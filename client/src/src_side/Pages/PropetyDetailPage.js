import React from 'react';
import ListingDetailPage from './ListingDetailPage'; // Import the ListingDetailPage component
import { useParams } from 'react-router-dom';

const PropetyDetailPage = (listingData2) => {
  const { propertName } = useParams();
  // alert(index)
  // Sample data
  const listingData = [
    {
      "id": 69,
      "listing_name": "TED",
      "address": "6300 Quinpool Road, Halifax, Nova Scotia",
      "property_management_name": "FACADE investments - NAhas",
      "monthly_rent": -1,
      "bedroom_count": 1,
      "bathroom_count": -1,
      "utility_water": -1,
      "utility_heat": -1,
      "utility_electricity": -1,
      "wifi_included": -1,
      "utility_laundry": 3,
      "included_appliances": [],
      "parking_availability": 2,
      "apartment_size": 713,
      "apartment_size_unit": "sq_ft",
      "is_furnished": 0,
      "availability_status": "Unk",
      "image": "https://images.squarespace-cdn.com/content/v1/62cf25413467912b87062e23/1660006142163-IWP5D77AL02VGZEN7U7Q/N.png",
      "description": "1 bedroom, 713 sqft, available on level 8.",
      "source": "https://theted.ca/our-units",
      "website": "https://theted.ca/our-units",
      "load_datetime": "2024-03-21T23:15:52.617025"
    },
    // Add more sample data here...
  ];

  return (
    <div className="main-component">
      <h1>Listings</h1>
      {listingData.map(item => (
        <ListingDetailPage key={item.id} item={item} />
      ))}
    </div>
  );
};

export default PropetyDetailPage;
