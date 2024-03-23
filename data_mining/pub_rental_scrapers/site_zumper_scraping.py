from bs4 import BeautifulSoup
import pandas as pd
from src.config import *
from src.utils import *
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium import webdriver
import time
from tqdm import tqdm


def extract_amenities(html_content):
    try:
        soup = BeautifulSoup(html_content, "html.parser")
        amenities_section = soup.find("section", id="amenities")

        amenities_list = []
        if amenities_section:
            table_cells = amenities_section.find_all("td", class_="css-rtks1j")
            for cell in table_cells:
                amenity = cell.text.strip()
                if amenity:
                    amenities_list.append(amenity)
            if amenities_list:
                return ", ".join(amenities_list)
        return "-1"
    except Exception as e:
        print(f"Error extracting amenities: {e}")
        return "-1"

def extract_apartment_data(link, driver):
    # print(f"Scraping article: {link}")
    driver.get(link)
    # WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#floor-plans > table")))
    content = driver.page_source
    soup = BeautifulSoup(content, "html.parser")
    apartment_data = {key: '-1' for key in apartment_features}
    apartment_data["source"] = link
    apartment_data["sitename"] = 'zumper.com'
    
    apartment_data["building_name"] = soup.find("h1", class_="chakra-heading css-za1032-display32To40").text.strip()
    apartment_data["listing_name"] = soup.find("h1", class_="chakra-heading css-za1032-display32To40").text.strip()
    apartment_data["address"] = soup.find("address", class_="chakra-text").text.strip()
    apartment_data["amenities"] = extract_amenities(content)
    picture = soup.select_one('div.css-138u0vj picture')
    if picture:
        img_src = picture.find('img')['src']
        apartment_data["property_image"] = img_src
    # table_rows = soup.select('#floor-plans > table > tbody[class*="css-13o7eu2"] > tr')
    # for row in table_rows:
    #     cells = row.find_all('td')
    #     if len(cells) >= 5:
    #         apartment_data["bedroom_count"] = cells[2].text.strip()
    #         apartment_data["bathroom_count"] = cells[3].text.strip()
    #         apartment_data["apartment_size"] = cells[4].text.strip()
    #         apartment_data["monthly_rent"] = cells[5].text.strip()
    div_container = soup.find("div", class_="css-19gdg9l")

    if div_container:
        table_body = div_container.find("tbody", class_="css-u8oc8g")
        if table_body:
            rows = table_body.find_all("tr")
            for row in rows:
                th_text = row.find("th").text.strip()
                td_text = row.find("td").text.strip()

                if "Monthly rent" in th_text:
                    apartment_data["monthly_rent"] = td_text
                elif "Beds" in th_text:
                    apartment_data["bedroom_count"] = td_text
                elif "Baths" in th_text:
                    apartment_data["bathroom_count"] = td_text
                elif "Sqft" in th_text:
                    apartment_data["apartment_size"] = td_text

    return pd.DataFrame([apartment_data])
def get_apartments_links(link, driver):
    driver.get(link)
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(6)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
    links = []
    base_url = "https://www.zumper.com"
    container_elements = driver.find_elements(By.CSS_SELECTOR, ".css-8a605h .css-0 a")

    for element in container_elements:
        link = element.get_attribute('href')
        full_link = link if link.startswith('http') else base_url + link
        links.append(full_link)

    return links

def main():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    # Initialize ChromeDriver with webdriver-manager
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    all_apartments_df = pd.DataFrame()
    try:
        ZUMPER_LINK_TODAY = f"{ZUMPER_LINK}?available-before={get_today_date_formatted()}&min-active-units=1"
        articles = get_apartments_links(ZUMPER_LINK_TODAY, driver)
        for article in tqdm(articles):
            try:
                apartment_df = extract_apartment_data(article, driver)
                all_apartments_df = pd.concat([all_apartments_df, apartment_df], ignore_index=True)
            except Exception as ex:
                print(f"Error scraping {article}: {str(ex)}")
    finally:
        driver.quit()  # Ensures the driver is quit even if an error occurs
    
    return all_apartments_df

if __name__ == "__main__":
    df = main()
