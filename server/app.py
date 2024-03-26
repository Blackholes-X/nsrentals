from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src import utils as U
from src import config as C
from src import dbutils as DU
from src import models as M
from src import create_tables
from src import auth
from src import llm 

from typing import Optional, List


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


@app.get("/competitors/property-managed-listing", response_model=List[M.Listing])
def property_managed_listing(property_management_name: str, records_limit: int = 10):
    listings = DU.get_recent_listings_by_management(property_management_name, records_limit)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    return listings


@app.get("/competitors/llm-comparison")
def llm_comparison(property_management_name: str):
    try:
        comparison_texts = llm.generate_comp_comparison_text(property_management_name)
        # Return the name and the list of comparison texts in the response
        return {
            "property_management_name": property_management_name,
            "comparisons": comparison_texts
        }
    except Exception as e:
        # Generic error handling, adjust as needed
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the comparison: {str(e)}")


### ---------------- Map Screen -----------------------------

@app.get("/map/comp-listings", response_model=List[M.Listing])
def map_property_managed_listing(records_limit: int = 20):
    listings = DU.get_all_comp_listings(records_limit)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while fetching the listings.")
    return listings

@app.get("/map/public-listings", response_model=List[M.Listing])
def map_property_managed_listing(records_limit: int = 20):
    listings = DU.get_all_listings(records_limit)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while fetching the listings.")
    return listings


### ---------------- Map Listings Screen -----------------------------

@app.get("/listings/details", response_model=List[M.Listing])
def get_listings_by_ids(id1: int, id2: int):
    listings = DU.get_listings_by_ids(id1, id2)
    if listings is None or len(listings) == 0:
        raise HTTPException(status_code=404, detail="Listings not found.")
    return listings

if __name__ == '__main__':

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8070)
