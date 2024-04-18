from src import db_utils as DU
from sqlalchemy import create_engine
import pandas as pd
from tqdm import tqdm



# PostgreSQL example
local_db = DU.get_database_uri()
server_db = DU.get_server_database_uri()


def transfer_table_data(table_name, source_db, target_db):
    """
    Transfers data from one table in the source database to a table in the target database.
    
    Parameters:
    - table_name (str): The name of the table to transfer.
    - source_db (str): The SQLAlchemy connection string for the source database.
    - target_db (str): The SQLAlchemy connection string for the target database.
    """
    # Create SQLAlchemy engines
    source_engine = create_engine(source_db)
    target_engine = create_engine(target_db)
    
    # Read data from source table
    df = pd.read_sql_table(table_name, source_engine)
    
    # Write data to target table
    df.to_sql(table_name, target_engine, if_exists='append', index=False)
    
    print(f"Data transferred for table: {table_name}")


def transfer_all_tables(tables, source_db, target_db):
    """
    Transfers data for multiple tables from the source database to the target database.
    
    Parameters:
    - tables (list of str): A list of table names to transfer.
    - source_db (str): The SQLAlchemy connection string for the source database.
    - target_db (str): The SQLAlchemy connection string for the target database.
    """
    for table_name in tqdm(tables):
        transfer_table_data(table_name, source_db, target_db)


        
if __name__ == "__main__":
    # tables_to_transfer = ['comp_rental_listings']  # Replace with your actual table names
    tables_to_transfer = ['comp_rental_listings', 'public_rental_data', 'nsrentalsusers', 'sec_public_rental_data', 'sec_comp_rental_listings', 
                          'south_west_listings', 'sec_southwest_listings', 'hrm_building_listings', 'hrm_buildings_permit',
                          'parking_data', 'sec_parking_data']  # Replace with your actual table names

    # Execute the transfer
    transfer_all_tables(tables_to_transfer, local_db, server_db)
