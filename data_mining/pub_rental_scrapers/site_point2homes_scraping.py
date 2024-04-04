import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from src.config import CHROME_DRIVER_PATH


def get_listing_urls(driver):
    driver.get("https://app.happipad.com/listings")
    listings = WebDriverWait(driver, 5).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".uk-grid-match a")))
    urls = [listing.get_attribute('href') for listing in listings]
    return urls

def scrape_data(driver):
    urls = get_listing_urls(driver)
    filtered_urls = [u for u in urls if u and '/property' in u]
    unique_urls = list(dict.fromkeys(filtered_urls))
    listings_data = []
    for url in unique_urls:
        listing_details = get_listing_details(driver, url)
        listings_data.append(listing_details)
    
    df = pd.DataFrame(listings_data)
    df.to_csv("scraped_data.csv", index=False)
    return df

def save_html_and_parse(driver, url):
    try:
        driver.get(url)
        WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, "body")))
        html_content = driver.page_source
        soup = BeautifulSoup(html_content, 'html.parser')
        return soup
    except Exception as e:
        print(f"Error loading page or parsing HTML for URL {url}: {e}")
        return None

def extract_amenities_and_bathroom_count(soup):
    try:
        amenities_tags = soup.select('ul.uk-grid > li')
        amenities = [tag.text.strip().replace(':\n\n', ': ') for tag in amenities_tags if tag.text.strip()]

        bathroom_count = '-1'
        for amenity in amenities:
            if 'Bathroom' in amenity:
                bathroom_count = amenity.split(':')[-1].strip()
                break
        return amenities, bathroom_count
    except Exception as e:
        print(f"Error extracting amenities and bathroom count: {e}")
        return [], '-1'

def get_listing_details(driver, url):
    try:
        print(url)
        soup = save_html_and_parse(driver, url)
        if soup is None:
            return {}

        listing_name = soup.select_one('h1.uk-margin-remove').text.strip() if soup.select_one('h1.uk-margin-remove') else '-1'
        building_name = soup.select_one('h1.uk-margin-remove').text.strip() if soup.select_one('h1.uk-margin-remove') else '-1'
        address = soup.select_one('h6.uk-margin-remove').text.strip() if soup.select_one('h6.uk-margin-remove') else '-1'
        total_price_elem = soup.select_one("div.roomPrices .column p:contains('Total cost') + p")
        total_price = total_price_elem.text.strip().split()[0] if total_price_elem else '-1'
        amenities, bathroom_count = extract_amenities_and_bathroom_count(soup)

        images = soup.select(".uk-grid-collapse img")
        property_images = [img["src"] for img in images if "src" in img.attrs]

        return {
            "listing_name": listing_name,
            "building_name": building_name,
            "apartment_number": "-1",
            "address": address,
            "add_lat": "-1",
            "add_long": "-1",
            "property_management_name": "-1",
            "monthly_rent": total_price,
            "amenities": amenities,
            "apartment_size": "-1",
            "bedroom_count": "-1",
            "bathroom_count": bathroom_count,
            "property_type": "-1",
            "image_source": property_images,
            "source": url,
            "sitename": "happipad.com"
        }
    except Exception as e:
        print(f"Error extracting listing details for {url}: {e}")
        return {}

def main():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(service=Service(CHROME_DRIVER_PATH), options=options)
    try:
        apartment_df = scrape_data(driver)
        return apartment_df
    finally:
        driver.quit()

if __name__ == "__main__":
    main()
