import os
import pandas as pd
import requests
from geopy.distance import geodesic

class AddressPreprocessor:
    def __init__(self, dataframe, api_key_env='GOOGLE_API_KEY'):
        self.df = dataframe
        self.api_key = os.getenv(api_key_env)
        
    def get_lat_lng(self, address):
        """Convert an address to latitude and longitude."""
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={self.api_key}"
        response = requests.get(geocode_url)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                location = data['results'][0]['geometry']['location']
                return location['lat'], location['lng']
        return -1.0, -1.0

    def update_lat_lng(self, row):
        lat, lng = self.get_lat_lng(row['address'])
        return (lat, lng) if lat != -1.0 and lng != -1.0 else (None, None)

    def find_closest_place(self, lat, lng, place_type, min_rating=None):
        """Find the closest place of a specific type to the given coordinates."""
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{lat},{lng}",
            "radius": 5000,
            "type": place_type,
            "key": self.api_key
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            closest_place = None
            min_distance = float('inf')
            for result in data['results']:
                if min_rating and result.get('rating', 0) < min_rating:
                    continue
                result_location = result['geometry']['location']
                distance = geodesic((lat, lng), (result_location['lat'], result_location['lng'])).miles
                if distance < min_distance:
                    min_distance = distance
                    closest_place = result
            if closest_place:
                closest_location = closest_place['geometry']['location']
                return closest_location['lat'], closest_location['lng'], min_distance
        return -1.0, -1.0, -1.0
    
    def process_place_types(self, place_types=['hospital', 'school', 'restaurant', 'bus_stop'], min_rating=3.5):
        """Process specified place types and update DataFrame with latitude, longitude, and distance, only if needed."""
        for place_type in place_types:
            dist_column = f'dist_{place_type}'
            # Check if the distance column exists and if any value is -1.0, indicating the need for processing.
            if dist_column not in self.df.columns or self.df[dist_column] is not None:
                columns = [f'{place_type}_lat', f'{place_type}_lng', dist_column]
                self.df[columns] = zip(*self.df.apply(lambda row: (-1.0, -1.0, -1.0) if (dist_column in row and row[dist_column] != -1.0)
                                                    else self.find_closest_place(row['add_lat'], row['add_lng'], place_type, min_rating), axis=1))

    def process_data(self):
    # Ensure 'add_lat' and 'add_lng' columns exist with default values of -1.0
        if 'add_lat' not in self.df.columns:
            self.df['add_lat'] = -1.0
        if 'add_lng' not in self.df.columns:
            self.df['add_lng'] = -1.0   
        # Now, update 'add_lat' and 'add_lng' with actual values
        self.df[['add_lat', 'add_lng']] = self.df.apply(lambda row: self.update_lat_lng(row), axis=1, result_type='expand')
        
        
        # Process place types
        self.process_place_types()