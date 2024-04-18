import os


from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import html2text
import time
from tqdm import tqdm

from src import utils as U
from src import normalization as N
from src import config as C



def scrape(url):
    
    ## Step 1: Getting all the links from the given url which has the same domain
    same_domain_urls = U.find_links_same_domain(url)
    # Order URLs by length
    ordered_urls = U.sort_urls_by_length(same_domain_urls)

    ## Step 2: Retrieving content (as formatted text) from all these websites as a list.
    contents_in_md = extract_content_to_markdown(ordered_urls)

    # Step 3: Use the extracted content from all the sites to merge to the final content which will be used for scraping.
    merged_content = N.merge_contents(contents_in_md)
    
    # Check if the debug folder exists, if not create it
    debug_folder_path = './debug'
    if not os.path.exists(debug_folder_path):
        os.makedirs(debug_folder_path)

    # Writing merged contents to a Markdown file
    file_path = os.path.join(debug_folder_path, 'scraped_md.md')
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(merged_content)
    
    return merged_content


def scrape_and_extract(url, company_name):
    # Placeholder for the scraping logic
    contents = scrape(url)
    token_count = U.count_tokens(contents)
    print(f"Token Count: {token_count}")
    segmented_content = U.split_content_by_token_limit(contents)
    print(f"Segmented Content Size: {len(segmented_content)}")

    return segmented_content[0]



def extract_content_to_markdown(urls):
    """
    Takes a list of URLs, extracts content from each using Selenium for dynamic content handling,
    and converts it to Markdown, with Chrome operating in headless mode.
    """
    # Configure Chrome to run in headless mode
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")  # This option is recommended for headless mode
    
    # Setup Selenium WebDriver with headless Chrome
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    contents_in_markdown = {}

    for url in tqdm(urls):
        driver.get(url)
        # Allow some time for dynamic content to load
        time.sleep(5)  # Adjust sleep time based on the expected load time of the sites
        
        # Get page source after JavaScript has been executed
        page_source = driver.page_source
        
        # Convert HTML to Markdown
        converter = html2text.HTML2Text()
        converter.ignore_links = True
        converter.ignore_images = False  # Change this to True if you wish to ignore images
        markdown = converter.handle(page_source)
        
        contents_in_markdown[url] = markdown
    
    driver.quit()
    return contents_in_markdown