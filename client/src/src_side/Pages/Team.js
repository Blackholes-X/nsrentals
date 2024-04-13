import MotionHoc from './MotionHoc'
import React, { useState, useEffect } from 'react'
import PropetyDetailPage from './PropetyDetailPage'
import { Link } from 'react-router-dom' // Import Link from react-router-dom
import Typewriter from '../componant/Typewriter'
import blackByLogo from '../assets/blackByLogo.png'
import tedLogo from '../assets/tedLogo.png'

const PropertyData = [
  {
    property_management_name: 'FACADE investments - NAhas',
    total_listings: 14,
    average_price_0_bedroom: null,
    average_price_1_bedroom: -1,
    average_price_2_bedroom: -1,
  },
  {
    property_management_name: 'Blackbay Group Inc.',
    total_listings: 55,
    average_price_0_bedroom: 1350,
    average_price_1_bedroom: 1473.96,
    average_price_2_bedroom: 1714.29,
  },
  {
    property_management_name: 'Blackbay Group Inc.',
    total_listings: 55,
    average_price_0_bedroom: 1350,
    average_price_1_bedroom: 1473.96,
    average_price_2_bedroom: 1714.29,
  },
  {
    property_management_name: 'Blackbay Group Inc.',
    total_listings: 55,
    average_price_0_bedroom: 1350,
    average_price_1_bedroom: 1473.96,
    average_price_2_bedroom: 1714.29,
  },
  {
    property_management_name: 'Blackbay Group Inc.',
    total_listings: 55,
    average_price_0_bedroom: 1350,
    average_price_1_bedroom: 1473.96,
    average_price_2_bedroom: 1714.29,
  },
  {
    property_management_name: 'Blackbay Group Inc.',
    total_listings: 55,
    average_price_0_bedroom: 1350,
    average_price_1_bedroom: 1473.96,
    average_price_2_bedroom: 1714.29,
  },
  {
    property_management_name: 'Blackbay Group Inc.',
    total_listings: 55,
    average_price_0_bedroom: 1350,
    average_price_1_bedroom: 1473.96,
    average_price_2_bedroom: 1714.29,
  },
]

const PropertyList = () => {
  const [propertyData2, setPropertyData2] = useState(PropertyData)

  useEffect(() => {
    fetch('http://54.196.154.157:8070/competitors/competetor-details')
      .then((response) => response.json())
      .then((data) => setPropertyData2(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  function loadImage(propertyname){
    if(propertyname == "Blackbay Group Inc."){
      return(
        <img
        src={blackByLogo}
        alt="Property"
        style={styles.propertyImage}
      />
      )
    }else if(propertyname == "FACADE investments - NAhas"){
      return(
        <img
        src={tedLogo}
        alt="Property"
        style={styles.propertyImage}
      />
      )
    }else{
      return(
        <img
        src={`https://via.placeholder.com/150`}
        alt="Property"
        style={styles.propertyImage}
      />
      )
    }
  }
  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        {propertyData2.map((property, index) => (
          <div key={index} style={styles.propertyCard}>
            <div style={styles.imageContainer}>
             {loadImage(property.property_management_name)}
            </div>
            <div style={styles.propertyInfo}>
              <Link key={index} to={`/propertyList/${property.property_management_name}`}>
                <h2>{property.property_management_name}</h2>
                <p><b>Total Listings: </b>{property.total_listings}</p>
                <p>
                <b>1 Bedroom Avg. Price:</b>{' '}
                  {property.average_price_1_bedroom !== -1
                    ? '$' + property.average_price_1_bedroom.toFixed(2)
                    : 'N/A'}
                </p>
                <p>
                <b>2 Bedroom Avg. Price:</b>{' '}
                  {property.average_price_2_bedroom !== -1
                    ? '$' + property.average_price_2_bedroom.toFixed(2)
                    : 'N/A'}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// const TeamComponent = () => {
//   return <PropertyList />;
// };

const Team = () => {
  return (
    <div>
      <Header />
      <PropertyList />
    </div>
  )
}

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px', textAlign: 'center' }}>Competitors List</h1>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '90%',
    margin: '0 auto',
    padding: '20px',
    marginTop: '30px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    color: '#333',
  },
  header: {
    backgroundColor: '#f4f4f4',
    padding: '15px 10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
    flexBasis: 'calc(50% - 10px)', // Making more efficient use of space
    margin: '5px', // Add a small margin around each card for better spacing
    border: '1px solid #ccc',
    borderRadius: '10px', // More pronounced rounded corners
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)', // Deeper shadow for a pop-out effect
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Smooth transition for hover effects
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)' // Enhanced shadow on hover
    },
    display: 'flex', // Maintain flex layout
    flexDirection: 'row', // Ensure side-by-side layout of image and info
    alignItems: 'center', // Vertically align items in the card
  },
  imageContainer: {
    flex: '0 0 auto', // Prevent flex shrink on the image container
    marginRight: '20px',
    alignSelf: 'center',
  },
  propertyImage: {
    width: '150px',
    height: 'auto',
    borderRadius: '5px',
  },
  propertyInfo: {
    flex: 1,
    overflow: 'hidden', // Prevent text from overflowing the card area
  },
}

export default Team
