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

PARKINGSITE= C.IMPARK

PARKINGSITE2= C.IMPARK_PART2

def dynamic_sleep():
    # Dynamic sleep interval to be considerate to the server and avoid detection
    time.sleep(random.uniform(1, 6))

def scrape()-> pd.DataFrame:


    scraper = cloudscraper.create_scraper()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    }
    scraper.headers.update(headers)

    response = scraper.get(PARKINGSITE)
    dynamic_sleep

    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all the relevant 'div' elements
        divs = soup.find_all('div', class_='e-con-inner')  # Assuming 'e-con-inner' is a class of the container
        
        # Create a list to hold the extracted data
        data = []
        
        # Iterate through the 'div' elements and extract data
        for div in divs:
            title = div.find('h5', class_='gdlr-core-title-item-title').get_text(strip=True) if div.find('h5', class_='gdlr-core-title-item-title') else None
            lot = div.find('span', class_='gdlr-core-title-item-caption').get_text(strip=True) if div.find('span', class_='gdlr-core-title-item-caption') else None
            price = div.find('h5', class_='gdlr-core-title-item-title').find_next_sibling('span').get_text(strip=True) if div.find('h5', class_='gdlr-core-title-item-title') else None
            type_ = div.find('span', class_='gdlr-core-title-item-caption').find_next_sibling('span').get_text(strip=True) if div.find('span', class_='gdlr-core-title-item-caption') else None
            description = div.find('p').get_text(strip=True) if div.find('p') else None
            
            # Append the extracted information to the data list
            data.append({
                'Title': title,
                'Lot': lot,
                'Price': price,
                'Type': type_,
                'Description': description
            })
        
        # Create a DataFrame from the data list
        df_parking = pd.DataFrame(data)
        
        # Display the DataFrame
        
        #df_parking.to_csv('../data/ImparkMonthlyRent.csv', index=False)
        return df_parking
    else:
        print(f"Failed to retrieve the webpage, status code: {response.status_code}")
        return

import re
def extract_lot_number(lot_span):
    if lot_span:
        lot_text = lot_span.get_text()
        lot_match = re.search(r'Lot #(\d+)', lot_text)
        if lot_match:
            return lot_match.group(1)
    return None

def scrape2() -> pd.DataFrame:
    scraper = cloudscraper.create_scraper()
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    }
    scraper.headers.update(headers)

    response = scraper.get(PARKINGSITE)
    dynamic_sleep()

    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all the relevant 'div' elements
        e_con_inner_divs = soup.find_all('div', class_='e-con-inner')
    
        # List to store each parking spot's information
        parking_data = []
        seen_titles = set()
        
        for div in e_con_inner_divs:
            title_div = div.find('h5', class_='gdlr-core-title-item-title')
            if title_div:
                title = title_div.get_text(strip=True)
                if title and title not in seen_titles:
                    seen_titles.add(title)
                    
                    refine_div = div.find_all('div',class_='gdlr-core-pbf-element')
                   
                    lot = refine_div[0].find('span', class_='gdlr-core-title-item-caption')

                    price = (refine_div[1].select_one('.gdlr-core-pbf-element:nth-of-type(2) .gdlr-core-title-item-title').get_text(strip=True)
                            if refine_div[1].select_one('.gdlr-core-pbf-element:nth-of-type(2) .gdlr-core-title-item-title') else None)
                    type_ = (refine_div[1].select_one('.gdlr-core-pbf-element:nth-of-type(2) .gdlr-core-title-item-caption').get_text(strip=True)
                             if refine_div[1].select_one('.gdlr-core-pbf-element:nth-of-type(2) .gdlr-core-title-item-caption') else None)
                    
                    if price is None:
                        
                        lot = refine_div[2].find('span', class_='gdlr-core-title-item-caption')
                        price = refine_div[3].select_one('.gdlr-core-pbf-element:nth-of-type(2) .gdlr-core-title-item-title').get_text(strip=True)
                        type_ = refine_div[3].select_one('.gdlr-core-pbf-element:nth-of-type(2) .gdlr-core-title-item-caption').get_text(strip=True)
                    
                    
                    description = (div.find('p').get_text(strip=True)
                                   if div.find('p') else None)
                    if lot is None:
                        continue
                    lot = extract_lot_number(lot)
                    
                    match = re.search(r'\$(\d+(\.\d+)?)', price)
                    if match:
                        price= match.group(1)
                    print(price)
                    parking_data.append({
                        'Address': title,
                        'Lot': lot,
                        'Price': price
                        
                    })
        
        df_parking = pd.DataFrame(parking_data)
        #df_parking.to_csv('comp_scrapers/data/ImparkMonthlyRent.csv', index=False)
        
        return df_parking
    else:
        print(f"Failed to retrieve the webpage, status code: {response.status_code}")
        return pd.DataFrame()  # Return an empty DataFrame for consistency


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

def scrape3()-> pd.DataFrame:
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
        
        lot_number_pattern = r'#(\d+)'
        match = re.search(lot_number_pattern, lot_name)
        if(match):
            lot_number = match.group(1)
        else:
            continue
        hourly_rate = rate
        
        monthly_rate = parse_rate(rate_info) if rate_info else None
        
        parking_spot = {
            'Address': address,
            'Lot': lot_number,
            'Price': monthly_rate
        }
        data.append(parking_spot)

    # Closing the driver if running in headless mode
    driver.quit()
    
    return pd.DataFrame(data)

def append_halifax_if_missing(location):
    if 'Halifax' not in location:
        location += ', Halifax, Nova Scotia'
    return location


if __name__ == "__main__":
    #scrape()
    # df_one = scrape2()
    # df_two = scrape3()
    
    # # Combine the DataFrames
    # combined_df = pd.concat([df_one, df_two], ignore_index=True)
    
    # # Save the combined DataFrame to CSV, if needed
    # combined_df.to_csv('comp_scrapers/data/ImparkMonthlyRent.csv', index=False)
    parking_df = pd.read_csv('comp_scrapers/data/ImparkMonthlyRent.csv')
    parking_df.rename(columns={
        'Address':'address',
        'Lot': 'lot',
        'Price' : 'price'
    }, inplace=True)
    # parking_df
    parking_df['address'] = parking_df['address'].apply(append_halifax_if_missing)
    print(parking_df)
    save_df_to_parking_data(parking_df)
    df_parking_data = read_data_from_parking_data()
    df_parking_data['price'] = df_parking_data['price'].str.replace('\$', '', regex=True)
    pattern = re.compile(r'Halifax', re.IGNORECASE)
    

    address_processor =address_utils.AddressPreprocessor()
    necessary_columns = ['add_lat', 'add_long']
    for col in necessary_columns:
        if col not in df_parking_data.columns:
            df_parking_data[col] = -1.0
    df_parking_data[['add_lat', 'add_long']] = df_parking_data.apply(lambda row: address_processor.update_lat_lng(row), axis=1, result_type='expand')
    df_parking_data.drop(columns={'id'},inplace=True)
    save_df_to_sec_parking_data(df_parking_data)

