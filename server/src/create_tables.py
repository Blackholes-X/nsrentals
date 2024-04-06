import os
import psycopg2
from dotenv import load_dotenv


load_dotenv()  # Load the environment variables from the .env file

def get_db_connection():
    """Connect to the PostgresDB and return the connection object."""
    conn = psycopg2.connect(
        host=os.getenv('POSTGRES_HOST'),
        database=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        port=os.getenv('POSTGRES_PORT')
    )
    return conn


def execute_table_creation(table_creation_sql, table_name):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f"SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = '{table_name}');")
        exists = cur.fetchone()[0]
        if not exists:
            cur.execute(table_creation_sql)
            conn.commit()
            print(f"Table '{table_name}' created successfully.")
        else:
            print(f"Table '{table_name}' already exists.")
    except Exception as e:
        print(f'An error occurred in creating table {table_name}: {e}')
    finally:
        if cur: cur.close()
        if conn: conn.close()



def create_comp_rental_listings_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Execute a query to check if the rental listings table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'comp_rental_listings');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the rental listings table with additional source, website, and load_datetime columns
            cur.execute("""
                CREATE TABLE comp_rental_listings (
                    id SERIAL PRIMARY KEY,
                    listing_name VARCHAR(255) NOT NULL,
                    address TEXT NOT NULL,
                    property_management_name VARCHAR(255) DEFAULT '-1',
                    monthly_rent INTEGER NOT NULL,
                    bedroom_count INTEGER NOT NULL,
                    bathroom_count INTEGER NOT NULL,
                    utility_water INTEGER NOT NULL,
                    utility_heat INTEGER NOT NULL,
                    utility_electricity INTEGER NOT NULL,
                    wifi_included INTEGER NOT NULL,
                    utility_laundry INTEGER NOT NULL,
                    included_appliances text[],
                    parking_availability INTEGER NOT NULL,
                    apartment_size INTEGER, 
                    apartment_size_unit VARCHAR(50), 
                    is_furnished INTEGER NOT NULL,
                    availability_status VARCHAR(50) DEFAULT 'Unk',
                    image TEXT,
                    description TEXT NOT NULL,
                    source TEXT,
                    website TEXT,
                    load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Table 'comp_rental_listings' created successfully.")
        else:
            print("Table 'comp_rental_listings' already exists.")

    except Exception as e:
        print(f"An error occurred in create_comp_rental_listings_table: {e}")

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()



def create_public_rental_data_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Ensure this function returns a connection to your PostgreSQL database
        cur = conn.cursor()

        # Execute a query to check if the public_rental_data table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'public_rental_data');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the public_rental_data table with the added 'property_image' column
            cur.execute("""
                CREATE TABLE public_rental_data (
                    id SERIAL PRIMARY KEY,
                    sitename VARCHAR(255) NOT NULL,
                    source TEXT NOT NULL,
                    listing_name VARCHAR(255) NOT NULL,
                    building_name VARCHAR(255) DEFAULT '-1',
                    apartment_number VARCHAR(50) DEFAULT '-1',
                    address TEXT NOT NULL,
                    add_lat VARCHAR(255) DEFAULT '-1.0',
                    add_long VARCHAR(255) DEFAULT '-1.0',
                    property_management_name VARCHAR(255) DEFAULT '-1',
                    monthly_rent VARCHAR(255) NOT NULL,
                    property_type VARCHAR(50) DEFAULT '-1',
                    bedroom_count VARCHAR(255) DEFAULT '-1',
                    bathroom_count VARCHAR(255) DEFAULT '-1',
                    apartment_size VARCHAR(255) DEFAULT '-1',
                    amenities TEXT DEFAULT '-1',
                    lease_period VARCHAR(255) DEFAULT '-1',
                    load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    property_image TEXT  -- New column for storing image URLs
                );
            """)
            conn.commit()
            print("Table 'public_rental_data' created successfully.")
        else:
            print("Table 'public_rental_data' already exists.")

    except Exception as e:
        print(f"An error occurred in create_public_rental_data_table: {e}", exc_info=True)

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()




def create_nsrentalsusers_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Execute a query to check if the nsrentalsusers table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'nsrentalsusers');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the nsrentalsusers table with the specified columns
            cur.execute("""
                CREATE TABLE nsrentalsusers (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    access_token TEXT NOT NULL,
                    creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Table 'nsrentalsusers' created successfully.")
        else:
            print("Table 'nsrentalsusers' already exists.")

    except Exception as e:
        print(f"An error occurred in create_nsrentalsusers_table: {e}", exc_info=True)

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()



def create_company_details_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Assuming get_db_connection() is a function that returns a database connection
        cur = conn.cursor()

        # Execute a query to check if the company_details table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'company_details');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the company_details table with the specified columns, including company_name
            cur.execute("""
                CREATE TABLE company_details (
                    company_id SERIAL PRIMARY KEY,
                    company_name VARCHAR(255) NOT NULL UNIQUE,
                    description TEXT NOT NULL,
                    createddate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    modifieddate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Table 'company_details' created successfully.")
        else:
            print("Table 'company_details' already exists.")

    except Exception as e:
        print(f"An error occurred in create_company_details_table: {e}", exc_info=True)

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()



def create_sec_public_rental_data_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Assuming this function returns a connection to your PostgreSQL database
        cur = conn.cursor()

        # Execute a query to check if the table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'sec_public_rental_data');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the table with the specified columns, updating data types to match sec_comp_rental_listings
            cur.execute("""
                CREATE TABLE sec_public_rental_data (
                    id SERIAL PRIMARY KEY,
                    listing_name VARCHAR(255),
                    building_name VARCHAR(255),
                    apartment_number VARCHAR(50),
                    address VARCHAR(255),
                    add_lat FLOAT,
                    add_long FLOAT,
                    property_management_name VARCHAR(255),
                    monthly_rent FLOAT NOT NULL,  -- Changed from VARCHAR(255) to INTEGER
                    property_type VARCHAR(255),
                    bedroom_count INTEGER NOT NULL,  -- Changed from VARCHAR(255) to INTEGER
                    bathroom_count INTEGER NOT NULL,  -- Changed from VARCHAR(255) to INTEGER
                    utility_water INTEGER,
                    utility_heat INTEGER,
                    utility_electricity INTEGER,
                    utility_laundry INTEGER,
                    utility_wifi INTEGER,
                    included_appliances TEXT,
                    parking_availability INTEGER,
                    parking_rates INTEGER,  -- Assuming you want to keep consistent with sec_comp_rental_listings changes
                    parking_slots INTEGER,
                    parking_distance FLOAT,
                    parking_restrictions INTEGER,
                    parking_availability_status INTEGER,
                    parking_address TEXT,
                    pet_friendly INTEGER,
                    smoking_allowed INTEGER,
                    apartment_size INTEGER,  -- Consider changing if this stores numerical values
                    apartment_size_unit VARCHAR(50),
                    is_furnished INTEGER,
                    lease_duration VARCHAR(255),
                    availability_status INTEGER,
                    dist_hospital FLOAT,
                    dist_school FLOAT,
                    dist_restaurant FLOAT,
                    dist_downtown FLOAT,
                    dist_busstop FLOAT,
                    dist_larry_uteck_area FLOAT,
                    dist_central_halifax FLOAT,
                    dist_clayton_park FLOAT,
                    dist_rockingham FLOAT, 
                    source VARCHAR(255),
                    website VARCHAR(255),
                    image TEXT,
                    description TEXT,
                    property_image TEXT,
                    load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Table 'sec_public_rental_data' created successfully.")
        else:
            print("Table 'sec_public_rental_data' already exists.")

    except Exception as e:
        print(f"An error occurred in create_sec_public_rental_data_table: {e}", exc_info=True)

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()



def create_sec_comp_rental_listings():
    conn = None
    cur = None
    try:
        # Assuming get_db_connection is a function that returns a connection to your PostgreSQL database
        conn = get_db_connection()
        cur = conn.cursor()

        # Execute a query to check if the table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'sec_comp_rental_listings');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the table with the specified columns
            cur.execute("""
                    CREATE TABLE sec_comp_rental_listings (
                        id SERIAL PRIMARY KEY,
                        listing_name VARCHAR(255),
                        building_name VARCHAR(255),
                        apartment_number VARCHAR(50),
                        address VARCHAR(255),
                        add_lat FLOAT,
                        add_long FLOAT,
                        property_management_name VARCHAR(255),
                        monthly_rent INTEGER, 
                        property_type VARCHAR(255),
                        bedroom_count INTEGER,  -- Changed from VARCHAR(255) to INTEGER
                        bathroom_count INTEGER,  -- Changed from VARCHAR(255) to INTEGER
                        utility_water INTEGER,
                        utility_heat INTEGER,
                        utility_electricity INTEGER,
                        utility_laundry INTEGER,
                        utility_wifi INTEGER,
                        included_appliances TEXT,
                        parking_availability INTEGER,
                        parking_rates INTEGER,
                        parking_slots INTEGER,
                        parking_distance INTEGER,
                        parking_restrictions INTEGER,
                        parking_availability_status INTEGER,
                        parking_address TEXT,
                        pet_friendly INTEGER,
                        smoking_allowed INTEGER,
                        apartment_size INTEGER
                        apartment_size_unit INTEGER,
                        is_furnished INTEGER,
                        lease_duration VARCHAR(255),
                        availability_status INTEGER,
                        dist_hospital FLOAT,
                        dist_school FLOAT,
                        dist_restaurant FLOAT,
                        dist_downtown FLOAT,
                        dist_busstop FLOAT,
                        dist_larry_uteck_area FLOAT,
                        dist_central_halifax FLOAT,
                        dist_clayton_park FLOAT,
                        dist_rockingham FLOAT, 
                        source VARCHAR(255),
                        website VARCHAR(255),
                        image TEXT,
                        description TEXT,
                        property_image TEXT,
                        load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );
            """)
            conn.commit()
            print("Table 'sec_comp_rental_listings' created successfully.")
        else:
            print("Table 'sec_comp_rental_listings' already exists.")

    except Exception as e:
        print(f"An error occurred in create_sec_comp_rental_listings: {e}", exc_info=True)
    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()


def create_south_west_listings_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Make sure this function correctly sets up your database connection
        cur = conn.cursor()

        # Execute a query to check if the south_west_listings table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'south_west_listings');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the south_west_listings table with the same structure as comp_rental_listings
            cur.execute("""
                CREATE TABLE south_west_listings (
                    id SERIAL PRIMARY KEY,
                    listing_name VARCHAR(255) NOT NULL,
                    address TEXT NOT NULL,
                    property_management_name VARCHAR(255) DEFAULT '-1',
                    monthly_rent INTEGER NOT NULL,
                    bedroom_count INTEGER NOT NULL,
                    bathroom_count INTEGER NOT NULL,
                    utility_water INTEGER NOT NULL,
                    utility_heat INTEGER NOT NULL,
                    utility_electricity INTEGER NOT NULL,
                    wifi_included INTEGER NOT NULL,
                    utility_laundry INTEGER NOT NULL,
                    included_appliances text[],
                    parking_availability INTEGER NOT NULL,
                    apartment_size INTEGER, 
                    apartment_size_unit VARCHAR(50), 
                    is_furnished INTEGER NOT NULL,
                    availability_status VARCHAR(50) DEFAULT 'Unk',
                    image TEXT,
                    description TEXT NOT NULL,
                    source TEXT,
                    website TEXT,
                    load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            """)
            conn.commit()
            print("Table 'south_west_listings' created successfully.")
        else:
            print("Table 'south_west_listings' already exists.")

    except Exception as e:
        print(f"An error occurred in create_south_west_listings_table: {e}", exc_info=True)

    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()


def create_sec_southwest_listings():
    conn = None
    cur = None
    try:
        # Assuming get_db_connection is a function that returns a connection to your PostgreSQL database
        conn = get_db_connection()
        cur = conn.cursor()

        # Execute a query to check if the sec_southwest_listings table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'sec_southwest_listings');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the sec_southwest_listings table with the specified columns
            cur.execute("""
                    CREATE TABLE sec_southwest_listings (
                        id SERIAL PRIMARY KEY,
                        listing_name VARCHAR(255),
                        building_name VARCHAR(255),
                        apartment_number VARCHAR(50),
                        address VARCHAR(255),
                        add_lat FLOAT,
                        add_long FLOAT,
                        property_management_name VARCHAR(255),
                        monthly_rent VARCHAR(255),  -- Consider changing this to a numeric type if it stores numerical values
                        property_type VARCHAR(255),
                        bedroom_count INTEGER,  -- Changed from VARCHAR(255) to INTEGER
                        bathroom_count INTEGER,  -- Changed from VARCHAR(255) to INTEGER
                        utility_water INTEGER,
                        utility_heat INTEGER,
                        utility_electricity INTEGER,
                        utility_laundry INTEGER,
                        utility_wifi INTEGER,
                        included_appliances TEXT,
                        parking_availability INTEGER,
                        parking_rates INTEGER,
                        parking_slots INTEGER,
                        parking_distance INTEGER,
                        parking_restrictions INTEGER,
                        parking_availability_status INTEGER,
                        pet_friendly INTEGER,
                        smoking_allowed INTEGER,
                        apartment_size INTEGER,  -- Consider changing if this stores numerical values
                        apartment_size_unit INTEGER,
                        is_furnished INTEGER,
                        lease_duration VARCHAR(255),
                        availability_status INTEGER,
                        dist_hospital FLOAT,
                        dist_school FLOAT,
                        dist_restaurant FLOAT,
                        dist_downtown FLOAT,
                        dist_busstop FLOAT,
                        source VARCHAR(255),
                        website VARCHAR(255),
                        image TEXT,
                        description TEXT,
                        property_image TEXT,
                        load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );
            """)
            conn.commit()
            print("Table 'sec_southwest_listings' created successfully.")
        else:
            print("Table 'sec_southwest_listings' already exists.")

    except Exception as e:
        print(f"An error occurred in create_sec_southwest_listings: {e}", exc_info=True)
    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()




def create_table_comp_rental_listings():
    execute_table_creation("""
        CREATE TABLE comp_rental_listings (
            id SERIAL PRIMARY KEY,
            listing_name VARCHAR(255) NOT NULL,
            address TEXT NOT NULL,
            property_management_name VARCHAR(255) DEFAULT '-1',
            monthly_rent INTEGER NOT NULL,
            bedroom_count INTEGER NOT NULL,
            bathroom_count INTEGER NOT NULL,
            utility_water INTEGER NOT NULL,
            utility_heat INTEGER NOT NULL,
            utility_electricity INTEGER NOT NULL,
            wifi_included INTEGER NOT NULL,
            utility_laundry INTEGER NOT NULL,
            included_appliances text[],
            parking_availability INTEGER NOT NULL,
            apartment_size INTEGER, 
            apartment_size_unit VARCHAR(50), 
            is_furnished INTEGER NOT NULL,
            availability_status VARCHAR(50) DEFAULT 'Unk',
            image TEXT,
            description TEXT NOT NULL,
            source TEXT,
            website TEXT,
            load_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    """, "comp_rental_listings")

def create_table_hrm_building_listings():
    execute_table_creation("""
        CREATE TABLE hrm_building_listings (
            id SERIAL PRIMARY KEY,
            listing_name VARCHAR(255),
            address TEXT,
            property_management_name VARCHAR(255) DEFAULT NULL,
            permit_value  VARCHAR(255),
            floors  VARCHAR(255),
            units_or_size VARCHAR(255),
            building_type VARCHAR(255),
            image TEXT,
            url TEXT,
            source_name VARCHAR(255),
            add_lat FLOAT,
            add_long FLOAT
        );
    """, "hrm_building_listings")

def create_table_hrm_buildings_permit():
    execute_table_creation("""
        CREATE TABLE hrm_buildings_permit (
            id SERIAL PRIMARY KEY,
            civic_address TEXT NOT NULL,
            floors  VARCHAR(255),
            units_or_size VARCHAR(255),
            building_type VARCHAR(255),
            permit_value VARCHAR(255),
            latest_update  TEXT
        );
    """, "hrm_buildings_permit")

def create_table_parking_data():
    execute_table_creation("""
        CREATE TABLE parking_data (
            id SERIAL PRIMARY KEY,
            address VARCHAR(255),
            lot INTEGER,
            price VARCHAR(50)
        );
    """, "parking_data")

def create_table_sec_parking_data():
    execute_table_creation("""
        CREATE TABLE sec_parking_data (
            id SERIAL PRIMARY KEY,
            address VARCHAR(255),
            lot INTEGER,
            price FLOAT,
            add_lat FLOAT,
            add_long FLOAT
        );
    """, "sec_parking_data")



def create_model_versioning_table():
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Assuming get_db_connection() is a function that returns a database connection
        cur = conn.cursor()

        # Execute a query to check if the model_versioning table exists
        cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename  = 'model_versioning');")
        exists = cur.fetchone()[0]

        if not exists:
            # Create the model_versioning table with the specified columns
            cur.execute("""
                CREATE TABLE model_versioning (
                    id SERIAL PRIMARY KEY,
                    model_number VARCHAR(255) NOT NULL,
                    model_version VARCHAR(255) NOT NULL,
                    r2_score FLOAT NOT NULL,
                    loaddatetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            """)
            # Insert initial data
            cur.execute("""
                INSERT INTO model_versioning (model_number, model_version, r2_score)
                VALUES (%s, %s, %s);
            """, ('1', 'v1', 84.9))
            conn.commit()
            print("Table 'model_versioning' created successfully and initial data inserted.")
        else:
            print("Table 'model_versioning' already exists.")

    except Exception as e:
        print(f"An error occurred in create_model_versioning_table: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


# Call the function to create the table
create_model_versioning_table()
create_comp_rental_listings_table()
create_sec_comp_rental_listings()
create_nsrentalsusers_table()
create_public_rental_data_table()
create_sec_public_rental_data_table()
create_table_comp_rental_listings()
create_table_hrm_building_listings()
create_table_hrm_buildings_permit()
create_table_parking_data()
create_table_sec_parking_data()
create_south_west_listings_table()
create_sec_southwest_listings()
create_company_details_table()