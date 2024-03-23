import pandas as pd
from typing import List
from dotenv import load_dotenv
from competitor_scrapers import ws_blackbaygrp , ws_facade
from hrm_scrapers import ws_hrm_permit_tracking, ws_hrm_building_listings
from src import db_utils as DU
from src import create_tables
from tqdm import tqdm
import os

load_dotenv()  

class Scraper:
    def __init__(self) -> None:
        # Initialize an empty DataFrame for storing rental data
        #self.data = pd.DataFrame()
        pass
    
    def call_scrapers(self) -> pd.DataFrame:
        """
        Calls individual scraper functions or classes from other files in the src directory.
        Each scraper is expected to return a DataFrame.
        """

        # Scraper functions/classes from different modules
        scraper_functions = {
            'Competitor_Scrapers': [
                ws_blackbaygrp.scrape,
                ws_facade.scrape
            ],
            'General_Scrapers': [

            ],
            'HRM_Permit_Scraper': [
                ws_hrm_permit_tracking.scrape
            ],
            'HRM_Buildings_Scraper':[
                ws_hrm_building_listings.scrape
            ],

            'Parking_Scraper': [

            ],
            'South_West_Scraper': [

            ]
        }
        
        # Collect DataFrames from each scraper
        
        for category, scrapers in scraper_functions.items():
            print(f"Starting category: {category}")
            dfs: List[pd.DataFrame] = []
            for scrape_func in tqdm(scrapers, desc=f'{category} Progress'):
                try:
                    df = scrape_func()
                    print(f"Length of dataframe: {len(df)}")
                    if category == 'Competitor_Scrapers':
                        DU.save_df_to_comp_rental_listings(df)

                    elif category == 'General_Scrapers':
                        # Add your custom function or handling for this category
                        pass

                    elif category == 'HRM_Permit_Scraper':
                        DU.save_df_to_hrm_buildings_permit(df)

                    elif category == 'HRM_Buildings_Scraper':
                        DU.save_df_to_hrm_building_listings(df)

                    elif category == 'Parking_Scraper':
                        # Add your custom function or handling for this category
                        pass

                    elif category == 'South_West_Scraper':
                        # Add your custom function or handling for this category
                        pass

                    dfs.append(df)
                    print(f"Completed: {scrape_func.__name__}")
                except Exception as e:
                    print(f"Error calling scraper {scrape_func.__name__}: {e}")
        
            # Concatenate all DataFrames into one
            if dfs:
                combined_df = pd.concat(dfs, ignore_index=True)
                save_dir = 'data'
                # Check if the directory exists, and create it if it doesn't
                if not os.path.exists(save_dir):
                    os.makedirs(save_dir)
                # Specify the path to save the CSV file, including the directory
                csv_filename = os.path.join(save_dir, f'{category}_data.csv')
                combined_df.to_csv(csv_filename, index=False)
                print(f"Data for {category} saved to {csv_filename}")

            print(f"Finished category: {category}")
        
        
if __name__ == "__main__":
    create_tables.create_all_tables()
    scraper = Scraper()
    scraper.call_scrapers()
    # combined_data.to_csv('combined_data.csv')
    # print(combined_data)
