from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import pandas as pd
from typing import List 
from bs4 import BeautifulSoup
from src import db_utils as DU
from src import config as C

WEBSITE_URL = C.HRM_BUILDING_LISTING
PROPERTY_MANAGEMENT_FIRM="Halifax Regional Municiaplity development blog"

def get_listing_urls(driver) -> List[str]:
    """
    Fetches listing URLs from the main page.
    
    :param driver: Selenium WebDriver instance.
    :return: List of listing URLs.
    """
    driver.get(WEBSITE_URL)
    driver.implicitly_wait(10)  # Adjust based on page load time
    
    try:
        # Wait up to 10 seconds before proceeding, ensuring the div is present
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".entry-content.wp-block-post-content.has-global-padding.is-layout-constrained.wp-block-post-content-is-layout-constrained"))
        )
    except TimeoutException:
        print("Timed out waiting for page to load")
        driver.quit()

    # Now select all <a> tags within <li> elements inside the specified div
    links = driver.find_elements(By.CSS_SELECTOR, ".entry-content.wp-block-post-content.has-global-padding.is-layout-constrained.wp-block-post-content-is-layout-constrained ul li a")

    # Extract the href attribute from each link
    urls = [link.get_attribute('href') for link in links]
        
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
    div_content = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".wp-block-query.alignwide.is-layout-flow.wp-block-query-is-layout-flow"))
    )
    
    # Get the HTML content of the div
    inner_html = div_content.get_attribute('innerHTML')
    
    return inner_html


def get_clean_data(extracted_relevant_html):

    soup = BeautifulSoup(extracted_relevant_html, 'html.parser')


    ul_tag = soup.find('ul', class_='is-flex-container')

  
    cleaned_data = []

    for li in ul_tag.find_all('li', class_='wp-block-post'):
        item_data = {}
        h2_tag = li.find('h2', class_='wp-block-post-title')
        if h2_tag:
            item_data['building_name'] = h2_tag.get_text(strip=True)
            a_tag = h2_tag.find('a')
            item_data['listing_link'] = a_tag['href']
        
        # Extract the image URL (inside <img> tag within <figure>)
        img_tag = li.find('img')
        if img_tag:
            item_data['img_url'] = img_tag['src']
        
        # Extract the description (inside <div> with class 'wp-block-post-excerpt')
        description_div = li.find('div', class_='wp-block-post-excerpt')
        if description_div:
            item_data['description'] = description_div.get_text(strip=True)
        

        cleaned_data.append(item_data)
    return cleaned_data

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
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        urls = get_listing_urls(driver)

        # Filter URLs against the database
        # urls = DU.filter_existing_urls(urls)
        
        listings_data = []
        # print('url',urls)
        for index, url in enumerate(urls):
            if not DU.url_exists_in_db(url):
                try:
                    extracted_relevant_html = extract_listing_relevant_html(url, driver)
                    
                    cleaned_content = get_clean_data(extracted_relevant_html)

                    listing_details = get_scraped_content_hrm_llm(cleaned_content,PROPERTY_MANAGEMENT_FIRM)
                    for listing in listing_details["rental_listings"]:
                        listing["source_name"] = PROPERTY_MANAGEMENT_FIRM
                        listings_data.append(listing)

                    # time.sleep(5) can be uncommented if needed
                    
                except Exception as e:
                    print(f"Error extracting details from {url}: {e}")
                
                # Remove or modify the break statement as needed for full execution
                # break
            
        df = pd.DataFrame(listings_data)
        
    except Exception as ex:
        print(f"Exception occurred while scraping: {ex}")
        df = pd.DataFrame()  # Ensure df is defined in case of an exception
    finally:
        driver.quit()
    
    return df
