import MotionHoc from "./MotionHoc";
import React, { useState, useEffect } from 'react';
import PropetyDetailPage from "./PropetyDetailPage";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Typewriter from "../componant/Typewriter";
const CompetitorData = [
  
];
const PublicData = [
  
];
const SouthwestData = [
  
];
const CompetitorList = () => {

  const [propertyData2, setPropertyData2] = useState(CompetitorData);

  useEffect(() => {
    fetch('http://54.196.154.157:8070/listings/all-listings?competitor=true&public=false&southwest=false')
      .then(response => response.json())
      .then(data => setPropertyData2(data.competitor))
      .catch(error => console.error('Error fetching data:', error));
    
  }, []);

  return (
  <div style={styles.container}>
  <div style={styles.cardsContainer}>
    {propertyData2.map((property, index) => (
      <div key={index} style={{ ...styles.propertyCard, backgroundColor: property.isHighlighted ? 'yellow' : 'white' }}>
        <div style={styles.imageContainer}>
          <img src={property.image} alt="Property" style={styles.propertyImage} />
        </div>
        <div style={styles.propertyInfo}>
          <Link key={index} to={`/propertyList/${property.property_management_name}`}>
            <h2>{property.property_management_name}</h2>
       <p><strong>Address:</strong>             
          <Typewriter text={property.address} delay={100} />
      </p>
       <p><strong>Apartment Size:</strong> {property.apartment_size} sqft</p>
       <p><strong>Bedrooms:</strong> {property.bedroom_count}</p>
       <p><strong>Bathrooms:</strong> {property.bathroom_count}</p>
       <p><strong>Monthly Rent:</strong> {property.monthly_rent !== "-1" ? `$${property.monthly_rent}` : "N/A"}</p>
       <p><strong>Parking Availability:</strong> {property.parking_availability === 2 ? "Available" : "Not Available"}</p>
       <p><strong>Utility Laundry:</strong> {property.utility_laundry}</p>
       <p><strong>Furnished:</strong> {property.is_furnished === -1 ? "No" : "Yes"}</p>
       <p><strong>Website:</strong> <a href={property.website} target="_blank" rel="noopener noreferrer">{property.website}</a></p>
       <p>{property.description}</p>
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

const PublicList = () => {

  const [propertyData2, setPropertyData2] = useState(PublicData);

  useEffect(() => {
    fetch('http://54.196.154.157:8070/listings/all-listings?competitor=false&public=true&southwest=false')
      .then(response => response.json())
      .then(data => setPropertyData2(data.public))
      .catch(error => console.error('Error fetching data:', error));
    
  }, []);

  return (
  <div style={styles.container}>
  <div style={styles.cardsContainer}>
    {propertyData2.map((property, index) => (
      <div key={index} style={{ ...styles.propertyCard, backgroundColor: property.isHighlighted ? 'yellow' : 'white' }}>
        <div style={styles.imageContainer}>
          <img src={property.image} alt="Property" style={styles.propertyImage} />
        </div>
        <div style={styles.propertyInfo}>
          <Link key={index} to={`/propertyList/${property.property_management_name}`}>
            <h2>{property.listing_name}</h2>
       <p><strong>Address:</strong>             
          <Typewriter text={property.address} delay={100} />
      </p>
       <p><strong>Apartment Size:</strong> {property.apartment_size} sqft</p>
       <p><strong>Bedrooms:</strong> {property.bedroom_count}</p>
       <p><strong>Bathrooms:</strong> {property.bathroom_count}</p>
       <p><strong>Monthly Rent:</strong> {property.monthly_rent !== "-1" ? `$${property.monthly_rent}` : "N/A"}</p>
       <p><strong>Parking Availability:</strong> {property.parking_availability === 2 ? "Available" : "Not Available"}</p>
       <p><strong>Utility Laundry:</strong> {property.utility_laundry}</p>
       <p><strong>Furnished:</strong> {property.is_furnished === -1 ? "No" : "Yes"}</p>
       <p><strong>Website:</strong> <a href={property.website} target="_blank" rel="noopener noreferrer">{property.website}</a></p>
       <p>{property.description}</p>
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

const SouthWestList = () => {

  const [propertyData2, setPropertyData2] = useState(PublicData);

  useEffect(() => {
    fetch('http://54.196.154.157:8070/listings/all-listings?competitor=false&public=false&southwest=true')
      .then(response => response.json())
      .then(data => setPropertyData2(data.southwest))
      .catch(error => console.error('Error fetching data:', error));
    
  }, []);

  return (
  <div style={styles.container}>
  <div style={styles.cardsContainer}>
    {propertyData2.map((property, index) => (
      <div key={index} style={{ ...styles.propertyCard, backgroundColor: property.isHighlighted ? 'yellow' : 'white' }}>
        <div style={styles.imageContainer}>
          <img src={property.property_image} alt="Property" style={styles.propertyImage} />
        </div>
        <div style={styles.propertyInfo}>
          <Link key={index} to={`/propertyList/${property.property_management_name}`}>
            <h2>{property.property_management_name}</h2>
       <p><strong>Address:</strong>             
          <Typewriter text={property.address} delay={100} />
      </p>
       <p><strong>Apartment Size:</strong> {property.apartment_size} sqft</p>
       <p><strong>Bedrooms:</strong> {property.bedroom_count}</p>
       <p><strong>Bathrooms:</strong> {property.bathroom_count}</p>
       <p><strong>Monthly Rent:</strong> {property.monthly_rent !== "-1" ? `$${property.monthly_rent}` : "N/A"}</p>
       <p><strong>Parking Availability:</strong> {property.parking_availability === 2 ? "Available" : "Not Available"}</p>
       <p><strong>Utility Laundry:</strong> {property.utility_laundry}</p>
       <p><strong>Furnished:</strong> {property.is_furnished === -1 ? "No" : "Yes"}</p>
       <p><strong>Website:</strong> <a href={property.website} target="_blank" rel="noopener noreferrer">{property.website}</a></p>
       <p><Typewriter text={property.description} delay={100} /></p>
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

const AllListCom = () => {
  

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
      <Tabs>
    <TabList>
      <Tab>Competitors</Tab>
      <Tab>Public</Tab>
      <Tab>Southwest</Tab>

    </TabList>

    <TabPanel>
      <CompetitorList/>
    </TabPanel>
    <TabPanel>
      <PublicList/>
    </TabPanel>
    <TabPanel>
      <SouthWestList/>
    </TabPanel>
  </Tabs>
      </div>
    </div>
  );
};


// const TeamComponent = () => {
//   return <PropertyList />;
// };

const Projects = () => {
  return (
    <div>
      <Header />
      <AllListCom />
    </div>
  );
};

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px',  textAlign: 'center' }}>All listings</h1>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: '5px', 
    marginTop: '50px',

  },
  heading: {
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '24px',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderRadius: '0 0 25px 25px', 
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyCard: {
    flexBasis: 'calc(50% - 20px)', // Adjust the width of each card as per your requirement
    maxWidth: 'calc(50% - 20px)', // Set maximum width to prevent overflow
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    display: 'flex', // Make the card flex container
  },
  imageContainer: {
    marginRight: '20px', // Add some space between the image and text
  },
  propertyImage: {
    width: '150px', // Adjust the width as needed
    height: 'auto', // Maintain aspect ratio
    borderRadius: '5px', // Rounded corners
  },
  propertyInfo: {
    flex: 1, // Allow the property info to take up remaining space
  },
};
export default Projects;
