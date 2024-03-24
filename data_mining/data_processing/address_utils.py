import os
import pandas as pd
import requests
from geopy.distance import geodesic
from dotenv import load_dotenv


class AddressPreprocessor:
    def __init__(self, api_key_env='GOOGLE_API_KEY'):
        self.api_key = os.getenv(api_key_env)
        
    def get_lat_lng(self,address):
        """Convert an address to latitude and longitude."""
        geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={self.api_key}"
        response = requests.get(geocode_url)
        if response.status_code == 200:
            data = response.json()
            if data['results']:
                location = data['results'][0]['geometry']['location']
                return location['lat'], location['lng']
        return None, None

    def update_lat_lng(self, row):
        """Updates the latitude and longitude for a given row if necessary."""
        # Check if the lat and long need to be updated
        if row['add_lat'] == -1.0 and row['add_long'] == -1.0:
            return self.get_lat_lng(row['address'])
        else:
            return row['add_lat'], row['add_long']
    
    def find_closest_place(self,lat, lng, place_type, min_rating=None):
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
            # with open(f"response_json_{lat}_{lng}.json", 'w', encoding='utf-8') as f:
            #     json.dump(data, f, indent=2)

            closest_place = None
            min_distance = float('inf')  # Initialize with an infinitely large value

            for result in data['results']:
                # Skip places with ratings below the minimum, if specified
                if min_rating and result.get('rating', 0) < min_rating:
                    continue

                
                # Calculate the distance from the original coordinates to this place
                result_location = result['geometry']['location']
                result_lat = result_location['lat']
                result_lng = result_location['lng']
                distance = geodesic((lat, lng), (result_lat, result_lng)).miles

                # If this place is closer than any we've found before, remember it
                if distance < min_distance:
                    min_distance = distance
                    closest_place = result

            if closest_place:
                closest_location = closest_place['geometry']['location']
                return closest_location['lat'], closest_location['lng'], min_distance

        return None, None, None


    
    def get_lat_long_dist_data(self, df, place_types=['hospital', 'school', 'restaurant', 'bus_stop'], min_rating=3.5):
        """Process the DataFrame for address data and place types."""
        necessary_columns = ['add_lat', 'add_long'] + [f'{pt}_lat' for pt in place_types] + [f'{pt}_long' for pt in place_types] + [f'dist_{pt}' for pt in place_types]
        for col in necessary_columns:
            if col not in df.columns:
                df[col] = -1.0
        
        df[['add_lat', 'add_long']] = df.apply(lambda row: self.update_lat_lng(row), axis=1, result_type='expand')
        for place_type in place_types:
            min_rating = 3.5
            for index, row in df.iterrows():
                if (row['add_lat'] != -1.0 and row['add_lat'] is not None) and (row['add_long'] != -1.0 and row['add_long'] is not None) and row[f'dist_{place_type}'] == -1.0:
                    lat, lng, dist = self.find_closest_place(row['add_lat'], row['add_long'], place_type, min_rating)
                    lat, lng, dist = self.find_closest_place(row['add_lat'], row['add_long'], place_type, min_rating)
                    df.at[index, f'{place_type}_lat'] = lat 
                    df.at[index, f'{place_type}_long'] = lng 
                    df.at[index, f'dist_{place_type}'] = dist
        return df
        
    def calculate_distance(self, row, downtown_coords):
# Check if the row's coordinates are valid and distance needs updating
        if (row['add_lat'] != -1.0 and row['add_lat'] is not None) and (row['add_long'] != -1.0 and row['add_long'] is not None) and row['dist_downtown'] == -1.0:
            # Extract the current row's coordinates
            current_coords = (row['add_lat'], row['add_long'])
            # Calculate and return the distance
            return geodesic(current_coords, downtown_coords).miles
        else:
            # Return the existing distance if conditions are not met
            return row['dists_downtown']


    # main function to get all the address related data
    def get_address_data(self, df, place_types=['hospital', 'school', 'restaurant', 'bus_stop'], min_rating=3.5):
        load_dotenv()
        df  = self.get_lat_long_dist_data(df,place_types,min_rating)
        if 'dist_downtown' not in df.columns:
            df['dist_downtown'] = -1.0
        downtown_lat,downtown_long = self.get_lat_lng("Downtown Halifax")
        downtown_halifax_coords = (downtown_lat,downtown_long)
        df['dist_downtown'] = df.apply(lambda row: self.calculate_distance(row, downtown_halifax_coords), axis=1)
        return df