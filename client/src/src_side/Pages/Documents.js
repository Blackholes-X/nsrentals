import MotionHoc from './MotionHoc'
import React, { useState, useEffect } from 'react'
import PropetyDetailPage from './PropetyDetailPage'
import { Link } from 'react-router-dom' // Import Link from react-router-dom
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Typewriter from '../componant/Typewriter'
import dummyImg from '../../src_map/dummyImg.jpg'

const BuildingData = []
const PermitData = []

const BuildingList = () => {
  const [propertyData2, setPropertyData2] = useState(BuildingData)

  useEffect(() => {
    fetch('http://54.196.154.157:8070/hrm/building-listings?records_limit=50')
      .then((response) => response.json())
      .then((data) => {
        console.log('--------------')
        console.log(JSON.stringify(data))
        setPropertyData2(data)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const handleImageError = (e) => {
    e.target.src = dummyImg; // Set the source to your dummy image
  };

  return (
    <div style={styles.container}>
    <div style={styles.cardsContainer}>
      {propertyData2.map((property, index) => (
        <div
          key={index}
          style={{
            ...styles.propertyCard,
            backgroundColor: property.isHighlighted ? 'yellow' : 'white',
          }}
        >
          <div style={styles.propertyCardInner}>
            <div style={styles.imageContainer}>
              <img src={property.image || dummyImg} alt="Property" style={styles.propertyImage} onError={handleImageError} />
            </div>
            <div style={styles.propertyInfo}>
              <h2>{property.listing_name}</h2>
              <div style={styles.propertyDescription}>
                <div>
                  <p>
                    <strong><b>Address:</b></strong>
                    {property.address}
                  </p>
                  <p>
                    <strong><b>Permit value:</b></strong> {property.permit_value}
                  </p>
                  <p>
                    <strong><b>Floors:</b></strong> {property.floors}
                  </p>
                </div>
                <div>
                  <p>
                    <strong><b>Units/size:</b></strong> {property.units_or_size}
                  </p>
                  <p>
                    <strong><b>Building Type:</b></strong> {property.building_type}
                  </p>
                  <p>
                    <strong><b>Url:</b></strong> {property.url}
                  </p>
                  <p>
                    <strong><b>Source:</b></strong> {property.source_name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

const PermitList = () => {
  const [propertyData2, setPropertyData2] = useState(PermitData)

  useEffect(() => {
    fetch('http://54.196.154.157:8070/hrm/building-permits?records_limit=50')
      .then((response) => response.json())
      .then((data) => setPropertyData2(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        {propertyData2.map((property, index) => (
          <div
            key={index}
            style={{
              ...styles.propertyCard,
              backgroundColor: property.isHighlighted ? 'yellow' : 'white',
            }}
          >
            <div style={styles.propertyInfo}>
                <h2>{property.civic_address}</h2>
                <p>
                  <strong><b>Permit Value:</b></strong> {property.permit_value}
                </p>
                <p>
                  <strong><b>Floors:</b></strong> {property.floors}
                </p>
                <p>
                  <strong><b>Units/Size:</b></strong> {property.units_or_size == '? Units' ? "N/A" : property.units_or_size}
                </p>
                <p>
                  <strong><b>Building Type:</b></strong> {property.building_type}
                </p>
                <p>
                  <strong><b>Latest Update:</b></strong> {property.latest_update}
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
            <BuildingList />
          </TabPanel>
          <TabPanel>
            <PermitList />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

// const TeamComponent = () => {
//   return <PropertyList />;
// };

const Documents = () => {
  return (
    <div>
      <Header />
      <AllHrmList />
    </div>
  )
}

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px', textAlign: 'center' }}>HRM</h1>
    </div>
  )
}

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
    flexBasis: 'calc(33.33% - 20px)', // Adjust the width of each card as per your requirement
    maxWidth: 'calc(33.33% - 20px)', // Set maximum width to prevent overflow
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    display: 'flex', // Make the card flex container
    flexDirection: 'column', // Stack items vertically
  },
  imageContainer: {
    marginBottom: '10px',
  },
  propertyImage: {
    width: '100%', // Adjust the width as needed
    height: 'auto', // Maintain aspect ratio
    borderRadius: '5px', // Rounded corners
  },
  propertyInfo: {
    flex: 1, // Allow the property info to take up remaining space
    overflow: 'hidden', // Prevent overflow
  },
  propertyDescription: {
    display: 'flex',
    flexDirection: 'column', // Display columns on small screens
  },

  // Media query for larger screens
  '@media (min-width: 768px)': {
    propertyDescription: {
      flexDirection: 'row', // Display rows on larger screens
      justifyContent: 'space-between',
    },
  },
};


const styles2 = {
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
    width: '100%', // Adjust the width as needed
    height: '100%', // Maintain aspect ratio
    borderRadius: '5px', // Rounded corners
  },
  propertyInfo: {
    flex: 1, // Allow the property info to take up remaining space
  },
  propertyCardInner: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  propertyDescription: {
    display: 'flex',
  },
  
  imageContainer: {
    marginBottom: '10px',
  },
  
  propertyInfo: {
    flex: 1,
  },
}
export default Documents
