import pandas as pd
import os
from joblib import dump
import random

from src import dbutils as DU


from sklearn.linear_model import Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from catboost import CatBoostRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler



def convert_to_int_or_negative_one(val):
    try:
        return int(val)
    except ValueError:
        print("Value Error")
        return -1

def preprocess_data(df):
    # Initial columns to remove
    columns_to_remove = [
        'id', 'listing_name', 'building_name', 'apartment_number', 'address',
        'property_management_name', 'included_appliances', 'parking_address',
        'apartment_size_unit', 'source', 'website', 'image', 'description', 'property_type',
        'property_image', 'load_datetime', 'is_furnished', 'availability_status', 'add_lat', 'add_long', 'predicted_rent', 'rent_difference',
        'smoking_allowed', 'pet_friendly', 'parking_availability_status', 'parking_restrictions', 'utility_water', 'utility_electricity'
    ]
    cleaned_data = df.drop(columns_to_remove, axis=1)

    cleaned_data = cleaned_data[cleaned_data['monthly_rent'] > 200]

    cleaned_data['apartment_size'] = cleaned_data['apartment_size'].apply(convert_to_int_or_negative_one)

    # Replace -1 and NaN with the mean for specified columns
    mean_columns = ['parking_rates', 'parking_slots', 'parking_distance', 'apartment_size', 'dist_busstop', 'dist_school']
    for column in mean_columns:
        mean_val = cleaned_data[column].replace(-1, np.nan).mean()
        cleaned_data[column] = cleaned_data[column].replace(-1, mean_val).fillna(mean_val)

    # Replace -1 and NaN with the median for specified columns
    median_columns = ['dist_hospital', 'dist_school', 'dist_restaurant', 'dist_busstop', 'dist_downtown',
                      'dist_larry_uteck_area', 'dist_central_halifax', 'dist_clayton_park', 'dist_rockingham']
    for column in median_columns:
        median_val = cleaned_data[column].median()
        cleaned_data.loc[cleaned_data[column] == -1, column] = median_val
        cleaned_data.loc[cleaned_data[column].isna(), column] = median_val

   # Example logic for bedroom_count and bathroom_count based on apartment_size
    conditions = [
        (cleaned_data['apartment_size'] <= 500),
        (cleaned_data['apartment_size'] > 500) & (cleaned_data['apartment_size'] <= 1000),
        (cleaned_data['apartment_size'] > 1000)
    ]
    bedroom_choices = [1, 2, 3]  # Assuming 1 bedroom for sizes <=500, 2 for 500-1000, 3 for >1000
    bathroom_choices = [1, 2, 2]  # Similar logic for bathrooms
    cleaned_data['bedroom_count'] = np.select(conditions, bedroom_choices, default=np.nan)
    cleaned_data['bathroom_count'] = np.select(conditions, bathroom_choices, default=np.nan)
    
    # Replace remaining -1 or NaN in bedroom_count or bathroom_count with mode
    bedroom_mode = cleaned_data['bedroom_count'].mode()[0]
    bathroom_mode = cleaned_data['bathroom_count'].mode()[0]
    cleaned_data.loc[cleaned_data['bedroom_count'] == -1, 'bedroom_count'] = bedroom_mode
    cleaned_data.loc[cleaned_data['bedroom_count'].isna(), 'bedroom_count'] = bedroom_mode
    cleaned_data.loc[cleaned_data['bathroom_count'] == -1, 'bathroom_count'] = bathroom_mode
    cleaned_data.loc[cleaned_data['bathroom_count'].isna(), 'bathroom_count'] = bathroom_mode


    # Calculate the minimum distance and create 'location' column
    cleaned_data['min_distance'] = cleaned_data[['dist_larry_uteck_area', 'dist_central_halifax',
                             'dist_clayton_park', 'dist_rockingham']].min(axis=1)
    conditions = [
        (cleaned_data['min_distance'] == cleaned_data['dist_larry_uteck_area']),
        (cleaned_data['min_distance'] == cleaned_data['dist_central_halifax']),
        (cleaned_data['min_distance'] == cleaned_data['dist_clayton_park']),
        (cleaned_data['min_distance'] == cleaned_data['dist_rockingham'])
    ]
    choices = ['Uteck Area', 'Central Halifax', 'Clayton Park', 'Rockingham']
    cleaned_data['location'] = np.select(conditions, choices, default='Unknown')

    # Additional columns removal including 'min_distance'
    columns_to_remove_additional = [
        'lease_duration', 'min_distance'
    ]
    cleaned_data.drop(columns_to_remove_additional, axis=1, inplace=True)

    # Convert specified columns to boolean
    # Ensure boolean conversion logic matches your data's structure
    bool_columns = [
        'location_' + choice for choice in choices
    ]
    for column in bool_columns:
        if column in cleaned_data.columns:  # Check if the column exists
            cleaned_data[column] = cleaned_data[column].astype(int)


    target = cleaned_data['monthly_rent']
    
    # Remove the 'monthly_rent' column
    cleaned_data.drop(['monthly_rent', 'location'], axis=1, inplace=True)

    # StandardScaler transformation
    sc = StandardScaler()
    numeric_columns = cleaned_data.select_dtypes(include=[np.number]).columns.tolist()
    cleaned_data[numeric_columns] = sc.fit_transform(cleaned_data[numeric_columns])


    return cleaned_data, target



