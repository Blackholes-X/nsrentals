import pandas as pd

from src import config as C

def transform_dataframe(df):
    # Define a dictionary for the new structure
    column_mapping = {
        'listing_name': 'listing_name',
        'building_name': 'building_name',
        'apartment_number': 'apartment_number',
        'address': 'address',
        'add_lat': -1.0,
        'add_long': -1.0,
        'property_management_name': 'property_management_name',
        'monthly_rent': 'monthly_rent',
        'property_type': 'property_type',
        'bedroom_count': 'bedroom_count',
        'bathroom_count': 'bathroom_count',
        'utility_water': -1,
        'utility_heat': -1,
        'utility_electricity': -1,
        'utility_laundry': -1,
        'utility_wifi': -1,
        'included_appliances': 'amenities',
        'parking_availability': -1,
        'parking_rates': -1,
        'parking_slots': -1,
        'parking_distance': -1,
        'parking_restrictions': -1,
        'parking_availability_status': -1,
        'pet_friendly': -1,
        'smoking_allowed': -1,
        'apartment_size': 'apartment_size',
        'apartment_size_unit': -1,
        'is_furnished': -1,
        'lease_duration': 'lease_period',
        'availability_status': -1,
        'dist_hospital': -1,
        'dist_school': -1,
        'dist_restaurant': -1,
        'dist_downtown': -1,
        'dist_busstop': -1,
        'source': 'source',
        'website': 'sitename',
        'image': 'property_management_name',
        'description': 'amenities',
        'property_image' : 'property_image',
        'load_datetime': 'load_datetime'
    }
    
    # Create a new dataframe with the required structure
    new_df = pd.DataFrame(columns=column_mapping.keys())
    
    # Map existing columns or fill with default values
    for new_col, mapping in column_mapping.items():
        if isinstance(mapping, str):  # If the mapping is a column name from the old dataframe
            new_df[new_col] = df[mapping] if mapping in df.columns else None
        else:  # If the mapping is a default value
            new_df[new_col] = mapping
    
    return new_df



def extract_numeric_value(value):
    # Extract the first sequence of digits, possibly including a decimal point
    matches = pd.Series(value).str.extract(r'(\d+(\.\d+)?)')[0]
    # If there's a match, return the first occurrence as float, else return -1
    return float(matches.iloc[0]) if matches.notna().any() else -1


def extract_apartment_size(value):
    if '-1' in value:
        return -1
    # Remove commas for thousands and extract the first number sequence
    size = pd.Series(value).str.replace(',', '').str.extract(r'(\d+)')[0]
    # Correctly convert Series to int, avoiding deprecated method
    return int(size.iloc[0]) if not size.empty and not pd.isna(size.iloc[0]) else -1


# Define a function to update utility columns and parking_availability based on included_appliances column
def update_utilities_and_parking(row):
    for utility in C.utilities:
        # Check if the utility word is in the included_appliances string
        if utility in row['included_appliances'].lower():
            row[f'utility_{utility}'] = 1
    # Check for "parking" in the included_appliances string
    if 'parking' in row['included_appliances'].lower():
        row['parking_availability'] = 1
    return row