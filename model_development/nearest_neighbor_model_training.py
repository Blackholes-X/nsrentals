import os
import pickle
from dotenv import load_dotenv
import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.neighbors import NearestNeighbors
from data_mining.src import db_utils

def preprocess_features(df, numerical_cols, categorical_cols, columns_to_drop):
    features_to_use = [col for col in df.columns if col not in columns_to_drop]
    numerical_features = [col for col in features_to_use if col in numerical_cols]
    categorical_features = [col for col in features_to_use if col in categorical_cols]

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', Pipeline(steps=[
                ('imputer', SimpleImputer(strategy='median')),
                ('scaler', StandardScaler())]), numerical_features),
            ('cat', Pipeline(steps=[
                ('imputer', SimpleImputer(strategy='most_frequent')),
                ('onehot', OneHotEncoder(handle_unknown='ignore'))]), categorical_features)
        ])
    
    return preprocessor.fit_transform(df[features_to_use]), preprocessor

def train_nearest_neighbors(X):
    nn = NearestNeighbors(n_neighbors=10, algorithm='ball_tree')
    nn.fit(X)
    return nn

def save_to_pickle(data, filepath):
    with open(filepath, 'wb') as f:
        pickle.dump(data, f)

def main():
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


    # Process the features for both datasets
    X_sw_prepared, preprocessor = preprocess_features(sw_df, numerical_cols, categorical_cols, columns_to_drop)
    X_comp_prepared = preprocessor.transform(comp_df)

    # Train the NearestNeighbors model
    nn_model = train_nearest_neighbors(X_comp_prepared)

    # Create "models" directory if it doesn't exist
    models_dir = 'models'
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)

    # Save the NearestNeighbors model and the processed features
    save_to_pickle(nn_model, os.path.join(models_dir, 'nearest_neighbors_model.pkl'))
    save_to_pickle(X_sw_prepared, os.path.join(models_dir, 'X_sw_prepared.pkl'))

    print("All components have been pickled and saved successfully in the 'models' directory.")

if __name__ == "__main__":
    main()
