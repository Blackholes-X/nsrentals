import json
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv
load_dotenv()

def read_data_from_json(json_file_path):
    """Reads data from a JSON file and returns it."""
    with open(json_file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def convert_data_to_dicts(data):
    """
    Converts a list of lists containing tuples (as fetched from the database)
    into a list of dictionaries for easier JSON serialization.

    Each tuple is expected to have the following structure:
    (id, company_name, website_url, logo_url, description, domain_name,
     geography_served, contact_email, social_media_profiles, address, notes)
    """
    result = []
    for outer_list in data:
        for record in outer_list:
            (id, company_name, website_url, logo_url, description, domain_name,
             geography_served, contact_email, social_media_profiles, address, notes) = record
            
            # Convert the tuple into a dictionary
            record_dict = {
                "id": id,
                "company_name": company_name,
                "website_url": website_url,
                "logo_url": logo_url,
                "description": description,
                "domain_name": domain_name,
                "geography_served": geography_served,
                "contact_email": contact_email,
                "social_media_profiles": social_media_profiles,
                "address": address,
                "notes": notes
            }
            result.append(record_dict)
    return result

def connect_and_insert_from_json(json_file_path):
    # Connection parameters - update these with your database information
    dbname = os.getenv('POSTGRES_DB')
    user = os.getenv('POSTGRES_USER')
    password = os.getenv('POSTGRES_PASSWORD')
    port=os.getenv('POSTGRES_PORT')

    host = os.getenv('POSTGRES_HOST') # or your database server address

    # Read data from JSON file
    data = read_data_from_json(json_file_path)

    # Connect to your database
    conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    # Check if table exists and create it if it doesn't
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS company_description (
            id SERIAL PRIMARY KEY,
            company_name TEXT NOT NULL,
            website_url TEXT NOT NULL,
            logo_url TEXT,
            description TEXT NOT NULL,
            domain_name TEXT,
            geography_served TEXT[],
            contact_email TEXT,
            social_media_profiles JSONB,
            address TEXT,
            notes TEXT
        );
    """)

    insert_query = """
    INSERT INTO company_description (
        company_name, website_url, logo_url, description, domain_name, 
        geography_served, contact_email, social_media_profiles, address, notes
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s)
    """
    # Prepare and execute the insert query for each item in the data
    for item in data:
         cursor.execute(insert_query, (
            item["Company Name"],
            item["Website URL"],
            item["Logo URL"],
            item["Description"],
            item["Domain Name"],
            item["Geography Served"],  # Assumes PostgreSQL can handle this directly as an array
            item["Contact Email"],
            json.dumps(item["Social Media Profiles"]),  # Converts the dictionary to a JSON string for JSONB column
            item.get("Address"),  # Use .get for optional fields to avoid KeyError
            item.get("Notes")
        ))

    # Commit the transaction and close the connection
    conn.commit()

    select_query = "SELECT * FROM company_description WHERE company_name = %s"
    extracted_data = [] 

    for item in data:
        cursor.execute(select_query, (item["Company Name"],))  # Note the comma to make it a tuple
        extracted_data.append(cursor.fetchall())  
    cursor.close()
    conn.close()
    
    return convert_data_to_dicts(extracted_data)

# Example usage
if __name__ == "__main__":
    company = "BlackBay"
    debug_folder_path = './debug'
    file_name = f"summarized_content_{company}.json"
    file_path = os.path.join(debug_folder_path, file_name)
    connect_and_insert_from_json(file_path)
