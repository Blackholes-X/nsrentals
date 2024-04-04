
from typing import List
from src import dbutils as DU
import os
import json

from openai import OpenAI
from dotenv import load_dotenv

from src import config as C


load_dotenv()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))


def generate_comp_comparison_text(property_management_name: str) -> List[str]:
    # Example logic to generate comparison texts based on the property management name
    comparisons = [
        f"{property_management_name} offers competitive pricing.",
        "Their customer service is rated highly among users.",
        "They have a wide range of properties available."
    ]
    return comparisons


def generate_property_comparison_text(competitor_id: int, southwest_id: int,public_id : int):
    # Example logic to generate comparison texts based on the property management name
    sw_df = DU.read_data_from_sec_southwest_listings()
    if competitor_id != 0:
        comp_df = DU.read_data_from_sec_comp_rental_listings()
        comp_property = comp_df.loc[comp_df['id'] == competitor_id]
        comp_property_details = comp_property.to_json(orient='records')
        data = json.loads(comp_property_details)
        comp_property_firm = data[0]['property_management_name'] if 'property_management_name' in data[0] else None
    else:
        comp_df = DU.read_data_from_sec_public_rental_data()
        comp_property = comp_df.loc[comp_df['id'] == public_id]
        comp_property_details = comp_property.to_json(orient='records')
        data = json.loads(comp_property_details)
        comp_property_firm = data[0]['listing_name'] if 'listing_name' in data[0] else None

    
    # Fetch rows by ID
    sw_property = sw_df.loc[sw_df['id'] == southwest_id]
    

    # Convert rows to a human-readable format for the prompt
    sw_property_details = sw_property.to_json(orient='records')
    comp_property_details = comp_property.to_json(orient='records')
    data = json.loads(comp_property_details)
    


    # Constructing the prompt
    system_prompt = "You are a helpful AI trained in real estate comparisons."

    user_prompt = f"""
    Given the descriptions of two property listings in json format, provide a comparison in terms of different features given for the properties. 
    Please refer to the following description of features for your reference:
    - building_name: The name of the apartment or housing complex.
    - apartment_number: Specific unit number within the building.
    - address: The full street address of the property.
    - add_lat: Longitude of the address.
    - add_long: Latitude of the address.
    - company_name: The name of the property management or owning company.
    - monthly_rent: The monthly cost of renting the apartment/house.
    - property_type: Distinguishes between an apartment unit or a condo.
    - bedroom_count: The number of bedrooms in the apartment/house.
    - bathroom_count: The number of bathrooms in the apartment/house.
    - utility_water: Indicates if water is included and the cost if not.
    - utility_heat: Indicates if heating is included and the cost if not.
    - utility_electricity: Indicates if electricity is included and the cost if not.
    - wifi_included: Indicates if WiFi service is included in the rent.
    - parking_availability: Indicates if parking is available and included in the cost.
    - parking_slots: The number of parking slots available nearby if parking_availability is 0 in building.
    - parking_rates: The cost of parking per slot of the nearby parking.
    - parking_distance: The distance from the nearby parking lot to the property.
    - parking_address: The address of the nearby parking.
    - pet_friendly: Indicates if pets are allowed and under what conditions.
    - unit_size: The square footage or square meter measurement of the unit.
    - is_furnished: Specifies if the unit is fully furnished, partially furnished, or unfurnished.
    - included_appliances: Lists appliances that come with the rental unit.
    - lease_duration: The time period for the lease agreement.
    - availability_status: The month in which the apartment is available for rent.
    - dist_hospital: The distance of the apartment from the nearest hospital.
    - dist_school: The distance of the apartment from the nearest school.
    - dist_restaurant: The distance of the apartment from the nearest famous restaurant.
    - dist_downtown: The distance of the apartment from downtown.
    - dist_busstop: The distance of the apartment from the nearest bus stop.
    - dist_larry_uteck_area: The distance of the apartment from the Larry Uteck area(a place in Halifax,NS,Canada).
    - dist_central_halifax: The distance of the apartment from Central Halifax(a place in Halifax,NS,Canada).
    - dist_clayton_park: The distance of the apartment from Clayton Park (a place in Halifax,NS,Canada).
    - dist_rockingham: The distance of the apartment from Rockingham street(a place in Halifax,NS,Canada).

    Please refer to the below details of the properties in json format, based on the above mentioned features:
    Southwest Property: {sw_property_details}

    Competitor Property: {comp_property_details}
    Your task is to provide a detailed comparison between two property listings, one from Southwest and the other from {comp_property_firm}. The comparison should be formatted as a JSON array consisting of two objects. Each object represents a property listing and its distinctive features. 
    Within each object, you are expected to list the key differences that set each property apart from the other. These differences should be presented as items in an array associated with each property object. It's crucial that the descriptions for these points are thorough and elucidate the unique aspects of each property clearly and concisely. 
    For each feature difference, delve into specifics—describe not just what the difference is, but also how it might impact the potential tenant's living experience or the property's appeal. Aim for parity in the number of points for each property to maintain a balanced comparison.
    Include as much information as you can about everything. Also if mentioning anything about distances use relative terms like near, far etc.
    For instance:
    {{
        "sw_property_details": [
            "Studio apartment with possibly no monthly rent mentioned.",
            "Includes basic appliances: Fridge and Stove.",
            "Utilities covered: Water, Heat, WiFi, and Laundry facilities.",
            "Lacks detailed parking information.",
            "Smaller unit size of 323 sqft not indicating furnished status."
        ],
        "{comp_property_firm}": [
            "1-bedroom loft style apartment with a monthly rent of $1600.",
            "Includes a wider range of appliances and possibly HVAC systems.",
            "Parking available at $95 per slot with 13 slots, suggesting better parking facilities.",
            "Lacks information on utilities covered by the rent.",
            "Unit size and furnished status not mentioned, implying potential for customization."
        ] 
    }}

    """
    # Call OpenAI API with the constructed prompt
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
    with open('gpt_res.json', 'w') as file:
        json.dump(response_content, file)

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