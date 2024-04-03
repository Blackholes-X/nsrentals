import MotionHoc from "./MotionHoc";
import React, { useState, useEffect } from 'react';
import PropetyDetailPage from "./PropetyDetailPage";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Typewriter from "../componant/Typewriter";
const PropertyData = [
  {
    "property_management_name": "FACADE investments - NAhas",
    "total_listings": 14,
    "average_price_0_bedroom": null,
    "average_price_1_bedroom": -1,
    "average_price_2_bedroom": -1
  },
  {
    "property_management_name": "Blackbay Group Inc.",
    "total_listings": 55,
    "average_price_0_bedroom": 1350,
    "average_price_1_bedroom": 1473.96,
    "average_price_2_bedroom": 1714.29
  },
  {
    "property_management_name": "Blackbay Group Inc.",
    "total_listings": 55,
    "average_price_0_bedroom": 1350,
    "average_price_1_bedroom": 1473.96,
    "average_price_2_bedroom": 1714.29
  },
  {
    "property_management_name": "Blackbay Group Inc.",
    "total_listings": 55,
    "average_price_0_bedroom": 1350,
    "average_price_1_bedroom": 1473.96,
    "average_price_2_bedroom": 1714.29
  },
  {
    "property_management_name": "Blackbay Group Inc.",
    "total_listings": 55,
    "average_price_0_bedroom": 1350,
    "average_price_1_bedroom": 1473.96,
    "average_price_2_bedroom": 1714.29
  },
  {
    "property_management_name": "Blackbay Group Inc.",
    "total_listings": 55,
    "average_price_0_bedroom": 1350,
    "average_price_1_bedroom": 1473.96,
    "average_price_2_bedroom": 1714.29
  },
  {
    "property_management_name": "Blackbay Group Inc.",
    "total_listings": 55,
    "average_price_0_bedroom": 1350,
    "average_price_1_bedroom": 1473.96,
    "average_price_2_bedroom": 1714.29
  }
];

const PropertyList = () => {
  // useEffect(() => {
  //   document.body.style.overflowX = "hidden"; // Disable vertical scrolling
  //   return () => {
  //     document.body.style.overflowX = "auto"; // Enable vertical scrolling when component unmounts
  //   };
  // }, []);

  const [propertyData2, setPropertyData2] = useState(PropertyData);

  useEffect(() => {
    fetch('http://54.196.154.157:8070/competitors/competetor-details')
      .then(response => response.json())
      .then(data => setPropertyData2(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        {propertyData2.map((property, index) => (
          
          <div key={index} style={styles.propertyCard}>
            <div style={styles.imageContainer}>
              <img src={`https://via.placeholder.com/150`} alt="Property" style={styles.propertyImage} />
            </div>
            <div style={styles.propertyInfo}>
            <Link key={index} to={`/propertyList/${property.property_management_name}`}>
              <h2>{property.property_management_name}</h2>
              <p>Total Listings: {property.total_listings}</p>
              <p>1 Bedroom Avg. Price: {property.average_price_1_bedroom !== -1 ? '$' + property.average_price_1_bedroom.toFixed(2) : 'N/A'}</p>
              <p>2 Bedroom Avg. Price: {property.average_price_2_bedroom !== -1 ? '$' + property.average_price_2_bedroom.toFixed(2) : 'N/A'}</p>
             </Link>
            </div>
          </div>
       
        ))}
      </div>
    </div>
  );
};


// const TeamComponent = () => {
//   return <PropertyList />;
// };

const Team = () => {
  return (
    <div>
      <Header />
      <PropertyList />
    </div>
  );
};

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px',  textAlign: 'center' }}>Competitors List</h1>
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
export default Team;
