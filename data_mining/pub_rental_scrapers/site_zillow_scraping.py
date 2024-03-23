import pandas as pd
import json
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from src.config import *
from src.utils import *

def get_data():
    url = "https://www.zillow.com/async-create-search-page-state"
    payload = json.dumps({
    "searchQueryState": {
      "pagination": {},
      "isMapVisible": True,
      "mapBounds": {
        "west": -65.79428797656253,
        "east": -61.47666102343753,
        "south": 44.47398031442788,
        "north": 44.817898812616356
      },
      "usersSearchTerm": "Halifax, NS",
      "regionSelection": [
        {
          "regionId": 791204,
          "regionType": 6
        }
      ],
      "filterState": {
        "isForRent": {
          "value": True
        },
        "isForSaleByAgent": {
          "value": False
        },
        "isForSaleByOwner": {
          "value": False
        },
        "isNewConstruction": {
          "value": False
        },
        "isComingSoon": {
          "value": False
        },
        "isAuction": {
          "value": False
        },
        "isForSaleForeclosure": {
          "value": False
        },
        "isAllHomes": {
          "value": True
        }
      },
      "isListVisible": True,
      "mapZoom": 8
    },
    "wants": {
      "cat1": [
        "mapResults"
      ]
    },
    "requestId": 2,
    "isDebugRequest": False
    })
    headers = {
    'authority': 'www.zillow.com',
    'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Cookie': 'search=6|1713468897780%7Crect%3D44.817898812616356%2C-61.47666102343753%2C44.47398031442788%2C-65.79428797656253%26rid%3D791204%26disp%3Dmap%26mdm%3Dauto%26p%3D1%26z%3D1%26listPriceActive%3D1%26fs%3D0%26fr%3D1%26mmm%3D0%26rs%3D0%26ah%3D0%26singlestory%3D0%26housing-connector%3D0%26abo%3D0%26garage%3D0%26pool%3D0%26ac%3D0%26waterfront%3D0%26finished%3D0%26unfinished%3D0%26cityview%3D0%26mountainview%3D0%26parkview%3D0%26waterview%3D0%26hoadata%3D1%26zillow-owned%3D0%263dhome%3D0%26featuredMultiFamilyBuilding%3D0%26student-housing%3D0%26income-restricted-housing%3D0%26military-housing%3D0%26disabled-housing%3D0%26senior-housing%3D0%26excludeNullAvailabilityDates%3D0%26isRoomForRent%3D0%26isEntirePlaceForRent%3D1%26commuteMode%3Ddriving%26commuteTimeOfDay%3Dnow%09%09791204%09%7B%22isList%22%3Atrue%2C%22isMap%22%3Atrue%7D%09%09%09%09%09; zgsession=1|2550dc24-dc37-4b5e-860d-659f6a4b936e; zguid=24|%24150af8cb-2ba8-41b8-b37b-a0d3bde0a634; x-amz-continuous-deployment-state=AYABeGjWflvMYTEg1APsJxFJ9IgAPgACAAFEAB1kM2Jsa2Q0azB3azlvai5jbG91ZGZyb250Lm5ldAABRwAVRzA3MjU1NjcyMVRZRFY4RDcyVlpWAAEAAkNEABpDb29raWUAAACAAAAADJpHvSz55Ij7NfSLfAAw9XQMRpCW3%2FRRZPv6ATNHBT1AbqjiK61QdDYSnVMOC4mZw9ca4fyUrdtY2UkWm2aTAgAAAAAMAAQAAAAAAAAAAAAAAAAAAIDJJBTKJZmINrG1eee%2FYg%2F%2F%2F%2F%2F%2FAAAAAQAAAAAAAAAAAAAAAQAAAAzUk3UBBFUwIEmw366YlZ7kebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjLebwWA89PfNhmjEjL'
    }
    response = requests.request("PUT", url, headers=headers, data=payload)
    return response.text

def process_properties(json_data):
    rows = []
    for item in tqdm(json_data["cat1"]["searchResults"]["mapResults"]):
        row = {feature: '-1' for feature in apartment_features}  # Initialize all to '-1'
        
        # Update the row with available data
        row.update({
            "source": "https://www.zillow.com" + item.get("detailUrl", "-1"),
            "sitename": "Zillow",
            "image_source": item.get("imgSrc", "-1"),
            "listing_name": item.get("statusText", "-1"),
            "building_name": item.get("buildingName", "-1"),
            "address": item.get("address", "-1"),
            "monthly_rent": item.get("price", "-1"),
            "bedroom_count": str(item.get("minBeds", "-1")),
            "bathroom_count": str(item.get("minBaths", "-1")),
            "apartment_size": str(item.get("minArea", "-1")) + " sqft"
        })
        rows.append(row)
    
    df = pd.DataFrame(rows)
    return df
def main():
    apartment_df = pd.DataFrame()
    
    try:
        data = json.loads(get_data())
        processed_properties = process_properties(data)
        apartment_df = pd.DataFrame(processed_properties)
        return apartment_df
    except Exception as e:
        print(f"An error occurred: {e}")
      
    return apartment_df

if __name__ == "__main__":
    main()
