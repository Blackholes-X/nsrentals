from src import dbutils as DU

from joblib import load
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def convert_to_int_or_negative_one(val):
    try:
        return int(val)
    except ValueError:
        print("Value Error")
        return -1
    

def get_weighted_model_predictions(df):
    """
    Loads the models, makes predictions on the given DataFrame, and returns the weighted sum of predictions.
    
    Parameters:
    - df: Pandas DataFrame, the input data for making predictions.
    
    Returns:
    - A DataFrame containing the weighted sum of predictions from each model, labeled as 'predicted_rent'.
    """
    # Define the model names and their corresponding weights
    model_info = {
        'xgboost': 0.2091857986391298,
        'catboost': 0.20904013417141076,
        'gradient_boosting': 0.21063398091272023,
        'lasso': 0.15452601884229578,
        'random_forest': 0.21661406743444342,
    }
    
    # Load the models
    models = {name: load(f"./models/running_model/{name}_model.joblib") for name in model_info.keys()}
    
    # Initialize an array to hold the weighted predictions
    weighted_predictions = np.zeros(df.shape[0])
    
    # Compute the weighted sum of predictions
    for name, weight in model_info.items():
        weighted_predictions += weight * models[name].predict(df)
    
    # Create a DataFrame with the final predictions
    final_predictions_df = pd.DataFrame(weighted_predictions, columns=['predicted_rent'])
    
    return final_predictions_df

from typing import Optional, List, Dict


def append_predictions_and_calculate_difference(original_df, predictions_df):
    """
    Appends the 'predicted_rent' column from predictions_df to original_df.
    Calculates 'rent_difference' where 'monthly_rent' is more than 200, sets to 'NULL' otherwise.
    Rounds 'predicted_rent' and 'rent_difference' to two decimal points.

    Parameters:
    - original_df: Pandas DataFrame, the original data.
    - predictions_df: Pandas DataFrame, contains the predicted rents.

    Returns:
    - A modified DataFrame with added 'predicted_rent' and 'rent_difference' columns, rounded to two decimal points.
    """
    # Append the 'predicted_rent' column and round it to two decimal points
    original_df['predicted_rent'] = predictions_df['predicted_rent'].values.round(2)
    
    # Initialize 'rent_difference' with 'NULL'
    original_df['rent_difference'] = 'NULL'

    original_df['monthly_rent'] = original_df['monthly_rent'].apply(convert_to_int_or_negative_one)
    
    
    # Condition where 'monthly_rent' is available and more than 200
    condition = (original_df['monthly_rent'].notnull()) & (original_df['monthly_rent'] > 200)
    
    # Calculate 'rent_difference' where condition is True and round it to two decimal points
    original_df.loc[condition, 'rent_difference'] = (original_df.loc[condition, 'monthly_rent'] - original_df.loc[condition, 'predicted_rent']).round(2)
    
    # Convert 'rent_difference' for non-condition rows to NaN for numeric operations and consistency
    original_df['rent_difference'] = pd.to_numeric(original_df['rent_difference'], errors='coerce')
    
    return original_df


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

    # Remove the 'monthly_rent' column
    cleaned_data.drop(['monthly_rent', 'location'], axis=1, inplace=True)

    # StandardScaler transformation
    sc = StandardScaler()
    numeric_columns = cleaned_data.select_dtypes(include=[np.number]).columns.tolist()
    cleaned_data[numeric_columns] = sc.fit_transform(cleaned_data[numeric_columns])


    return cleaned_data

def get_rent_predictions(data):
    preprocessed_df = preprocess_data(data)
    predictions_df = get_weighted_model_predictions(preprocessed_df)
    final_data = append_predictions_and_calculate_difference(data, predictions_df)
    return final_data



def predicted_rent():
    rent_predicted = {
        "rent": 1630.0,
        "rent_for_1bhk": 1520.4,
        "rent_for_2bhk": 1740.0,
    }
    return rent_predicted

def ml_predict_rent(property_type: str, bedroom_count: int, bathroom_count: int, wifi_included: bool, 
                      utility_included: bool, utility_water: bool, utility_heat: bool, 
                      utility_electricity: bool, parking_availability: bool, pet_friendly: bool, 
                      unit_size: int, is_furnished: bool, included_appliances: bool, 
                      availability_status: str) -> float:
    
    base_rent = 700
    rent = base_rent
    
    rent += bedroom_count * 100
    rent += bathroom_count * 50
    rent += 100 if wifi_included else 0
    rent += 100 if utility_included else 0
    rent += 50 if utility_water else 0
    rent += 50 if utility_heat else 0
    rent += 50 if utility_electricity else 0
    rent += 75 if parking_availability else 0
    rent += 100 if pet_friendly else 0
    rent += unit_size * 0.6
    rent += 150 if is_furnished else 0

    if included_appliances == 1:
        rent += 25

    if availability_status == 1:
        rent += 100
    
    # Ensure the rent is within the normal range
    rent = max(900, min(8763, rent))
    
    return round(rent)



def update_new_predictions():
    try:
        data_frames = DU.load_data_from_postgres()

        ## Public Data
        public_data = data_frames["sec_public_rental_data"]
        req_dataframe = get_rent_predictions(public_data)
        table_name = "sec_public_rental_data"
        DU.write_dataframe_to_postgres(req_dataframe, table_name)


        ## Southwest Data
        southwest_listings = data_frames["sec_southwest_listings"]
        req_dataframe = get_rent_predictions(southwest_listings)
        table_name = "sec_southwest_listings"
        DU.write_dataframe_to_postgres(req_dataframe, table_name)


        ## Competitor Data
        comp_rental_listings = data_frames["sec_comp_rental_listings"]
        req_dataframe = get_rent_predictions(comp_rental_listings)
        table_name = "sec_comp_rental_listings"
        DU.write_dataframe_to_postgres(req_dataframe, table_name)

        return True
    except Exception as ex:
        print(f"Error: {ex}")
        return False