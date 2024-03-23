from bs4 import BeautifulSoup
import pandas as pd
from src.config import *
from src.utils import *
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time
from tqdm import tqdm

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
        # Compare the current page source with the last known page source
        current_page_source = driver.page_source
        if current_page_source == last_page_source:
            break  # If page source hasn't changed, assume the page has finished loading
        else:
            last_page_source = current_page_source
            time.sleep(check_interval)  # Wait for the next check

    page_source = driver.page_source
    driver.quit()
    return page_source

def extract_image_sources(soup):
    image_tags = soup.select('.c-property-hero-slider__image img')
    image_sources = [img['src'] for img in image_tags if img.get('src')]
    return image_sources

def extract_amenities(soup):
    amenity_items = soup.find_all('div', class_='c-amenity-item')
    amenities = [item.find('div', class_='c-amenity-item__desc_title').text.strip() for item in amenity_items if item.find('div', class_='c-amenity-item__desc_title')]
    amenities_str = ', '.join(amenities)
    return amenities_str


def extract_floor_plan_data(soup):
    floor_plans = []
    # Adjusted to directly target the parent block containing the floor plans
    floorplan_groups = soup.select('.block-killam-property-page-floorplans .c-floorplan-group')
    
    for group in floorplan_groups:
        plan_type = group.find('a', class_='c-floorplan-group__title').text.strip()

        if "studio" in plan_type.lower():
            bedroom_count = "0"
        elif "one bedroom" in plan_type.lower():
            bedroom_count = "1"
        elif "two bedroom" in plan_type.lower():
            bedroom_count = "2"
        elif "three bedroom" in plan_type.lower():
            bedroom_count = "3"
        else:
            bedroom_count = "-1"  # Default or unknown bedroom count
        
        floorplans = group.select('.c-floorplan')
        for plan in floorplans:
            title_link = plan.select_one('.c-floorplan__description-title a')
            title = title_link.text.strip() if title_link else "Unknown Floor Plan"
            link = title_link['href'] if title_link else "No Link"
            floor_plans.append({
                "floor_plan_type": plan_type,
                "bedroom_count": bedroom_count,
                "title": title,
                "link": link
            })

    return pd.DataFrame(floor_plans)

def extract_apartment_data(soup, link):
    base_apartment_data = {
        "source": link,
        "sitename": 'killam.com',
        "image_source": '-1', 
    }

    # Initialize all features to -1
    for feature in apartment_features:
        base_apartment_data[feature] = '-1'

    base_apartment_data["building_name"] = soup.find("h1", class_="c-property-heading__title").text.strip() if soup.find("h1", class_="c-property-heading__title") else base_apartment_data["building_name"]
    base_apartment_data["address"] = ' '.join(soup.find("p", class_="c-property-heading__address").text.strip().replace('\n', ' ').split()) if soup.find("p", class_="c-property-heading__address") else base_apartment_data["address"]
    base_apartment_data["listing_name"] = soup.find("h1", class_="c-property-heading__title").text.strip() if soup.find("h1", class_="c-property-heading__title") else base_apartment_data["building_name"]

    base_apartment_data["property_image"] = ", ".join(extract_image_sources(soup))
    base_apartment_data["amenities"] = extract_amenities(soup)
    apartment_data_list = []
    unit_rows = soup.find_all('div', class_='c-unit-row')
    if(len(unit_rows)!=0):
        for row in unit_rows:
            apartment_data = base_apartment_data.copy() 
            apartment_data["monthly_rent"] = row.find('div', text='Price From (mthly)').find_next_sibling('div').text.strip() if row.find('div', text='Price From (mthly)') else base_apartment_data["monthly_rent"]
            apartment_data["bedroom_count"] = row.find('div', text='Bedrooms').find_next_sibling('div').text.strip() if row.find('div', text='Bedrooms') else base_apartment_data["bedroom_count"]
            apartment_data["bathroom_count"] = row.find('div', text='Bath').find_next_sibling('div').text.strip() if row.find('div', text='Bath') else base_apartment_data["bathroom_count"]
            apartment_data["apartment_size"] = row.find('div', text='Size (aprox.)').find_next_sibling('div').text.strip() if row.find('div', text='Size (aprox.)') else base_apartment_data["apartment_size"]
            # apartment_data["availability"] = row.find('div', text='Availability').find_next_sibling('div').text.strip() if row.find('div', text='Availability') else base_apartment_data["availability"]
            apartment_data_list.append(apartment_data)
    else:        
        floor_plan_df = extract_floor_plan_data(soup)
        if len(floor_plan_df) == 0:
            return pd.DataFrame(apartment_data_list)

        for _, row in floor_plan_df.iterrows():
            apartment_data = base_apartment_data.copy()
            apartment_data["floor_details_link"] = row["link"]
            apartment_data["bedroom_count"] = row["bedroom_count"]
            apartment_data_list.append(apartment_data)

    df = pd.DataFrame(apartment_data_list)   
    return df

def get_apartments_links(content):
    soup = BeautifulSoup(content, "lxml")
    container = soup.find(id='killam-search-result-cards')
    if not container:
        return [] 
    cards = container.find_all(class_='killam-search-result-card')    
    article_links = []
    for card in cards:
        heading = card.find('div', class_='killam-search-result-info-title').text.strip()
        if heading:
            formatted_heading = heading.replace(' ', '-').lower()
            article_links.append(f"https://killamreit.com/apartments/halifax-ns/{formatted_heading}")
    
    return article_links

def scrape_each_apartment_details(link):
    try:
        content = get_html_content(link)
        article = BeautifulSoup(content, "lxml")
        data = extract_apartment_data(article, link)
        return data

    except Exception as ex:
        print(f"Error: {str(ex)}")
        return None


def main():
    all_apartments_df = pd.DataFrame()
    content = get_content_selenium_dynamic(KILLAM_LINK)
    articles = get_apartments_links(content)
    for article in tqdm(articles):
        try:
            # print(f"Scraping article: {article}")
            article_content = get_html_content(article)
            article_soup = BeautifulSoup(article_content, "lxml")
            apartment_df = extract_apartment_data(article_soup, article)
            
            all_apartments_df = pd.concat([all_apartments_df, apartment_df], ignore_index=True)
        except Exception as ex:
            print(f"Error scraping {article}: {str(ex)}")
    # all_apartments_df.to_csv("scraped_data.csv", index=False)
    return all_apartments_df

if __name__ == "__main__":
    main()