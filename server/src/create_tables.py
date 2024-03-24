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
        print(f"An error occurred in create_comp_rental_listings_table: {e}", exc_info=True)

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
            # Create the table with the specified columns
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
                    monthly_rent VARCHAR(255),
                    property_type VARCHAR(255),
                    bedroom_count VARCHAR(255),
                    bathroom_count VARCHAR(255),
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
                    apartment_size VARCHAR(255),
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



# if __name__ == "__main__":
            
create_comp_rental_listings_table()

create_nsrentalsusers_table()

create_public_rental_data_table()

create_sec_public_rental_data_table()