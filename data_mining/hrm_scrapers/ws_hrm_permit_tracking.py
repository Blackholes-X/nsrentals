import requests
from bs4 import BeautifulSoup
import pandas as pd
from src import config as C

WEBSITE_URL = C.HRM_PERMIT_TRACKING

def clean_html_content(main_content):
    """
    Clean the HTML content by removing everything after the "Glossary" <p> tag, including the tag itself.
    
    Parameters:
    - main_content: BeautifulSoup object that represents the main content of the page.
    
    Returns:
    The cleaned main_content.
    """
    glossary_tag = main_content.find('p', string="Glossary")
    if glossary_tag:
        next_sib = glossary_tag.find_next_sibling()
        while next_sib:
            next_to_remove = next_sib.find_next_sibling()
            next_sib.decompose()  # Remove the current sibling
            next_sib = next_to_remove
        glossary_tag.decompose()
    return main_content

def scrape_main_content(website_url):
    """
    Scrape the main content from the specified URL, clean it, and extract project details into a DataFrame.
    
    Parameters:
    - website_url: The URL of the website to scrape.
    
    Returns:
    A pandas DataFrame containing the extracted project details.
    """
    # Fetch the HTML content from the website
    res = requests.get(website_url)
    html_content = res.text

    # Parse the HTML content
    soup = BeautifulSoup(html_content, 'html.parser')
    main_content = soup.find('main')

    # Clean the HTML content
    main_content_cleaned = clean_html_content(main_content)

    # Extract project details
    project_list_items = main_content_cleaned.find_all('li')
    projects = [item.get_text().split('-') for item in project_list_items]

    # Define the column names for the DataFrame
    columns = ['civic_address', 'floors', 'units_or_size', 'building_type', 'permit_value', 'latest_update']

    # Create a DataFrame from the projects list
    df_projects = pd.DataFrame(projects, columns=columns)
    return df_projects

def scrape() -> pd.DataFrame:
    """
    Orchestrates the scraping process.
    
    :return: A DataFrame containing all the scraped data.
    """
    try:
        df_projects = scrape_main_content(WEBSITE_URL)
    except Exception as ex:
        print(f"Exception occurred while scraping: {ex}")
        df_projects = pd.DataFrame()  
    
    return df_projects
