import psycopg2
import psycopg2.extras
from psycopg2.extras import RealDictCursor
from psycopg2 import sql
from typing import Optional
import os
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import urllib
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine
from urllib.parse import quote


from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    '''
    This function is used to connect to the PostGresDB
    Returns:
        connection: Returns the connection object
    '''
    conn = psycopg2.connect(
        host=os.getenv('POSTGRES_HOST'),
        database=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        port=os.getenv('POSTGRES_PORT')
    )
    return conn


def load_data_from_postgres():
    # Database credentials
    POSTGRES_DB = os.getenv('POSTGRES_DB')
    POSTGRES_USER = os.getenv('POSTGRES_USER')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT')
    RAW_PASSWORD = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_SERVER_HOST = os.getenv('POSTGRES_HOST')
    POSTGRES_PASSWORD = quote(RAW_PASSWORD)
    
    # Creating a connection URL
    connection_string = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
    
    # Create the engine
    engine = create_engine(connection_string)

    # DataFrames dictionary to store each table's DataFrame
    dfs = {}

    # List of tables to load
    tables = [
        "sec_public_rental_data",
        "sec_southwest_listings",
        "sec_comp_rental_listings"
    ]

    # Load data from each table into a DataFrame and store it in the dictionary
    for table in tables:
        query = f"SELECT * FROM {table}"
        dfs[table] = pd.read_sql(query, engine)

    # Make sure to close the connection
    engine.dispose()
    
    # Return the dictionary containing the DataFrames
    return dfs



def write_dataframe_to_postgres(df, table_name):
    """
    Writes a DataFrame to a specific table in a PostgreSQL database.

    Parameters:
    - df: DataFrame to write.
    - table_name: Name of the table to write the DataFrame to.
    - db_credentials: A dictionary containing database credentials.
    """


    POSTGRES_DB = os.getenv('POSTGRES_DB')
    POSTGRES_USER = os.getenv('POSTGRES_USER')
    POSTGRES_PORT = os.getenv('POSTGRES_PORT')
    RAW_PASSWORD = os.getenv('POSTGRES_PASSWORD')
    POSTGRES_SERVER_HOST = os.getenv('POSTGRES_HOST')
    POSTGRES_PASSWORD = quote(RAW_PASSWORD)
    
    # Creating a connection URL
    connection_string = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
    
    # Create the engine
    engine = create_engine(connection_string)
    
    # Write the DataFrame to the specified table
    df.to_sql(table_name, engine, if_exists='replace', index=False, method='multi')
    
    # Make sure to close the connection
    engine.dispose()


def get_recent_listings_by_management(property_management_name: str, records_limit: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # SQL query to select the recent 'n' listings for the specified property management firm
        cur.execute("""
            SELECT * FROM sec_comp_rental_listings
            WHERE property_management_name = %s
            ORDER BY load_datetime DESC
            LIMIT %s
        """, (property_management_name, records_limit))

        listings = cur.fetchall()
        if listings:
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, listing)) for listing in listings]
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()



def get_all_comp_listings(records_limit: int, bedroom_count: Optional[int] = None, bathroom_count: Optional[int] = None, rent_min: Optional[int] = None, rent_max: Optional[int] = None):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT * FROM sec_comp_rental_listings
            WHERE TRUE
        """

        params = []

        if bedroom_count is not None:
            query += " AND bedroom_count = %s"
            params.append(bedroom_count)

        if bathroom_count is not None:
            query += " AND bathroom_count = %s"
            params.append(bathroom_count)

        if rent_min is not None:
            query += " AND CAST(monthly_rent AS INTEGER) >= %s"
            params.append(rent_min)

        if rent_max is not None:
            query += " AND CAST(monthly_rent AS INTEGER) <= %s"
            params.append(rent_max)

        query += " ORDER BY load_datetime DESC LIMIT %s"
        params.append(records_limit)

        cur.execute(query, tuple(params))

        listings = cur.fetchall()
        if listings:
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, listing)) for listing in listings]
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()


def get_pub_listings(records_limit: int, bedroom_count: Optional[int] = None, bathroom_count: Optional[int] = None, rent_min: Optional[int] = None, rent_max: Optional[int] = None):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT * FROM sec_public_rental_data
            WHERE TRUE
        """

        params = []

        if bedroom_count is not None:
            query += " AND CAST(bedroom_count AS INTEGER) = %s"
            params.append(bedroom_count)

        if bathroom_count is not None:
            query += " AND CAST(bathroom_count AS INTEGER) = %s"
            params.append(bathroom_count)

        if rent_min is not None:
            query += " AND CAST(monthly_rent AS INTEGER) >= %s"
            params.append(rent_min)

        if rent_max is not None:
            query += " AND CAST(monthly_rent AS INTEGER) <= %s"
            params.append(rent_max)

        query += " ORDER BY load_datetime DESC LIMIT %s"
        params.append(records_limit)

        cur.execute(query, tuple(params))

        listings = cur.fetchall()
        if listings:
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, listing)) for listing in listings]
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()


