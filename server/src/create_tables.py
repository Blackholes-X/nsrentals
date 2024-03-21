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



# if __name__ == "__main__":
            
create_comp_rental_listings_table()

create_nsrentalsusers_table()