import MotionHoc from "./MotionHoc";
import React, { useState, useEffect } from 'react';
import PropetyDetailPage from "./PropetyDetailPage";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Typewriter from "../componant/Typewriter";
const BuildingData = [
  
];
const PermitData = [
  
];

const BuildingList = () => {

  const [propertyData2, setPropertyData2] = useState(BuildingData);

  useEffect(() => {
    fetch('http://54.196.154.157:8070/hrm/building-listings?records_limit=10')
      .then(response => response.json())
      .then(data => {
        console.log("--------------")
        console.log(JSON.stringify(data))
        setPropertyData2(data)
      })
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
       <p><strong>permit_value:</strong> {property.permit_value}</p>
       <p><strong>floors:</strong> {property.floors}</p>
       <p><strong>units_or_size:</strong> {property.units_or_size}</p>
       <p><strong>building_type:</strong> {property.building_type}</p>
       <p><strong>url:</strong> {property.url}</p>
       <p><strong>source_name:</strong> {property.source_name}</p>
       
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

const PermitList = () => {

  const [propertyData2, setPropertyData2] = useState(PermitData);

  useEffect(() => {
    fetch('http://54.196.154.157:8070/hrm/building-permits?records_limit=10')
      .then(response => response.json())
      .then(data => setPropertyData2(data))
      .catch(error => console.error('Error fetching data:', error));
    
  }, []);

  return (
  <div style={styles.container}>
  <div style={styles.cardsContainer}>
    {propertyData2.map((property, index) => (
      <div key={index} style={{ ...styles.propertyCard, backgroundColor: property.isHighlighted ? 'yellow' : 'white' }}>
        
        <div style={styles.propertyInfo}>
          <Link key={index} to={`/propertyList/${property.property_management_name}`}>
            <h2><Typewriter text={property.civic_address} delay={100} /></h2>
       <p><strong>permit_value:</strong> {property.permit_value}</p>
       <p><strong>floors:</strong> {property.floors}</p>
       <p><strong>units_or_size:</strong> {property.units_or_size}</p>
       <p><strong>building_type:</strong> {property.building_type}</p>
       <p><strong>latest_update:</strong> {property.latest_update}</p>
       
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

const AllHrmList = () => {

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
      <Tabs>
    <TabList>
      <Tab>Buildings</Tab>
      <Tab>Permits</Tab>
    </TabList>

    <TabPanel>
      <BuildingList/>
    </TabPanel>
    <TabPanel>
      <PermitList/>
    </TabPanel>

  </Tabs>
      </div>
    </div>
  );
};


// const TeamComponent = () => {
//   return <PropertyList />;
// };

const Documents = () => {
  return (
    <div>
      <Header />
      <AllHrmList />
    </div>
  );
};

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px',  textAlign: 'center' }}>HRM</h1>
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
export default Documents;
