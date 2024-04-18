import os
import json
from dotenv import load_dotenv

from openai import OpenAI

from src import config as C
from dotenv import load_dotenv
load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def extract_from_single_content(content, propertyManagementFirm):

    system_prompt = f'''
            Your role involves processing and analyzing markdown data extracted from various web pages of a property management firm. Your primary task is to parse this markdown data and organize it into a structured JSON format that categorizes information into specified fields.

            Required Output: The output should be a JSON object that encapsulates detailed information about the property management firm. The JSON structure should adhere to the following schema, with specific fields populated by the data extracted from the markdown content. If certain information is not available within the provided markdown, please use "Not Provided" as the value for those fields.

            {{
                "Company Name": {propertyManagementFirm},
                "Website URL": "https://www.example.com",
                "Logo URL": "https://www.example.com/logo.png",
                "Description": "Brief description of the property management firm, its mission, and core values.Also about places where there properties are with total number of apartments available for rental.",
                "Domain Name": "example.com",
                "Geography Served": ["List", "Of", "Geographies"],
                "Contact Email": "contact@example.com",
                "Social Media Profiles": {{
                    "LinkedIn": "LinkedIn URL",
                    "Twitter": "Twitter URL",
                    "Facebook": "Facebook URL"
                }},
                "Address": "Company Address",
                "Notes": "Any additional notes or important information to be highlighted."
            }}

            Fields Explained:
            Company Name: The legal name of the company.
            Website URL: The official website URL.
            Logo URL: Direct URL to the company's logo.
            Description: A detailed description of the company's business, places where they have property, number of buildings and available aprtments for rental .
            Domain Name: Internet domain name.
            Geography Served: List of geographic regions where services are offered. 
            Contact Email: Primary contact email address.
            Social Media Profiles: URLs to the company's social media profiles.
            Address: Physical address of the company's headquarters.
            Notes: Additional relevant information or context about the company.

    '''

    user_prompt = f'''

          Carefully review the markdown data provided below. Extract relevant information and populate the JSON schema accordingly. Ensure accuracy and completeness to the best of your ability, and use "Not Provided" for any missing details.

          <content>
          {content}
          </content>
    '''

    # Create the conversation messages with the system prompt and the user query
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    
    response = client.chat.completions.create(
        model=C.OPENAI_MODEL,
        response_format={ "type": "json_object" },
        messages=messages
        )
    
    # Extract the response content
    response_content = response.choices[0].message.content
    # Remove the markdown code block notation and leading/trailing backticks
    cleaned_response = response_content.replace("```json", "").replace("```", "").strip()

    # Attempt to parse the cleaned response as JSON
    try:
        response_json = json.loads(cleaned_response)
        # print(json.dumps(response_json, indent=4))
        print("inside LLM call")
        print(response_json)
        return response_json
    except json.JSONDecodeError as e:
        print(f"Failed to parse JSON: {e}")
        return None
    

def extract_from_more_content(content, response):
    # Placeholder for actual implementation
    # This should process additional content segments and return a response
    return f"Processed additional segment: {len(content.split())} tokens"

def extract_contents(content_segments, companyName):
    responses = [] 
    
    if len(content_segments) == 1:
        # If there's only one segment, process it with extract_from_single_content
        response = extract_from_single_content(content_segments[0], companyName)
        responses.append(response)
    elif len(content_segments) > 1:
        # If there are multiple segments, process the first with extract_from_single_content
        response = extract_from_single_content(content_segments[0], companyName)
        responses.append(response)
        # Process the rest of the segments with extract_from_more_content iteratively
        for segment in content_segments[1:]:
            response = extract_from_more_content(segment, response)
            responses.append(response)
    
    return responses