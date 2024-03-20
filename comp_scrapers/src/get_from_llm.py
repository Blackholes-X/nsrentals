import os
import json
from dotenv import load_dotenv

from openai import OpenAI

from src import config as C

load_dotenv() # Load the environment variables from the .env file

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def get_unique_listings(text_html_content):
    system_prompt = "You are a helpful data mining expert helping to collect rental information from text extracted from scraped HTML content."

    # Correctly escape braces within the f-string
    user_prompt = f"""
    Please analyze the provided HTML content to identify and enumerate the rental options available. Structure your response as a JSON array, where each object represents a distinct rental listing. 
    Ensure each JSON object includes the number of bedrooms, minimum price, maximum price and a description. If a listing specifies only one price, use this value for both the minimum and maximum price fields. 
    Note that the prices should be numerical values without any currency symbols or text prefixes. 
    For instance:
        {{
            "rental_listings": [
                {{
                    "number_of_bedrooms": 1,
                    "minimum_price": 200,
                    "maximum_price": 400,
                    "description" : "loft style"
                }},
                {{
                    "number_of_bedrooms": 1,
                    "minimum_price": 600,
                    "maximum_price": 600,
                    "description" : "seperate entrance"
                }}
            ]
        }}

    Please refer to the below HTML content. """ + text_html_content + "\n\n"

    response = client.chat.completions.create(
        model=C.OPENAI_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    # Extract the response content
    response_content = response.choices[0].message.content

    # Remove the markdown code block notation and leading/trailing backticks
    cleaned_response = response_content.replace("```json", "").replace("```", "").strip()

    # Attempt to parse the cleaned response as JSON
    try:
        response_json = json.loads(cleaned_response)
        # print(json.dumps(response_json, indent=4))
        return response_json
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        return None



def get_features_from_llm(text_html_content, unique_listings, property_management_name):

    system_prompt = "You are a helpful data mining expert helping to collect rental information from text extracted from scraped HTML content."

    user_prompt = f"""
    Given the HTML content from a rental listing website for the property management firm: {property_management_name}, your task is to extract and format the information into a JSON list. Each object within the list should represent a unique apartment listing. 

    Attributes for each JSON object include:
    - **listing_name**: The official name of the listing.
    - **address**: The complete street address.
    - **property_management_name**: Name of the property management firm; -1 if unavailable.
    - **monthly_rent**: The minimum monthly rent; -1 if unavailable.
    - **bedroom_count**, **bathroom_count**: The count of bedrooms and the count of bathroom, with -1 for unknown bathroom count.
    - **utility_water**: Whether water is included; 1 if included, 0 if not included else -1.
    - **utility_heat**: Whether heat is included; 1 if included, 0 if not included else -1.
    - **utility_electricity**: Whether electricity is included; 1 if included, 0 if not included else -1.
    - **wifi_included**: Whether wifi is included; 1 if included, 0 if not included else -1.
    - **utility_laundry**: Whether laundry is included; 0 for not included, 1 for paid, 2 for free, 3 if unknown.
    - **included_appliances**: A list of all included appliances.
    - **parking_availability**: 0 for not included, 1 for included, 2 if unknown.
    - **apartment_size**: -1 if size is not provided.
    - **apartment_size_unit**: "sq_mt" or "sq_ft"; None, if not provided.
    - **is_furnished**: 0 for unknown, 1 for unfurnished, 2 for partially, 3 for fully furnished.
    - **availability_status**: "Unk" if not specified.
    - **image**: URL to the main image of the listing.
    - **description**: The full listing description.

    Unique listings found in the HTML: {unique_listings}

    These listings share common features, replicate those common information across the respective listings. 
    
    Scraped Content:
    {text_html_content}

    A sample response looks like this:
    {{
        "rental_listings": [
            {{
                "listing_name": "123 Ocean View",
                "address": "123 Ocean View Drive, Coastal Town, NS",
                "property_management_name": "Private",
                "monthly_rent": 1450,
                "bedroom_count": 2,
                "bathroom_count": 1,
                "utility_water": 1,
                "utility_heat": 1,
                "utility_electricity": 1,
                "wifi_included": 1,
                "utility_laundry": 2,
                "included_appliances": ["Refrigerator", "Stove", "Dishwasher"],
                "parking_availability": 1,
                "apartment_size": 850,
                "apartment_size_unit": "sq_ft",
                "is_furnished": 1,
                "availability_status": "Unk",
                "image": "https://example.com/uploads/2023/02/123-ocean-view.jpg",
                "description": "2-bedroom unit with ocean views, starting at $1450. Building features include on-site parking, mail services, in-suite laundry, and a secure entry system."
            }},
            {{..}}
        ]
    }}
    """



    response = client.chat.completions.create(
        model=C.OPENAI_MODEL,
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
        )

    # Extract the response content
    response_content = response.choices[0].message.content
    # Remove the markdown code block notation and leading/trailing backticks
    cleaned_response = response_content.replace("```json", "").replace("```", "").strip()

    # Attempt to parse the cleaned response as JSON
    try:
        response_json = json.loads(cleaned_response)
        # print(json.dumps(response_json, indent=4))
        return response_json
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        return None

