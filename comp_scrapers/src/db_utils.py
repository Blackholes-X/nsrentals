import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv

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


def filter_existing_urls(urls):
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



### Next