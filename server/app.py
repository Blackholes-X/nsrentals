from fastapi import FastAPI, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from src import utils as U
from src import config as C
from src import dbutils as DU
from src import models as M
from src import create_tables
from src import company_scraper as CS
from src import auth
from src import llm 
from src import prediction as P
import numpy as np
import pandas as pd
from src import nearest_neighbor_inference
from src import training as T
from ai_scrapping import main
from typing import Optional, List, Dict
from data_model import ListingDataResponse

app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


### ---------------- Test -----------------------------
@app.get('/')
def welcome():
    return {'message': 'Welcome to backend'}

### ---------------- Auth -----------------------------

@app.post("/auth/auth-token", response_model=M.UserResponse)
async def create_token(user_credentials: M.UserCredentials):
    access_token = auth.create_access_token(data={"sub": user_credentials.user_email})
    
    try:
        DU.store_user_and_access_token(user_credentials.user_email, user_credentials.user_name, access_token)
        pass
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to store user and token information.")

    return {
        "user_email": user_credentials.user_email,
        "user_name": user_credentials.user_name,
        "access_token": access_token
    }


### ---------------- Competitors -----------------------------

@app.get("/competitors/competetor-details", response_model=List[M.CompanyDetails])
def company_details():
    details = DU.get_company_details()
    if details is None:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    return details


@app.get("/competitors/property-managed-listing")
def property_managed_listing(property_management_name: str, records_limit: int = 10):
    listings = DU.get_recent_listings_by_management(property_management_name, records_limit)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    return listings


@app.get("/competitors/llm-comparison")
def llm_comparison(property_management_name: str):
    try:
        # comparison_texts = llm.generate_comp_comparison_text(property_management_name)
        southwest_texts = [
            "Metro Living stands out for its strategic locations and modern urban living solutions.",
            "Innovative use of technology in property management sets Metro Living apart.",
            "The company is a leader in affordable luxury, offering high-end amenities at competitive prices.",
            "Tenants praise Metro Living for its community-building events and initiatives."
        ]
        comparison_texts = [
            f"{property_management_name} is a recognized name in the property management industry, known for its dedication to excellence.",
            "Details about specific initiatives or accolades for this company are currently under review.",
            "Stay tuned for more detailed comparisons and insights about this company.",
            "We are in the process of gathering more data and tenant feedback on this company."
        ]

        return {
            "competitor": comparison_texts,
            "southwest": southwest_texts
        }
    except Exception as e:
        # Generic error handling, adjust as needed
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the comparison: {str(e)}")
    
@app.post("/competitors/update-listing/")
def update_listing(listing_data: ListingDataResponse):
    update_response = DU.update_listing_in_db(listing_data)
    
    if "error" in update_response:
        raise HTTPException(status_code=update_response["status"], detail=update_response["error"])
    
    return {"message": update_response.get("message", "Success")}


### ---------------- Map Screen -----------------------------

@app.get("/map/comp-listings")
def map_property_managed_listing(records_limit: int = 20, bedroom_count: Optional[int] = None, bathroom_count: Optional[int] = None, rent_min: Optional[int] = None, rent_max: Optional[int] = None):
    listings = DU.get_all_comp_listings(records_limit, bedroom_count, bathroom_count, rent_min, rent_max)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while fetching the listings.")
    return listings

@app.get("/map/public-listings")
def map_public_property_listing(records_limit: int = 20, bedroom_count: Optional[int] = None, bathroom_count: Optional[int] = None, rent_min: Optional[int] = None, rent_max: Optional[int] = None):
    listings = DU.get_pub_listings(records_limit, bedroom_count, bathroom_count, rent_min, rent_max)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while fetching the listings.")
    return listings

@app.get("/map/southwest-listings")
def map_southwest_property_listing(records_limit: int = 20, bedroom_count: Optional[int] = None, bathroom_count: Optional[int] = None, rent_min: Optional[int] = None, rent_max: Optional[int] = None):
    listings = DU.get_southwest_listings(records_limit, bedroom_count, bathroom_count, rent_min, rent_max)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while fetching the southwest listings.")
    return listings

@app.get("/map/parkings")
def map_parking_data():
    listings = DU.read_data_from_sec_parking_data()
    listing_json = listings.to_json(orient='records')
    if listings.empty:
        raise HTTPException(status_code=500, detail="An error occurred while fetching parking data.")
    return listing_json


@app.get("/map/competitor/compare")
def compare_competitor_properties(property_id: int):
    try:
        random_properties = nearest_neighbor_inference.find_similar_properties(property_id)
        random_properties = random_properties.head(3)
        random_properties.replace([np.inf, -np.inf, np.nan], None, inplace=True)
        
        if random_properties.empty:
            raise HTTPException(status_code=404, detail="No properties found.")
        return random_properties.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



