import React, { Component, useState, useEffect } from 'react'
import './app.css'
import Mapcraft from 'mapcraft'
import Search from './search'
import Tour from './tour'
import Page from './page'
import im1 from '../icon-apartment.png'
import public_building from '../public_building.png'
import competitor from '../competitor.png'
import southwesticon from '../southwesticon.png'
import parking from '../parking.png'

import Modal from './Modal'
import Typewriter from 'src/src_side/componant/Typewriter'
import TypewriterForLI from 'src/src_side/componant/TypewriterForLI'
// import bl
import blackByLogo from '../../src_side/assets/blackByLogo.png'
import tedLogo from '../../src_side/assets/tedLogo.png'
import southwestlogo from '../../src_side/assets/southwestlogo.png'
import PropertyDialogComponent from './PropertyDialogComponent'
import { auto } from '@popperjs/core'
import Loader_cmparison from './Loader_cmparison'
const comparisionDatavar = []

const ComparisionModule = ({ property1, property2, id1, id2, propertyType }) => {
  const [comparisionData, setComparisionData] = useState(comparisionDatavar)
  const [loading, setloading] = useState(false)
  useEffect(() => {
    var competitor_id = 0
    var southwest_id = id1
    var public_id = 0
    if(propertyType == "public"){
      public_id= id2
    }
    if(propertyType == "competitor"){
      competitor_id = id2
    }

    var url ='http://54.196.154.157:8070/map/competitor/compare-properties?competitor_id='+competitor_id+'&southwest_id='+id1+'&public_id='+public_id
    console.log("first pro"+property1)
    console.log("propertyType-------"+property2)
    console.log(url)
    setloading(true)
    fetch(
      url,
    )
      .then((response) => response.json())
      .then((data) => {
        let products = []

        console.log("***********************************")
        console.log(JSON.stringify(data))
        console.log("***********************************")

        console.log(JSON.stringify(data.sw_property_details))
        console.log("----------------------------------888888888888888888")

        if (data) {
          const entries = Object.entries(data);

          // Now entries is an array of [key, value] pairs
          // For example: [['Southwest Property', [...]], ['FACADE investments - NAhas', [...]]]
    
          const products = entries.map((entry, index) => ({
            name: entry[0],  // The key as name
            imageUrl: index === 0 ? southwestlogo : 'https://cdngeneralcf.rentcafe.com/dmslivecafe/3/480429/FortGeorgeExterior.jpg?&quality=85',
            features: entry[1],  // The value array as features
          }));

          // products = [
          //   {
          //     name: 'Southwest Property',
          //     imageUrl:southwestlogo,
          //     features: data.sw_property_details,
          //   },
          //   {
          //     name: "Competitor's Property",
          //     imageUrl:
          //       'https://cdngeneralcf.rentcafe.com/dmslivecafe/3/480429/FortGeorgeExterior.jpg?&quality=85',
          //     features: data.sw_property_details,
          //   },
          // ]
          console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=")
          console.log(JSON.stringify(products))
          console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=")
          setloading(false)
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

  function loadView(){
    return(
      <div style={comparisonTableStyle}>
        <Loader_cmparison/>
      </div>
    )
  }
  function ComparisonTable({ products }) {
    const featureNames = [...new Set(products.flatMap((product) => Object.keys(product.features)))]

    // if(loading){

    // }else{
      
    // }
    return (
      <div style={comparisonTableStyle}>
        <div style={productHeadersStyle}>
          {products.map((product) => (
            <ProductHeader key={product.name} product={product} />
          ))}
        </div>
          {loading ? <Loader_cmparison/> : null}
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
        <p
          style={{
            alignContent: 'center',
            alignSelf: 'center',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <b>
            Comparision between {property1} - {property2}
          </b>
        </p>


        {/* {true ? (
      <Loader_cmparison />
    ) : (
      <ComparisonTable products={comparisionData} />
    )} */}
        <ComparisonTable products={comparisionData} />
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    types: [
      { slug: 'house', name: 'House', checked: true },
      { slug: 'apartment', name: 'Apartment', checked: true },
      { slug: 'shared', name: 'Shared', checked: true },
      { slug: 'dorm', name: 'Dorm', checked: true },
    ],
    rooms: [
      { slug: 'one', name: 'One', checked: false },
      { slug: 'two', name: 'Two', checked: false },
      { slug: 'more', name: 'More', checked: false },
      { slug: 'any', name: 'Any', checked: true },
    ],
    dataFilter: [
      { slug: 'southwest', name: 'southwest', checked: true },
      { slug: 'public', name: 'public', checked: false },
      { slug: 'competitor', name: 'competitor', checked: false },
      { slug: 'parking', name: 'parking', checked: false },
    ],
    areas: {
      from: 30,
      to: 150,
    },
    rents: {
      from: 5000,
      to: 20000,
    },
    deposits: {
      from: 10000,
      to: 100000,
    },
    places: {
      type: 'FeatureCollection',
      features: [],
    },
    slideOpen: false,
    tourActive: false,
    tourIndex: 0,
    pageVisible: false,
    page: {},
    firstPropertySelected: false,
    secondPropertySelected: false,
    propertyName: null,
    propertyName2: null,
    showModal: false,
    id: null,
    id2: null,
    secondPropertyType: null,
    propertySuggestionData:[],
    activeProperty: null,
    showDialogModal: false,
    propertyDetails: {}
  }

  setActiveProperty = (property) => {
    const images = property.image;
    // alert("1111")
    console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQqqqq")
    console.log(JSON.stringify(property))
    console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQqqqq")

    this.setState({
      activeProperty: property,
      propertyDetails: {
        title: property.listing_name,
        typeName: "Apartment",
        rooms: property.bedroom_count === "-1" || property.bedroom_count === "0" ? "1" : property.bedroom_count,
        area: property.area,
        rent: property.monthly_rent,
        deposit: property.deposit,
        images: images,
        excerpt: property.excerpt,
      },
      showDialogModal: true, // Open the modal when a property is active
    });
  };

  setcloseActiveProperty = () => {
    this.setState({ showDialogModal: false });
  }

  closeModal = () => {
    this.setState({ showDialogModal: false });
  };

  componentDidMount() {
    this.fetchData()
  }

  toggleModal = () => {
      // this.handlepropertyName(null)
      // this.handlepropertyId1(null)
      // this.handlepropertyName2(null)
      // this.setsecondPropertyType(null)
      // this.handlepropertyId2(null)

    this.setState({ showModal: !this.state.showModal })
  }


  fetchData = () => {
    // fetch('http://54.196.154.157:8070/map/comp-listings?records_limit=20')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const geoJsonData = {
    //       type: 'FeatureCollection',
    //       features: data.map((item, index) => ({
    //         type: 'Feature',
    //         properties: {
    //           // "id": `item-${index}`,
    //           id: item.id,
    //           title: item.listing_name,
    //           excerpt: item.address,
    //           description: item.description,
    //           images: [
    //             {
    //               original: item.property_image,
    //               thumbnail: item.property_image, // Assuming the same image for both
    //             },
    //           ],
    //           // Add or adjust properties as necessary
    //           type: item.property_type || 'apartment',
    //           rooms: item.bedroom_count,
    //           area: parseInt(item.apartment_size, 10),
    //           rent: parseInt(item.monthly_rent, 10),
    //           deposit: 0, // Adjust as needed
    //         },
    //         geometry: {
    //           type: 'Point',
    //           coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
    //         },
    //       })),
    //     }

    //     this.setState({ places: geoJsonData })
    //     this.InitializeMap(geoJsonData, "competitor")
    //     // setPropertyData2(data)
    //   })
    //   .catch((error) => console.error('Error fetching data:', error))

     fetch('http://54.196.154.157:8070/map/southwest-listings?records_limit=20')
        .then((response) => response.json())
        .then((data) => {
          const geoJsonData = {
            type: 'FeatureCollection',
            features: data.map((item, index) => ({
              type: 'Feature',
              properties: {
                id: item.id,
                title: item.listing_name,
                excerpt: item.address,
                description: item.description,
                images: [
                  {
                    original: item.property_image,
                    thumbnail: item.property_image, // Assuming the same image for both
                  },
                ],
                // Add or adjust properties as necessary
                type: 'apartment',
                rooms: item.bedroom_count,
                area: parseInt(item.bathroom_count) < 0 ? "n/a" : item.bathroom_count,
                rent: parseInt(item.monthly_rent, 10),
                deposit: 0, // Adjust as needed
              },
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
              },
            })),
          }

          this.setState({ places: geoJsonData })
          // this.mapcraft.map.getSource('places-data').setData(publicData)
          // if (publicData.features.length)
          //   this.mapcraft.fitBounds({
          //     geoJson: publicData,
          //   })

          this.InitializeMap(geoJsonData,'southwest')
          // this.setState({ dataFilter })
          console.log('slugggggggggggggggg' + slug)
          // this.InitializeMap(this.state.places)
          // this.handleChangeTour('end-tour')

          // setPropertyData2(data)
        })
        .catch((error) => console.error('Error fetching data:', error))
  }

  fetchDataFilter = (url, slug) => {
    fetch('http://54.196.154.157:8070/map/comp-listings?records_limit=20')
      .then((response) => response.json())
      .then((data) => {
        const geoJsonData = {
          type: 'FeatureCollection',
          features: data.map((item, index) => ({
            type: 'Feature',
            properties: {
              id: item.id,
              title: item.listing_name,
              excerpt: item.address,
              description: item.description,
              images: [
                {
                  original: item.property_image,
                  thumbnail: item.property_image, // Assuming the same image for both
                },
              ],
              // Add or adjust properties as necessary
              type: 'apartment',
              rooms: item.bedroom_count,
              area: parseInt(item.bathroom_count) < 0 ? "n/a" : item.bathroom_count,
              rent: parseInt(item.monthly_rent, 10),
              deposit: 0, // Adjust as needed
            },
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
            },
          })),
        }

        this.setState({ places: geoJsonData })
        this.InitializeMap(geoJsonData,'competitor')
        // setPropertyData2(data)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }

  render() {
    let numberOFPlaces = this.state.places.features.length
    let lastIndex = numberOFPlaces - 1


    return (
      <div className="app">
        <div id="app-map"></div>
        {/* <PropertyDialogComponent activeProperty={this.state.activeProperty} /> */}

        <div className={this.getSlideClasses()}>
          <Search
            types={this.state.types}
            rooms={this.state.rooms}
            areas={this.state.areas}
            rents={this.state.rents}
            deposits={this.state.deposits}
            slideOpen={this.state.slideOpen}
            onChangeSlide={this.handleChangeSlide}
            onChangeType={this.handleChangeType}
            onChangeRoom={this.handleChangeRoom}
            onChangeDataFilter={this.onChangeDataFilter}
            onChangeArea={this.handleChangeArea}
            onChangeRent={this.handleChangeRent}
            onChangeDeposit={this.handleChangeDeposit}
            onChangeTour={this.handleChangeTour}
            getPlacesCount={this.getPlacesCount}
            disableTour={numberOFPlaces === 0}
            firstPropertySelected={this.state.firstPropertySelected}
            secondPropertySelected={this.state.secondPropertySelected}
            dataFilter={this.state.dataFilter}
            propertyName={this.state.propertyName}
            propertyName2={this.state.propertyName2}
            handlePropertyName={this.handlepropertyName}
            handlePropertyName2={this.handlepropertyName2}
            toggleModal={this.toggleModal}
            propertySuggestionData={this.state.propertySuggestionData}
            setActiveProperty={this.setActiveProperty}
            setcloseActiveProperty={this.setcloseActiveProperty}
            setsecondPropertyType={this.setsecondPropertyType}
            handlepropertyId2={this.handlepropertyId2}
          />
        </div>

        {this.state.showDialogModal && (
         <Modal isOpen={this.state.showDialogModal} onClose={this.closeModal}>
         <div className="sc-card sc-borderless">
           <div className="sc-card-header">
           <h5>{this.state.propertyDetails.title}</h5>
           </div>
           <div className="sc-card-body" style={styles2.modalBody}>
             <div style={styles2.imageContainer}>
               <img src={this.state.propertyDetails.images} alt={"Property View"} style={styles2.modalImage} />
             </div>
             <div style={styles2.infoContainer}>
               <table className="sc-table">
               <tbody>
                  <tr><td>Type</td><td>Appartment</td></tr>
                  <tr><td>Rooms</td><td>{this.state.propertyDetails.rooms}</td></tr>
                  <tr><td>Bed Rooms</td><td>{this.state.propertyDetails.rooms}</td></tr>
                  <tr><td>Rent</td><td>${this.state.propertyDetails.rent}</td></tr>
                  <tr><td>description</td><td>{this.state.propertyDetails.excerp}</td></tr>
                </tbody>
               </table>
             </div>
           </div>
           <div className="sc-card-footer">{this.state.propertyDetails.excerpt}</div>
         </div>
       </Modal>
       
        )}
        <Modal isOpen={this.state.showModal} onClose={() => {
          this.handlepropertyName(null)
          this.handlepropertyId1(null)
          this.handlepropertyName2(null)
          this.setsecondPropertyType(null)
          this.handlepropertyId2(null)
          this.toggleModal()
          }}>
          {/* <h2>Modal Title</h2>
          <p>Content for the modal goes here...</p> */}
          {/* Add more content or components inside the modal as needed */}
          <ComparisionModule
            property1={this.state.propertyName}
            property2={this.state.propertyName2}
            id1={this.state.id}
            id2={this.state.id2}
            propertyType={this.state.secondPropertyType}
          />
        </Modal>

        <div className={this.getTourControlsClasses()}>
          <Tour
            disableRestart={this.state.tourIndex <= 0}
            disableNext={this.state.tourIndex >= lastIndex}
            disablePrev={this.state.tourIndex <= 0}
            onChangeTour={this.handleChangeTour}
          />
        </div>

        <div
          className={this.getPageOverlayClasses()}
          onClick={() => {
            this.handleChangePage(false)
          }}
        >
          <Page page={this.state.page} onChangePage={this.handleChangePage} />
        </div>
      </div>
    )
  }

  handleChangePage = (pageVisible) => {
    this.setState({ pageVisible })
  }

  handleChangeSlide = (slideOpen) => {
    this.setState({ slideOpen })
  }

  getTourControlsClasses = () => {
    let classes = 'app-tour-controls sc-grid-4'

    if (this.state.tourActive) classes += ' is-visible'

    return classes
  }

  getPageOverlayClasses = () => {
    let classes = 'app-page-overlay'

    if (this.state.pageVisible) classes += ' is-visible'

    return classes
  }

  getSlideClasses = () => {
    let classes = 'sc-slide'

    if (this.state.slideOpen) classes += ' sc-is-open'

    return classes
  }

  getPlacesCount = () => {
    let features = this.state.places.features

    return features.length ? features.length : 'No'
  }

  handleFilter = () => {
    let { types, rooms, areas, rents, deposits } = this.state

    let filters = [
      'all',
      ['>=', 'area', areas.from],
      ['<=', 'area', areas.to],
      ['>=', 'rent', rents.from],
      ['<=', 'rent', rents.to],
      ['>=', 'deposit', deposits.from],
      ['<=', 'deposit', deposits.to],
    ]

    let typesFilter = types
      .filter((item) => item.checked)
      .reduce(
        (total, current) => {
          total.push(['==', 'type', current.slug])

          return total
        },
        ['any'],
      )

    filters.push(typesFilter)

    let roomsFilter = rooms
      .filter((item) => item.checked)
      .reduce(
        (total, current) => {
          if (current.slug === 'one') total.push(['==', 'rooms', 1])
          if (current.slug === 'two') total.push(['==', 'rooms', 2])
          if (current.slug === 'more') total.push(['>', 'rooms', 2])
          if (current.slug === 'any') total.push(['>=', 'rooms', 0])

          return total
        },
        ['any'],
      )

    filters.push(roomsFilter)

    this.mapcraft.map.setFilter('point-symbol-places', filters)
  }

  // handleGeoJson = () => {
  //   let { types, rooms, dataFilter, areas, rents, deposits } = this.state;

  //   // let selectedTypes = types
  //   //   .filter(type => type.checked)
  //   //   .map(type => type.slug);

  //   let selectedTypes = types?.filter(type => type.checked)?.map(type => type.slug) || [];

  //   let selectedRooms = rooms
  //     .filter(room => room.checked)
  //     .map(room => room.slug);

  //   let places = { ...this.mapcraft.geoJsons.places };

  //   let features = places.features.filter(feature => {
  //     let { type, rooms, area, rent, deposit } = feature.properties;

  //     if (
  //       selectedTypes.includes(type) &&
  //       area >= areas.from &&
  //       area <= areas.to &&
  //       rent >= rents.from &&
  //       rent <= rents.to &&
  //       deposit >= deposits.from &&
  //       deposit <= deposits.to
  //     ) {
  //       if (
  //         (rooms === 1 && selectedRooms.includes("one")) ||
  //         (rooms === 2 && selectedRooms.includes("two")) ||
  //         (rooms > 2 && selectedRooms.includes("more")) ||
  //         selectedRooms.includes("any")
  //       ) {
  //         return true;
  //       }
  //     }

  //     return false;
  //   });

  //   places.features = features;

  //   this.setState({ places });

  //   if (places.features.length)
  //     this.mapcraft.fitBounds({
  //       geoJson: places
  //     });
  // };

  // handleGeoJson = () => {
  //   const { types, rooms, areas, rents, deposits, places2 } = this.state;

  //   // Ensure the necessary data is available and in the correct format
  //   // if (!types || !rooms || !places.features) {
  //   //   console.warn("Data not available for filtering.");
  //   //   return;
  //   // }

  //   let selectedTypes = types.filter(type => type.checked).map(type => type.slug);
  //   let selectedRooms = rooms.filter(room => room.checked).map(room => room.slug);

  //   var places = { ...this.mapcraft.geoJsons.places };
  //   let features = places.features.filter(feature => {
  //     let { type, rooms, area, rent, deposit } = feature.properties;

  //     if (
  //       selectedTypes.includes(type) &&
  //       area >= areas.from &&
  //       area <= areas.to &&
  //       rent >= rents.from &&
  //       rent <= rents.to &&
  //       deposit >= deposits.from &&
  //       deposit <= deposits.to
  //     ) {
  //       if (
  //         (rooms === 1 && selectedRooms.includes("one")) ||
  //         (rooms === 2 && selectedRooms.includes("two")) ||
  //         (rooms > 2 && selectedRooms.includes("more")) ||
  //         selectedRooms.includes("any")
  //       ) {
  //         return true;
  //       }
  //     }

  //     return false;
  //   });

  //   places.features = features;

  //   this.setState({ places });

  //   if (places.features.length)
  //     this.mapcraft.fitBounds({
  //       geoJson: places
  //     });
  // };

  handleGeoJson = () => {
    const { types, rooms, areas, rents, deposits, places } = this.state

    console.log('******************')
    console.log(JSON.stringify(places))
    console.log('******************')

    if (places.features.length)
      this.mapcraft.fitBounds({
        geoJson: places,
      })

    // If there's no need to use `this.mapcraft.geoJsons.places`, remove it and use `places` from the state
    let selectedTypes = types.filter((type) => type.checked).map((type) => type.slug)
    let selectedRooms = rooms.filter((room) => room.checked).map((room) => room.slug)

    if (this.mapcraft && this.mapcraft.geoJsons && this.mapcraft.geoJsons.places) {
      var places2 = { ...this.mapcraft.geoJsons.places }
      console.log('******************')
      console.log(JSON.stringify(places2))
      console.log('******************')
      let features = this.mapcraft.geoJsons.places.features.filter((feature) => {
        let { type, rooms, area, rent, deposit } = feature.properties
        return (
          selectedTypes.includes(type) &&
          (selectedRooms.includes('any') ||
            (rooms === 1 && selectedRooms.includes('one')) ||
            (rooms === 2 && selectedRooms.includes('two')) ||
            (rooms > 2 && selectedRooms.includes('more'))) &&
          area >= areas.from &&
          area <= areas.to &&
          rent >= rents.from &&
          rent <= rents.to &&
          deposit >= deposits.from &&
          deposit <= deposits.to
        )
      })

      // Update state with filtered features
      this.setState({ places: { ...places2, features: features } })
      if (places2.features.length)
        this.mapcraft.fitBounds({
          geoJson: places2,
        })
    }

    // If using Mapbox GL or similar, and you need to fit the map bounds to the new features
    // ensure you have a mechanism in place to do so once the state is updated
  }

  handleChangeType = (event) => {
    let slug = event.target.getAttribute('data-type')
    let types = [...this.state.types].map((type) => {
      if (type.slug === slug) type.checked = event.target.checked

      return type
    })

    this.setState({ types })

    this.handleChangeTour('end-tour')
    this.handleFilter()
    this.handleGeoJson()
  }

  handleChangeRoom = (event) => {
    let slug = event.target.getAttribute('data-room')
    let rooms = [...this.state.rooms].map((room) => {
      room.checked = room.slug === slug ? true : false

      return room
    })

    this.setState({ rooms })

    this.handleChangeTour('end-tour')
    this.handleFilter()
    this.handleGeoJson()
  }

  onChangeDataFilter = (event) => {
    var southWestData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'item-0',
            title: 'Southwest-Praesent ut ipsum nulla.',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Turpis in eu mi bibendum neque egestas. Nibh praesent tristique magna sit amet purus. Id aliquet risus feugiat in ante metus. Curabitur gravida arcu ac tortor. Vivamus arcu felis bibendum ut tristique et egestas. Nunc non blandit massa enim nec dui nunc mattis. Eu non diam phasellus vestibulum lorem. Risus commodo viverra maecenas accumsan lacus vel.',
            images: [
              {
                original: '/assets/images/original/apartment/2/1.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/1.jpg',
              },
              {
                original: '/assets/images/original/apartment/2/2.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/2.jpg',
              },
              {
                original: '/assets/images/original/apartment/2/3.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/3.jpg',
              },
            ],
            type: 'apartment',
            rooms: 1,
            area: 97,
            rent: 20900,
            deposit: 83000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.571602, 44.636379],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-1',
            title: 'Southwest-Praesent ut ipsum nulla.',
            excerpt:
              'Praesent ullamcorper dui molestie augue hendrerit finibus. Praesent ut ipsum nulla.',
            description:
              'Erat velit scelerisque in dictum non consectetur a erat nam. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Pretium aenean pharetra magna ac placerat vestibulum lectus. Augue mauris augue neque gravida in fermentum et. Eros in cursus turpis massa tincidunt. Leo in vitae turpis massa sed elementum tempus egestas. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur.',
            images: [
              {
                original: '/assets/images/original/apartment/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/1.jpg',
              },
              {
                original: '/assets/images/original/apartment/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/2.jpg',
              },
              {
                original: '/assets/images/original/apartment/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/3.jpg',
              },
            ],
            type: 'apartment',
            rooms: 1,
            area: 52,
            rent: 10900,
            deposit: 32000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.571461, 44.628948],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-2',
            title: 'Southwest-Orci varius natoque penatibus',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.',
            images: [
              {
                original: '/assets/images/original/shared/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/1.jpg',
              },
              {
                original: '/assets/images/original/shared/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/2.jpg',
              },
              {
                original: '/assets/images/original/shared/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/3.jpg',
              },
            ],
            type: 'shared',
            rooms: 2,
            area: 99,
            rent: 21800,
            deposit: 65000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.57958666863994, 44.64103165],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-2',
            title: 'Southwest-Orci varius natoque penatibus',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.',
            images: [
              {
                original: '/assets/images/original/shared/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/1.jpg',
              },
              {
                original: '/assets/images/original/shared/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/2.jpg',
              },
              {
                original: '/assets/images/original/shared/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/3.jpg',
              },
            ],
            type: 'shared',
            rooms: 2,
            area: 99,
            rent: 21800,
            deposit: 65000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.58014346185526, 44.63114815],
          },
        },
      ],
    }

    var publicData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'item-0',
            title: 'public-Praesent ut ipsum nulla.',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Turpis in eu mi bibendum neque egestas. Nibh praesent tristique magna sit amet purus. Id aliquet risus feugiat in ante metus. Curabitur gravida arcu ac tortor. Vivamus arcu felis bibendum ut tristique et egestas. Nunc non blandit massa enim nec dui nunc mattis. Eu non diam phasellus vestibulum lorem. Risus commodo viverra maecenas accumsan lacus vel.',
            images: [
              {
                original: '/assets/images/original/apartment/2/1.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/1.jpg',
              },
              {
                original: '/assets/images/original/apartment/2/2.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/2.jpg',
              },
              {
                original: '/assets/images/original/apartment/2/3.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/3.jpg',
              },
            ],
            type: 'apartment',
            rooms: 1,
            area: 97,
            rent: 20900,
            deposit: 83000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.571602, 44.636379],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-1',
            title: 'public-Praesent ut ipsum nulla.',
            excerpt:
              'Praesent ullamcorper dui molestie augue hendrerit finibus. Praesent ut ipsum nulla.',
            description:
              'Erat velit scelerisque in dictum non consectetur a erat nam. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Pretium aenean pharetra magna ac placerat vestibulum lectus. Augue mauris augue neque gravida in fermentum et. Eros in cursus turpis massa tincidunt. Leo in vitae turpis massa sed elementum tempus egestas. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur.',
            images: [
              {
                original: '/assets/images/original/apartment/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/1.jpg',
              },
              {
                original: '/assets/images/original/apartment/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/2.jpg',
              },
              {
                original: '/assets/images/original/apartment/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/3.jpg',
              },
            ],
            type: 'apartment',
            rooms: 1,
            area: 52,
            rent: 10900,
            deposit: 32000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.571461, 44.628948],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-2',
            title: 'public-Orci varius natoque penatibus',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.',
            images: [
              {
                original: '/assets/images/original/shared/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/1.jpg',
              },
              {
                original: '/assets/images/original/shared/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/2.jpg',
              },
              {
                original: '/assets/images/original/shared/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/3.jpg',
              },
            ],
            type: 'shared',
            rooms: 2,
            area: 99,
            rent: 21800,
            deposit: 65000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.57958666863994, 44.64103165],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-2',
            title: 'public-Orci varius natoque penatibus',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.',
            images: [
              {
                original: '/assets/images/original/shared/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/1.jpg',
              },
              {
                original: '/assets/images/original/shared/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/2.jpg',
              },
              {
                original: '/assets/images/original/shared/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/3.jpg',
              },
            ],
            type: 'shared',
            rooms: 2,
            area: 99,
            rent: 21800,
            deposit: 65000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.58014346185526, 44.63114815],
          },
        },
      ],
    }

    var compeData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'item-0',
            title: 'compe-Praesent ut ipsum nulla.',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Turpis in eu mi bibendum neque egestas. Nibh praesent tristique magna sit amet purus. Id aliquet risus feugiat in ante metus. Curabitur gravida arcu ac tortor. Vivamus arcu felis bibendum ut tristique et egestas. Nunc non blandit massa enim nec dui nunc mattis. Eu non diam phasellus vestibulum lorem. Risus commodo viverra maecenas accumsan lacus vel.',
            images: [
              {
                original: '/assets/images/original/apartment/2/1.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/1.jpg',
              },
              {
                original: '/assets/images/original/apartment/2/2.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/2.jpg',
              },
              {
                original: '/assets/images/original/apartment/2/3.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/2/3.jpg',
              },
            ],
            type: 'apartment',
            rooms: 1,
            area: 97,
            rent: 20900,
            deposit: 83000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.571602, 44.636379],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-1',
            title: 'compe-Praesent ut ipsum nulla.',
            excerpt:
              'Praesent ullamcorper dui molestie augue hendrerit finibus. Praesent ut ipsum nulla.',
            description:
              'Erat velit scelerisque in dictum non consectetur a erat nam. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Pretium aenean pharetra magna ac placerat vestibulum lectus. Augue mauris augue neque gravida in fermentum et. Eros in cursus turpis massa tincidunt. Leo in vitae turpis massa sed elementum tempus egestas. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur.',
            images: [
              {
                original: '/assets/images/original/apartment/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/1.jpg',
              },
              {
                original: '/assets/images/original/apartment/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/2.jpg',
              },
              {
                original: '/assets/images/original/apartment/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/apartment/3/3.jpg',
              },
            ],
            type: 'apartment',
            rooms: 1,
            area: 52,
            rent: 10900,
            deposit: 32000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.571461, 44.628948],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-2',
            title: 'compe-Orci varius natoque penatibus',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.',
            images: [
              {
                original: '/assets/images/original/shared/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/1.jpg',
              },
              {
                original: '/assets/images/original/shared/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/2.jpg',
              },
              {
                original: '/assets/images/original/shared/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/3.jpg',
              },
            ],
            type: 'shared',
            rooms: 2,
            area: 99,
            rent: 21800,
            deposit: 65000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.57958666863994, 44.64103165],
          },
        },
        {
          type: 'Feature',
          properties: {
            id: 'item-2',
            title: 'compe-Orci varius natoque penatibus',
            excerpt: 'Orci varius natoque penatibus et magnis dis parturient montes.',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.',
            images: [
              {
                original: '/assets/images/original/shared/3/1.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/1.jpg',
              },
              {
                original: '/assets/images/original/shared/3/2.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/2.jpg',
              },
              {
                original: '/assets/images/original/shared/3/3.jpg',
                thumbnail: '/assets/images/thumbnail/shared/3/3.jpg',
              },
            ],
            type: 'shared',
            rooms: 2,
            area: 99,
            rent: 21800,
            deposit: 65000,
          },
          geometry: {
            type: 'Point',
            coordinates: [-63.58014346185526, 44.63114815],
          },
        },
      ],
    }
    let slug = event.target.getAttribute('data-datafilter')
    let dataFilter = [...this.state.dataFilter].map((dataFilter) => {
      dataFilter.checked = dataFilter.slug === slug ? true : false
      return dataFilter
    })

    if (slug == 'public') {
      fetch('http://54.196.154.157:8070/map/public-listings?records_limit=20')
        .then((response) => response.json())
        .then((data) => {
          const geoJsonData = {
            type: 'FeatureCollection',
            features: data.map((item, index) => ({
              type: 'Feature',
              properties: {
                id: item.id,
                title: item.listing_name,
                excerpt: item.address,
                description: item.description,
                images: [
                  {
                    original: item.property_image,
                    thumbnail: item.property_image, // Assuming the same image for both
                  },
                ],
                // Add or adjust properties as necessary
                type: 'apartment',
                rooms: item.bedroom_count,
                area: parseInt(item.bathroom_count) < 0 ? "n/a" : item.bathroom_count,
                rent: parseInt(item.monthly_rent, 10),
                deposit: 0, // Adjust as needed
              },
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
              },
            })),
          }

          this.setState({ places: geoJsonData })
          this.mapcraft.map.getSource('places-data').setData(publicData)
          if (publicData.features.length)
            this.mapcraft.fitBounds({
              geoJson: publicData,
            })

          this.InitializeMap(geoJsonData, 'public')
          this.setState({ dataFilter })
          console.log('slugggggggggggggggg' + slug)
          // this.InitializeMap(this.state.places)
          this.handleChangeTour('end-tour')

          // setPropertyData2(data)
        })
        .catch((error) => console.error('Error fetching data:', error))

      // this.setState({ places: publicData });
      // this.mapcraft.map.getSource('places-data').setData(publicData);
      // if (publicData.features.length)
      // this.mapcraft.fitBounds({
      //   geoJson: publicData
      // });
    } else if (slug == 'southwest') {
      // this.setState({ places: southWestData });
      // this.mapcraft.map.getSource('places-data').setData(southWestData);

      // if (southWestData.features.length)
      // this.mapcraft.fitBounds({
      //   geoJson: southWestData
      // });

      fetch('http://54.196.154.157:8070/map/southwest-listings?records_limit=20')
        .then((response) => response.json())
        .then((data) => {
          const geoJsonData = {
            type: 'FeatureCollection',
            features: data.map((item, index) => ({
              type: 'Feature',
              properties: {
                id: item.id,
                title: item.listing_name,
                excerpt: item.address,
                description: item.description,
                images: [
                  {
                    original: item.property_image,
                    thumbnail: item.property_image, // Assuming the same image for both
                  },
                ],
                // Add or adjust properties as necessary
                type: 'apartment',
                rooms: item.bedroom_count,
                area: parseInt(item.bathroom_count) < 0 ? "n/a" : item.bathroom_count,
                rent: parseInt(item.monthly_rent, 10),
                deposit: 0, // Adjust as needed
              },
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
              },
            })),
          }

          this.setState({ places: geoJsonData })
          this.mapcraft.map.getSource('places-data').setData(publicData)
          if (publicData.features.length)
            this.mapcraft.fitBounds({
              geoJson: publicData,
            })

          this.InitializeMap(geoJsonData,'southwest')
          this.setState({ dataFilter })
          console.log('slugggggggggggggggg' + slug)
          // this.InitializeMap(this.state.places)
          this.handleChangeTour('end-tour')

          // setPropertyData2(data)
        })
        .catch((error) => console.error('Error fetching data:', error))
    }else if(slug == 'parking'){
      fetch('http://54.196.154.157:8070/map/parkings')
      .then((response) => response.json())
      .then((data) => {
        console.log("9999999999999999999999999999999999999999999999")
        console.log(JSON.parse(data))
        console.log("9999999999999999999999999999999999999999999999")
         data = JSON.parse(data)
        const geoJsonData = {
          type: 'FeatureCollection',
          features: data.map((item, index) => ({
            type: 'Feature',
            properties: {
              id: item.id,
              title: item.address,
              excerpt: item.address,
              description: item.address,
              images: [
                {
                  original: null,
                  thumbnail: null, // Assuming the same image for both
                },
              ],
              // Add or adjust properties as necessary
              type: 'apartment',
              rooms: item.lot,
              area: "n/a",
              rent: parseInt(item.price, 10),
              deposit: 0, // Adjust as needed
            },
            geometry: {
              type: 'Point',
              coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
            },
          })),
        }

        this.setState({ places: geoJsonData })
        this.mapcraft.map.getSource('places-data').setData(publicData)
        if (publicData.features.length)
          this.mapcraft.fitBounds({
            geoJson: publicData,
          })

        this.InitializeMap(geoJsonData,'parking')
        this.setState({ dataFilter })
        console.log('slugggggggggggggggg' + slug)
        // this.InitializeMap(this.state.places)
        this.handleChangeTour('end-tour')

        // setPropertyData2(data)
      })
      .catch((error) => console.error('Error fetching data:', error))
    } else {
      // this.setState({ places: compeData });
      // this.mapcraft.map.getSource('places-data').setData(compeData);

      // if (compeData.features.length)
      // this.mapcraft.fitBounds({
      //   geoJson: compeData
      // });

      fetch('http://54.196.154.157:8070/map/comp-listings?records_limit=20')
        .then((response) => response.json())
        .then((data) => {
          const geoJsonData = {
            type: 'FeatureCollection',
            features: data.map((item, index) => ({
              type: 'Feature',
              properties: {
                id: item.id,
                title: item.listing_name,
                excerpt: item.address,
                description: item.description,
                images: [
                  {
                    original: item.property_image,
                    thumbnail: item.property_image, // Assuming the same image for both
                  },
                ],
                // Add or adjust properties as necessary
                type: 'apartment',
                rooms: item.bedroom_count,
                area: parseInt(item.bathroom_count) < 0 ? "n/a" : item.bathroom_count,
                rent: parseInt(item.monthly_rent, 10),
                deposit: 0, // Adjust as needed
              },
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(item.add_long), parseFloat(item.add_lat)],
              },
            })),
          }

          this.setState({ places: geoJsonData })
          this.mapcraft.map.getSource('places-data').setData(publicData)
          if (publicData.features.length)
            this.mapcraft.fitBounds({
              geoJson: publicData,
            })

          this.InitializeMap(geoJsonData,'competitor')
          this.setState({ dataFilter })
          // this.InitializeMap(this.state.places)
          this.handleChangeTour('end-tour')

          // setPropertyData2(data)
        })
        .catch((error) => console.error('Error fetching data:', error))
    }

    // this.handleFilter();
    // this.handleGeoJson();
  }

  handleChangeArea = (value) => {
    let areas = { ...this.state.areas }

    areas.from = value.min
    areas.to = value.max

    this.setState({ areas })

    this.handleChangeTour('end-tour')
    this.handleFilter()
    this.handleGeoJson()
  }

  handleChangeRent = (value) => {
    let rents = { ...this.state.rents }

    rents.from = value.min
    rents.to = value.max

    this.setState({ rents })

    this.handleChangeTour('end-tour')
    this.handleFilter()
    this.handleGeoJson()
  }

  handleChangeDeposit = (value) => {
    let deposits = { ...this.state.deposits }

    deposits.from = value.min
    deposits.to = value.max

    this.setState({ deposits })

    this.handleChangeTour('end-tour')
    this.handleFilter()
    this.handleGeoJson()
  }

  handleChangeTour = (action) => {
    let features = this.state.places.features
    let lastIndex = features.length - 1
    let tourActive = this.state.tourActive
    let tourIndex = this.state.tourIndex

    this.handleChangeSlide(false)

    if (action === 'start-tour') {
      tourActive = true

      tourIndex = 0
    }

    if (action === 'end-tour') {
      tourActive = false

      tourIndex = 0

      this.mapcraft.closePopup()

      this.handleChangeSlide(true)
    }

    if (action === 'restart') tourIndex = 0

    if (action === 'next' && tourIndex < lastIndex) tourIndex += 1

    if (action === 'prev' && tourIndex > 0) tourIndex -= 1

    if (tourActive) {
      let feature = features[tourIndex]

      let lnglat = {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1],
      }

      this.mapcraft.flyTo({
        lnglat: lnglat,
        zoom: 15,
      })

      this.openPopup(feature.properties, lnglat)
    }

    this.setState({ tourActive, tourIndex })
  }

  InitializeMap = (placevar, iconName) => {
    this.mapcraft = new Mapcraft({
      env: {
        mapbox: {
          token:
            'pk.eyJ1IjoiYXlkaW5naGFuZSIsImEiOiJjazJpcXB1Zm8xamNvM21sNjlsMG95ejY3In0.jMuteEFuzviEuitJZ-DY2w',
        },
      },
      styles: {
        light: 'mapbox://styles/mapbox/streets-v11',
      },
      map: {
        container: 'app-map',
        center: [44.6542783, -63.58312599999999],
        zoom: 5,
        pitch: 50,
        bearing: 0,
        hash: false,
      },
      controls: {
        fullscreen: false,
        geolocation: false,
        navigation: true,
      },
      // icons: {
      //   house: "https://picsum.photos/200/300",
      //   apartment: "https://picsum.photos/200/300",
      //   shared: "https://picsum.photos/200/300",
      //   dorm: "https://picsum.photos/200/300"
      // }
      // ,
      // geoJsons: {
      //   places: "./data/places2.json"
      // }
    })

    this.mapcraft.load().then(() => {
      const img = new Image()
      img.onload = () => {
        // Once the image is loaded, add it to the map
        this.mapcraft.map.addImage('apartment-icon', img)

        // Add your source and layer using the added image here
        this.mapcraft.map.addSource('places-data', {
          type: 'geojson',
          data: placevar,
        })

        this.mapcraft.map.addLayer({
          id: 'point-symbol-places',
          type: 'symbol',
          source: 'places-data',
          layout: {
            'icon-image': 'apartment-icon', // Reference the ID used in addImage
            'icon-size': 1.0,
          },
        })
      }
      img.onerror = (err) => {
        throw err
      }
      img.src = im1
      if(iconName == "competitor"){
        img.src = competitor
      }else if(iconName == "public"){
        img.src = public_building
      }else if(iconName == "parking"){
        img.src = parking
      }else{
        img.src = southwesticon
      }

      this.handleFilter()

      setTimeout(() => {
        this.handleGeoJson()
      }, 2000)

      setTimeout(() => {
        this.handleChangeSlide(true)
      }, 5000)

      this.mapcraft.map.on('click', 'point-symbol-places', (event) => {
        let properties = event.features[0].properties
        let coordinates = event.features[0].geometry.coordinates.slice()

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360
        }

        this.openPopup(properties, coordinates)
      })
    })
  }

  handleFirstProperty2 = () => {
    this.setState({ firstPropertySelected: !this.state.firstPropertySelected })
  }

  handleSecondProperty2 = () => {
    this.setState({ secondPropertySelected: !this.state.secondPropertySelected })
  }

  handlePropertySuggestionData = (id) => {    
      // Fetch data from API
      fetch(`http://54.196.154.157:8070/map/competitor/compare?property_id=`+id)
        .then((response) => response.json())
        .then((data) => {
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
          console.log(JSON.stringify(data))
  
          console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
  
          this.setState({propertySuggestionData: data })
          // Process your data here
          // this.setState({
            
          // });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          // this.setState({ loading: false }); // Stop loading even if there is an error
        });
    
  }

  handlepropertyName = (title) => {
    this.setState({ propertyName: title })
  }
  handlepropertyName2 = (title) => {
    this.setState({ propertyName2: title })
  }
  handlepropertyId1 = (id) => {
    this.handlePropertySuggestionData(id)
    this.setState({ id: id })
  }
  handlepropertyId2 = (id) => {
    this.setState({ id2: id })
  }
  setsecondPropertyType = (secondPropertyType) => {
    this.setState({secondPropertyType: secondPropertyType})
  }

  openPopup = (properties, lnglat) => {
    if (typeof properties.images !== 'object') properties.images = JSON.parse(properties.images)

    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    // console.log("Datafilter:"+JSON.stringify(this.state.dataFilter))
    // console.log(properties.type)
    // console.log(JSON.stringify(this.state.types.filter((t) => t.slug === properties.type)[0].name))
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    properties.typeName = this.state.types.filter((t) => t.slug === properties.type)[0].name

    let { id, title, images, excerpt, typeName, rooms, area, rent, deposit } = properties

    const checkedItem = this.state.dataFilter.find(item => item.checked === true);

    var propertyType = checkedItem.slug
    console.log("$$$$$$$$$$$$$id"+id)
    console.log(JSON.stringify(checkedItem.slug))
    // this.setState({propertyName: title})

    if(propertyType == "southwest"){
      this.handlepropertyName(title)
      this.handlepropertyId1(id)
    }else if(propertyType == "parking"){

    }else{
      this.handlepropertyName2(title)
      this.setsecondPropertyType(propertyType)
      this.handlepropertyId2(id)
    }
    // if (this.state.propertyName == null) {
    //   this.handlepropertyName(title)
    //   this.handlepropertyId1(id)
    // } else {
    //   this.handlepropertyName2(title)
    //   this.handlepropertyId2(id)
    // }

    let html = `<div class="sc-card sc-borderless">
      <div class="sc-card-header">
        <h5 class="app-page-trigger"> ${title} </h5>
      </div>
      <h5 class="app-page-trigger">${title}</h5> 
  
      <div class="sc-card-body">
        <div>
          <img src="${images[0].thumbnail}" class="app-page-trigger" />
        </div>

        <div>
          <table class="sc-table">
            <tbody>
              <tr>
                <td>Type</td>
                <td>${typeName}</td>
              </tr>

              <tr>
                <td>Rooms</td>
                <td>${rooms == "-1" || rooms == "0" ? "1" : rooms}</td>
              </tr>

              <tr>
                <td>Bathroom count</td>
                <td>${area}</td>
              </tr>

              <tr>
                <td>Rent</td>
                <td>${rent}</td>
              </tr>

              <tr>
                <td>Deposit</td>
                <td>${deposit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="sc-card-footer">${excerpt}</div>
    </div>`

    let htmlParking = `<div class="sc-card sc-borderless">
    <div class="sc-card-header">
      <h5 class="app-page-trigger"> ${title} </h5>
    </div>
    <h5 class="app-page-trigger">${title}</h5> 

    <div class="sc-card-body">
      <div>
        <img src="${parking}" class="app-page-trigger" />
      </div>

      <div>
        <table class="sc-table">
          <tbody>
            <tr>
              <td>Type</td>
              <td>Parking</td>
            </tr>


            <tr>
              <td>Rent</td>
              <td>${rent}</td>
            </tr>

            <tr>
              <td>Lot</td>
              <td>${rooms}</td>
            </tr>

            
          </tbody>
        </table>
      </div>
    </div>
    <div class="sc-card-footer">${excerpt}</div>
  </div>`

    this.mapcraft.openPopup({
      lnglat: lnglat,
      html: propertyType == "parking" ? htmlParking : html,
    })

    document.querySelectorAll('.app-page-trigger').forEach((element) => {
      element.addEventListener('click', () => {
        this.handleChangePage(true)

        this.setState({ page: properties })
      })
    })

    //   document.querySelector('.first-property-button').addEventListener('click', () => {
    //     this.handleFirstProperty2();
    //   });

    //   document.querySelector('.second-property-button').addEventListener('click', () => {
    //     this.handleSecondProperty2();
    // });
  }
}

const styles2 = {
  modalBody: {
    display: 'flex',           // Enables flexbox layout
    justifyContent: 'space-between', // Spaces out children evenly
    alignItems: 'flex-start',  // Aligns children at the start of the cross axis
  },
  imageContainer: {
    flex: 1,                  // Takes up half of the flex container
    marginRight: '20px'       // Adds space between the image and the table
  },
  modalImage: {
    width: '100%',            // Makes the image fully occupy its container
    height: 'auto',           // Keeps the aspect ratio of the image
    borderRadius: '5px',      // Rounded corners for aesthetics
  },
  infoContainer: {
    flex: 1,                  // Takes up the remaining half of the flex container
    maxWidth: '400px'         // Maximum width of the table
  }
};


const styles = {
  container: {
    margin: '0 auto',
    padding: '5px',
    marginTop: '10px',
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

export default App
