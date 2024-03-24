import pandas as pd
from typing import List
from dotenv import load_dotenv

from scrapers import ws_blackbaygrp , ws_facade

from src import db_utils as DU
from src import create_tables


load_dotenv()  

class CompetitorScraper:
    def __init__(self) -> None:
        # Initialize an empty DataFrame for storing rental data
        self.data = pd.DataFrame()
    
    def call_scrapers(self) -> pd.DataFrame:
        """
        Calls individual scraper functions or classes from other files in the src directory.
        Each scraper is expected to return a DataFrame.
        """

        # Scraper functions/classes from different modules
        scraper_functions = [
            ws_blackbaygrp.scrape,
            ws_facade.scrape
        ]
        
        # Collect DataFrames from each scraper
        dfs: List[pd.DataFrame] = []
        for scrape_func in scraper_functions:
            try:
                df = scrape_func()
                print(f"Length of dataframe: {len(df)}")
                DU.save_df_to_comp_rental_listings(df)

                dfs.append(df)
                
            except Exception as e:
                print(f"Error calling scraper {scrape_func.__name__}: {e}")
        
        # Concatenate all DataFrames into one
        if dfs:
            self.data = pd.concat(dfs, ignore_index=True)
        
        return self.data

if __name__ == "__main__":
    scraper = CompetitorScraper()
    combined_data = scraper.call_scrapers()
    # combined_data.to_csv('combined_data.csv')
    # print(combined_data)