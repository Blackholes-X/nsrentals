from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import html2text
import time
from tqdm import tqdm

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
