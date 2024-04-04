import pandas as pd
from typing import List
from dotenv import load_dotenv
from hrm_scrapers import ws_hrm_permit_tracking, ws_hrm_building_listings
from src import db_utils as DU
import os



load_dotenv()  

class HrmScraper:
    def __init__(self) -> None:
        # Initialize an empty DataFrame for storing rental data
        pass

    def call_scrapers(self):
        """
        Calls individual scraper functions or classes from other files in the src directory.
        Each scraper is expected to return a DataFrame.
        """

        # Scraper functions/classes from different modules
        scraper_functions = [
           ws_hrm_permit_tracking.scrape,
            ws_hrm_building_listings.scrape
        ]
        
        for scrape_func in scraper_functions:
            try:
                df = scrape_func()
                print(f"Length of dataframe: {len(df)}")
                
                module_name = scrape_func.__module__
                if(module_name == 'hrm_scrapers.ws_hrm_permit_tracking'):
                    DU.save_df_to_hrm_buildings_permit(df)
                elif(module_name == 'hrm_scrapers.ws_hrm_building_listings'):
                    DU.save_df_to_hrm_building_listings(df)
                data_dir = 'data'
                if not os.path.exists(data_dir):
                    os.makedirs(data_dir)

                clean_file_name = module_name.split('.')[-1]
                csv_file_path = os.path.join(data_dir, f'{clean_file_name}.csv')
                df.to_csv(csv_file_path, index=False)

                
            except Exception as e:
                print(f"Error calling scraper {scrape_func.__name__}: {e}")
        

if __name__ == "__main__":
    scraper = HrmScraper()
    scraper.call_scrapers()
