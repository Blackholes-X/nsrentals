import MotionHoc from "./MotionHoc";
import React, { useState, useEffect } from 'react';
import PropetyDetailPage from "./PropetyDetailPage";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import TypewriterForLI from "../componant/TypewriterForLI";
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

const comparisionDatavar = [
  
];

const PropertyListView = () => {
  // useEffect(() => {
  //   document.body.style.overflowX = "hidden"; // Disable vertical scrolling
  //   return () => {
  //     document.body.style.overflowX = "auto"; // Enable vertical scrolling when component unmounts
  //   };
  // }, []);

  const [propertyData2, setPropertyData2] = useState(PropertyData);
  const { propertyName } = useParams();
// alert(propertyName)
  useEffect(() => {
    fetch(`http://54.196.154.157:8070/competitors/property-managed-listing?property_management_name=${propertyName}`)
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
              <img src={property.image} alt="Property" style={styles.propertyImage} />
            </div>
            <div style={styles.propertyInfo}>
              <h2>{property.listing_name}</h2>
              <p>Address: {property.address}</p>
              <p>Bedrooms: {property.bedroom_count}</p>
              <p>Bathrooms: {property.bathroom_count}</p>
              <p>Monthly Rent: {property.monthly_rent !== -1 ? `$${property.monthly_rent}` : 'N/A'}</p>
              {/* Add more details as needed */}
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

const PropertyList = () => {
  return (
    <div>
      <Header />
      <AllProList />
    </div>
  );
};

const ComparisionModule = () => {

  const [comparisionData, setComparisionData] = useState(comparisionDatavar);
  const { propertyName } = useParams();
  useEffect(() => {
    fetch('http://54.196.154.157:8070/competitors/llm-comparison?property_management_name='+propertyName)
      .then(response => response.json())
      .then(data => {
        let products = [];

        if (data) {
          products = [
            {
              name: "Southwest Property",
              imageUrl: "https://cdngeneralcf.rentcafe.com/dmslivecafe/3/480429/FortGeorgeExterior.jpg?&quality=85",
              features: data.southwest
            },
            {
              name: "Competitor's Property",
              imageUrl: "https://cdngeneralcf.rentcafe.com/dmslivecafe/3/480429/FortGeorgeExterior.jpg?&quality=85",
              features: data.competitor
            },
          ];
          setComparisionData(products)

        }


      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  function ProductHeader({ product }) {
    return (
      <div style={productHeaderStyle}>
        <img src={product.imageUrl} alt={product.name} style={productImageStyle} />
        <h2 style={productNameStyle}>{product.name}</h2>
      </div>
    );
  }
  function ProductFeatureRow({ featureName, products }) {
  return (
    <div style={featureRowStyle}>
      <div style={featureNameStyle}>Features</div> {/* Static 'Features' column header */}
      {products.map((product) => (
        <div key={product.name} style={featureValueStyle}>
          <ul>
            {Object.entries(product.features).map(([feature, value]) => (
              <li key={feature}> <TypewriterForLI text={`${feature}: ${value}`} delay={100} /> </li>
              
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

const FeatureListWithAnimation = ({ features, delay }) => {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // When the text for a feature completes, move to the next feature
  const handleAnimationComplete = () => {
    setCurrentFeatureIndex(index => (index + 1) % features.length);
  };

  useEffect(() => {
    const timer = setTimeout(handleAnimationComplete, (features[currentFeatureIndex].length * delay) + 1000);
    return () => clearTimeout(timer);
  }, [currentFeatureIndex, features, delay]);

  return (
    <ul>
      {features.slice(0, currentFeatureIndex + 1).map((feature, index) => (
        <li key={index}>
          <Typewriter text={feature} delay={delay} />
        </li>
      ))}
    </ul>
  );
};


  function ComparisonTable({ products }) {
    const featureNames = [...new Set(products.flatMap(product => Object.keys(product.features)))];
  
    return (
      <div style={comparisonTableStyle}>
        <div style={productHeadersStyle}>
          {products.map(product => (
            <ProductHeader key={product.name} product={product} />
          ))}
        </div>
       
          <div style={featureRowStyle}>
          {products.map((product) => (
            <div key={product.name} style={featureValueStyle}>
               <FeatureListWithAnimation
            features={Object.entries(product.features).map(([key, value]) => `${key}: ${value}`)}
            delay={50}
          />

              {/* <ul>
                {Object.entries(product.features).map(([feature, value]) => (
                  <li key={feature}><TypewriterForLI text={`${feature}: ${value}`} delay={100} /></li>
                ))}
              </ul> */}
            </div>
          ))}
        </div>
        
      
      </div>
    );
  }
  
  const productHeadersStyle = {
    display: 'flex',
    justifyContent: 'space-evenly', // Ensure even spacing
    alignItems: 'center',
    textAlign: 'center',
    width: '100%', // Use the full width of the container
  };
  
  // Ensure the comparisonTableStyle accommodates two columns comfortably
  const comparisonTableStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '20px auto',
    maxWidth: '95%',
    backgroundColor: '#fff',
  };
  
  // Adjusted styles for the ComparisonModule components
  const productHeaderStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f2f2f2',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    margin: '0 auto', // Center align the header within its column
  };

const productImageStyle = {
  width: '120px', // Adjusted image size for better visibility
  height: 'auto',
  borderRadius: '4px', // Rounded corners for images
  marginBottom: '10px', // Space between the image and the product name
};

const productNameStyle = {
  fontWeight: 'bold', // Bold product names for better readability
  color: '#333', // Darker text for better readability
  textAlign: 'center', // Ensure the product name is centered
};

const featureRowStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '10px 0',
  width: '100%', // Ensure the row uses the full width for consistent alignment
};

const featureNameStyle = {
  flex: 1,
  textAlign: 'center', // Center-aligned feature names
  fontWeight: '500', // Medium font weight for feature names
  color: '#444',
};

const featureValueStyle = {
  flex: 1,
  textAlign: 'left', // Center-aligned feature values
  color: '#666', // Slightly lighter text color for values
};

  

  return (
  <div style={styles.container}>
  <div style={styles.cardsContainer}>
  <ComparisonTable products={comparisionData} />
  </div>
</div>

  );
};


const AllProList = () => {

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
      <Tabs style={{width:'100%'}}>
    <TabList>
      <Tab>Listings</Tab>
      <Tab>Comparision</Tab>
    </TabList>

    <TabPanel>
      <PropertyListView/>
    </TabPanel>
    <TabPanel>
      <ComparisionModule/>
    </TabPanel>

  </Tabs>
      </div>
    </div>
  );
};

const Header = () => {
  const { propertyName } = useParams();

  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px',  textAlign: 'center' }}>Property List of {propertyName}</h1>
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
export default PropertyList;
