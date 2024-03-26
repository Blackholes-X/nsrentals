import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv
from sqlalchemy import create_engine
import urllib
from datetime import datetime
import ast

load_dotenv()

def get_db_connection():
    '''Connect to the PostgresDB and return the connection object.'''
    return psycopg2.connect(
        host=os.getenv('POSTGRES_HOST'),
        database=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        port=os.getenv('POSTGRES_PORT')
    )



###  Competitor Rental Listing Functions ------------------------------------------------------------------------------------------

def save_df_to_comp_rental_listings(df):
    '''Insert DataFrame rows into the comp_rental_listings table.'''
    load_dotenv()
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        for index, row in df.iterrows():
            cur.execute("""
                INSERT INTO comp_rental_listings (
                    listing_name, address, property_management_name, monthly_rent,
                    bedroom_count, bathroom_count, utility_water, utility_heat,
                    utility_electricity, wifi_included, utility_laundry, included_appliances,
                    parking_availability, apartment_size, apartment_size_unit,
                    is_furnished, availability_status, image, description, source, website
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                row['listing_name'], row['address'], row['property_management_name'], row['monthly_rent'],
                row['bedroom_count'], row['bathroom_count'], row['utility_water'], row['utility_heat'],
                row['utility_electricity'], row['wifi_included'], row['utility_laundry'],
                # Ensure included_appliances is formatted as expected for the text[] or JSONB type
                row['included_appliances'], row['parking_availability'], row['apartment_size'],
                row['apartment_size_unit'], row['is_furnished'], row['availability_status'],
                row['image'], row['description'], row['source'], row['website']
            ))
            conn.commit()

        print("Dataframe successfully saved to comp_rental_listings table.")

    except Exception as e:
        print(f"An error occurred while saving dataframe to comp_rental_listings table: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur: cur.close()
        if conn: conn.close()


def save_df_to_hrm_buildings_permit(df: pd.DataFrame):
    '''Insert DataFrame rows into the hrm_buildings_permit table.'''
    load_dotenv()
    conn = None
    try:
        conn = get_db_connection()  # Make sure this function returns a valid connection object
        cur = conn.cursor()

        for index, row in df.iterrows():
            cur.execute("""
                INSERT INTO hrm_buildings_permit (
                    civic_address, floors, units_or_size, building_type, permit_value, latest_update
                ) VALUES (%s, %s, %s, %s, %s, %s);
            """, (
                row['civic_address'], row['floors'], row['units_or_size'], 
                row['building_type'], row['permit_value'], row['latest_update']
            ))
            conn.commit()

        print("DataFrame successfully saved to hrm_buildings_permit table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to hrm_buildings_permit table: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur: cur.close()
        if conn: conn.close()

def filter_existing_urls(urls):
    load_dotenv()
    """Filter out URLs already present in the comp_rental_listings table's source column."""
    filtered_urls = []
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        for url in urls:
            cur.execute("SELECT COUNT(*) FROM comp_rental_listings WHERE source = %s;", (url,))
            count = cur.fetchone()[0]
            if count == 0:
                filtered_urls.append(url)

    except Exception as e:
        print(f"Error filtering URLs: {e}")

    finally:
        if cur: cur.close()
        if conn: conn.close()

    return filtered_urls


def save_df_to_hrm_building_listings(df: pd.DataFrame):
    '''Insert DataFrame rows into the hrm_building_listings table.'''
    load_dotenv()
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Ensure this function is defined to establish a DB connection
        cur = conn.cursor()

        insert_query = """
            INSERT INTO hrm_building_listings (
                listing_name, address, property_management_name, permit_value, floors,
                units_or_size, building_type, image, url, source_name
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """

        for index, row in df.iterrows():
            # Using .get for optional fields to avoid KeyError if the column is missing in some rows
            cur.execute(insert_query, (
                row['listing_name'], 
                row['address'], 
                row.get('property_management_name'), 
                row.get('permit_value'), 
                row.get('floors'), 
                row.get('units_or_size'), 
                row['building_type'], 
                row.get('image'), 
                row.get('url'), 
                row['source_name']
            ))
        conn.commit()
        print("DataFrame successfully saved to the hrm_building_listings table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to the hrm_building_listings table: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur: cur.close()
        if conn: conn.close()


def url_exists_in_db(url):
    """Check if a URL already exists in the hrm_building_listings table."""
    load_dotenv()
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Ensure this function is defined to establish a DB connection
        cur = conn.cursor()
        cur.execute("SELECT EXISTS(SELECT 1 FROM hrm_building_listings WHERE url = %s)", (url,))
        exists = cur.fetchone()[0]
        return exists
    except Exception as e:
        print(f"Error checking URL existence in database: {e}")
        return False  # Assuming failure means the URL can't be verified as existing
    
    finally:
        if cur: cur.close()
        if conn: conn.close()



def save_df_to_public_rental_data(df):
    '''Insert DataFrame rows into the public_rental_data table.'''
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        for index, row in df.iterrows():
            cur.execute("""
                INSERT INTO public_rental_data (
                    sitename, source, listing_name, building_name, apartment_number, address,
                    add_lat, add_long, property_management_name, monthly_rent, property_type,
                    bedroom_count, bathroom_count, apartment_size, amenities, lease_period
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                row['sitename'], row['source'], row['listing_name'], row['building_name'],
                row['apartment_number'], row['address'], row['add_lat'], row['add_long'],
                row['property_management_name'], row['monthly_rent'], row['property_type'],
                row['bedroom_count'], row['bathroom_count'], row['apartment_size'],
                row['amenities'], row['lease_period']
            ))
            conn.commit()

        print("Dataframe successfully saved to public_rental_data table.")

    except Exception as e:
        print(f"An error occurred while saving dataframe to public_rental_data table: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur: cur.close()
        if conn: conn.close()

def save_df_to_parking_data(df: pd.DataFrame):
    
    '''Insert DataFrame rows into the parking_data table.'''
    load_dotenv()
    conn = None
    try:
        conn = get_db_connection()  # Ensure this function returns a valid connection object
        cur = conn.cursor()

        for index, row in df.iterrows():
            cur.execute("""
                INSERT INTO parking_data (
                    address, lot, price, type, description
                ) VALUES (%s, %s, %s, %s, %s);
            """, (
                row['address'], row['lot'], row['price'], 
                row['type'], row['description']
            ))
            conn.commit()

        print("DataFrame successfully saved to parking_data table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to parking_data table: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur: cur.close()
        if conn: conn.close()


def read_data_from_sec_parking_data():
    """Fetch all rows from the sec_parking_data table and return as DataFrame."""
    # URL-encode the password
    password = urllib.parse.quote_plus(os.getenv('POSTGRES_PASSWORD'))
    
    # Create the database connection URI, including the URL-encoded password
    database_uri = (
        f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{password}" +
        f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    )
    
    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)
        
        # Define the SQL query
        query = "SELECT * FROM sec_parking_data"  # Updated to 'sec_parking_data'
        
        # Use pandas to load the query result into a DataFrame
        df = pd.read_sql_query(query, engine)
        return df
    except Exception as e:
        print(f"Error fetching data from sec_parking_data table: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of error
    

def read_data_from_public_rental_data():
    """Fetch all rows from the public_rental_data table and return as DataFrame."""
    # URL-encode the password
    password = urllib.parse.quote_plus(os.getenv('POSTGRES_PASSWORD'))
    
    # Create the database connection URI, including the URL-encoded password
    database_uri = (
        f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{password}" +
        f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    )
    
    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)
        
        # Define the SQL query
        query = "SELECT * FROM public_rental_data"
        
        # Use pandas to load the query result into a DataFrame
        df = pd.read_sql_query(query, engine)
        return df
    except Exception as e:
        print(f"Error fetching data from public_rental_data table: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of erro
    
def read_data_from_parking_data():
    """Fetch all rows from the parking_data table and return as DataFrame."""
    # URL-encode the password
    password = urllib.parse.quote_plus(os.getenv('POSTGRES_PASSWORD'))
    
    # Create the database connection URI, including the URL-encoded password
    database_uri = (
        f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{password}" +
        f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    )
    
    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)
        
        # Define the SQL query
        query = "SELECT * FROM parking_data"
        
        # Use pandas to load the query result into a DataFrame
        df = pd.read_sql_query(query, engine)
        return df
    except Exception as e:
        print(f"Error fetching data from parking_data table: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of error


def get_database_uri():
    """Generate the database connection URI."""
    password = urllib.parse.quote_plus(os.getenv('POSTGRES_PASSWORD'))
    return f"postgresql+psycopg2://{os.getenv('POSTGRES_USER')}:{password}" \
           f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

def save_df_to_sec_parking_data(df):
    """Insert DataFrame rows into the sec_parking_data table using SQLAlchemy."""
    database_uri = get_database_uri()

    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)

        # Insert DataFrame into the database in a transaction
        with engine.begin() as connection:
            df.to_sql('sec_parking_data', con=connection, if_exists='append', index=False)

        print("DataFrame successfully saved to sec_parking_data table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to sec_parking_data table: {e}")


def save_df_to_sec_public_rental_data(df):
    """Insert DataFrame rows into the sec_public_rental_data table using SQLAlchemy."""
    database_uri = get_database_uri()

    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)

        # Insert DataFrame into the database in a transaction
        with engine.begin() as connection:
            df.to_sql('sec_public_rental_data', con=connection, if_exists='append', index=False)

        print("DataFrame successfully saved to sec_public_rental_data table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to sec_public_rental_data table: {e}")



def save_df_to_sec_comp_rental_listings(df):
    """Insert DataFrame rows into the sec_comp_rental_listings table using SQLAlchemy."""
    database_uri = get_database_uri()  # Ensure this function returns your database connection string

    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)

        # Insert DataFrame into the database in a transaction
        with engine.begin() as connection:
            df.to_sql('sec_comp_rental_listings', con=connection, if_exists='append', index=False)

        print("DataFrame successfully saved to sec_comp_rental_listings table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to sec_comp_rental_listings table: {e}")



def save_df_to_southwest_listings(df):
    """
    Insert DataFrame rows into the southwest_listings table using SQLAlchemy.

    Parameters:
    df (pandas.DataFrame): The DataFrame to be saved into the database.
    """
    database_uri = get_database_uri()  # Make sure this function returns your database connection string

    try:
        # Create the SQLAlchemy engine
        engine = create_engine(database_uri)

        # Insert DataFrame into the database in a transaction
        with engine.begin() as connection:
            df.to_sql('sec_southwest_listings', con=connection, if_exists='append', index=False)

        print("DataFrame successfully saved to southwest_listings table.")

    except Exception as e:
        print(f"An error occurred while saving DataFrame to southwest_listings table: {e}")


def read_data_from_comp_rental_listings():
    '''Fetch all rows from the comp_rental_listings table and return as DataFrame.'''
    conn = None
    try:
        conn = get_db_connection()  # Assuming get_db_connection() is a function that returns a DB connection
        query = "SELECT * FROM comp_rental_listings"
        df = pd.read_sql(query, conn)
        return df

    except Exception as e:
        print(f"An error occurred while fetching data from comp_rental_listings table: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of error

    finally:
        if conn:
            conn.close()



def read_southwest_listing_csv(csv_path='SouthWestListingStructuredData.csv'):
    """
    Reads a CSV file into a pandas DataFrame.

    Parameters:
    csv_path (str): The path to the CSV file to be read.

    Returns:
    pandas.DataFrame: A DataFrame containing the data from the CSV file.
    """
    try:
        # Load the CSV file into a DataFrame
        df = pd.read_csv(csv_path)
        print("CSV file loaded successfully.")
        return df
    except Exception as e:
        print(f"An error occurred while reading the CSV file: {e}")
        return None



def transform_comp_dataframe(df):
    # Define a dictionary for the new structure
    column_mapping = {
        'listing_name': 'listing_name',
        'building_name': 'listing_name',
        'apartment_number': -1,
        'address': 'address',
        'add_lat': -1.0,
        'add_long': -1.0,
        'property_management_name': 'property_management_name',
        'monthly_rent': 'monthly_rent',
        'property_type': None,
        'bedroom_count': 'bedroom_count',
        'bathroom_count': 'bathroom_count',
        'utility_water': 'utility_water',
        'utility_heat': 'utility_heat',
        'utility_electricity': 'utility_electricity',
        'utility_laundry': 'utility_laundry',
        'utility_wifi': 'wifi_included',
        'included_appliances': 'included_appliances',
        'parking_availability': 'parking_availability',
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
        'lease_duration': -1,
        'availability_status': -1,
        'dist_hospital': -1,
        'dist_school': -1,
        'dist_restaurant': -1,
        'dist_downtown': -1,
        'dist_busstop': -1,
        'source': 'source',
        'website': 'website',
        'image': 'image',
        'description': 'description',
        'property_image': 'image',
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



def transform_sw_dataframe(df):
    # First, attempt to convert the 'image' column from string to list if necessary
    if 'image' in df.columns:
        # Safely evaluate the string representation of the list
        # This requires the image column to be in a format that ast.literal_eval can understand, e.g., "[item1, item2]"
        df['image'] = df['image'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else x)

    # Define a dictionary for the new structure, excluding load_datetime for now
    column_mapping = {
        'listing_name': 'listing_name',
        'building_name': 'listing_name',  # Consider if this mapping is correct or needs adjustment
        'apartment_number': -1,
        'address': 'address',
        'add_lat': -1.0,
        'add_long': -1.0,
        'property_management_name': 'property_management_name',
        'monthly_rent': 'monthly_rent',
        'property_type': None,
        'bedroom_count': 'bedroom_count',
        'bathroom_count': 'bathroom_count',
        'utility_water': 'utility_water',
        'utility_heat': 'utility_heat',
        'utility_electricity': 'utility_electricity',
        'utility_laundry': 'utility_laundry',
        'utility_wifi': 'wifi_included',
        'included_appliances': 'included_appliances',
        'parking_availability': 'parking_availability',
        'parking_rates': -1,
        'parking_slots': -1,
        'parking_distance': -1,
        'parking_restrictions': -1,
        'parking_availability_status': -1,
        'pet_friendly': -1,
        'smoking_allowed': -1,
        'apartment_size': 'apartment_size',
        'apartment_size_unit': -1,
        'is_furnished': 'is_furnished',
        'lease_duration': -1,
        'availability_status': -1,
        'dist_hospital': -1,
        'dist_school': -1,
        'dist_restaurant': -1,
        'dist_downtown': -1,
        'dist_busstop': -1,
        'source': 'source',
        'website': 'website',
        'image': 'image',
        'description': 'description',
        # 'load_datetime' will be handled separately
        'property_image': None
    }

    # Create a new dataframe with the required structure
    new_df = pd.DataFrame(columns=column_mapping.keys())

    # Map existing columns or fill with default values
    for new_col, mapping in column_mapping.items():
        if isinstance(mapping, str):  # If the mapping is a column name from the old dataframe
            new_df[new_col] = df[mapping] if mapping in df.columns else None
        else:  # If the mapping is a default value
            new_df[new_col] = mapping

    # Extract the first image from the 'image' list for each row, or None if not applicable
    if 'image' in df.columns:
        new_df['property_image'] = df['image'].apply(lambda x: x[0] if isinstance(x, list) and len(x) > 0 else None)

    # Set 'load_datetime' to the current time
    new_df['load_datetime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    return new_df