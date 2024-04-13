from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import StaleElementReferenceException

from bs4 import BeautifulSoup

import os
import time
import json
import pandas as pd
from typing import List
import random

import sys
from src import config as C
from src import get_from_llm as LLM
from src import utils as U
from src import db_utils as DU
import cloudscraper
import re

PARKINSITE = C.PARKOPEDIA
print(PARKINSITE)


def fetch_and_clean_data(driver,urls):
        data = []
        for url in urls:
            driver.get(url)
            # Wait for dynamic content to load
            time.sleep(5)  # Adjust timing based on the website's load time
            # Use BeautifulSoup to parse and clean the data
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            location_details = soup.find('div', class_='LocationDetails')
            if location_details:
                # Remove all HTML tags and get raw text
                raw_text = location_details.text
                # Optionally, perform further cleaning to remove excessive whitespace
                cleaned_text = '||'.join(raw_text.split())
                data.append(cleaned_text)
        return data

def get_details_links(driver,url):
        driver.get(url)
        # Wait for dynamic content to load
        time.sleep(5)  # Adjust timing based on the website's load time
        # Extract links to details pages
        items = driver.find_elements(By.CSS_SELECTOR, '.LocationListItem__containerLink')
        links = [item.get_attribute('href') for item in items]
        return links


def scrape_parking_data(main_page_url= PARKINSITE):
    # Initialize Selenium WebDriver
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument('log-level=3')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Execute the scraping process
    details_links = get_details_links(driver, main_page_url)
    raw_data = fetch_and_clean_data(driver,details_links)
    
    # Clean up: close the WebDriver
    driver.quit()
    
    return raw_data
import importlib
import src.get_from_llm as LLM
importlib.reload(LLM)
parking_list= pd.DataFrame()


def get_Structure_from_LLM(scraped_data):
    all_parking_listings = []
    for data in scraped_data:
        result = LLM.get_parking_data(data, "Parkopedia")
        # Check if 'parking_listings' key exists in the result
        #all_parking_listings.extend(result)
        if 'parking_listings' in result:
            all_parking_listings.extend(result['parking_listings'])
        else:
            print(f"Warning: 'parking_listings' not found in the result for data: {data}")
        return(all_parking_listings)
    


if __name__ == '__main__':
    scraped_data = scrape_parking_data()
    for item in scraped_data:
        print(item)
    all_parking_listings = get_Structure_from_LLM(scraped_data=scraped_data)
