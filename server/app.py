from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from src import utils as U
from src import config as C
from src import dbutils as DU
from src import models as M
from src import create_tables
from src import auth

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


### ---------------- Competitor Listinfs -----------------------------

@app.get("/competitors/company-details", response_model=List[M.CompanyDetails])
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


if __name__ == '__main__':

    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8070)
