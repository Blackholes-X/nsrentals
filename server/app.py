from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from src import utils as U
from src import config as C
from src import dbutils as DU
from src import models as M

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

@app.get('/')
def welcome():
    return {'message': 'Welcome to backend'}


@app.get("/company-details", response_model=List[M.CompanyDetails])
def company_details():
    details = DU.get_company_details()
    if details is None:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    return details


@app.get("/property-managed-listing", response_model=List[M.Listing])
def property_managed_listing(property_management_name: str, records_limit: int = 10):
    listings = DU.get_recent_listings_by_management(property_management_name, records_limit)
    if listings is None:
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")
    return listings



if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8070)
