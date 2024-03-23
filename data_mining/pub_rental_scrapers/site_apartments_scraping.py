from bs4 import BeautifulSoup
import pandas as pd
from src.config import *
from src.utils import *
import re
from tqdm import tqdm


def extract_apartment_data(soup, link):
    apartment_data = {
        "source": link,
        "sitename": 'apartments.com',
        "image_source": '-1', 
    }

    # Initialize all features to -1
    for feature in apartment_features:
        apartment_data[feature] = '-1'

    apartment_data["listing_name"] = soup.find("h1", class_="propertyName").text.strip() if soup.find("h1", class_="propertyName") else '-1'
    apartment_data["apartment_number"] = soup.find("div", class_="unitColumn column").find("span", title=True).get_text(strip=True) if soup.find("div", class_="unitColumn column") and soup.find("div", class_="unitColumn column").find("span", title=True) else '-1'
    apartment_data["building_name"] = soup.find("h1", class_="propertyName").text.strip() if soup.find("h1", class_="propertyName") else '-1'
    apartment_data["address"] = " ".join(soup.find("div", class_="propertyAddressContainer").h2.stripped_strings) if soup.find("div", class_="propertyAddressContainer") else '-1'
    apartment_data["monthly_rent"] = soup.find("p", class_="rentInfoDetail").text.strip() if soup.find("p", class_="rentInfoDetail") else '-1'
    apartment_data["bedroom_count"] = soup.find('p', class_='rentInfoLabel', text='Bedrooms').find_next('p', class_='rentInfoDetail').text.strip() if soup.find('p', class_='rentInfoLabel', text='Bedrooms') else '-1'
    apartment_data["bathroom_count"] = soup.find('p', class_='rentInfoLabel', text='Bathrooms').find_next('p', class_='rentInfoDetail').text.strip() if soup.find('p', class_='rentInfoLabel', text='Bathrooms') else '-1' 
    apartment_data["apartment_size"] = soup.find('p', class_='rentInfoLabel', text='Square Feet').find_next('p', class_='rentInfoDetail').text.strip() if soup.find('p', class_='rentInfoLabel', text='Square Feet') else '-1'
    apartment_data["property_type"] = "Apartment"
    # apartment_data["property_management_name"] = "Private"
    

    container = soup.find("div", class_="container threeColumns")
    if container:
        logo_img = container.find("img", class_="logo")
        if logo_img and "src" in logo_img.attrs:
            apartment_data["property_management_name"] = logo_img["src"]
        
    amenities_list = []
    unique_features_div = soup.find("div", class_="uniqueFeatures")
    if unique_features_div:
        unique_features = unique_features_div.find_all("li", class_="specInfo uniqueAmenity")
        amenities_list.extend([feature.span.text for feature in unique_features])
    
    # Extract general amenities
    combined_amenities_div = soup.find("ul", class_="combinedAmenitiesList")
    if combined_amenities_div:
        combined_amenities = combined_amenities_div.find_all("li", class_="specInfo")
        amenities_list.extend([amenity.span.text for amenity in combined_amenities])

    # Remove duplicates and save
    apartment_data["amenities"] = ", ".join(sorted(set(amenities_list), key=amenities_list.index))

    images = soup.select(".carouselSection .aspectRatioImage img")
    if images:
        apartment_data["property_image"] = images[0]["src"] if "src" in images[0].attrs else '-1'

    df = pd.DataFrame([apartment_data])
    return df

def get_apartments_links(initial_content):
    article_links = list()
    soup = BeautifulSoup(initial_content, "lxml")

    def extract_links(soup_obj):
        placard_container = soup_obj.find("div", class_="placardContainer")
        if placard_container:
            posts = placard_container.find_all("li", class_="mortar-wrapper")
            for article in posts:
                data_url = article.find("article").get("data-url")
                article_links.append(data_url)

    extract_links(soup)
    pagination = soup.find("nav", class_="paging seoVariant3")
    if pagination:
        pages = pagination.find_all("a", href=True)
        for page in pages:
            if page.text.strip().isdigit():  # Ensuring it's a page number
                page_link = page["href"]
                print(f"Scraping page: {page_link}")
                page_content = get_html_content(
                    page_link
                )  
                page_soup = BeautifulSoup(page_content, "lxml")
                extract_links(page_soup)
    return article_links

def scrape_each_apartment_details(link):
    try:
        print(link)
        content = get_html_content(link)
        article = BeautifulSoup(content, "lxml")
        data = extract_apartment_data(article, link)
        return data

    except Exception as ex:
        print(f"Error: {str(ex)}")
        return None


def main():
    all_apartments_df = pd.DataFrame()
    content = get_html_content(APARTMENTS_LINK)
    articles = get_apartments_links(content)
    for article in tqdm(articles):
        try:
            # print(f"Scraping article: {article}")
            article_content = get_html_content(article)
            # with open("output.html", "w") as file:
            #     file.write(article_content)
            article_soup = BeautifulSoup(article_content, "lxml")
            apartment_df = extract_apartment_data(article_soup, article)
            all_apartments_df = pd.concat([all_apartments_df, apartment_df], ignore_index=True)
        except Exception as ex:
            print(f"Error scraping {article}: {str(ex)}")
    
    return all_apartments_df

if __name__ == "__main__":
    main()