@app.get("/map/competitor/compare-properties")
def compare_properties(competitor_id: int, southwest_id: int,public_id:int):
    try:
        comparison_texts = llm.generate_property_comparison_text(competitor_id, southwest_id, public_id)
        return comparison_texts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

### ---------------- Listings Screen -----------------------------

@app.get("/listings/all-listings")
def all_listings(competitor: Optional[bool] = False, public: Optional[bool] = False, southwest: Optional[bool] = False):
    try:
        results = {}
        if competitor:
            results['competitor'] = DU.get_last_listings('sec_comp_rental_listings', 10)
        if public:
            results['public'] = DU.get_last_listings('sec_public_rental_data', 10)
        if southwest:
            results['southwest'] = DU.get_last_listings('sec_southwest_listings', 10)
        
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    


### ---------------- HRM Screen -----------------------------
    
@app.get("/hrm/building-listings")
def hrm_building_listings():
    try:
        listings = DU.get_hrm_building_listings()
        listings.replace([np.inf, -np.inf, np.nan], None, inplace=True)
        return  listings.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

@app.get("/hrm/building-permits")
def hrm_building_permits(records_limit: Optional[int] = 10):
    try:
        permits = DU.get_hrm_building_permits(records_limit)
        return permits
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    

### ---------------- Dashboard Screen -----------------------------

@app.get("/dashboard/predicted-rent")
def get_predicted_rent():
    # Assuming these values are placeholders for demonstration
    predicted_rent = {
        "rent": 1630.0,
        "rent_for_1bhk": 1520.4,
        "rent_for_2bhk": 1740.0,
    }
    return predicted_rent

@app.get("/dashboard/competitor-listings")
def get_competitor_listings():
    try:
        competitor_listings = DU.get_competitor_listings_summary()
        return competitor_listings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

### -------------------- ML Stuffs --------------------------------------

@app.get("/model-versions")
def get_model_versions():
    model_versions = DU.fetch_all_model_versions()
    return model_versions

@app.get("/retrain-predictive-models")
async def retrain_predictive_models(background_tasks: BackgroundTasks):
    """
    Endpoint to retrain predictive models asynchronously.
    """
    # Add the retrain_models function to be executed in the background
    background_tasks.add_task(T.retrain_models)
    
    # Return a response immediately to the client while the task runs in the background
    return {"message": "Model retraining has been initiated. Please check the system logs for completion status."}

@app.post("/model-redeploy/{model_id}")
def model_redeploy(model_id: int):
    success = DU.redeploy(model_id)
    if success:
        return {"message": "Model redeployment successful."}
    else:
        raise HTTPException(status_code=404, detail="Model redeployment failed. Check logs for details.")
    
@app.get("/update-and-refresh-predictions")
def update_and_refresh_predictions():
    # Call the refresh_predictions function and return its result
    refreshed_predictions = P.update_new_predictions()
    return refreshed_predictions


### ---------------------- LLMs ---------------------------------------------

@app.post("/add-competitor-details")
async def add_competitor_details(url: str, company_name: str):
    """
    Adds competitor details to the database by scraping and extracting information
    from the provided URL and company name.
    """
    try:
        # Call the CS.scrape_and_extract method and store its response
        scraped_data = CS.scrape_and_extract(url, company_name)
        
        # Assume we have a function to save the scraped data to the database
        id = DU.save_to_database(scraped_data, company_name)

        # For demonstration, returning the scraped data as the response
        response = {
            "message" : "Happy!!",
            "content" : scraped_data,
            "id" : id
        }
        return scraped_data
    except Exception as e:
        # If anything goes wrong, return an error message
        raise HTTPException(status_code=500, detail=str(e))



### ---------------------- General Scraper ---------------------------------------------

@app.get("/scraper/competitor-listing")
def scraper_competitor_listing(competitor_name : Optional [str] = 'Blackbay Group Inc.'):
    listings = DU.get_scraper_comp_listing(competitor_name)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    return listings



###------------------------AI-Scrapping--------------------------------------------------------------

@app.get("/scraper/company-details")
def company_details(company_name : Optional [str] = 'BlackBay Group Inc.', url: Optional[str] ='https://blackbaygroup.ca'):
    if "ted" in company_name.lower():
        normalized_company_name = " ".join(company_name.strip().lower().split())
        if normalized_company_name == 'ted':
            company_name = "FACADE investments - NAhas"
    exists  = DU.check_company_exists(company_name, url)
    print(exists)
    if exists:
        result = DU.get_company_description_by_name_or_url(company_name, url)
        return result
    
    company_scraped_data = DU.check_company_exists_in_company_details(company_name)
    if company_scraped_data:
        scraped_data   = DU.get_company_scraped_data(company_name)
    else:
        scraped_data = main.scrape_and_extract(url, company_name)
        id = DU.save_to_database(scraped_data, company_name)

   
    summarized_content = main.run_llm_script(content=scraped_data,company=company_name)
    DU.save_company_summary(summarized_content)

    
    return summarized_content


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8070)