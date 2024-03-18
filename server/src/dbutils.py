import psycopg2
import psycopg2.extras
from psycopg2.extras import RealDictCursor
from psycopg2 import sql

import os
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



def get_recent_listings_by_management(property_management_name: str, records_limit: int):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # SQL query to select the recent 'n' listings for the specified property management firm
        cur.execute("""
            SELECT * FROM comp_rental_listings
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



def get_company_details():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
        SELECT property_management_name, 
               COUNT(*) AS total_listings, 
               ROUND(AVG(CASE WHEN bedroom_count = 0 THEN monthly_rent END), 2) AS average_price_0_bedroom,
               ROUND(AVG(CASE WHEN bedroom_count = 1 THEN monthly_rent END), 2) AS average_price_1_bedroom,
               ROUND(AVG(CASE WHEN bedroom_count = 2 THEN monthly_rent END), 2) AS average_price_2_bedroom
        FROM comp_rental_listings
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

