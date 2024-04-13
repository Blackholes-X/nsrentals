import React, { Component } from 'react'
import InputRange from 'react-input-range'
import photo1 from '../icon-apartment.png'
// import { color } from 'framer-motion'
import propertyIcon from '../icon-apartment.png'
import Vimy from '../vimy.jpg'

// import 
import Loader from 'src/src_home/components/Loader'
class Sreach extends Component {
  state = {
    firstPropertySelected: false,
    secondPropertySelected: false,
    propertyName: null,
    propertyName2: null,
    showModal: false,
    loading: true, 
    suggestionData: [],
    activeProperty: null,
    // setsecondPropertyType={this.setsecondPropertyType}
    // handlepropertyId2={this.handlepropertyId2}
  }

  handleMouseEnter = (property) => {
    setActiveProperty(property)
    this.setState({ activeProperty: property });
  }

  handleMouseLeave = () => {
    this.setState({ activeProperty: null });
  }

  renderPopup = () => {
    const { activeProperty } = this.state;
    if (!activeProperty) return null;

    const { title, images, typeName, rooms, area, rent, deposit, excerpt } = activeProperty;
    return (
      <div className="popup">
        <div className="sc-card sc-borderless">
          <div className="sc-card-header">
            <h5>{title}</h5>
          </div>
          <div className="sc-card-body">
            {/* <img src={images[0].thumbnail} alt={title} /> */}
            <table className="sc-table">
              <tbody>
                <tr><td>Type</td><td>Hello</td></tr>
                <tr><td>Rooms</td><td>-1</td></tr>
                <tr><td>Area</td><td>area</td></tr>
                <tr><td>Rent</td><td>$ 10</td></tr>
                <tr><td>Deposit</td><td>$ 15</td></tr>
              </tbody>
            </table>
          </div>
          <div className="sc-card-footer">excerpt</div>
        </div>
      </div>
    );
  }