def get_southwest_listings(records_limit: int, bedroom_count: Optional[int] = None, bathroom_count: Optional[int] = None, rent_min: Optional[int] = None, rent_max: Optional[int] = None):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT * FROM sec_southwest_listings
            WHERE TRUE
        """

        params = []

        if bedroom_count is not None:
            query += " AND CAST(bedroom_count AS INTEGER) = %s"
            params.append(bedroom_count)

        if bathroom_count is not None:
            query += " AND CAST(bathroom_count AS INTEGER) = %s"
            params.append(bathroom_count)

        if rent_min is not None:
            query += " AND CAST(monthly_rent AS INTEGER) >= %s"
            params.append(rent_min)

        if rent_max is not None:
            query += " AND CAST(monthly_rent AS INTEGER) <= %s"
            params.append(rent_max)

        query += " ORDER BY load_datetime DESC LIMIT %s"
        params.append(records_limit)

        cur.execute(query, tuple(params))

        listings = cur.fetchall()
        if listings:
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, listing)) for listing in listings]
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()


def get_random_southwest_properties(property_id: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch all columns
        query = """
            SELECT * FROM sec_southwest_listings
            ORDER BY RANDOM()
            LIMIT 3
        """

        cur.execute(query)
        properties = cur.fetchall()

        if properties:
            # Dynamically getting column names from the cursor description
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, property)) for property in properties]
        return []
    except Exception as e:
        print(f"An error occurred while fetching random southwest properties: {e}")
        return []
    finally:
        if cur: cur.close()
        if conn: conn.close()


def get_listings_by_ids(id1: int, id2: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # SQL query to fetch listings by the two given IDs
        cur.execute("""
            SELECT * FROM comp_rental_listings
            WHERE id IN (%s, %s);
        """, (id1, id2))

        listings = cur.fetchall()
        if listings:
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, listing)) for listing in listings]
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()




def get_company_details():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
        SELECT property_management_name, 
               COUNT(*) AS total_listings, 
               ROUND(AVG(CASE WHEN bedroom_count::INTEGER = 0 THEN CAST(monthly_rent AS INTEGER) END), 2) AS average_price_0_bedroom,
               ROUND(AVG(CASE WHEN bedroom_count::INTEGER = 1 THEN CAST(monthly_rent AS INTEGER) END), 2) AS average_price_1_bedroom,
               ROUND(AVG(CASE WHEN bedroom_count::INTEGER = 2 THEN CAST(monthly_rent AS INTEGER) END), 2) AS average_price_2_bedroom
        FROM sec_comp_rental_listings
        GROUP BY property_management_name
        """)
        
        company_details = cur.fetchall()
        if company_details:
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, detail)) for detail in company_details]
        else:
            return []
    except Exception as e:
        print(f"An error occurred: {e}")
        return None
    finally:
        if cur: cur.close()
        if conn: conn.close()



