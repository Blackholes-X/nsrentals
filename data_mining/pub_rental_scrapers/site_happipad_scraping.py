import pandas as pd
import json
import requests
from tqdm import tqdm
from bs4 import BeautifulSoup
from src.config import *
from src.utils import *

def get_data():
    url = "https://app.happipad.com/property-map-ajax"

    payload = "city=Halifax&state=Nova+Scotia&searchArea=Halifax%2C+NS%2C+Canada&latitude=44.6475811&longitude=-63.5727683&radius=20"
    headers = {
    'authority': 'app.happipad.com',
    'accept': '*/*',
    'accept-language': 'en,en-US;q=0.9,de;q=0.8',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'cookie': '_gcl_au=1.1.1972049441.1711220394; _gid=GA1.2.818697984.1711220394; _tt_enable_cookie=1; _ttp=-TSG12ctPARZhoqlPfI0xtwxfKA; _fbp=fb.1.1711220394163.1772992241; cw_conversation=eyJhbGciOiJIUzI1NiJ9.eyJzb3VyY2VfaWQiOiJhNTUwMjk5OC0wNzI2LTQyNWUtYjk2Ni05NDE0YjkzYWFlMmIiLCJpbmJveF9pZCI6Mn0.7X9z4KuSrfpEw51D0fWMSr3jDd-r-ehjf458fwzDKr0; prism_611338066=bfea8609-8a0a-47e6-86d1-1d2f7c6a0906; XSRF-TOKEN=eyJpdiI6InJKRlV6VzFZMEF2T2J2NGZjb25OcEE9PSIsInZhbHVlIjoiNXFxcDN6XC9pZktFZUYwdGpQOUZcL1JDUlwvazlsdlNWN2xzek5aekZqVTdPdHpNMURoN0VXUGlpM2JITFNxSWdHZm5wMmNTb3U3QmIzQ1wvVHpqY2pvWDN0Vkx1ZnlhMU03a0dydlcwRTFmQnMzMnZqblNSd3JVdmhnWk8xV2NPQTZrIiwibWFjIjoiNWZlMTA0NmY4OGJhZDAzNjI4MTgxMWI1ZTNmZmVmZmJmNzRlMTMzMDcwYmUxM2YxYTUzOGVmMDc2NzVlNmNhZSJ9; happipad_session=eyJpdiI6IkhZMVdOR0lGN3RPUXprQ2xVczRLckE9PSIsInZhbHVlIjoiV3VsV2ZnTzRSYXkxcUFLRG4xN21mSnJCbVBwcUdpc1wvZGpYQk1tMFRiUnM3SStSTG16M3NPRHRNV3pldXV6XC81VzlKenBvK2wyb0VhS2hxMjd2cWp5eEtFeHNkdTJPMzJQMDNFQ2x4YXp4ZUhIblRVcnBDYnQ3RjFtR2dnUlkzaiIsIm1hYyI6IjZiMTQ3MmI0ZmRiNGVmMTA2ODgzNTFmZjViMWIxZTFlYTE5MzJlMWY3MTRmMzgzYWM3MDFlM2Q2NWVkOThiZTMifQ%3D%3D; _ga_Y0S1JYQH6E=GS1.1.1711220394.1.1.1711220546.0.0.0; _ga=GA1.2.1105857864.1711220394; _dc_gtm_UA-218782750-1=1; _ga_9GF2VBRF3X=GS1.2.1711220394.1.1.1711220547.60.0.0; XSRF-TOKEN=eyJpdiI6Ik1yMGJzOHVBY2lQNXc5aGZuXC9iWmVRPT0iLCJ2YWx1ZSI6ImNFeVc3Y3FFOXVBMlwvNXlPaXRoaGdZTHdnUk5ZV055blpcLzY5MXRQXC9GWTU2RCtlM0F1YzVlTDJIZ28xa01IVnoyU0J4SDVLaFVnczRUTk1DWEFBa1wvVjd4aURuR01MRnJCN29USGxKYnVIeTFxT0VxSSs5eXVPT3NqU1FwYkF2eCIsIm1hYyI6IjkwNGI4YzQ1Y2ZiOGNiMDRhOTZkYjA2MjIzZGY2Y2ZkMDQ4MzExNDA4MjQ0ZmUxMzZkZDQ2MDEyZGFkODM1MTEifQ%3D%3D; happipad_session=eyJpdiI6InByUnZTdUFjQU8rNVFRUHhCaGFyT1E9PSIsInZhbHVlIjoiRjJiTU9oRndmYWxzcjB0RUUwMW1KWXp3QUtBUHZEZFwvbWRoQXlFVEQxZFR6NHdEZHhZMHlnZllxd1VoMjB0eEtTd05hRUNmRGxzXC9NcVNmazlZRnArV3JCb3QyMU5QdDBoK3FEREwycDJpR0pXUkxHWUtsczBHeExFYVd4V0h1byIsIm1hYyI6ImRmNDg1ZTMyMzZkM2NkNGUwNzEzM2I1MzdiNzg4NzJiN2RmZWM3MDhiMjJjZjRmYWNkM2VlOWVjNDA2ZThiOTgifQ%3D%3D',
    'origin': 'https://app.happipad.com',
    'referer': 'https://app.happipad.com/listings?_ga=2.213829341.818697984.1711220394-1105857864.1711220394',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'x-csrf-token': 'VU5cOpm8CZdgjigqEXlXxb9jdDRUN7zhdEK1i7X7',
    'x-requested-with': 'XMLHttpRequest'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    response = requests.request("POST", url, headers=headers, data=payload)
    return response.text


def extract_amenities_and_bathroom_count(url):
    # print(f"Extracting amenities from {url}")
    try:
        content = get_html_content(url)
        soup = BeautifulSoup(content, "lxml")
        home_features_h2 = soup.find('h2', text='Home Features')
        if home_features_h2:
            next_ul = home_features_h2.find_next_sibling('ul', class_="uk-child-width-1-4@m")
            if next_ul:
                amenities_tags = next_ul.find_all('li')
                amenities = [tag.text.strip() for tag in amenities_tags if tag.text.strip()]
                return amenities
            else:
                print("UL with amenities not found after the 'Home Features' H2.")
        else:
            print("'Home Features' H2 tag not found.")
        
        return -1
    except Exception as e:
        print(f"Error extracting amenities and bathroom count: {e}")
        return [], '-1'

def process_properties(data):
    base_image_url = "https://app.happipad.com/storage/images/property/"
    base_property_url = "https://app.happipad.com/property/"
    processed_properties = []

    for property in tqdm(data["properties"]):
        try:
            images = json.loads(property["propertiesPicture"]) if property["propertiesPicture"] else []
            image_source = f"{base_image_url}{property['id']}/800x450/{images[0]}" if images else "-1"
        except Exception as e:
            image_source = "-1"

        source = f"{base_property_url}{property['id']}"
        amenities = extract_amenities_and_bathroom_count(source)

        processed_property = {feature: '-1' for feature in apartment_features}  # Initialize all features to -1

        processed_property.update({
            "source": source,
            "sitename": 'happipad.com',
            "property_image": image_source,
            "listing_name": property.get("roomTitle", '-1'),
            "address": property.get("address", '-1'),
            "monthly_rent": property.get("roomRent", '-1'),
            "amenities": ', '.join(amenities) if amenities != -1 else '-1',
            "latitude": property.get("latitude", '-1'),
            "longitude": property.get("longitude", '-1'),
            "city": property.get("city", '-1'),
            "state": property.get("state", '-1'),
            "bathroom_count": property.get("guestBathroom", '-1'),
        })

        processed_properties.append(processed_property)

    return processed_properties

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
