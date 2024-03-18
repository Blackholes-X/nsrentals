from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class Listing(BaseModel):
    id: int
    listing_name: str
    address: str
    property_management_name: str
    monthly_rent: int
    bedroom_count: int
    bathroom_count: int
    utility_water: int
    utility_heat: int
    utility_electricity: int
    wifi_included: int
    utility_laundry: int
    included_appliances: List[str]
    parking_availability: int
    apartment_size: int
    apartment_size_unit: Optional[str] = None  # Allow None as a valid value
    is_furnished: int
    availability_status: str
    image: str
    description: str
    source: str
    website: str
    load_datetime: datetime  # Use datetime directly



class CompanyDetails(BaseModel):
    property_management_name: str
    total_listings: int
    average_price_0_bedroom: Optional[float]
    average_price_1_bedroom: Optional[float]
    average_price_2_bedroom: Optional[float]