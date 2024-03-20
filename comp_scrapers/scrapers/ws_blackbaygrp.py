from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

from bs4 import BeautifulSoup

import os
import time
import json
import pandas as pd
from typing import List

from src import config as C
from src import get_from_llm as LLM
from src import utils as U
from src import db_utils as DU

PROPERTY_MANAGEMENT_FIRM = "Blackbay Group Inc."
WEBSITE_URL = C.BLACKBAY_GRP

def get_listing_urls(driver) -> List[str]:
    """
    Fetches listing URLs from the main page.
    
    :param driver: Selenium WebDriver instance.
    :return: List of listing URLs.
    """
    driver.get(WEBSITE_URL)
    driver.implicitly_wait(10)  # Adjust based on page load time
    
    listings = driver.find_elements(By.CSS_SELECTOR, ".row.listing-grid div a")
    urls = [elem.get_attribute('href') for elem in listings]
    
    return urls


def extract_listing_relevant_html(url: str, driver) -> dict:
    """
    Extracts the HTML content of a specified container on a single listing page for NLP processing.
    
    :param url: URL of the listing page.
    :param driver: Selenium WebDriver instance.
    :return: A dictionary containing the URL and the raw HTML of the targeted container.
    """
    driver.get(url)
    # Using an explicit wait here to ensure that the element is loaded
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".container .fw-container.clearfix")))
    
    # Fetch the container and its HTML content
    container_html = driver.find_element(By.CSS_SELECTOR, ".container .fw-container.clearfix").get_attribute('outerHTML')
    
    return container_html


def extract_features_from_text_html(text_html_content: str, output_file: str = 'full_text_html_content.json') -> None:
    """
    Writes the entire HTML content to a file for further NLP processing.
    
    :param text_html_content: String containing the full HTML content.
    :param output_file: Path to the output file where the HTML content will be saved.
    """

    unique_listings = LLM.get_unique_listings(text_html_content)
    listings_features_listed = LLM.get_features_from_llm(text_html_content, unique_listings, PROPERTY_MANAGEMENT_FIRM)

    # Write the parsed data to a file in JSON format
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(listings_features_listed, file, indent=4)

    
    return listings_features_listed["rental_listings"]


def scrape() -> pd.DataFrame:
    """
    Orchestrates the scraping process.
    
    :return: A DataFrame containing all the scraped data.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run Chrome in headless mode (without a GUI).
    chrome_options.add_argument("--no-sandbox")  # Bypass OS security model; required in some environments.
    chrome_options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems.
    chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])  # Disable logging (optional).

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    # driver = webdriver.Chrome()
    
    try:
        urls = get_listing_urls(driver)

        # Filter URLs against the database
        urls = DU.filter_existing_urls(urls)
        
        listings_data = []
        for index, url in enumerate(urls):
            try:
                extracted_relevant_html = extract_listing_relevant_html(url, driver)
                
                # Get cleaned content
                cleaned_content = U.text_from_html(extracted_relevant_html)

                listing_details = extract_features_from_text_html(cleaned_content)
                for listing in listing_details:
                    listing["source"] = url
                    listing["website"] = WEBSITE_URL
                    listings_data.append(listing)

                # time.sleep(5) can be uncommented if needed
                
            except Exception as e:
                print(f"Error extracting details from {url}: {e}")
            
            # # Remove or modify the break statement as needed for full execution
            # break

        df = pd.DataFrame(listings_data)
        
    except Exception as ex:
        print(f"Exception occurred while scraping: {ex}")
        df = pd.DataFrame()  # Ensure df is defined in case of an exception
    finally:
        driver.quit()
    
    return df
