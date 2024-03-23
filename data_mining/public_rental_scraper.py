from pub_rental_scrapers import site_apartments_scraping, site_findallrentals_scraping, site_zumper_scraping, site_rentseeker_scraping
from pub_rental_scrapers import site_happipad_scraping, site_killam_scraping, site_zillow_scraping, site_kijiji_scraping
import pandas as pd

from src.config import *
from src.utils import *
from src.db_utils import *

class Scraper():
    def __init__(self, contents):
        self.contents = contents
        
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
    contents_df = pd.DataFrame()
    scraper = Scraper(contents_df)

    apartments_data_df = scraper.scrape_apartments("Apartments")
    print(f"Length of apartments_data_df: {len(apartments_data_df)}")

    find_all_rentals_data_df = scraper.scrape_apartments("FIND_ALL_RENTALS")
    print(f"Length of find_all_rentals_data_df: {len(find_all_rentals_data_df)}")
    
    happipad_data_df = scraper.scrape_apartments("HAPPIPAD")
    print(f"Length of happipad_data_df: {len(happipad_data_df)}")
    
    killam_data_df = scraper.scrape_apartments("KILLAM")
    print(f"Length of killam_data_df: {len(killam_data_df)}")
    
    zumper_data_df = scraper.scrape_apartments("ZUMPER")
    print(f"Length of zumper_data_df: {len(zumper_data_df)}")
    
    zillow_data_df = scraper.scrape_apartments("ZILLOW")
    print(f"Length of find_all_rentals_data_df: {len(zillow_data_df)}")

    # kijiji_data_df = scraper.scrape_apartments("KIJIJI")
    # print(f"Length of kijiji_data_df: {len(kijiji_data_df)}")

    rentseeker_df = scraper.scrape_apartments("RENTSEEKER")
    print(f"Length of rentseeker_df: {len(rentseeker_df)}")

    combined_data_df = pd.concat([apartments_data_df, find_all_rentals_data_df, happipad_data_df, zumper_data_df, killam_data_df, zillow_data_df], ignore_index=True)
    # combined_data_df = pd.concat([apartments_data_df, find_all_rentals_data_df, happipad_data_df, zumper_data_df, killam_data_df, zillow_data_df, kijiji_data_df], ignore_index=True)
    ordered_df = reorder_dataframe_columns(combined_data_df, desired_column_order)
    
    if not ordered_df.empty:
        save_df_to_public_rental_data(ordered_df)
        ordered_df.to_csv("dataset.csv", index=False)
        print("Scraping completed. Data saved to dataset.csv.")
    else:
        print("No data scraped.")

    return ordered_df

if __name__ == "__main__":
    start_scraping()
