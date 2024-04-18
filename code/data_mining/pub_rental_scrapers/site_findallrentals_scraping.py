from bs4 import BeautifulSoup
import pandas as pd
from src.config import *
from src.utils import *
import re
from tqdm import tqdm


def extract_apartment_data(soup, link):
    apartment_data = {
        "source": link,
        "sitename": 'findallrentals.ca',
        "image_source": None, 
    }

    for feature in apartment_features:
        apartment_data[feature] = '-1'

    apartment_data["building_name"] = (soup.find("div", class_="upper-content").find("h1").find("span").text.strip()
                                       if soup.find("div", class_="upper-content") and soup.find("div", class_="upper-content").find("h1") and soup.find("div", class_="upper-content").find("h1").find("span")
                                       else None)
    apartment_data["listing_name"] = (soup.find("div", class_="upper-content").find("h1").find("span").text.strip()
                                       if soup.find("div", class_="upper-content") and soup.find("div", class_="upper-content").find("h1") and soup.find("div", class_="upper-content").find("h1").find("span")
                                       else None)
    
    apartment_data["address"] = (soup.find("div", class_="upper-content").find("p", class_="location").text.strip()
                             if soup.find("div", class_="upper-content") and soup.find("div", class_="upper-content").find("p", class_="location")
                             else None)
    apartment_data["monthly_rent"] = (soup.find("div", class_="price").find("span", class_="amount").text.strip()
                                  if soup.find("div", class_="price") and soup.find("div", class_="price").find("span", class_="amount")
                                  else None)

    container = soup.find("div", class_="container threeColumns")
    if container:
        logo_img = container.find("img", class_="logo")
        if logo_img and "src" in logo_img.attrs:
            apartment_data["property_management_name"] = logo_img["src"]
    # apartment_data["property_management_name"] = 'Private'

    amenities_list = []

    circle_container = soup.find("div", class_="circle-container")
    if circle_container:
        circles = circle_container.find_all("div", class_="circle")
        for circle in circles:
            about_label = circle.find("span", class_="about-label")
            data_span = circle.find("span", class_="data")
            if about_label and data_span:
                amenity_info = f"{about_label.get_text(strip=True)}: {data_span.get_text(strip=True)}"
                amenities_list.append(amenity_info)

    amenities_list = list(set(amenities_list))
    apartment_data["amenities"] = ", ".join(amenities_list)
    apartment_data["amenities"] = ", ".join(sorted(set(amenities_list), key=amenities_list.index))

    image_urls = []
    fotorama_div = soup.find('div', class_='fotorama')
    if fotorama_div:
        image_sources = [img['src'] for a in fotorama_div.find_all('a') if (img := a.find('img')) and 'src' in img.attrs]
        apartment_data["property_image"] = ", ".join(image_sources)
    else:
        apartment_data["property_image"] = None
        
    apartment_data["apartment_size"] = soup.find('div', text='Area:').find_next_sibling('div').get_text(strip=True) if soup.find('div', text='Area:') else '-1'
    apartment_data["bedroom_count"] = soup.find('div', text='Bedrooms:').find_next_sibling('div').get_text(strip=True).split(' ')[0] if soup.find('div', text='Bedrooms:') else '-1'
    apartment_data["bathroom_count"] = soup.find('div', text='Bathrooms:').find_next_sibling('div').get_text(strip=True).split(' ')[0] if soup.find('div', text='Bathrooms:') else '-1'
    apartment_data["property_type"] = soup.find('div', text='Property type:').find_next_sibling('div').get_text(strip=True) if soup.find('div', text='Property type:') else '-1'


    df = pd.DataFrame([apartment_data])
    return pd.DataFrame([apartment_data])

def get_apartments_links(initial_content, initial_url):
    article_links = []
    next_page_url = initial_url  # Start with the initial URL
    while next_page_url:
        soup = BeautifulSoup(initial_content, "lxml")
        placard_container = soup.find("div", class_="flex flex-wrap search-results")
        if placard_container:
            posts = placard_container.find_all("div", class_="col-sm-4 col-md-4 col-xs-12 col-lg-3 fix")
            for article in posts:
                a_tag = article.find("a")
                if a_tag and 'href' in a_tag.attrs:
                    article_links.append(f"https://findallrentals.ca{a_tag['href']}")

        # Check for pagination and update next_page_url accordingly
        pagination_container = soup.find("div", id="pagination-load-more")
        next_page_link = pagination_container.find("a", class_="next-page") if pagination_container else None
        next_page_url = next_page_link['href'] if next_page_link and 'href' in next_page_link.attrs else None
        
        if next_page_url:
            initial_content = get_html_content(next_page_url)
        else:
            break 

    return article_links

def scrape_each_apartment_details(link):
    try:
        # print(link)
        content = get_html_content(link)
        article = BeautifulSoup(content, "lxml")
        with open("output.html", "w") as file:
            file.write(content)
        data = extract_apartment_data(article, link)
        return data

    except Exception as ex:
        print(f"Error: {str(ex)}")
        return None


def main():
    all_apartments_df = pd.DataFrame()
    content = get_html_content(FINDALLRENTALS_LINK)
    articles = get_apartments_links(content, FINDALLRENTALS_LINK)
    for article in tqdm(articles):
        try:
            # print(f"Scraping article: {article}")
            article_content = get_html_content(article)
            article_soup = BeautifulSoup(article_content, "lxml")
            # with open("output.html", "w") as file:
            #     file.write(article_content)
            apartment_df = extract_apartment_data(article_soup, article)
            all_apartments_df = pd.concat([all_apartments_df, apartment_df], ignore_index=True)
        except Exception as ex:
            print(f"Error scraping {article}: {str(ex)}")
    
    return all_apartments_df

if __name__ == "__main__":
    main()