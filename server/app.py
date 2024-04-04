from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src import utils as U
from src import config as C
from src import dbutils as DU
from src import models as M
from src import create_tables
from src import auth
from src import llm 

from src import nearest_neighbor_inference

from typing import Optional, List, Dict


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


@app.get("/map/competitor/compare")
def compare_competitor_properties(property_id: int):
    try:
        random_properties = nearest_neighbor_inference.find_similar_properties(property_id)
        random_properties = random_properties.head(3)
        print(random_properties)
        if random_properties.empty:
            raise HTTPException(status_code=404, detail="No properties found.")
        return random_properties.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



@app.get("/map/competitor/compare-properties")
def compare_properties(competitor_id: int, southwest_id: int):
    try:
        # Placeholder for actual function to fetch property details
        # For now, returning hardcoded comparison texts
        comparison_texts = {
            "competitor": [
                f"Competitor Property {competitor_id} offers unique amenities that cater to a wide range of tenants.",
                f"However, it might fall short in terms of parking availability when compared to Southwest Property {southwest_id}.",
                "Future developments and renovations are expected to enhance its value."
            ],
            "southwest": [
                f"Southwest Property {southwest_id} is renowned for its excellent location and community services.",
                "It boasts superior parking facilities but may have higher rent compared to the competitor.",
                "It's committed to sustainability, with several eco-friendly initiatives in place."
            ]
        }
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
def hrm_building_listings(records_limit: Optional[int] = 10):
    try:
        listings = DU.get_hrm_building_listings(records_limit)
        return listings
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


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8070)
