# llm_description_call.py
import json
import os
from ai_scrapping.ai_scraper_src  import utils as U   
from ai_scrapping.ai_scraper_src  import llm as LLM  
import csv

def read_file_contents(file_path):
    """Reads and returns the contents of a file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def dump_json(data, output_path):
    """Dumps data to a JSON file."""
    try:
        # Attempt to dump data to JSON
        with open(output_path, 'w', encoding='utf-8') as json_file:  # Added '.json' extension
            json.dump(data, json_file, ensure_ascii=False, indent=4)
        print(f"Data successfully saved to {output_path}.json")
    except TypeError as e:
        print(f"Failed to save data as JSON due to: {e}")
        # The rest of the function remains unchanged

def summarize_content(content, company):
    """Segments and summarizes the content using LLM."""
    # Assuming `segment_content_semantically` and `extract_contents` are available.
    # Adjust the function calls according to your implementation.
    segmented_content = U.split_content_by_token_limit(content)
    summarized_content = LLM.extract_contents(segmented_content, companyName=company)
    return summarized_content

if __name__ == "__main__":
    debug_folder_path = './debug'
    file_name = 'scraped_md.md'
    file_path = os.path.join(debug_folder_path, file_name)

    company = "BlackBay"
    output_json_file = f"summarized_content_{company}.json"
    output_json_file = os.path.join(debug_folder_path, output_json_file)
    
    
    # Ensure the file exists
    if not os.path.exists(file_path):
        print(f"Error: The file {file_path} does not exist.")
        exit(1)
    
    content = read_file_contents(file_path)
    summarized_content = summarize_content(content,company )
    print("print smmarized content",summarized_content)
    dump_json(summarized_content, output_json_file)
    #dump_json(summarize_content, output_json_file)
    print("Summarized Content:")
    print(summarized_content)