def store_user_and_access_token(email, name, access_token):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # SQL statement for inserting user data
        insert_sql = """
        INSERT INTO nsrentalsusers (name, email, access_token, creation_date, modified_date)
        VALUES (%s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (email) 
        DO UPDATE SET
            name = EXCLUDED.name,
            access_token = EXCLUDED.access_token,
            modified_date = CURRENT_TIMESTAMP;
        """
        
        # Execute the insert statement
        cur.execute(insert_sql, (name, email, access_token))
        
        # Commit the changes
        conn.commit()
        print("User data stored successfully.")
    
    except Exception as e:
        print(f"An error occurred while storing user data: {e}")
        if conn:
            conn.rollback()
    
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()




def get_last_listings(table_name: str, limit: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Updated query to filter out listings based on property_image and source
        query = f"""
            SELECT * FROM {table_name}
            WHERE property_image != '-1' AND property_image != 'Kijiji User'
            ORDER BY load_datetime DESC
            LIMIT %s
        """
        cur.execute(query, (limit,))
        
        listings = cur.fetchall()
        if listings:
            # Assuming you know the columns or dynamically fetch if necessary
            columns = [desc[0] for desc in cur.description]
            filtered_listings = [dict(zip(columns, listing)) for listing in listings]
            return filtered_listings
        return []
    except Exception as e:
        print(f"An error occurred fetching listings from {table_name}: {e}")
        return []
    finally:
        if cur: cur.close()
        if conn: conn.close()



def get_hrm_building_listings(limit: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Ensure this function returns a DB connection
        cur = conn.cursor()

        query = """
            SELECT * FROM hrm_building_listings
            LIMIT %s;
        """
        cur.execute(query, (limit,))

        listings = cur.fetchall()
        if listings:
            columns = [desc[0] for desc in cur.description]  # Fetch column names
            return [dict(zip(columns, listing)) for listing in listings]
        else:
            return []
    except Exception as e:
        print(f"An error occurred while fetching HRM building listings: {e}")
        return []
    finally:
        if cur: cur.close()
        if conn: conn.close()


def get_hrm_building_permits(limit: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()  # Make sure this function returns a DB connection
        cur = conn.cursor()

        query = """
            SELECT * FROM hrm_buildings_permit
            LIMIT %s;
        """
        cur.execute(query, (limit,))

        permits = cur.fetchall()
        if permits:
            columns = [desc[0] for desc in cur.description]  # Fetch column names
            return [dict(zip(columns, permit)) for permit in permits]
        else:
            return []
    except Exception as e:
        print(f"An error occurred while fetching HRM building permits: {e}")
        return []
    finally:
        if cur: cur.close()
        if conn: conn.close()



def get_competitor_listings_summary():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Using CAST to numeric with specified scale for rounding
        cur.execute("""
            SELECT property_management_name,
                   COUNT(*) AS total_listings,
                   CAST(AVG(monthly_rent::FLOAT) AS NUMERIC(10, 2)) AS avg_rent
            FROM sec_comp_rental_listings
            GROUP BY property_management_name
        """)

        competitors = cur.fetchall()
        # Format the query results into a list of dictionaries
        competitor_listings = [
            {"name": competitor[0], "total_listings": competitor[1], "avg_rent": competitor[2]}
            for competitor in competitors
        ]
        return competitor_listings

    except Exception as e:
        print(f"An error occurred: {e}")
        return []
    finally:
        if conn:
            conn.close()



def read_data_from_sec_southwest_listings():
    """Fetch all rows from the sec_southwest_listings table and return as DataFrame."""

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
        query = "SELECT * FROM sec_southwest_listings"
        
        # Use pandas to load the query result into a DataFrame
        df = pd.read_sql_query(query, engine)
        return df
    except Exception as e:
        print(f"Error fetching data from sec_southwest_listings table: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of error


def read_data_from_sec_comp_rental_listings():
    """Fetch all rows from the sec_comp_rental_listings table and return as DataFrame."""

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
        query = "SELECT * FROM sec_comp_rental_listings"
        
        # Use pandas to load the query result into a DataFrame
        df = pd.read_sql_query(query, engine)
        return df
    except Exception as e:
        print(f"Error fetching data from sec_comp_rental_listings table: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of error

