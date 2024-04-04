import sys
import pickle
import os
from dotenv import load_dotenv
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.neighbors import NearestNeighbors
import numpy as np
from data_mining.src import db_utils

load_dotenv()
comp_df = db_utils.read_data_from_sec_comp_rental_listings()
sw_df = db_utils.read_data_from_sec_southwest_listings()

numerical_cols = ['add_lat', 'add_long', 'dist_hospital', 'dist_school', 'dist_restaurant', 
                  'dist_downtown', 'dist_busstop', 'dist_larry_uteck_area', 'apartment_size',
                  'dist_central_halifax', 'dist_clayton_park', 'dist_rockingham','parking_distance']
categorical_cols = ['bedroom_count', 'bathroom_count', 'smoking_allowed','is_furnished',
                    'utility_water', 'utility_heat', 'utility_electricity', 
                    'utility_laundry', 'utility_wifi', 'parking_availability', 'included_appliances',
                    'pet_friendly']

# Columns to drop from the feature set but keep in the final DataFrame
columns_to_drop = ['src', 'image', 'id', 'load_datetime', 'website', 'apartment_number', 'parking_slots', 'parking_availability_status', 'parking_address']

# Adjust the feature sets by excluding the columns_to_drop
features_to_use = [col for col in sw_df.columns if col not in columns_to_drop and (col in numerical_cols or col in categorical_cols)]

# Define the preprocessing steps for both numerical and categorical features
preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())]), [col for col in features_to_use if col in numerical_cols]),
        ('cat', Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))]), [col for col in features_to_use if col in categorical_cols])
    ])

# Apply preprocessing to the feature subset of each DataFrame
X_sw_prepared = preprocessor.fit_transform(sw_df[features_to_use])
X_comp_prepared = preprocessor.transform(comp_df[features_to_use])

# Create and fit the NearestNeighbors model on the prepared competitor features
nn = NearestNeighbors(n_neighbors=10, algorithm='ball_tree')
nn.fit(X_comp_prepared)


# Create a "models" directory if it doesn't exist
models_dir = 'models'
if not os.path.exists(models_dir):
    os.makedirs(models_dir)

models_dir = '/model'
# Pickle the NearestNeighbors model
with open(os.path.join(models_dir, 'nearest_neighbors_model.pkl'), 'wb') as f:
    pickle.dump(nn, f)

# Since X_sw_prepared is a NumPy array, ensure to pickle it as well
with open(os.path.join(models_dir, 'X_sw_prepared.pkl'), 'wb') as f:
    pickle.dump(X_sw_prepared, f)


print("All components have been pickled and saved successfully in the 'models' directory.")
