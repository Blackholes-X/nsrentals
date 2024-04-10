import MotionHoc from './MotionHoc'
import React, { useState, useEffect } from 'react'
import PropetyDetailPage from './PropetyDetailPage'
import { Link } from 'react-router-dom' // Import Link from react-router-dom
import { useParams } from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import TypewriterForLI from '../componant/TypewriterForLI'
import Typewriter from '../componant/Typewriter'
import southwestlogo from '../../src_side/assets/southwestlogo.png'
import blackByLogo from '../../src_side/assets/blackByLogo.png'
import tedLogo from '../../src_side/assets/tedLogo.png'
import uparrow from '../../src_side/assets/uparrow.png'
import downarrow from '../../src_side/assets/downarrow.png'
import ExpandableText from '../componant/ExpandableText'
import Modal from 'src/src_map/components/Modal'
import editicon from '../assets/editicon.png'
import EditPropertyModal from './EditPropertyModal'
import DetailPropertyModal from './DetailPropertyModal'
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

const comparisionDatavar = []

const PropertyListView = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);

  // useEffect(() => {
  //   document.body.style.overflowX = "hidden"; // Disable vertical scrolling
  //   return () => {
  //     document.body.style.overflowX = "auto"; // Enable vertical scrolling when component unmounts
  //   };
  // }, []);

  const [propertyData2, setPropertyData2] = useState(PropertyData)
  const { propertyName } = useParams()
  // alert(propertyName)
  useEffect(() => {
    fetch(
      `http://54.196.154.157:8070/competitors/property-managed-listing?property_management_name=${propertyName}`,
    )
      .then((response) => response.json())
      .then((data) => setPropertyData2(data))
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


  const rentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px', // Adjust the gap as needed
  };
  return (
    // <div style={styles.container}>
    //   <div style={styles.cardsContainer}>
    //     {propertyData2.map((property, index) => (
    //       <div key={index} style={styles.propertyCard}>
    //         <div style={styles.imageContainer}>
    //           <img src={property.image} alt="Property" style={styles.propertyImage} />
    //           <p><b>Distance from (in miles):  </b> </p>
    //           <p><b>Hospital: </b>{parseFloat(property.dist_hospital).toFixed(2)}</p>
    //           <p><b>School:</b> {parseFloat(property.dist_school).toFixed(2)}</p>
    //           <p><b>Restaurant: </b>{parseFloat(property.dist_restaurant).toFixed(2)}</p>
    //           <p><b>Downtown:</b> {parseFloat(property.dist_downtown).toFixed(2)}</p>
    //           <p><b>Bustop:</b> {parseFloat(property.dist_busstop).toFixed(2)}</p>
    //           <p><b>larry uteck area: </b>{parseFloat(property.dist_larry_uteck_area).toFixed(2)}</p>
    //           <p><b>Central Halifax: </b>{parseFloat(property.dist_central_halifax).toFixed(2)} </p>
    //           <p><b>Clayton Park: </b>{parseFloat(property.dist_clayton_park).toFixed(2)} </p>
    //           <p><b>rockingham:</b> {parseFloat(property.dist_rockingham).toFixed(2)}</p>
    //           {/* <button onClick={() => openModal(property)}>View Details</button>
    //           <Modal isOpen={isModalOpen} closeModal={closeModal()}>
    //             <h2>{selectedProperty?.listing_name}</h2>
    //           </Modal> */}
    //         </div>
    //         <div style={styles.propertyInfo}>
    //           <h2>{property.listing_name}</h2>
    //           <p><b>Address:</b> {property.address}</p>
    //           <p><b>Bedrooms: </b>{property.bedroom_count}</p>
    //           <p><b>Bathrooms:</b> {property.bathroom_count}</p>
    //           <p>
    //           <b>Monthly Rent: </b>{property.monthly_rent !== -1 ? `$${property.monthly_rent}` : 'N/A'}
    //           </p>
    //           <p><b>parking availability: </b>{property.parking_availability}</p>
    //           <p><b>source: </b><a target='_blank' href={property.source}><u>{property.source}</u></a></p>
    //           <p><b>website:</b> <a target='_blank' href={property.website}><u>{property.website}</u></a></p>
    //           <p><b>description:</b> {property.description ? <ExpandableText text={property.description} /> : null }  </p>
    //           <p style={rentInfoStyle}>
    //             <b>Predicted Rent:</b> {property.predicted_rent} $
    //             {property.rent_difference != null ? 
    //               parseFloat(property.rent_difference) < 0 ? 
    //               <img src={uparrow} alt="Up" height="15" width="15"/> : 
    //               <img src={downarrow} alt="Down" height="15" width="15"/>
    //               : null
    //             }
    //           </p>
              
              

    //           {/* Add more details as needed */}
    //         </div>
    //         <button style={styles.editButton} onClick={() => {

    //         }}>
    //           {/* <EditIcon style={styles.editIcon} /> */}
    //           <img src={editicon} alt="Property" height={50} width={50} />
    //         </button>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div style={styles.container}>
    <div style={styles.cardsContainer}>
    {/* {selectedProperty && (
          <EditPropertyModal
            isOpen={isModalOpen}
            onClose={closeModal}
            property={selectedProperty}
            onSave={savePropertyChanges}
          />
        )} */}

{isModalOpen && <EditPropertyModal isOpen={isModalOpen} onClose={closeModal} property={selectedProperty} onSave={savePropertyChanges}/>}
            {isDetailModalOpen && <DetailPropertyModal isOpen={isDetailModalOpen} onClose={closeDetailModal} property={selectedProperty} />}

      {propertyData2.map((property, index) => (
        <div key={index} style={styles.propertyCard}>
          <div style={styles.cardContent}>
            <div style={styles.imageContainer}>
              <img src={property.image} alt="Property" style={styles.propertyImage} />
             
  
                   <p style={rentInfoStyle}>
                 <b>Predicted Rent:</b> {property.predicted_rent} $
                 
                 {property.rent_difference != null ? 
                    parseFloat(property.rent_difference) < 0 ? 
                    <img src={uparrow} alt="Up" height="15" width="15"/> : 
                    <img src={downarrow} alt="Down" height="15" width="15"/>
                    : null
                  }
                </p>
              <p><b>Monthly Rent: </b>{property.monthly_rent !== -1 ? `$${property.monthly_rent}` : 'N/A'}</p>
               <p><b>source: </b><a target='_blank' href={property.source}><u>{property.source}</u></a></p>
               <p><b>website:</b> <a target='_blank' href={property.website}><u>{property.website}</u></a></p>
              
               {/* <p><b>description:</b> {property.description ? <ExpandableText text={property.description} /> : null }  </p> */}
            </div>
            <div style={styles.propertyInfo}>
              <h2>{property.listing_name}</h2>
              <p><b>Address:</b> {property.address}</p>
               <p><b>Bedrooms: </b>{property.bedroom_count}</p>
               <p><b>Bathrooms:</b> {property.bathroom_count}</p>
              
               <p><b>parking availability: </b>{property.parking_availability}</p>
               <button type="button" onClick={() => {
                openDetailModal(property)
              }} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 15px', cursor: 'pointer', fontWeight: 'bold'}}>View More Detail</button>

           
              {/* Other details */}
            </div>
          </div>
          <img src={editicon} alt="Edit" style={styles.editIcon} onClick={() => openModal(property)} />
        </div>
      ))}
    </div>
    {/* {isModalOpen && <EditPropertyModal isOpen={isModalOpen} onClose={closeModal}>

    </EditPropertyModal>} */}
   
  </div>
  )
}

