import MotionHoc from './MotionHoc'
import React, { useState, useEffect } from 'react'
import PropetyDetailPage from './PropetyDetailPage'
import { Link } from 'react-router-dom' // Import Link from react-router-dom
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import Typewriter from '../componant/Typewriter'
import Loader_bar from 'src/src_map/components/Loader_bar'
import Modal from 'src/src_map/components/Modal'
import dbimg from '../assets/database.png'

const CompetitorData = []
const PublicData = []
const SouthwestData = []

const AllListCom = () => {
  // const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  // const [data, setData] = useState([]);  // State to hold the fetched data
  // const [loading, setLoading] = useState(false);  // State to manage loading status

  const [data, setData] = useState([]); // State to hold the fetched data
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [editMode, setEditMode] = useState(false);  // Manage global edit mode
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [viewMode, setViewMode] = useState('listings');
  const [desc, setdesc] = useState(null)
  const [showTooltip, setShowTooltip] = useState(true);

  // Function to simulate progress
  const simulateProgress = () => {
    let interval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment progress by a small amount every half second
        return Math.min(oldProgress + (100 / 60), 100);  // Increase over 30 seconds
      });
    }, 500);
  };

  const fetchData = async () => {
    setLoading(true);
    simulateProgress();

    setTimeout(async () => {  // Introduce a delay before fetching the data
      try {
        const response = await fetch('http://54.196.154.157:8070/scraper/competitor-listing?competitor_name=Blackbay%20Group%20Inc.');
        const jsonData = await response.json();
        const formattedData = jsonData.map(item => ({ ...item, isEditing: false }));
        setData(formattedData);

        
        // setData(jsonData);  // Set the fetched data into state
        setLoading(false);
        setProgress(100);  // Ensure progress bar reaches 100%
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
        setProgress(100);  // Ensure progress bar reaches 100%
      }
    }, 20000);  // Wait for 30 seconds before executing the fetch
  };

  const fetchModelList = async () => {

  }
  const fetchDesc = async () => {
    setLoading(true);
    simulateProgress();

    setTimeout(async () => {  // Introduce a delay before fetching the data
      try {
        const response = await fetch('http://54.196.154.157:8070/scraper/competitor-listing?competitor_name=Blackbay%20Group%20Inc.');
        const jsonData = await response.json();
        const formattedData = jsonData.map(item => ({ ...item, isEditing: false }));
        // setData(formattedData);
        setdesc("Fully restored character building located on Brunswick Street is just a short distance from downtown Halifax, the Hydrostone Market, and the Halifax Commons. These suites feature granite countertops, hardwood throughout, stainless steel appliances, and high ceilings with lots of natural light. Water and heat are included, tenant is responsible for power. All new energy-efficient appliances, new windows, and spray insulation. Make this stunning location your new home today!")
        // setData(jsonData);  // Set the fetched data into state
        setLoading(false);
        setProgress(100);  // Ensure progress bar reaches 100%
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
        setProgress(100);  // Ensure progress bar reaches 100%
      }
    }, 20000);  // Wait for 30 seconds before executing the fetch
  };


  useEffect(() => {
    // fetchData();  // Fetch data when component mounts
  }, []);

  // Function to fetch data from the API
  // const fetchData = async () => {
  //   setLoading(true);  // Set loading to true while fetching data

  //   try {
  //     const response = await fetch('http://54.196.154.157:8070/scraper/competitor-listing?competitor_name=Blackbay%20Group%20Inc.');
  //     const jsonData = await response.json();
  //     setData(jsonData);  // Set fetched data into state
  //     setLoading(false);  // Set loading to false after data is fetched
  //     setLoadingComplete(true)
  //   } catch (error) {
  //     console.error('Failed to fetch data:', error);
  //     setLoading(false);  // Ensure loading is false on error
  //   }
  // };

  const startLoading = () => {
    let timeElapsed = 0;
    const interval = setInterval(() => {
      timeElapsed += 1000; // update every second
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 3.33;
        if (newProgress >= 100) {
          clearInterval(interval);
          setLoadingComplete(true); // Set loading completion to true when progress is 100
          return 100;
        }
        return newProgress; // increment by 3.33% every second
      });
    }, 1000);
  };

  const handleEdit = (index) => {
    const newData = [...data];
    newData[index].isEditing = true;
    setData(newData);
  };

  // Handle change on input fields
  const handleChange = (value, index, field) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const handleViewChange = (event) => {
    setViewMode(event.target.value);
    // fetchData();
  };


  // Save the edited item
  const handleSave = (index) => {
    const newData = [...data];
    newData[index].isEditing = false;
    setData(newData);
    // Optionally send update to server here
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleEditChange = (id, field, value) => {
    const newData = data.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData(newData);
  };

  
  const loadIntoDB = () => {
    // Simulate loading data into database
    console.log("Data loaded into DB");
    setShowModal(true); // Show success modal
    // setTimeout(() => setShowModal(false), 3000); // Hide modal after 3 seconds
  };
  
  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center align the items vertically
      justifyContent: 'center', // Center align the items horizontally
    }
  };
  const SuccessModal = () => (
  
      <Modal isOpen={showModal} onClose={()=>{
        setShowModal(false)
      }} style={modalStyle} >
        <img src={dbimg} height={100} width={100} style={{textAlign:'center', marginLeft:'440px',}}/>
        <h2 style={{textAlign:'center'}}>New Data Loaded Successfully ! </h2>
        <p style={{textAlign:'center'}}>Your changes have been saved to the database. Switch to the <b>"ML models"</b> tab to retrain model.</p>
        {/* <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px', marginTop: '10px', cursor: 'pointer',marginLeft:'440px' }}>
          OK
        </button> */}

        <button onClick={() => {
          setShowModal(false)
          setdesc(null)
          setData([])
          setProgress(0)
        }}  style={{ margin: '10px', marginLeft:'440px', padding: '10px 20px', backgroundColor: 'green', color: 'white', cursor: 'pointer', borderRadius: '5px' }}>
          OK
        </button>
    
      </Modal>
    // )
  );

  


  const MLModelsTab = ({ setShowModal, setModalContent }) => {
    const [modelVersions, setModelVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModalML, setshowModalML] = useState(false);

    useEffect(() => {
        const fetchModelVersions = async () => {
            try {
                const response = await fetch('http://54.196.154.157:8070/model-versions');
                const data = await response.json();
                setModelVersions(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch model versions:', error);
                setError('Failed to load data');
                setLoading(false);
            }
        };

        fetchModelVersions();
    }, []);

    const ModalAlert = () => {
      const [message, setMessage] = useState("Are you sure you wanna deploy this model?");
    
      const handleDeployConfirmation = () => {
        // Simulate deployment action
        setMessage("Model is deploying in background! ");
    
        setTimeout(() => {
          setshowModalML(false); // Automatically close the modal after 3 seconds
        }, 5000);
      };
    
      return (
        <Modal isOpen={true} onClose={() => setshowModalML(false)} style={modalStyle}>
          <h2 style={{textAlign: 'center'}}>{message}</h2>
          {message === "Are you sure you wanna deploy this model?" && (
            <>
              <button onClick={handleDeployConfirmation} style={styles2.yesButton}>
                Yes
              </button>
              <button onClick={() => setshowModalML(false)} style={styles2.noButton}>
                No
              </button>
            </>
          )}
        </Modal>
      );
    };
    
    const styles2 = {
      yesButton: {
        float: 'right', 
        margin: '10px', 
        padding: '10px 20px', 
        backgroundColor: 'green', 
        color: 'white', 
        cursor: 'pointer', 
        borderRadius: '5px'
      },
      noButton: {
        float: 'right', 
        margin: '10px', 
        padding: '10px 20px', 
        backgroundColor: 'red', 
        color: 'white', 
        cursor: 'pointer', 
        borderRadius: '5px'
      }
    };

    const handleDeploy = (modelVersion) => {
        const confirmDeploy = () => {
            console.log(`Deploying model version ${modelVersion}...`);
            // Add actual deployment logic here
            setShowModal(false); // Close modal after action
        };

        // Set the modal content for deployment confirmation
        setModalContent({
            title: "Confirm Deployment",
            message: `Are you sure you want to deploy model version ${modelVersion}?`,
            onConfirm: confirmDeploy
        });
        setShowModal(true);
    };

    if (loading) return <p>Loading model versions...</p>;
    if (error) return <p>Error loading data: {error}</p>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', color: '#333', fontSize: '18px' }}>ML Model List</h2>
            {showModalML && <ModalAlert />}
            <button onClick={() => setshowModalML(true)} style={{ float:'right', margin: '5px', padding: '5px 10px', backgroundColor: 'Orange', color: 'white', cursor: 'pointer', borderRadius: '5px'}}>
                                    Retrain
                                </button>
                                <button onClick={() => setshowModalML(true)} style={{ float:'right', margin: '5px', padding: '5px 10px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', borderRadius: '5px'}}>
                                    Refresh Predition
                                </button>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Model Number</th>
                        <th style={styles.tableHeader}>Model Version</th>
                        <th style={styles.tableHeader}>R2 Score</th>
                        <th style={styles.tableHeader}>Load Datetime</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {modelVersions.map((model) => (
                        <tr key={model.id}>
                            <td style={styles.tableCell}>{model.model_number}</td>
                            <td style={styles.tableCell}>{model.model_version}</td>
                            <td style={styles.tableCell}>{model.r2_score}</td>
                            <td style={styles.tableCell}>{new Date(model.loaddatetime).toLocaleString()}</td>
                            <td style={styles.tableCell}>
                           
                            <button onClick={() => setshowModalML(true)} style={{  margin: '5px', padding: '5px 10px', backgroundColor: 'green', color: 'white', cursor: 'pointer', borderRadius: '5px'}}>
                                    Deploy
                                </button>
                                

                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

  const DescriptionBox = () => (
    <div style={styles.descriptionBox}>
      <textarea
        style={styles.textArea}
        placeholder="Enter details about the company here..."
        rows="4"
        // title='jjjjjjjj'
        value={desc}
      />
    </div>
  );

  function loadDescView(){
    if(desc != null){
      return(
        <>
        <button onClick={loadIntoDB} style={{ float: 'right', margin: '10px', padding: '10px 20px', backgroundColor: 'green', color: 'white', cursor: 'pointer', borderRadius: '5px' }}>
             Save Changes
           </button>
        
          <DescriptionBox />
          {showModal && <SuccessModal />}
          </>
      )
    }else{
      return(
        <div style={{...styles.progressBarContainer, width: `${progress}%`, backgroundColor: progress === 100 ? 'green' : 'green', borderRadius: 10}}></div>
      )
    }
    
  }
  function loadButton(){
    if(data.length > 0){
      return(
        editMode ? 
          <button onClick={loadIntoDB} style={{ float: 'right', margin: '10px', padding: '10px 20px', backgroundColor: 'green', color: 'white', cursor: 'pointer', borderRadius: '5px' }}>
            Save Changes
          </button>
          : 
          <button onClick={toggleEditMode} style={{ float: 'right', margin: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', borderRadius: '5px' }}>
            Edit Records
          </button>
      )
    }
  }
  function loadTableView(){
    if(!loading){
    return(
      <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
       {/* <button onClick={toggleEditMode} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: editMode ? 'green' : '#007bff' , color: 'white', border: 'none', borderRadius: '4px' }}>
         {editMode ? "Load into DB" : "Edit records"}
       </button> */}
        {/* {data.length>0 ?
        
        <button onClick={toggleEditMode} style={{ float: 'right', margin: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', borderRadius: '5px' }}>
           {editMode ? "Load into DB" : "Edit Records"}
         </button>
       : null} */}
      {loadButton()}
       {showModal && <SuccessModal />}

       </div>
     {/* <button onClick={toggleEditMode} style={[styles.button,{alignSelf:''}]} >{editMode ? "Save Changes" : "Edit All"}</button> */}
     <table style={styles.table}>
       <thead>
         <tr>
           <th style={styles.tableHeader}>Monthly Rent</th>
           <th style={styles.tableHeader}>Bedroom Count</th>
           <th style={styles.tableHeader}>Bathroom Count</th>
           <th style={styles.tableHeader}>Utility Water</th>
           <th style={styles.tableHeader}>Utility Heat</th>
           <th style={styles.tableHeader}>Utility Electricity</th>

           <th style={styles.tableHeader}>Utility Laundry</th>

           <th style={styles.tableHeader}>Utility Wifi</th>
           <th style={styles.tableHeader}>Pet Friendly</th>
           <th style={styles.tableHeader}>Parking Availability</th>
           {/* <th style={styles.tableHeader}>pet friendly</th> */}
          <th style={styles.tableHeader}>Apartment Size</th>
           {/* <th style={styles.tableHeader}>Edit</th> */}

           

         </tr>
       </thead>
       <tbody>
       {data.map(item => (
         editMode ? (
           // If item is in edit mode, show input fields
           
          <> 
           <td colSpan="13" style={{ ...styles.baseStyle, ...styles.tableCellDetail, textAlign: 'center' }}>
           {item.listing_name} - {item.building_name} - {item.property_management_name} - {item.address}
                             </td>
           <tr style={styles.tableRow}>
             <td style={styles.tableCell}>
               <input type="text" value={item.monthly_rent} onChange={(e) => handleChange(e.target.value, item.id, 'monthly_rent')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.bedroom_count} onChange={(e) => handleChange(e.target.value, item.id, 'bedroom_count')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.bathroom_count} onChange={(e) => handleChange(e.target.value, item.id, 'bathroom_count')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.utility_water} onChange={(e) => handleChange(e.target.value, item.id, 'utility_water')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.utility_heat} onChange={(e) => handleChange(e.target.value, item.id, 'utility_heat')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.utility_electricity} onChange={(e) => handleChange(e.target.value, item.id, 'utility_electricity')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.utility_laundry} onChange={(e) => handleChange(e.target.value, item.id, 'utility_laundry')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.utility_wifi} onChange={(e) => handleChange(e.target.value, item.id, 'utility_wifi')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.pet_friendly} onChange={(e) => handleChange(e.target.value, item.id, 'pet_friendly')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.parking_availability} onChange={(e) => handleChange(e.target.value, item.id, 'parking_availability')} style={styles.inputField} />
             </td>
             <td style={styles.tableCell}>
               <input type="text" value={item.apartment_size} onChange={(e) => handleChange(e.target.value, item.id, 'apartment_size')} style={styles.inputField} />
             </td>
             {/* <td style={styles.tableCell}>
               <button onClick={() => handleSave(index)} style={styles.button}>Save</button>
             </td> */}
          
           </tr>
           </>
         ) : (
           // Display mode
           <>
           <td colSpan="13" style={{ ...styles.baseStyle, ...styles.tableCellDetail, textAlign: 'center' }}>
           {item.listing_name} - {item.building_name} - {item.property_management_name} - {item.address}
                             </td>
           <tr key={item.id} style={styles.tableRow}>
             <td style={styles.tableCell}>{item.monthly_rent}</td>
             <td style={styles.tableCell}>{item.bedroom_count}</td>
             <td style={styles.tableCell}>{item.bathroom_count}</td>
             <td style={styles.tableCell}>{item.utility_water}</td>
             <td style={styles.tableCell}>{item.utility_heat}</td>
             <td style={styles.tableCell}>{item.utility_electricity}</td>
             <td style={styles.tableCell}>{item.utility_laundry}</td>
             <td style={styles.tableCell}>{item.utility_wifi}</td>
             <td style={styles.tableCell}>{item.pet_friendly}</td>
             <td style={styles.tableCell}>{item.parking_availability}</td>
             <td style={styles.tableCell}>{item.apartment_size}</td>
             {/* <td style={styles.tableCell}>{item.listing_name}</td> */}

             {/* <td style={styles.tableCell}>
               <button onClick={() => handleEdit(item.id)} style={styles.button}>Edit</button>
             </td> */}
           </tr>
           </>
         )
       ))}
       </tbody>
     
     </table>
     </>
   ) 
  }else{
    return(                
    <div style={{...styles.progressBarContainer, width: `${progress}%`, backgroundColor: progress === 100 ? 'green' : 'green', borderRadius: 10}}></div>
  )
  }
  }

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
     
        <Tabs>
          <TabList>
            <Tab>Web Scrapping</Tab>
            <Tab>ML Models</Tab>
          </TabList>

          <TabPanel>
            <div style={styles.webScrapContainer}>
              <div style={styles.inputGroup}>
      
              <input
  type="text"
  placeholder="Enter URL to scrap..."
  style={{ ...styles.inputFieldurl, opacity: viewMode === 'listings' ? 0.5 : 1, pointerEvents: viewMode === 'listings' ? 'none' : 'auto' }}
  value={viewMode === 'listings' ? 'https://blackbaygroup.ca/' : ''}
  disabled={viewMode === 'listings'}
  readOnly={viewMode === 'listings'}
  
/>
                {/* <input type="text" placeholder="Enter URL to scrap..." style={styles.inputFieldurl} /> */}
                <button onClick={() => {
                  if(viewMode == "listings"){
                    fetchData()
                  }else{
                    fetchDesc()
                  }
                  
                  }} style={styles.button}>Start Scrapping</button>
                <div style={styles.checkboxGroup}>
                <label>
                <input type="radio" name="viewMode" value="listings" checked={viewMode === 'listings'} onChange={handleViewChange} />
                Company Listings
              </label>
              <label>
                <input type="radio" name="viewMode" value="details" checked={viewMode === 'details'} onChange={handleViewChange} />
                Company Details
              </label>
                  {/* <label style={styles.labelStyle}><input type="radio" name='grp1' /> Company details</label>
                  <label style={styles.labelStyle}><input type="radio" name='grp1' checked /> Company Listings</label> */}
                </div>
              </div>
              {/* {!loading ? 
                loadTableView() :
                <div style={{...styles.progressBarContainer, width: `${progress}%`, backgroundColor: progress === 100 ? 'green' : 'green', borderRadius: 10}}></div>
              } */}
              
              {/* {loadTableView()} */}
              {viewMode == "details" ?
              
              
              loadDescView()
            
             
              : loadTableView()}
            </div>
          </TabPanel>
          <TabPanel>
            {/* Content for ML Models tab */}
            <MLModelsTab/>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '90%',
    margin: 'auto',
    padding: '20px',
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  cardsContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  webScrapContainer: {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  inputGroup: {
    display: 'flex',
    marginBottom: '20px',
    alignItems: 'center',
  },
  inputField: {
    width: '50px',
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  inputFieldurl: {
    
    flex: 1,
    marginRight: '10px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  progressBarContainer: {
    width: '100%',
    height: '10px',
    backgroundColor: '#eee',
    marginTop: '10px',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px',
  },
  labelStyle: {
    marginBottom: '5px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontWeight: '600',
    letterSpacing: '0.05em',
    padding: '15px 20px',
    border: '1px solid #ddd',
  },
  tableRow: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    padding: '15px 20px',
    border: '1px solid #ddd',
  },
  tableCellDetail: {
    padding: '15px 20px',
    backgroundColor: '#e9eff3',
    fontStyle: 'italic',
    border: '1px solid #ddd'
  },
  descriptionBox: {
    margin: '20px 0',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    width: '100%',
    height: '150px',
    border: 'none',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#333",
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    zIndex: 1, // Ensure it's above other elements
    top: "calc(100% + 5px)", // Position below the button
    left: "50%", // Position at the center of the button
    transform: "translateX(-50%)", // Center horizontally
  },
};


// const TeamComponent = () => {
//   return <PropertyList />;
// };

const WebScrapping = () => {
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
      <h1 style={{ margin: 0, fontSize: '15px', textAlign: 'center' }}>Web scrapping and ML models</h1>
    </div>
  )
}

// const styles = {
//   container: {
//     maxWidth: '90%',
//     margin: '0 auto',
//     padding: '5px',
//     marginTop: '50px',
//   },
//   heading: {
//     textAlign: 'center',
//     marginBottom: '10px',
//     fontSize: '24px',
//   },
//   header: {
//     backgroundColor: '#ffffff',
//     padding: '10px',
//     boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
//     position: 'sticky',
//     top: 0,
//     zIndex: 1000,
//     borderRadius: '0 0 25px 25px',
//   },
//   cardsContainer: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   propertyCard: {
//     flexBasis: 'calc(50% - 20px)', // Adjust the width of each card as per your requirement
//     maxWidth: 'calc(50% - 20px)', // Set maximum width to prevent overflow
//     border: '1px solid #ccc',
//     borderRadius: '5px',
//     padding: '15px',
//     marginBottom: '20px',
//     backgroundColor: '#f9f9f9',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     boxSizing: 'border-box',
//     display: 'flex', // Make the card flex container
//   },
//   imageContainer: {
//     marginRight: '20px', // Add some space between the image and text
//   },
//   propertyImage: {
//     width: '150px', // Adjust the width as needed
//     height: 'auto', // Maintain aspect ratio
//     borderRadius: '5px', // Rounded corners
//   },
//   propertyInfo: {
//     flex: 1, // Allow the property info to take up remaining space
//   },
// }
export default WebScrapping
