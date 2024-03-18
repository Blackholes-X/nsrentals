import React, { useEffect, useState } from "react";

function CompanyStatusDashboard() {
  const [companies, setCompanies] = useState([]); // State to store company details

  useEffect(() => {
    // Function to fetch company details from the backend
    const fetchCompanyDetails = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/company-details`
      );
      const data = await response.json(); // Assuming the response is in JSON format
      console.log(data);
      setCompanies(data); // Set the companies state with the response data
    };

    fetchCompanyDetails().catch(console.error); // Fetch company details from the backend and catch any error
  }, []);

  return (
    <div className="dashboard">
      <h1>Company Status Dashboard</h1>
      {companies.length > 0 ? (
        <div className="company-list">
          {companies.map((company, index) => (
            <div key={index} className="company">
              <h2>{company.property_management_name}</h2>
              <p>Total Listings: {company.total_listings}</p>
              <p>
                Average Price for 0 Bedroom: ${company.average_price_0_bedroom}
              </p>
              <p>
                Average Price for 1 Bedroom: ${company.average_price_1_bedroom}
              </p>
              <p>
                Average Price for 2 Bedrooms: ${company.average_price_2_bedroom}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No company details available.</p>
      )}
    </div>
  );
}

export default CompanyStatusDashboard;
