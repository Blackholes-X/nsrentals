import MotionHoc from './MotionHoc'
import React, { useState, useEffect } from 'react'
import PropetyDetailPage from './PropetyDetailPage'
import { Link } from 'react-router-dom' // Import Link from react-router-dom
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Typewriter from '../componant/Typewriter'
import editicon from '../assets/editicon.png'
import EditPropertyModal from './EditPropertyModal'
import DetailPropertyModal from './DetailPropertyModal'
import uparrow from '../../src_side/assets/uparrow.png'
import downarrow from '../../src_side/assets/downarrow.png'
import dummyImg from '../../src_map/dummyImg.jpg'

const CompetitorData = []
const PublicData = []
const SouthwestData = []
const CompetitorList = () => {
  const [propertyData2, setPropertyData2] = useState(CompetitorData)
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    fetch(
      'http://54.196.154.157:8070/listings/all-listings?competitor=true&public=false&southwest=false',
    )
      .then((response) => response.json())
      .then((data) => setPropertyData2(data.competitor))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const openModal = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const closeModal = () => {
    // setSelectedProperty();
    setModalOpen(false);
  };

  const openDetailModal = (property) => {
    setSelectedProperty(property);
    setDetailModalOpen(true);
};

const closeDetailModal = () => {
    setDetailModalOpen(false);
};



  const savePropertyChanges = (propertyId, updatedData) => {
    // Here you would send the updated data to the server
    console.log('Saving data for property ID:', propertyId, updatedData);
    // Assuming successful update, update the local state
    const updatedProperties = propertyData2.map(p => 
      p.id === propertyId ? { ...p, ...updatedData } : p
    );
    setPropertyData2(updatedProperties);
  };

  const handleImageError = (e) => {
    e.target.src = dummyImg; // Set the source to your dummy image
  };
  const rentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Adjust the gap as needed
  };

  return (
    <div style={styles2.container}>
    <div style={styles2.cardsContainer}>


{isModalOpen && <EditPropertyModal isOpen={isModalOpen} onClose={closeModal} property={selectedProperty} onSave={savePropertyChanges}/>}
            {isDetailModalOpen && <DetailPropertyModal isOpen={isDetailModalOpen} onClose={closeDetailModal} property={selectedProperty} />}

      {propertyData2.map((property, index) => (
        <div key={index} style={styles2.propertyCard}>
          <div style={styles2.cardContent}>
            <div style={styles2.imageContainer}>
              <img src={property.image || dummyImg} alt="Property" style={styles2.propertyImage} onError={handleImageError} />
             
  
                   <p style={rentInfoStyle}>
                 {/* <b>Predicted Rent:</b> {property.predicted_rent} $ */}
                 <span style={{color: '#FF5722', fontWeight: 'bold'}}><u>Predicted Rent: ${property.predicted_rent}/month</u></span>
                 {property.rent_difference != null ? 
                    parseFloat(property.rent_difference) < 0 ? 
                    <img src={uparrow} alt="Up" height="15" width="15"/> : 
                    <img src={downarrow} alt="Down" height="15" width="15"/>
                    : null
                  }
                </p>
              <p><b>Monthly Rent: </b>{property.monthly_rent !== -1 ? `$${property.monthly_rent}` : 'N/A'}</p>
               <p><b>Source: </b><a target='_blank' href={property.source}><u>https://blackbaygroup.ca/</u></a></p>
               <p><b>Website:</b> <a target='_blank' href={property.website}><u>https://blackbaygroup.ca/</u></a></p>
              
               {/* <p><b>description:</b> {property.description ? <ExpandableText text={property.description} /> : null }  </p> */}
            </div>
            <div style={styles2.propertyInfo}>
              <h2>{property.listing_name}</h2>
              <p><b>Address:</b> {property.address}</p>
               <p><b>Bedrooms: </b>{property.bedroom_count}</p>
               <p><b>Bathrooms:</b> {property.bathroom_count == "-1" ? "n/a" : property.bathroom_count }</p>
              
               <p><b>Parking availability: </b>{property.parking_availability}</p>
               <button type="button" onClick={() => {
                openDetailModal(property)
              }} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold'}}>View More Detail</button>

           
              {/* Other details */}
            </div>
          </div>
          <img src={editicon} alt="Edit" style={styles2.editIcon} onClick={() => openModal(property)} />
        </div>
      ))}
    </div>
   
  </div>
  )
}

