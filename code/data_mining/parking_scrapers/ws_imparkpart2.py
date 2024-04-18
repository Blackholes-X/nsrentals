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
import random

import sys
sys.path.append('C://Users//hp//MCDA//02_Sem//Hackathon//nsRentals//nsrentals//comp_scrapers') 
from src import config as C
from src import get_from_llm as LLM
from src import utils as U
from src import db_utils as DU
import cloudscraper
import re
from src.db_utils import *
from data_processing import address_utils

PARKINGSITE2= C.IMPARK_PART2
print('SITE:',PARKINGSITE2)

def dynamic_sleep():
    # Dynamic sleep interval to be considerate to the server and avoid detection
    time.sleep(random.uniform(1, 6))

def parse_rate(rate_text):
    # Check for hourly rate
    hourly_rate_match = re.search(r'\$(\d+\.\d+) per hour', rate_text)
    if hourly_rate_match:
        hourly_rate = float(hourly_rate_match.group(1))
        return hourly_rate * 7 * 24  # Convert hourly rate to monthly rate assuming 30 days in a month

    # Check for per 30 minutes rate
    per_thirty_minutes_match = re.search(r'\$(\d+\.\d+) per 30 mins', rate_text)
    if per_thirty_minutes_match:
        half_hour_rate = float(per_thirty_minutes_match.group(1))
        return half_hour_rate * 2 * 7 * 24  # Convert 30 minutes rate to monthly

    # Check for daily rate
    daily_rate_match = re.search(r'\$(\d+\.\d+) per day', rate_text)
    if daily_rate_match:
        daily_rate = float(daily_rate_match.group(1))
        return daily_rate * 24  # Convert daily rate to monthly assuming 30 days in a month

    # Default case if none match
    return None

def scrape2()-> pd.DataFrame:
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Ensures the browser window doesn't pop up
    #driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # Set up driver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)        
    driver.get(PARKINGSITE2)

    # Allow time for the page to load dynamically, can be adjusted as needed
    time.sleep(5)

    # Now that the page is loaded, let's fetch the content
    data = []
    result_rows = driver.find_elements(By.CLASS_NAME, 'result_row')

    for row in result_rows:
        address = row.find_element(By.CSS_SELECTOR, ".address-text").text if row.find_elements(By.CSS_SELECTOR, ".address-text") else None
        lot_name = row.find_element(By.CSS_SELECTOR, ".lot-name").text if row.find_elements(By.CSS_SELECTOR, ".lot-name") else None
        rate_info = row.find_element(By.CSS_SELECTOR, ".lot-rate").text if row.find_elements(By.CSS_SELECTOR, ".transient-rate") else None
        rate = row.find_element(By.CSS_SELECTOR,".lot-rate").text#find_element(By.CSS_SELECTOR, ".transient-rate").text
        if(address is None or lot_name is None):
            continue
        print('rate',rate)
        print(lot_name)
        lot_number_pattern = r'#(\d+)'
        match = re.search(lot_number_pattern, lot_name)
        if(match):
            lot_number = match.group(1)
        else:
            continue
        hourly_rate = rate
        
        monthly_rate = parse_rate(rate_info) if rate_info else None
        print(lot_number)
        parking_spot = {
            'Address': address,
            'Lot Name': lot_number,
            'Monthly Rate': monthly_rate
        }
        data.append(parking_spot)

    # Closing the driver if running in headless mode
    driver.quit()
    
    return pd.DataFrame(data)



if __name__ == "__main__":
    #scrape()
    print(scrape2())

    