  callApi = () => {
    this.setState({ loading: true }); // Start loading
  
    // Fetch data from API
    fetch(`http://54.196.154.157:8070/map/competitor/compare?property_id=2`)
      .then((response) => response.json())
      .then((data) => {
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log(JSON.stringify(data))

        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")

        // Process your data here
        this.setState({
          // Update state with the fetched data
          loading: false, // Stop loading
          suggestionData: data
        });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false }); // Stop loading even if there is an error
      });
  }

  loaderStyles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    loader: {
      border: '16px solid #f3f3f3',
      borderTop: '16px solid #3498db',
      borderRadius: '50%',
      width: '120px',
      height: '120px',
      animation: 'spin 2s linear infinite',
    },
  }

  // Loader = ({ styles }) => (
  //   <div style={styles.container}>
  //     <div style={styles.loader}></div>
  //   </div>
  // );

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal })
  }

  handleFirstProperty = () => {
    // Correctly access firstPropertySelected from state
    this.setState({ firstPropertySelected: !this.state.firstPropertySelected })
  }

  handleSecondProperty = () => {
    // Correctly access secondPropertySelected from state
    this.setState({ secondPropertySelected: !this.state.secondPropertySelected })
  }

  handlePropertyName = (propertyName) => {
    this.setState({ propertyName: propertyName })
  }
  handlePropertyName2 = (propertyName2) => {
    this.setState({ propertyName2: propertyName2 })
  }

  handlepropertyId2 = (id) => {
    // this.setState({ id2: id })
  }

  setsecondPropertyType = (secondPropertyType) => {
    // this.setState({secondPropertyType: secondPropertyType})
  }


 
  
  render() {
    let {
      types,
      rooms,
      areas,
      dataFilter,
      rents,
      deposits,
      slideOpen,
      onChangeSlide,
      onChangeType,
      onChangeRoom,
      onChangeDataFilter,
      onChangeArea,
      onChangeRent,
      onChangeDeposit,
      onChangeTour,
      getPlacesCount,
      disableTour,
      firstPropertySelected,
      secondPropertySelected,
      propertyName,
      propertyName2,
      handlePropertyName,
      handlePropertyName2,
      toggleModal,
      propertySuggestionData,
      setActiveProperty,
      setcloseActiveProperty,
      setsecondPropertyType,
      handlepropertyId2
    } = this.props
    console.log("^^^^^^^^^^^^^^^^^^^^^^^11111111111111111111")
    console.log(JSON.stringify(propertySuggestionData))
    console.log("^^^^^^^^^^^^^^^^^^^^^^^11111111111111111111")

    
  const handleMouseEnter = (property) => {
    setActiveProperty(property)
    this.setState({ activeProperty: property });
    
  }

  const handleMouseLeave = () => {
    setcloseActiveProperty()
    this.setState({ activeProperty: null });
  }

    const loadSuggestionView = (suggestionData) => {
      const fileUploadSelectedLabelStyle = {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 15px',
        border: '2px solid green',
        borderRadius: '5px',
        color: '#555',
        transition: 'background-color 0.3s ease',
        width: '95%',
        height: '100px',
        marginBottom: '20px',
        ':hover': {
          backgroundColor: '#f0f0f0',
        },
      };
    
      const imageStyle = {
        width: '80px', // Set a fixed width for the image
        height: '80px', // Set a fixed height to align with the text
        marginRight: '20px', // Add space between the image and the text
        borderRadius: '5px', // Optionally, round the corners
      };
    
      const contentStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexGrow: 1, // Take up remaining space
      };
    
      console.log("Suggestion Data:::::::::::::::::::::::::::::", JSON.stringify(suggestionData));
    
      const handleImageError = (e) => {
        e.target.src = Vimy; // Set the source to your dummy image
      };
      if (suggestionData.length > 0) {
        return (
          <div>
            <header>
              <h5>Suggested Properties</h5>
            </header>
            {suggestionData.map((property, index) => (
              // console.log("")
              <div key={index}
              onClick={()=>{
                // this.handlePropertyName2
                handlePropertyName2(property.listing_name)
                // handlepropertyName2(property.listing_name)
                setsecondPropertyType("competitor")
                handlepropertyId2(property.id)
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@")
              }}
              onMouseEnter={() => {
                setActiveProperty(property)
                handleMouseEnter(property)
              }}
              onMouseLeave={handleMouseLeave}
              >
                <label htmlFor={`file-upload-${property.id}`} style={fileUploadSelectedLabelStyle}>
                  {/* <img src={property.property_image || dummyImg} alt={property.listing_name} style={imageStyle} /> */}
                  <img 
        src={property.property_image || Vimy} 
        alt={property.listing_name} 
        style={imageStyle} 
        onError={handleImageError} // Set the onError handler
      />
                  <div style={contentStyle}>
                    <div>{property.address}</div>
                    <p style={{ color: 'red', marginTop: '10px', cursor: 'pointer' }} onClick={() => this.handlePropertyName2(property.listing_name)}>
                      <b><u>Click to compare</u></b>
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        );
      } else {
        return <div>No suggestions available.</div>; // Placeholder for no data
      }
    }
    const fileUploadLabelStyle = {
      cursor: 'pointer',
      display: 'inline-block',
      padding: '10px 15px',
      border: '2px solid #ddd',
      borderRadius: '5px', // Making it square
      color: '#555',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#f0f0f0',
      },
      i: {
        marginRight: '5px',
      },
      width: '95%', // Set width to match height
      height: '100px', // Set height
      textAlign: 'center',
      lineHeight: '100px', // Center content vertically
    }

    const fileUploadSelectedLabelStyle = {
      cursor: 'pointer',
      display: 'inline-block',
      padding: '10px 15px',
      border: '2px solid green',
      borderRadius: '5px', // Making it square
      color: '#555',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#f0f0f0',
      },
      i: {
        marginRight: '5px',
      },
      width: '95%', // Set width to match height
      height: '100px', // Set height
      textAlign: 'center',
      lineHeight: '100px', // Center content vertically
    }

    // const fileUploadInputStyle = {
    //   display: 'none',
    // }

   
    
    return (
      <React.Fragment>
        <header className="sc-slide-header">
          <h5>Comparision</h5>

          <i
            className="sc-icon-menu sc-slide-toggle"
            onClick={() => {
              onChangeSlide(!slideOpen)
            }}
          ></i>
        </header>

        <div className="sc-slide-body">
          <form className="sc-form">
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Applying inline style */}
              <h6>Select Southwest property</h6>
              <label
                htmlFor="file-upload"
                style={firstPropertySelected ? fileUploadSelectedLabelStyle : fileUploadLabelStyle}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <i className="fas fa-cloud-upload-alt" style={{ marginBottom: '5px' }}></i>
                  <img src={photo1} alt="client" />
                  {propertyName != null ? propertyName : 'First Property'}
                  {propertyName != null ? (
                    <p
                      onClick={() => {
                        console.log('sssssss')
                        handlePropertyName(null)
                        // this.setState({ propertyName: null})
                      }}
                      style={{ color: 'red' }}
                    >
                      <b>
                        <u>Remove</u>
                      </b>
                    </p>
                  ) : null}
                </div>
              </label>
            </div>

            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Applying inline style */}
              
              <h6>Select any other property</h6>
              <label
                htmlFor="file-upload"
                style={secondPropertySelected ? fileUploadSelectedLabelStyle : fileUploadLabelStyle}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <i className="fas fa-cloud-upload-alt" style={{ marginBottom: '5px' }}></i>
                  <img src={photo1} alt="client" />
                  {propertyName2 != null ? propertyName2 : 'Second Property'}

                  {propertyName2 != null ? (
                    <p
                      style={{ color: 'red' }}
                      onClick={() => {
                        console.log('wwww')
                        handlePropertyName2(null)

                        // this.setState({ propertyName2: null})
                      }}
                    >
                      <b>
                        <u>Remove</u>
                      </b>
                    </p>
                  ) : null}
                </div>
              </label>
            </div>
            {propertyName != null && propertyName2 != null ? (
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <p
                  onClick={() => {
                    // handlePropertyName(null)

                    // console.log("dddddddddd")
                    toggleModal()
                    //  console.log("Button Clicked!"); // Define your button click handler function
                  }}
                  style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Compare
                </p>
              </div>
            ) : null}

            {propertyName != null ? 
              loadSuggestionView(propertySuggestionData)
              : null }
           
           {this.state.loading && <Loader styles={this.loaderStyles} />}

            <header className="sc-slide-header">
              <h5>Filters</h5>
            </header>

            <h6>Data filter</h6>

            <div className="sc-form-group sc-grid-2">
              {dataFilter.map((dataFilter, index) => {
                return (
                  <div className="sc-form-radio" key={index}>
                    <input
                      type="radio"
                      name="dataFilter"
                      id={dataFilter.slug}
                      data-datafilter={dataFilter.slug}
                      checked={dataFilter.checked}
                      onChange={(event) => {
                        onChangeDataFilter(event)
                      }}
                    />

                    <label htmlFor={dataFilter.slug}>
                      <i className="sc-icon-radio"></i>

                      <span>{dataFilter.name}</span>
                    </label>
                  </div>
                )
              })}
            </div>

            <h6>Type</h6>

            <div className="sc-form-group sc-grid-2">
              {types.map((type, index) => {
                return (
                  <div className="sc-form-checkbox" key={index}>
                    <input
                      type="checkbox"
                      name="types"
                      id={type.slug}
                      data-type={type.slug}
                      checked={type.checked}
                      onChange={(event) => {
                        onChangeType(event)
                      }}
                    />

                    <label htmlFor={type.slug}>
                      <i className="sc-icon-checkbox"></i>

                      <span>{type.name}</span>
                    </label>
                  </div>
                )
              })}
            </div>

            <h6>Rooms</h6>

            <div className="sc-form-group sc-grid-2">
              {rooms.map((room, index) => {
                return (
                  <div className="sc-form-radio" key={index}>
                    <input
                      type="radio"
                      name="rooms"
                      id={room.slug}
                      data-room={room.slug}
                      checked={room.checked}
                      onChange={(event) => {
                        onChangeRoom(event)
                      }}
                    />

                    <label htmlFor={room.slug}>
                      <i className="sc-icon-radio"></i>

                      <span>{room.name}</span>
                    </label>
                  </div>
                )
              })}
            </div>

            <h6>Area</h6>

            <div className="sc-form-group sc-grid-1">
              <InputRange
                maxValue={200}
                minValue={20}
                step={5}
                value={{ min: areas.from, max: areas.to }}
                onChange={(value) => {
                  onChangeArea(value)
                }}
              />
            </div>

            <h6>Rent</h6>

            <div className="sc-form-group sc-grid-1">
              <InputRange
                maxValue={50000}
                minValue={3000}
                step={1000}
                value={{ min: rents.from, max: rents.to }}
                onChange={(value) => {
                  onChangeRent(value)
                }}
              />
            </div>

            <h6>Deposit</h6>

            <div className="sc-form-group sc-grid-1">
              <InputRange
                maxValue={200000}
                minValue={10000}
                step={1000}
                value={{ min: deposits.from, max: deposits.to }}
                onChange={(value) => {
                  onChangeDeposit(value)
                }}
              />
            </div>
          </form>
        </div>

        <footer className="sc-slide-footer">
          <h6>{getPlacesCount()} results found.</h6>

          <div className="sc-form-group sc-grid-1">
            <div className="sc-form-button sc-stretched">
              <button
                disabled={disableTour}
                onClick={() => {
                  onChangeTour('start-tour')
                }}
              >
                <i className="sc-icon-route"></i>

                <span>Tour through the results</span>
              </button>
            </div>
          </div>
        </footer>
      </React.Fragment>
    )
  }
}

export default Sreach