// const TeamComponent = () => {
//   return <PropertyList />;
// };

const PropertyList = () => {
  return (
    <div>
      <Header />
      <AllProList />
    </div>
  )
}

const ComparisionModule = () => {
  const [comparisionData, setComparisionData] = useState(comparisionDatavar)
  const { propertyName } = useParams()
  useEffect(() => {
    fetch(
      'http://54.196.154.157:8070/competitors/llm-comparison?property_management_name=' +
        propertyName,
    )
      .then((response) => response.json())
      .then((data) => {
        let products = []
        var imgVar = null
        if(propertyName == "Blackbay Group Inc."){
          imgVar = blackByLogo
        }else if(propertyName == "FACADE investments - NAhas"){
          imgVar = tedLogo
        }else{
          imgVar = 'https://cdngeneralcf.rentcafe.com/dmslivecafe/3/480429/FortGeorgeExterior.jpg?&quality=85'
        }

        if (data) {
          products = [
            {
              name: 'Southwest Property',
              imageUrl:
              southwestlogo,
              features: data.southwest,
            },
            {
              name: "Competitor's Property",
              imageUrl: imgVar,
              features: data.competitor,
            },
          ]
          setComparisionData(products)
        }
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  function ProductHeader({ product }) {
    return (
      <div style={productHeaderStyle}>
        <img src={product.imageUrl} alt={product.name} style={productImageStyle} />
        <h2 style={productNameStyle}>{product.name}</h2>
      </div>
    )
  }
  function ProductFeatureRow({ featureName, products }) {
    return (
      <div style={featureRowStyle}>
        <div style={featureNameStyle}>Features</div> {/* Static 'Features' column header */}
        {products.map((product) => (
          <div key={product.name} style={featureValueStyle}>
            <ul>
              {Object.entries(product.features).map(([feature, value]) => (
                <li key={feature}>
                  {' '}
                  <TypewriterForLI text={`${feature}: ${value}`} delay={100} />{' '}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  const FeatureListWithAnimation = ({ features, delay }) => {
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)

    // When the text for a feature completes, move to the next feature
    const handleAnimationComplete = () => {
      setCurrentFeatureIndex((index) => (index + 1) % features.length)
    }

    useEffect(() => {
      const timer = setTimeout(
        handleAnimationComplete,
        features[currentFeatureIndex].length * delay + 1000,
      )
      return () => clearTimeout(timer)
    }, [currentFeatureIndex, features, delay])

    return (
      <ul>
        {features.slice(0, currentFeatureIndex + 1).map((feature, index) => (
          <li key={index}>
            <Typewriter text={feature} delay={delay} />
          </li>
        ))}
      </ul>
    )
  }

  function ComparisonTable({ products }) {
    const featureNames = [...new Set(products.flatMap((product) => Object.keys(product.features)))]

    return (
      <div style={comparisonTableStyle}>
        <div style={productHeadersStyle}>
          {products.map((product) => (
            <ProductHeader key={product.name} product={product} />
          ))}
        </div>

        <div style={featureRowStyle}>
          {products.map((product) => (
            <div key={product.name} style={featureValueStyle}>
              <FeatureListWithAnimation
                features={Object.entries(product.features).map(
                  ([key, value]) => `- ${value}`,
                )}
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
    )
  }

  const productHeadersStyle = {
    display: 'flex',
    justifyContent: 'space-evenly', // Ensure even spacing
    alignItems: 'center',
    textAlign: 'center',
    width: '100%', // Use the full width of the container
  }

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
  }

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
  }

  const productImageStyle = {
    width: '120px', // Adjusted image size for better visibility
    height: 'auto',
    borderRadius: '4px', // Rounded corners for images
    marginBottom: '10px', // Space between the image and the product name
  }

  const productNameStyle = {
    fontWeight: 'bold', // Bold product names for better readability
    color: '#333', // Darker text for better readability
    textAlign: 'center', // Ensure the product name is centered
  }

  const featureRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 0',
    width: '100%', // Ensure the row uses the full width for consistent alignment
  }

  const featureNameStyle = {
    flex: 1,
    textAlign: 'center', // Center-aligned feature names
    fontWeight: '500', // Medium font weight for feature names
    color: '#444',
  }

  const featureValueStyle = {
    flex: 1,
    textAlign: 'left', // Center-aligned feature values
    color: '#666', // Slightly lighter text color for values
  }

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        <ComparisonTable products={comparisionData} />
      </div>
    </div>
  )
}

const AllProList = () => {
  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
        <Tabs style={{ width: '100%' }}>
          <TabList>
            <Tab>Listings</Tab>
            <Tab>Comparision</Tab>
          </TabList>

          <TabPanel>
            <PropertyListView />
          </TabPanel>
          <TabPanel>
            <ComparisionModule />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

const Header = () => {
  const { propertyName } = useParams()

  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px', textAlign: 'center' }}>
        Property List of {propertyName}
      </h1>
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
export default PropertyList