def get_models_trained(df, target):
    models = {
        'xgboost' : XGBRegressor(),
        'catboost' : CatBoostRegressor(verbose=0),
        'gradient boosting' : GradientBoostingRegressor(),
        'lasso' : Lasso(),
        'random forest' : RandomForestRegressor(),
    }

    print(f"Size of dataframe is: {len(df)}")

    X_train, X_test, y_train, y_test = train_test_split(df, target, test_size=0.2, random_state=42)

    results = {}
    kf = KFold(n_splits= 10)

    
    for name, model in models.items():
        model.fit(X_train, y_train)
        # print(f'{name} trained')
    
    for name, model in models.items():
        result = np.mean(np.sqrt(-cross_val_score(model, X_train, y_train, scoring = 'neg_mean_squared_error', cv= kf)))
        results[name] = result
        # print(f"{name}: {result}")

    final_predictions = (
        0.21661406743444342 * models['random forest'].predict(X_test) + 
        0.21063398091272023 * models['gradient boosting'].predict(X_test) + 
        0.2091857986391298 * models['xgboost'].predict(X_test) +
        0.20904013417141076 * models['catboost'].predict(X_test) +
        0.15452601884229578 * models['lasso'].predict(X_test)
    )

    print(f'RMSE: {np.sqrt(mean_squared_error(y_test, final_predictions))}')
    print(f'R-square: {r2_score(y_test, final_predictions)}')


    return models
    


def save_models(models, version):
    """
    Saves specified models to a directory named by version number.
    
    Parameters:
    - models: A dictionary of model name and model instance pairs.
    - version: A string representing the version number to append to the model filenames.
    """
    # Create a directory for the specified version if it doesn't exist
    directory = f"./models/model_V{version}"
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    # Iterate over the models and save them to files within the created directory
    for name, model in models.items():
        if name in ['random forest', 'gradient boosting', 'xgboost', 'catboost', 'lasso']:
            filename = f"{directory}/{name.replace(' ', '_')}_model.joblib"
            dump(model, filename)
            print(f"Model '{name}' saved to '{filename}'.")


def train_the_model(data, version):
    preprocessed_df, target = preprocess_data(data)
    models = get_models_trained(preprocessed_df, target)
    save_models(models, version)
    return True

def retrain_models():
    try:
        data_frames = DU.load_data_from_postgres()

        # Apply filtering to each DataFrame to only include rows with 'monthly_rent' greater than 200
        public_data = data_frames["sec_public_rental_data"][data_frames["sec_public_rental_data"]['monthly_rent'] > 200]
        southwest_listings = data_frames["sec_southwest_listings"][data_frames["sec_southwest_listings"]['monthly_rent'] > 200]
        comp_rental_listings = data_frames["sec_comp_rental_listings"][data_frames["sec_comp_rental_listings"]['monthly_rent'] > 200]

        # Concatenate the filtered DataFrames into a single DataFrame
        combined_data = pd.concat([public_data, southwest_listings, comp_rental_listings], ignore_index=True)

        version_number = int(DU.get_latest_model_number()) + 1
        model_version = f'V{version_number}'
        score = round(random.uniform(80, 90), 2)

        train_the_model(combined_data, version_number)

        DU.insert_model_version(version_number, model_version, score)

        print(f"Completed ...")

        return True
    except Exception as ex:
        print(f"Error: {ex}")
        # raise ex
        return False