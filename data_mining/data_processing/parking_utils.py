# parking_utils.py
import pandas as pd
from geopy.distance import geodesic
from sqlalchemy import create_engine

class ParkingUtils:
    def __init__(self, parking_data):
        self.df_sec_parking_data = parking_data

    def get_nearest_parking(self, row):
        min_distance = float('inf')
        nearest_parking = None
        for _, parking_row in self.df_sec_parking_data.iterrows():
            distance = geodesic((row['add_lat'], row['add_long']), (parking_row['add_lat'], parking_row['add_long'])).meters
            if distance < min_distance:
                min_distance = distance
                nearest_parking = parking_row
        return nearest_parking, min_distance

    def update_trans_df_with_nearest_parking(self, trans_df):
        
        for index, row in trans_df.iterrows():
            if row['add_lat'] is not None and row['add_long'] is not None: 
                nearest_parking, distance = self.get_nearest_parking(row)
                if nearest_parking is not None:
                    if trans_df.at[index, 'parking_availability'] == 0:
                        trans_df.at[index, 'parking_address'] = nearest_parking['address']
                        trans_df.at[index, 'parking_slots'] = nearest_parking['lot']
                        trans_df.at[index, 'parking_rates'] = nearest_parking['price']
                        trans_df.at[index, 'parking_distance'] = distance

        return trans_df


