from pub_rental_scrapers import site_apartments_scraping, site_findallrentals_scraping, site_zumper_scraping, site_rentseeker_scraping
from pub_rental_scrapers import site_happipad_scraping, site_killam_scraping, site_zillow_scraping, site_kijiji_scraping
import pandas as pd

from src.config import *
from src.utils import *
from src.db_utils import *

class PublicRentalScraper():
    def __init__(self):
        pass
        
    def scrape_apartments(self, site):
        scraped_df = pd.DataFrame()     
        try:
            if site == "Apartments":
                print("Scraping Apartments.com Site")
                scraped_df = site_apartments_scraping.main()

            elif site == "FIND_ALL_RENTALS":
                print("Scraping Findallrentals.com Site")
                scraped_df = site_findallrentals_scraping.main()

            elif site == "HAPPIPAD":
                print("Scraping happipad.com Site")
                scraped_df = site_happipad_scraping.main()

            elif site == "KILLAM":
                print("Scraping killam.com Site")
                scraped_df = site_killam_scraping.main()
                
            elif site == "ZUMPER":
                print("Scraping zumper.com Site")
                scraped_df = site_zumper_scraping.main()

            elif site == "ZILLOW":
                print("Scraping zillow.com Site")
                scraped_df = site_zillow_scraping.main()

            elif site == "KIJIJI":
                print("Scraping kijiji.ca Site")
                scraped_df = site_kijiji_scraping.main()

            elif site == "RENTSEEKER":
                print("Scraping Rent Seeker Site")
                scraped_df = site_rentseeker_scraping.main()
        
            return scraped_df

        except Exception as ex:
            print(f"Problem with Scraping: {str(ex)}")
            return scraped_df


def start_scraping():
    scraper = PublicRentalScraper()
    # Define a list to store the names of all scrapers for logging purposes
    scraper_names = ["Apartments", "FIND_ALL_RENTALS", "HAPPIPAD", "KILLAM", "ZUMPER", "RENTSEEKER", "ZILLOW", "KIJIJI"]
    all_data_frames = []  # List to hold all individual DataFrames for final combination

    for scraper_name in scraper_names:
        data_df = scraper.scrape_apartments(scraper_name)
        print(f"Length of {scraper_name} data_df: {len(data_df)}")
        print(f"Length of {scraper_name} columns: {data_df.columns}")

        if not data_df.empty:
            # Process and save each individual scraped data immediately
            processed_df = reorder_dataframe_columns(data_df, desired_column_order)
            save_df_to_public_rental_data(processed_df)
            # processed_df.to_csv(f"{scraper_name}_data.csv", index=False)
            print(f"Data from {scraper_name} processed and saved.")
            all_data_frames.append(processed_df)
        else:
            print(f"No data scraped from {scraper_name}.")

    if all_data_frames:
        # Combine all DataFrames into one if there were any successful scrapes
        combined_data_df = pd.concat(all_data_frames, ignore_index=True)
        # combined_data_df.to_csv("dataset.csv", index=False)
        print("Scraping completed. Combined data saved to dataset.csv.")
    else:
        print("No data scraped from any sources.")

    return combined_data_df if all_data_frames else pd.DataFrame()


if __name__ == "__main__":
    start_scraping()
