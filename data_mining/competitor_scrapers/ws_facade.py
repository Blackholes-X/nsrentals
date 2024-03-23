import pandas as pd
from typing import List
from src import config as C
from src import db_utils as DU
from bs4 import BeautifulSoup
from src import utils as U
import requests
from src import get_from_llm as LLM
import os
from tqdm import tqdm

PROPERTY_MANAGEMENT_FIRM = "FACADE investments - NAhas"
WEBSITE_URL = C.FACADE_GRP

def get_clean_content(sections):
    content_list = []

    for section in sections:
        # Extract text from each section
        section_text = ' '.join(section.stripped_strings)
        if section_text:
            content_list.append({'type': 'text', 'content': section_text})
        
        # Find all image tags within the section
        images = section.find_all('img')
        for img in images:
            # First try to get the image URL from the 'src' attribute
            img_url = img.get('src')
            # If 'src' is None, try to get the image URL from 'data-src' or similar attributes
            if not img_url:
                img_url = img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
            if img_url:  # Ensure img_url is not None before adding
                content_list.append({'type': 'image', 'url': img_url})

    # Now content_list contains all the texts and images from the sections, in order
    text = ""
    image_urls = []
    for item in content_list:
        if item['type'] == 'text':
            text = text + (item['content'])
        elif item['type'] == 'image':
            image_urls.append(item['url'])
    text_segments = [segment + "." for segment in text.split("View ") if segment] 

    # Start with an empty string to accumulate the cleaned content
    cleaned_content = ""

    # Iterate through the text segments and image URLs together
    for text_segment, image_url in zip(text_segments, image_urls):
        cleaned_content += text_segment + "\n" + image_url + "\n\n"

    # Handle remaining text segments if there are more texts than images
    if len(text_segments) > len(image_urls):
        remaining_texts = text_segments[len(image_urls):]
        for text in remaining_texts:
            cleaned_content += text + "\n\n"

    # Handle remaining image URLs if there are more images than texts
    elif len(image_urls) > len(text_segments):
        remaining_imgs = image_urls[len(text_segments):]
        for img in remaining_imgs:
            cleaned_content += img + "\n\n"
    return cleaned_content

def extract_features_from_text_html(text_html_content: str, output_file: str = 'full_text_html_content.json') -> None:
    """
    Writes the entire HTML content to a file for further NLP processing.
    
    :param text_html_content: String containing the full HTML content.
    :param output_file: Path to the output file where the HTML content will be saved.
    """

    unique_listings = LLM.get_unique_listings(text_html_content)
    listings_features_listed = LLM.get_features_from_llm(text_html_content, unique_listings, PROPERTY_MANAGEMENT_FIRM)
    
    return listings_features_listed["rental_listings"]


def scrape() -> pd.DataFrame:
    """
    Orchestrates the scraping process.
    
    :return: A DataFrame containing all the scraped data.
    """
    
    try:
        print(f"Scraping Facade")
        urls = DU.filter_existing_urls([WEBSITE_URL])
        for url in tqdm(urls):
            res=requests.get(url)

            # Assuming res.text contains your full HTML
            html_content = res.text

            # Parse the HTML content with Beautiful Soup
            soup = BeautifulSoup(html_content, 'html.parser')
            # Find the section with the specific data-section-id
            section = soup.find('section', {'data-section-id': "62f17d143799ea0f1706e094"})
            footer = soup.find('footer')

            # Convert both elements to strings and concatenate them
            combined_html_str = str(section) + str(footer)
            combined_soup = BeautifulSoup(combined_html_str, 'html.parser')
            cleaned_content = get_clean_content(combined_soup)
            # get cleaned content from footer
            cleaned_content += U.text_from_html(str(footer))
            # print(cleaned_content)
            listing_details = extract_features_from_text_html(cleaned_content)
            listings_data = []
            for listing in listing_details:
                listing["source"] = url
                listing["website"] = url
                listing['property_management_name'] = PROPERTY_MANAGEMENT_FIRM
                listing['listing_name'] = 'TED'
                listing['address'] = U.text_from_html(str(footer)).split('\n')[0]
                listings_data.append(listing)

            df = pd.DataFrame(listings_data)
        
    except Exception as ex:
        print(f"Exception occurred while scraping: {ex}")
        df = pd.DataFrame()  
    finally:
        if not os.path.exists('../data'):
            os.makedirs('../data')
        df.to_csv(f'../data/{PROPERTY_MANAGEMENT_FIRM}.csv', index=False)
    return df