const PublicList = () => {
  const [propertyData2, setPropertyData2] = useState(PublicData)
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  useEffect(() => {
    fetch(
      'http://54.196.154.157:8070/listings/all-listings?competitor=false&public=true&southwest=false',
    )
      .then((response) => response.json())
      .then((data) => setPropertyData2(data.public))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const openModal = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const closeModal = () => {
    // setSelectedProperty();
    setModalOpen(false);
  };

  const openDetailModal = (property) => {
    setSelectedProperty(property);
    setDetailModalOpen(true);
};

const closeDetailModal = () => {
    setDetailModalOpen(false);
};



  const savePropertyChanges = (propertyId, updatedData) => {
    // Here you would send the updated data to the server
    console.log('Saving data for property ID:', propertyId, updatedData);
    // Assuming successful update, update the local state
    const updatedProperties = propertyData2.map(p => 
      p.id === propertyId ? { ...p, ...updatedData } : p
    );
    setPropertyData2(updatedProperties);
  };

  const handleImageError = (e) => {
    e.target.src = dummyImg; // Set the source to your dummy image
  };
  const rentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Adjust the gap as needed
  };

  return (
    <div style={styles2.container}>
    <div style={styles2.cardsContainer}>


{isModalOpen && <EditPropertyModal isOpen={isModalOpen} onClose={closeModal} property={selectedProperty} onSave={savePropertyChanges}/>}
            {isDetailModalOpen && <DetailPropertyModal isOpen={isDetailModalOpen} onClose={closeDetailModal} property={selectedProperty} />}

      {propertyData2.map((property, index) => (
        <div key={index} style={styles2.propertyCard}>
          <div style={styles2.cardContent}>
            <div style={styles2.imageContainer}>
              <img src={property.image || dummyImg} alt="Property" style={styles2.propertyImage} onError={handleImageError} />
             
  
                   <p style={rentInfoStyle}>
                 {/* <b>Predicted Rent:</b> {property.predicted_rent} $ */}
                 <span style={{color: '#FF5722', fontWeight: 'bold'}}><u>Predicted Rent: ${property.predicted_rent}/month</u></span>
                 {property.rent_difference != null ? 
                    parseFloat(property.rent_difference) < 0 ? 
                    <img src={uparrow} alt="Up" height="15" width="15"/> : 
                    <img src={downarrow} alt="Down" height="15" width="15"/>
                    : null
                  }
                </p>
              <p><b>Monthly Rent: </b>{property.monthly_rent !== -1 ? `$${property.monthly_rent}` : 'N/A'}</p>
               <p><b>Source: </b><a target='_blank' href={property.source}><u>https://blackbaygroup.ca/</u></a></p>
               <p><b>Website:</b> <a target='_blank' href={property.website}><u>https://blackbaygroup.ca/</u></a></p>
              
               {/* <p><b>description:</b> {property.description ? <ExpandableText text={property.description} /> : null }  </p> */}
            </div>
            <div style={styles2.propertyInfo}>
              <h2>{property.listing_name}</h2>
              <p><b>Address:</b> {property.address}</p>
               <p><b>Bedrooms: </b>{property.bedroom_count}</p>
               <p><b>Bathrooms:</b> {property.bathroom_count == "-1" ? "n/a" : property.bathroom_count }</p>
              
               <p><b>Parking availability: </b>{property.parking_availability}</p>
               <button type="button" onClick={() => {
                openDetailModal(property)
              }} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold'}}>View More Detail</button>

           
              {/* Other details */}
            </div>
          </div>
          <img src={editicon} alt="Edit" style={styles2.editIcon} onClick={() => openModal(property)} />
        </div>
      ))}
    </div>
   
  </div>
  )
}

const SouthWestList = () => {
  const [propertyData2, setPropertyData2] = useState(PublicData)
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  useEffect(() => {
    fetch(
      'http://54.196.154.157:8070/listings/all-listings?competitor=false&public=false&southwest=true',
    )
      .then((response) => response.json())
      .then((data) => setPropertyData2(data.southwest))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const openModal = (property) => {
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const closeModal = () => {
    // setSelectedProperty();
    setModalOpen(false);
  };

  const openDetailModal = (property) => {
    setSelectedProperty(property);
    setDetailModalOpen(true);
};

const closeDetailModal = () => {
    setDetailModalOpen(false);
};



  const savePropertyChanges = (propertyId, updatedData) => {
    // Here you would send the updated data to the server
    console.log('Saving data for property ID:', propertyId, updatedData);
    // Assuming successful update, update the local state
    const updatedProperties = propertyData2.map(p => 
      p.id === propertyId ? { ...p, ...updatedData } : p
    );
    setPropertyData2(updatedProperties);
  };

  const handleImageError = (e) => {
    e.target.src = dummyImg; // Set the source to your dummy image
  };
  const rentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Adjust the gap as needed
  };

  return (
    <div style={styles2.container}>
    <div style={styles2.cardsContainer}>


{isModalOpen && <EditPropertyModal isOpen={isModalOpen} onClose={closeModal} property={selectedProperty} onSave={savePropertyChanges}/>}
            {isDetailModalOpen && <DetailPropertyModal isOpen={isDetailModalOpen} onClose={closeDetailModal} property={selectedProperty} />}

      {propertyData2.map((property, index) => (
        <div key={index} style={styles2.propertyCard}>
          <div style={styles2.cardContent}>
            <div style={styles2.imageContainer}>
              <img src={property.image || dummyImg} alt="Property" style={styles2.propertyImage} onError={handleImageError} />
             
  
                   <p style={rentInfoStyle}>
                 {/* <b>Predicted Rent:</b> {property.predicted_rent} $ */}
                 <span style={{color: '#FF5722', fontWeight: 'bold'}}><u>Predicted Rent: ${property.predicted_rent}/month</u></span>
                 {property.rent_difference != null ? 
                    parseFloat(property.rent_difference) < 0 ? 
                    <img src={uparrow} alt="Up" height="15" width="15"/> : 
                    <img src={downarrow} alt="Down" height="15" width="15"/>
                    : null
                  }
                </p>
              <p><b>Monthly Rent: </b>{property.monthly_rent !== -1 ? `$${property.monthly_rent}` : 'N/A'}</p>
               <p><b>Source: </b><a target='_blank' href={property.source}><u>https://blackbaygroup.ca/</u></a></p>
               <p><b>Website:</b> <a target='_blank' href={property.website}><u>https://blackbaygroup.ca/</u></a></p>
              
               {/* <p><b>description:</b> {property.description ? <ExpandableText text={property.description} /> : null }  </p> */}
            </div>
            <div style={styles2.propertyInfo}>
              <h2>{property.listing_name}</h2>
              <p><b>Address:</b> {property.address}</p>
               <p><b>Bedrooms: </b>{property.bedroom_count}</p>
               <p><b>Bathrooms:</b> {property.bathroom_count == "-1" ? "n/a" : property.bathroom_count }</p>
              
               <p><b>Parking availability: </b>{property.parking_availability}</p>
               <button type="button" onClick={() => {
                openDetailModal(property)
              }} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold'}}>View More Detail</button>

           
              {/* Other details */}
            </div>
          </div>
          <img src={editicon} alt="Edit" style={styles2.editIcon} onClick={() => openModal(property)} />
        </div>
      ))}
    </div>
   
  </div>
  )
}

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
            <CompetitorList />
          </TabPanel>
          <TabPanel>
            <PublicList />
          </TabPanel>
          <TabPanel>
            <SouthWestList />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

// const TeamComponent = () => {
//   return <PropertyList />;
// };

const Projects = () => {
  return (
    <div>
      <Header />
      <AllListCom />
    </div>
  )
}

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px', textAlign: 'center' }}>All listings</h1>
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
}

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
    position: 'relative', // Needed to position the edit icon absolutely
    flexBasis: 'calc(50% - 20px)',
    maxWidth: 'calc(50% - 20px)',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.25)'
    }
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
  },
  editIcon: {
    position: 'absolute',
    top: '10px', // Adjust as needed
    right: '10px', // Adjust as needed
    width: '30px',
    height: '30px',
    cursor: 'pointer'
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
}
export default Projects
