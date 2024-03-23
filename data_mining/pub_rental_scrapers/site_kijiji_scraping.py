from bs4 import BeautifulSoup
import pandas as pd
from src.config import *
from src.utils import *
from tqdm import tqdm
import re


def extract_apartment_size(soup):
    for li_tag in soup.find_all("li", class_="twoLinesAttribute-633292638"):
        if li_tag.find("dt", class_="twoLinesLabel-2332083105", text="Size (sqft)"):
            size_dd_tag = li_tag.find("dd", class_="twoLinesValue-2653438411")
            if size_dd_tag:
                # Combine the digits and add "sqft" at the end
                size_text = size_dd_tag.get_text(strip=True).replace("\n", "")
                apartment_size = f"{size_text} sqft"
                return apartment_size
    
    return "-1"

def extract_amenities(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    amenities_container = soup.select_one("#vip-body > div.itemAttributeCarousel-3991134065 > div.gradientScrollWrapper-2207830989 > div > div > div:nth-child(3) > ul")
    
    if amenities_container:
        amenities = [li.text.strip() for li in amenities_container.select("li.groupItem-1182798569.available-1766233427")]
        
        if amenities:
            return ", ".join(amenities)
        else:
            return "-1"
    else:
        # If the amenities container wasn't found
        return "-1"
def extract_apartment_data(article, html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    apartment_features = [
        "source", "sitename", "property_image", "property_management_name",
        "listing_name", "apartment_number", "building_name", "address",
        "monthly_rent", "amenities", "bedroom_count", "bathroom_count", 
        "property_type", "apartment_size", "latitude", "longitude", 
        "city", "state", "lease_period"
    ]

    listing_details = {feature: '-1' for feature in apartment_features}

    listing_details["source"] = article
    listing_details["sitename"] = 'Kijiji.ca'

    property_management_name_tag = soup.select_one("#vip-body > div.itemInfoSidebar-1618727533.itemInfoSidebar__newRentals-3969318677 > div:nth-child(4) > div > div.header-1351916284.headerWithAvatar-2912394077 > div > a")
    listing_details["property_management_name"] = property_management_name_tag.text.strip() if property_management_name_tag else "-1"
    
    bedroom_count_tag = soup.select_one("#vip-body > div.realEstateTitle-389420867 > div.unitRow-2439405931 > div > li:nth-child(2) > span")
    if bedroom_count_tag:
        # Splitting the text and getting the last element, assuming it's the number
        listing_details["bedroom_count"] = bedroom_count_tag.text.strip().split(":")[-1].strip()
    else:
        listing_details["bedroom_count"] = "-1"
    
    bathroom_count_tag = soup.select_one("#vip-body > div.realEstateTitle-389420867 > div.unitRow-2439405931 > div > li:nth-child(3) > span")
    if bathroom_count_tag:
        # Splitting the text and getting the last element, assuming it's the number
        listing_details["bathroom_count"] = bathroom_count_tag.text.strip().split(":")[-1].strip()
    else:
        listing_details["bathroom_count"] = "-1"
    # listing_details["bathroom_count"] = bathroom_count_tag.text.strip() if bathroom_count_tag else "-1"
    
    listing_details["amenities"] = extract_amenities(html_content)

    lease_period_tag = soup.select_one("#vip-body > div.itemAttributeCarousel-3991134065 > div.gradientScrollWrapper-2207830989 > div > div > div:nth-child(1) > ul > li:nth-child(4) > dl > dd")
    listing_details["lease_period"] = lease_period_tag.text.strip() if lease_period_tag else "-1"

    listing_details["listing_name"] = title_tag.text.strip() if (title_tag := soup.find("h1", class_="title-4206718449")) else "-1"
    listing_details["address"] = address_tag.text.strip() if (address_tag := soup.find("span", itemprop="address")) else "-1"
    listing_details["monthly_rent"] = price_tag.find("span").text.strip().split('.')[0] if (price_tag := soup.find("div", class_="priceWrapper-3915768379")) and price_tag.find("span") else "-1"

    listing_details["apartment_size"] = extract_apartment_size(soup)

    thumbnail_container = soup.find("div", class_="thumbnailContainer-178432056")
    if thumbnail_container:
        image_tag = thumbnail_container.find("img")
        if image_tag and image_tag.has_attr('src'):
            listing_details["property_image"] = image_tag['src']

    listings_df = pd.DataFrame([listing_details])
    return listings_df

def get_apartments_links(initial_content, initial_url):
    article_links = []
    next_page_url = initial_url  # Start with the initial URL
    while next_page_url:
        soup = BeautifulSoup(initial_content, "lxml")
        h3_tags = soup.find_all("h3", {"data-testid": "listing-title"})
        for h3 in h3_tags:
            a_tag = h3.find("a", {"data-testid": "listing-link"})
            if a_tag and a_tag.has_attr("href"):
                href = a_tag["href"]
                # Check if the URL is complete; if not, prepend the base part
                complete_url = href if href.startswith("http") else "https://www.kijiji.ca" + href
                article_links.append(complete_url)

        # Check for pagination and update next_page_url accordingly
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
    content = get_html_content(KIJIJI_LINK)
    articles = get_apartments_links(content, KIJIJI_LINK)
    for article in tqdm(articles, desc="Processing articles"):
        try:
            article_content = get_html_content(article)
            apartment_df = extract_apartment_data(article, article_content)
            all_apartments_df = pd.concat([all_apartments_df, apartment_df], ignore_index=True)
        except Exception as ex:
            print(f"Error scraping {article}: {str(ex)}")
    return all_apartments_df

if __name__ == "__main__":
    main()