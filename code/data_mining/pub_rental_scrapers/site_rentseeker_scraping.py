from bs4 import BeautifulSoup
import pandas as pd
from src.config import *
from src.utils import *
from tqdm import tqdm
import re

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

def extract_monetary_value(text):
    # This function uses a regular expression to find a pattern that matches the monetary value
    match = re.search(r"\$\d+(,\d+)*", text)
    return match.group(0) if match else "-1"

def extract_numeric_value(text):
    # This function extracts the first number found in a string
    match = re.search(r"\d+", text)
    return match.group(0) if match else "-1"
    
def get_content_selenium_dynamic(link, wait_time=2, check_interval=2):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    # Use ChromeDriverManager to automatically manage the driver version
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(link)

    last_page_source = driver.page_source
    time.sleep(check_interval)  # Initial wait for the first check

    for _ in range(int(wait_time / check_interval)):
        current_page_source = driver.page_source
        if current_page_source == last_page_source:
            break
        else:
            last_page_source = current_page_source
            time.sleep(check_interval)

    page_source = driver.page_source
    driver.quit()
    return page_source

def get_apartment_links(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    listing_cards_container = soup.find(id='listing-cards')
    apartment_links = []

    if listing_cards_container:
        listing_divs = listing_cards_container.find_all('div', class_='col col-12 col-lg-4')

        for listing_div in listing_divs:
            a_tag = listing_div.find('a', href=True)
            if a_tag and 'http' in a_tag['href']:  # Ensuring it's a full URL
                apartment_links.append(a_tag['href'])

    return apartment_links


def extract_amenities(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    amenities_list = []
    amenities_section = soup.select_one('#description > div > div:nth-child(2)')
    if amenities_section:
        li_tags = amenities_section.find_all('li')
        for li in li_tags:
            amenities_list.append(li.text.strip())

    amenities_str = ', '.join(amenities_list) if amenities_list else '-1'
    return amenities_str


def extract_apartment_details(html_content, link):
    soup = BeautifulSoup(html_content, 'html.parser')
    apartment_data = {}

    for feature in apartment_features:
        apartment_data[feature] = '-1'

    # Extracting building name
    apartment_data['source'] = link
    apartment_data['sitename'] = 'rentseeker.ca'
    building_name_tag = soup.select_one('#banner > div > div > div > div.col.col-lg-8 > div > h2')
    apartment_data['building_name'] = building_name_tag.text.strip() if building_name_tag else '-1'
    apartment_data['listing_name'] = building_name_tag.text.strip() if building_name_tag else '-1'
    
    building_address_tag = soup.select_one('#overview > div > div:nth-child(2) > div > h1')
    apartment_data['address'] = building_address_tag.text.strip() if building_address_tag else '-1'

    # Extracting image source
    banner_tag = soup.select_one('#banner')
    if banner_tag and 'style' in banner_tag.attrs:
        style_content = banner_tag['style']
        image_url_start = style_content.find('url("') + len('url("')
        image_url_end = style_content.find('");', image_url_start)
        apartment_data['image_source'] = style_content[image_url_start:image_url_end] if image_url_start != -1 else '-1'
    
    # Extract amenities
    apartment_data['amenities'] = extract_amenities(html_content)

    floorplans_container = soup.select_one('#floorplans > div')
    if floorplans_container:
        apartment_details = []  # List to hold each apartment detail as a dict
        accordion_buttons = floorplans_container.select('.accordion-button')
        for button in accordion_buttons:
            # detail = {key: apartment_data[key] for key in apartment_features}  # Copy common data
            detail = apartment_data.copy()
            cols = button.select('.container .row .col-md-3, .col-md-3.price, .col-md-2')
            detail['monthly_rent'] = extract_monetary_value(cols[1].text.strip()) if len(cols) > 1 else '-1'
            detail['bedroom_count'] = extract_numeric_value(cols[0].text.strip()) if cols else '-1'
            detail['bathroom_count'] = extract_numeric_value(cols[2].text.strip()) if cols else '-1'
            detail['apartment_size'] = cols[3].text.strip() if len(cols) > 3 else '-1'

            apartment_details.append(detail)
        
        if apartment_details:
            df = pd.DataFrame(apartment_details)
        else:
            df = pd.DataFrame([apartment_data])
    else:
        df = pd.DataFrame([apartment_data])

    return df
def get_apartments_links(initial_content, initial_url):
    article_links = []
    next_page_url = initial_url
    while next_page_url:
        soup = BeautifulSoup(initial_content, "lxml")
        h3_tags = soup.find_all("h3", {"data-testid": "listing-title"})
        for h3 in h3_tags:
            a_tag = h3.find("a", {"data-testid": "listing-link"})
            if a_tag and a_tag.has_attr("href"):
                href = a_tag["href"]
                complete_url = href if href.startswith("http") else "https://www.kijiji.ca" + href
                article_links.append(complete_url)

        pagination_container = soup.find("nav", {"aria-label": "Search Pagination"})
        current_page_li = pagination_container.find("li", {"data-testid": "pagination-list-item-selected"})
        next_page_li = current_page_li.find_next_sibling("li")
        next_page_link = next_page_li.find("a", {"data-testid": "pagination-link-item"}) if next_page_li else None
        next_page_url = next_page_link['href'] if next_page_link and 'href' in next_page_link.attrs else None
        
        if next_page_url:
            initial_content = get_html_content(next_page_url)
        else:
            break 

    return article_links

def main():
    all_apartments_df = pd.DataFrame()
    content = get_content_selenium_dynamic(RENTSEEKER_LINK)
    # with open("output.html", "w") as file:
    #     file.write(content)
    articles = get_apartment_links(content)
    for article in tqdm(articles, desc="Processing articles"):
        try:
            article_content = get_content_selenium_dynamic(article)
            apartment_df = extract_apartment_details(article_content, article)
            all_apartments_df = pd.concat([all_apartments_df, apartment_df], ignore_index=True)
        except Exception as ex:
            print(f"Error scraping {article}: {str(ex)}")

    return all_apartments_df

if __name__ == "__main__":
    main()