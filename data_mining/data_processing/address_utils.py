import os
import pandas as pd
import requests
from geopy.distance import geodesic
from dotenv import load_dotenv


class AddressPreprocessor:
    def __init__(self, api_key_env='GOOGLE_API_KEY'):
        self.api_key = os.getenv(api_key_env)
        print(self.api_key)
        
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
        
    def calculate_distance(self, row, coords,column_name):
        # Check if the row's coordinates are valid and distance needs updating
        if (row['add_lat'] != -1.0 and row['add_lat'] is not None) and (row['add_long'] != -1.0 and row['add_long'] is not None) and row[column_name]== -1.0:
            # Extract the current row's coordinates
            current_coords = (row['add_lat'], row['add_long'])
            # Calculate and return the distance
            return geodesic(current_coords, coords).miles
        else:
            # Return the existing distance if conditions are not met
            return row[column_name]
    
    
    def add_distance_to_places(self,df, place_names):
        """
        Adds a distance column for each place in place_names to the DataFrame df.
        
        Parameters:
        - df: pandas DataFrame containing the data.
        - place_names: List of place names to calculate distances to.
        - obj: The object instance if calling from within a class, set to None if calling as a standalone function.
        """
        
        for place in place_names:
            # Generate column name dynamically based on place name
            column_name = f'dist_{place.replace(" ", "_").lower()}'
            
            # Check if the distance column already exists; if not, initialize it with -1.0
            if column_name not in df.columns:
                df[column_name] = -1.0
            

            lat, lng = self.get_lat_lng(place)
            place_coords = (lat, lng)
            
            # Calculate distance and update the column for each row
            df[column_name] = df.apply(lambda row: self.calculate_distance(row, place_coords,column_name), axis=1)

        return df

# Note: You need to modify 'calculate_distance' to accept 'obj' parameter and use it similarly if it needs to call other methods from the object.


    # main function to get all the address related data
    def get_address_data(self, df, place_types=['hospital', 'school', 'restaurant', 'bus_stop'], min_rating=3.5):
        load_dotenv()
        df  = self.get_lat_long_dist_data(df,place_types,min_rating)
        
        # if 'dist_downtown' not in df.columns:
        #     df['dist_downtown'] = -1.0
        # downtown_lat,downtown_long = self.get_lat_lng("Downtown Halifax")
        # downtown_halifax_coords = (downtown_lat,downtown_long)
        # df['dist_downtown'] = df.apply(lambda row: self.calculate_distance(row, downtown_halifax_coords), axis=1)
        place_names = ['Downtown Halifax','Clayton Park Halifax','Rockingham Halifax','Peakview Way Bedford NS','Halifax Shopping Centre']
        df = self.add_distance_to_places(df,place_names)
        rm_columns = [f'{pt}_lat' for pt in place_types] + [f'{pt}_long' for pt in place_types]
        df.rename(columns={'dist_bus_stop': 'dist_busstop','dist_downtown_halifax':'dist_downtown','dist_peakview_way_bedford_ns':'dist_larry_uteck_area',
                           'dist_halifax_shopping_centre':'dist_central_halifax','dist_clayton_park_halifax':'dist_clayton_park',
                           'dist_rockingham_halifax':'dist_rockingham'},inplace=True)
        df.drop(columns=rm_columns,inplace=True)
        return df
