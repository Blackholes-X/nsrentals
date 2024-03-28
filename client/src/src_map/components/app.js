import React, { Component } from "react";
import "./app.css";
import Mapcraft from "mapcraft";
import Search from "./search";
import Tour from "./tour";
import Page from "./page";
import im1 from "../icon-apartment.png"

class App extends Component {
  state = {
    types: [
      { slug: "house", name: "House", checked: true },
      { slug: "apartment", name: "Apartment", checked: true },
      { slug: "shared", name: "Shared", checked: true },
      { slug: "dorm", name: "Dorm", checked: true }
    ],
    rooms: [
      { slug: "one", name: "One", checked: false },
      { slug: "two", name: "Two", checked: false },
      { slug: "more", name: "More", checked: false },
      { slug: "any", name: "Any", checked: true }
    ],
    dataFilter: [
      { slug: "public", name: "public", checked: false },
      { slug: "southwest", name: "southwest", checked: false },
      { slug: "competitor", name: "competitor", checked: true }
    ],
    areas: {
      from: 30,
      to: 150
    },
    rents: {
      from: 5000,
      to: 20000
    },
    deposits: {
      from: 10000,
      to: 100000
    },
    places: {
      "type": "FeatureCollection",
      "features": [
      ]
  }
  ,
    slideOpen: false,
    tourActive: false,
    tourIndex: 0,
    pageVisible: false,
    page: {},
    firstPropertySelected: false,
    secondPropertySelected: false,

  };

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    fetch('http://54.196.154.157:8070/map/comp-listings?records_limit=20')
    .then(response => response.json())
    .then(data => {
     
      const geoJsonData = {
        "type": "FeatureCollection",
        "features": data.map((item, index) => ({
          "type": "Feature",
          "properties": {
            "id": `item-${index}`,
            "title": item.property_management_name,
            "excerpt": item.address,
            "description": item.description,
            "images": [{
                "original": item.property_image,
                "thumbnail": item.property_image // Assuming the same image for both
            }],
            // Add or adjust properties as necessary
            "type": item.property_type || "apartment",
            "rooms": item.bedroom_count,
            "area": parseInt(item.apartment_size, 10),
            "rent": parseInt(item.monthly_rent, 10),
            "deposit": 0, // Adjust as needed
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              parseFloat(item.add_long),
              parseFloat(item.add_lat)
            ]
          }
        }))
      };

      this.setState({places: geoJsonData })
      this.InitializeMap(geoJsonData);
      // setPropertyData2(data)
    })
    .catch(error => console.error('Error fetching data:', error));
  }

  fetchDataFilter = (url, slug) => {
    fetch('http://54.196.154.157:8070/map/comp-listings?records_limit=20')
    .then(response => response.json())
    .then(data => {
     
      const geoJsonData = {
        "type": "FeatureCollection",
        "features": data.map((item, index) => ({
          "type": "Feature",
          "properties": {
            "id": `item-${index}`,
            "title": item.property_management_name,
            "excerpt": item.address,
            "description": item.description,
            "images": [{
                "original": item.property_image,
                "thumbnail": item.property_image // Assuming the same image for both
            }],
            // Add or adjust properties as necessary
            "type": item.property_type || "apartment",
            "rooms": item.bedroom_count,
            "area": parseInt(item.apartment_size, 10),
            "rent": parseInt(item.monthly_rent, 10),
            "deposit": 0, // Adjust as needed
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              parseFloat(item.add_long),
              parseFloat(item.add_lat)
            ]
          }
        }))
      };

      this.setState({places: geoJsonData })
      this.InitializeMap(geoJsonData);
      // setPropertyData2(data)
    })
    .catch(error => console.error('Error fetching data:', error));
  }


  render() {
    let numberOFPlaces = this.state.places.features.length;
    let lastIndex = numberOFPlaces - 1;

    return (
      <div className="app">
        <div id="app-map"></div>

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
          />
        </div>

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
            this.handleChangePage(false);
          }}
        >
          <Page page={this.state.page} onChangePage={this.handleChangePage} />
        </div>
      </div>
    );
  }

  handleChangePage = pageVisible => {
    this.setState({ pageVisible });
  };

  handleChangeSlide = slideOpen => {
    this.setState({ slideOpen });
  };

  getTourControlsClasses = () => {
    let classes = "app-tour-controls sc-grid-4";

    if (this.state.tourActive) classes += " is-visible";

    return classes;
  };

  getPageOverlayClasses = () => {
    let classes = "app-page-overlay";

    if (this.state.pageVisible) classes += " is-visible";

    return classes;
  };

  getSlideClasses = () => {
    let classes = "sc-slide";

    if (this.state.slideOpen) classes += " sc-is-open";

    return classes;
  };

  getPlacesCount = () => {
    let features = this.state.places.features;

    return features.length ? features.length : "No";
  };

  handleFilter = () => {
    let { types, rooms, areas, rents, deposits } = this.state;

    let filters = [
      "all",
      [">=", "area", areas.from],
      ["<=", "area", areas.to],
      [">=", "rent", rents.from],
      ["<=", "rent", rents.to],
      [">=", "deposit", deposits.from],
      ["<=", "deposit", deposits.to]
    ];

    let typesFilter = types
      .filter(item => item.checked)
      .reduce(
        (total, current) => {
          total.push(["==", "type", current.slug]);

          return total;
        },
        ["any"]
      );

    filters.push(typesFilter);

    let roomsFilter = rooms
      .filter(item => item.checked)
      .reduce(
        (total, current) => {
          if (current.slug === "one") total.push(["==", "rooms", 1]);
          if (current.slug === "two") total.push(["==", "rooms", 2]);
          if (current.slug === "more") total.push([">", "rooms", 2]);
          if (current.slug === "any") total.push([">=", "rooms", 0]);

          return total;
        },
        ["any"]
      );

    filters.push(roomsFilter);

    this.mapcraft.map.setFilter("point-symbol-places", filters);
  };

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
    const { types, rooms, areas, rents, deposits, places } = this.state;

    console.log("******************")
    console.log(JSON.stringify(places))
    console.log("******************")

    if (places.features.length)
    this.mapcraft.fitBounds({
      geoJson: places
    });

    // If there's no need to use `this.mapcraft.geoJsons.places`, remove it and use `places` from the state
    let selectedTypes = types.filter(type => type.checked).map(type => type.slug);
    let selectedRooms = rooms.filter(room => room.checked).map(room => room.slug);

    if (this.mapcraft && this.mapcraft.geoJsons && this.mapcraft.geoJsons.places) {
      var places2 = { ...this.mapcraft.geoJsons.places };
      console.log("******************")
      console.log(JSON.stringify(places2))
      console.log("******************")
      let features = this.mapcraft.geoJsons.places.features.filter(feature => {
          let { type, rooms, area, rent, deposit } = feature.properties;
          return selectedTypes.includes(type) &&
                 ((selectedRooms.includes('any')) ||
                  (rooms === 1 && selectedRooms.includes('one')) ||
                  (rooms === 2 && selectedRooms.includes('two')) ||
                  (rooms > 2 && selectedRooms.includes('more'))) &&
                  area >= areas.from && area <= areas.to &&
                  rent >= rents.from && rent <= rents.to &&
                  deposit >= deposits.from && deposit <= deposits.to;
      });
  
      // Update state with filtered features
      this.setState({ places: { ...places2, features: features }});
      if (places2.features.length)
          this.mapcraft.fitBounds({
            geoJson: places2
          });
    }
    
    // If using Mapbox GL or similar, and you need to fit the map bounds to the new features
    // ensure you have a mechanism in place to do so once the state is updated
};


  handleChangeType = event => {
    let slug = event.target.getAttribute("data-type");
    let types = [...this.state.types].map(type => {
      if (type.slug === slug) type.checked = event.target.checked;

      return type;
    });

    this.setState({ types });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeRoom = event => {
    let slug = event.target.getAttribute("data-room");
    let rooms = [...this.state.rooms].map(room => {
      room.checked = room.slug === slug ? true : false;

      return room;
    });

    this.setState({ rooms });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  onChangeDataFilter = event => {

    var southWestData = {
      "type": "FeatureCollection",
      "features": [{
              "type": "Feature",
              "properties": {
                  "id": "item-0",
                  "title": "Southwest-Praesent ut ipsum nulla.",
                  "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                  "description": "Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Turpis in eu mi bibendum neque egestas. Nibh praesent tristique magna sit amet purus. Id aliquet risus feugiat in ante metus. Curabitur gravida arcu ac tortor. Vivamus arcu felis bibendum ut tristique et egestas. Nunc non blandit massa enim nec dui nunc mattis. Eu non diam phasellus vestibulum lorem. Risus commodo viverra maecenas accumsan lacus vel.",
                  "images": [{
                          "original": "/assets/images/original/apartment/2/1.jpg",
                          "thumbnail": "/assets/images/thumbnail/apartment/2/1.jpg"
                      },
                      {
                          "original": "/assets/images/original/apartment/2/2.jpg",
                          "thumbnail": "/assets/images/thumbnail/apartment/2/2.jpg"
                      },
                      {
                          "original": "/assets/images/original/apartment/2/3.jpg",
                          "thumbnail": "/assets/images/thumbnail/apartment/2/3.jpg"
                      }
                  ],
                  "type": "apartment",
                  "rooms": 1,
                  "area": 97,
                  "rent": 20900,
                  "deposit": 83000
              },
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      -63.571602,
                      44.636379
                  ]
              }
          },
          {
              "type": "Feature",
              "properties": {
                  "id": "item-1",
                  "title": "Southwest-Praesent ut ipsum nulla.",
                  "excerpt": "Praesent ullamcorper dui molestie augue hendrerit finibus. Praesent ut ipsum nulla.",
                  "description": "Erat velit scelerisque in dictum non consectetur a erat nam. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Pretium aenean pharetra magna ac placerat vestibulum lectus. Augue mauris augue neque gravida in fermentum et. Eros in cursus turpis massa tincidunt. Leo in vitae turpis massa sed elementum tempus egestas. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur.",
                  "images": [{
                          "original": "/assets/images/original/apartment/3/1.jpg",
                          "thumbnail": "/assets/images/thumbnail/apartment/3/1.jpg"
                      },
                      {
                          "original": "/assets/images/original/apartment/3/2.jpg",
                          "thumbnail": "/assets/images/thumbnail/apartment/3/2.jpg"
                      },
                      {
                          "original": "/assets/images/original/apartment/3/3.jpg",
                          "thumbnail": "/assets/images/thumbnail/apartment/3/3.jpg"
                      }
                  ],
                  "type": "apartment",
                  "rooms": 1,
                  "area": 52,
                  "rent": 10900,
                  "deposit": 32000
              },
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      -63.571461,
                      44.628948
                  ]
              }
          },
          {
              "type": "Feature",
              "properties": {
                  "id": "item-2",
                  "title": "Southwest-Orci varius natoque penatibus",
                  "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.",
                  "images": [{
                          "original": "/assets/images/original/shared/3/1.jpg",
                          "thumbnail": "/assets/images/thumbnail/shared/3/1.jpg"
                      },
                      {
                          "original": "/assets/images/original/shared/3/2.jpg",
                          "thumbnail": "/assets/images/thumbnail/shared/3/2.jpg"
                      },
                      {
                          "original": "/assets/images/original/shared/3/3.jpg",
                          "thumbnail": "/assets/images/thumbnail/shared/3/3.jpg"
                      }
                  ],
                  "type": "shared",
                  "rooms": 2,
                  "area": 99,
                  "rent": 21800,
                  "deposit": 65000
              },
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      -63.57958666863994,
                      44.64103165
                  ]
              }
          },
          {
            "type": "Feature",
            "properties": {
                "id": "item-2",
                "title": "Southwest-Orci varius natoque penatibus",
                "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.",
                "images": [{
                        "original": "/assets/images/original/shared/3/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/shared/3/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/shared/3/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/3.jpg"
                    }
                ],
                "type": "shared",
                "rooms": 2,
                "area": 99,
                "rent": 21800,
                "deposit": 65000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                  -63.58014346185526	,
                    44.63114815
                ]
            }
        }
      ]
  }

  var publicData = {
    "type": "FeatureCollection",
    "features": [{
            "type": "Feature",
            "properties": {
                "id": "item-0",
                "title": "public-Praesent ut ipsum nulla.",
                "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                "description": "Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Turpis in eu mi bibendum neque egestas. Nibh praesent tristique magna sit amet purus. Id aliquet risus feugiat in ante metus. Curabitur gravida arcu ac tortor. Vivamus arcu felis bibendum ut tristique et egestas. Nunc non blandit massa enim nec dui nunc mattis. Eu non diam phasellus vestibulum lorem. Risus commodo viverra maecenas accumsan lacus vel.",
                "images": [{
                        "original": "/assets/images/original/apartment/2/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/2/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/2/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/2/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/2/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/2/3.jpg"
                    }
                ],
                "type": "apartment",
                "rooms": 1,
                "area": 97,
                "rent": 20900,
                "deposit": 83000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.571602,
                    44.636379
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "item-1",
                "title": "public-Praesent ut ipsum nulla.",
                "excerpt": "Praesent ullamcorper dui molestie augue hendrerit finibus. Praesent ut ipsum nulla.",
                "description": "Erat velit scelerisque in dictum non consectetur a erat nam. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Pretium aenean pharetra magna ac placerat vestibulum lectus. Augue mauris augue neque gravida in fermentum et. Eros in cursus turpis massa tincidunt. Leo in vitae turpis massa sed elementum tempus egestas. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur.",
                "images": [{
                        "original": "/assets/images/original/apartment/3/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/3/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/3/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/3/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/3/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/3/3.jpg"
                    }
                ],
                "type": "apartment",
                "rooms": 1,
                "area": 52,
                "rent": 10900,
                "deposit": 32000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.571461,
                    44.628948
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "item-2",
                "title": "public-Orci varius natoque penatibus",
                "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.",
                "images": [{
                        "original": "/assets/images/original/shared/3/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/shared/3/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/shared/3/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/3.jpg"
                    }
                ],
                "type": "shared",
                "rooms": 2,
                "area": 99,
                "rent": 21800,
                "deposit": 65000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.57958666863994,
                    44.64103165
                ]
            }
        },
        {
          "type": "Feature",
          "properties": {
              "id": "item-2",
              "title": "public-Orci varius natoque penatibus",
              "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
              "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.",
              "images": [{
                      "original": "/assets/images/original/shared/3/1.jpg",
                      "thumbnail": "/assets/images/thumbnail/shared/3/1.jpg"
                  },
                  {
                      "original": "/assets/images/original/shared/3/2.jpg",
                      "thumbnail": "/assets/images/thumbnail/shared/3/2.jpg"
                  },
                  {
                      "original": "/assets/images/original/shared/3/3.jpg",
                      "thumbnail": "/assets/images/thumbnail/shared/3/3.jpg"
                  }
              ],
              "type": "shared",
              "rooms": 2,
              "area": 99,
              "rent": 21800,
              "deposit": 65000
          },
          "geometry": {
              "type": "Point",
              "coordinates": [
                -63.58014346185526	,
                  44.63114815
              ]
          }
      }
    ]
}

  var compeData = {
    "type": "FeatureCollection",
    "features": [{
            "type": "Feature",
            "properties": {
                "id": "item-0",
                "title": "compe-Praesent ut ipsum nulla.",
                "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                "description": "Phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Sed euismod nisi porta lorem mollis aliquam ut porttitor leo. Morbi enim nunc faucibus a pellentesque sit amet porttitor. Turpis in eu mi bibendum neque egestas. Nibh praesent tristique magna sit amet purus. Id aliquet risus feugiat in ante metus. Curabitur gravida arcu ac tortor. Vivamus arcu felis bibendum ut tristique et egestas. Nunc non blandit massa enim nec dui nunc mattis. Eu non diam phasellus vestibulum lorem. Risus commodo viverra maecenas accumsan lacus vel.",
                "images": [{
                        "original": "/assets/images/original/apartment/2/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/2/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/2/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/2/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/2/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/2/3.jpg"
                    }
                ],
                "type": "apartment",
                "rooms": 1,
                "area": 97,
                "rent": 20900,
                "deposit": 83000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.571602,
                    44.636379
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "item-1",
                "title": "compe-Praesent ut ipsum nulla.",
                "excerpt": "Praesent ullamcorper dui molestie augue hendrerit finibus. Praesent ut ipsum nulla.",
                "description": "Erat velit scelerisque in dictum non consectetur a erat nam. Pellentesque pulvinar pellentesque habitant morbi tristique senectus et. Pretium aenean pharetra magna ac placerat vestibulum lectus. Augue mauris augue neque gravida in fermentum et. Eros in cursus turpis massa tincidunt. Leo in vitae turpis massa sed elementum tempus egestas. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur.",
                "images": [{
                        "original": "/assets/images/original/apartment/3/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/3/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/3/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/3/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/apartment/3/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/apartment/3/3.jpg"
                    }
                ],
                "type": "apartment",
                "rooms": 1,
                "area": 52,
                "rent": 10900,
                "deposit": 32000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.571461,
                    44.628948
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "id": "item-2",
                "title": "compe-Orci varius natoque penatibus",
                "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
                "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.",
                "images": [{
                        "original": "/assets/images/original/shared/3/1.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/1.jpg"
                    },
                    {
                        "original": "/assets/images/original/shared/3/2.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/2.jpg"
                    },
                    {
                        "original": "/assets/images/original/shared/3/3.jpg",
                        "thumbnail": "/assets/images/thumbnail/shared/3/3.jpg"
                    }
                ],
                "type": "shared",
                "rooms": 2,
                "area": 99,
                "rent": 21800,
                "deposit": 65000
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -63.57958666863994,
                    44.64103165
                ]
            }
        },
        {
          "type": "Feature",
          "properties": {
              "id": "item-2",
              "title": "compe-Orci varius natoque penatibus",
              "excerpt": "Orci varius natoque penatibus et magnis dis parturient montes.",
              "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Faucibus in ornare quam viverra orci sagittis eu volutpat. Diam ut venenatis tellus in metus vulputate eu. Quam quisque id diam vel quam elementum pulvinar etiam. Imperdiet massa tincidunt nunc pulvinar. Velit aliquet sagittis id consectetur purus ut. Libero enim sed faucibus turpis in eu mi bibendum. Aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc.",
              "images": [{
                      "original": "/assets/images/original/shared/3/1.jpg",
                      "thumbnail": "/assets/images/thumbnail/shared/3/1.jpg"
                  },
                  {
                      "original": "/assets/images/original/shared/3/2.jpg",
                      "thumbnail": "/assets/images/thumbnail/shared/3/2.jpg"
                  },
                  {
                      "original": "/assets/images/original/shared/3/3.jpg",
                      "thumbnail": "/assets/images/thumbnail/shared/3/3.jpg"
                  }
              ],
              "type": "shared",
              "rooms": 2,
              "area": 99,
              "rent": 21800,
              "deposit": 65000
          },
          "geometry": {
              "type": "Point",
              "coordinates": [
                -63.58014346185526	,
                  44.63114815
              ]
          }
      }
    ]
}
    let slug = event.target.getAttribute("data-datafilter");
    let dataFilter = [...this.state.dataFilter].map(dataFilter => {
      dataFilter.checked = dataFilter.slug === slug ? true : false;
      return dataFilter;
    });

    if(slug == "public"){
    fetch('http://54.196.154.157:8070/map/public-listings?records_limit=20')
    .then(response => response.json())
    .then(data => {
      const geoJsonData = {
        "type": "FeatureCollection",
        "features": data.map((item, index) => ({
          "type": "Feature",
          "properties": {
            "id": `item-${index}`,
            "title": item.property_management_name,
            "excerpt": item.address,
            "description": item.description,
            "images": [{
                "original": item.property_image,
                "thumbnail": item.property_image // Assuming the same image for both
            }],
            // Add or adjust properties as necessary
            "type": item.property_type || "apartment",
            "rooms": item.bedroom_count,
            "area": parseInt(item.apartment_size, 10),
            "rent": parseInt(item.monthly_rent, 10),
            "deposit": 0, // Adjust as needed
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              parseFloat(item.add_long),
              parseFloat(item.add_lat)
            ]
          }
        }))
      };

      this.setState({places: geoJsonData })
      this.mapcraft.map.getSource('places-data').setData(publicData);
      if (publicData.features.length)
      this.mapcraft.fitBounds({
        geoJson: publicData
      });

      this.InitializeMap(geoJsonData);
      this.setState({dataFilter})
      console.log("slugggggggggggggggg"+slug)
      // this.InitializeMap(this.state.places)
      this.handleChangeTour("end-tour");

      // setPropertyData2(data)
    })
    .catch(error => console.error('Error fetching data:', error));

      // this.setState({ places: publicData });
      // this.mapcraft.map.getSource('places-data').setData(publicData);
      // if (publicData.features.length)
      // this.mapcraft.fitBounds({
      //   geoJson: publicData
      // });

    }else if(slug == "southwest"){
      // this.setState({ places: southWestData });
      // this.mapcraft.map.getSource('places-data').setData(southWestData);

      // if (southWestData.features.length)
      // this.mapcraft.fitBounds({
      //   geoJson: southWestData
      // });

      fetch('http://54.196.154.157:8070/map/southwest-listings?records_limit=20')
      .then(response => response.json())
      .then(data => {
        const geoJsonData = {
          "type": "FeatureCollection",
          "features": data.map((item, index) => ({
            "type": "Feature",
            "properties": {
              "id": `item-${index}`,
              "title": item.property_management_name,
              "excerpt": item.address,
              "description": item.description,
              "images": [{
                  "original": item.property_image,
                  "thumbnail": item.property_image // Assuming the same image for both
              }],
              // Add or adjust properties as necessary
              "type": item.property_type || "apartment",
              "rooms": item.bedroom_count,
              "area": parseInt(item.apartment_size, 10),
              "rent": parseInt(item.monthly_rent, 10),
              "deposit": 0, // Adjust as needed
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                parseFloat(item.add_long),
                parseFloat(item.add_lat)
              ]
            }
          }))
        };
  
        this.setState({places: geoJsonData })
        this.mapcraft.map.getSource('places-data').setData(publicData);
        if (publicData.features.length)
        this.mapcraft.fitBounds({
          geoJson: publicData
        });
  
        this.InitializeMap(geoJsonData);
        this.setState({dataFilter})
        console.log("slugggggggggggggggg"+slug)
        // this.InitializeMap(this.state.places)
        this.handleChangeTour("end-tour");
  
        // setPropertyData2(data)
      })
      .catch(error => console.error('Error fetching data:', error));

      
    }else{
      // this.setState({ places: compeData });
      // this.mapcraft.map.getSource('places-data').setData(compeData);

      // if (compeData.features.length)
      // this.mapcraft.fitBounds({
      //   geoJson: compeData
      // });

      fetch('http://54.196.154.157:8070/map/comp-listings?records_limit=20')
      .then(response => response.json())
      .then(data => {
        const geoJsonData = {
          "type": "FeatureCollection",
          "features": data.map((item, index) => ({
            "type": "Feature",
            "properties": {
              "id": `item-${index}`,
              "title": item.property_management_name,
              "excerpt": item.address,
              "description": item.description,
              "images": [{
                  "original": item.property_image,
                  "thumbnail": item.property_image // Assuming the same image for both
              }],
              // Add or adjust properties as necessary
              "type": item.property_type || "apartment",
              "rooms": item.bedroom_count,
              "area": parseInt(item.apartment_size, 10),
              "rent": parseInt(item.monthly_rent, 10),
              "deposit": 0, // Adjust as needed
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                parseFloat(item.add_long),
                parseFloat(item.add_lat)
              ]
            }
          }))
        };
  
        this.setState({places: geoJsonData })
        this.mapcraft.map.getSource('places-data').setData(publicData);
        if (publicData.features.length)
        this.mapcraft.fitBounds({
          geoJson: publicData
        });
  
        this.InitializeMap(geoJsonData);
        this.setState({dataFilter})
        // this.InitializeMap(this.state.places)
        this.handleChangeTour("end-tour");
  
        // setPropertyData2(data)
      })
      .catch(error => console.error('Error fetching data:', error));
  
    }
   
   
    // this.handleFilter();
    // this.handleGeoJson();
  }

  handleChangeArea = value => {
    let areas = { ...this.state.areas };

    areas.from = value.min;
    areas.to = value.max;

    this.setState({ areas });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeRent = value => {
    let rents = { ...this.state.rents };

    rents.from = value.min;
    rents.to = value.max;

    this.setState({ rents });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeDeposit = value => {
    let deposits = { ...this.state.deposits };

    deposits.from = value.min;
    deposits.to = value.max;

    this.setState({ deposits });

    this.handleChangeTour("end-tour");
    this.handleFilter();
    this.handleGeoJson();
  };

  handleChangeTour = action => {
    let features = this.state.places.features;
    let lastIndex = features.length - 1;
    let tourActive = this.state.tourActive;
    let tourIndex = this.state.tourIndex;

    this.handleChangeSlide(false);

    if (action === "start-tour") {
      tourActive = true;

      tourIndex = 0;
    }

    if (action === "end-tour") {
      tourActive = false;

      tourIndex = 0;

      this.mapcraft.closePopup();

      this.handleChangeSlide(true);
    }

    if (action === "restart") tourIndex = 0;

    if (action === "next" && tourIndex < lastIndex) tourIndex += 1;

    if (action === "prev" && tourIndex > 0) tourIndex -= 1;

    if (tourActive) {
      let feature = features[tourIndex];

      let lnglat = {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1]
      };

      this.mapcraft.flyTo({
        lnglat: lnglat,
        zoom: 15
      });

      this.openPopup(feature.properties, lnglat);
    }

    this.setState({ tourActive, tourIndex });
  };

  InitializeMap = (placevar) => {
    this.mapcraft = new Mapcraft({
      env: {
        mapbox: {
          token:
            "pk.eyJ1IjoiYXlkaW5naGFuZSIsImEiOiJjazJpcXB1Zm8xamNvM21sNjlsMG95ejY3In0.jMuteEFuzviEuitJZ-DY2w"
        }
      },
      styles: {
        light: "mapbox://styles/mapbox/streets-v11"
      },
      map: {
        container: "app-map",
        center: [5, 60],
        zoom: 5,
        pitch: 50,
        bearing: 0,
        hash: false
      },
      controls: {
        fullscreen: false,
        geolocation: false,
        navigation: true
      }
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
    });

    this.mapcraft.load().then(() => {
      const img = new Image();
    img.onload = () => {
      // Once the image is loaded, add it to the map
      this.mapcraft.map.addImage('apartment-icon', img);

      // Add your source and layer using the added image here
      this.mapcraft.map.addSource('places-data', {
        type: 'geojson',
        data: placevar,
      });
      
      this.mapcraft.map.addLayer({
        id: 'point-symbol-places',
        type: 'symbol',
        source: 'places-data',
        layout: {
          'icon-image': 'apartment-icon', // Reference the ID used in addImage
          'icon-size': 1.0,
        },
      });
    };
    img.onerror = (err) => { throw err; };
    img.src = im1;

      
      this.handleFilter();

      setTimeout(() => {
        this.handleGeoJson();
      }, 2000);

      setTimeout(() => {
        this.handleChangeSlide(true);
      }, 5000);

      this.mapcraft.map.on("click", "point-symbol-places", event => {
        let properties = event.features[0].properties;
        let coordinates = event.features[0].geometry.coordinates.slice();

        while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        this.openPopup(properties, coordinates);
      });
    });
  };

  handleFirstProperty2 = () => {
    this.setState({ firstPropertySelected: !this.state.firstPropertySelected });
  }

  handleSecondProperty2 = () => {
    this.setState({ secondPropertySelected: !this.state.secondPropertySelected });
  }

  openPopup = (properties, lnglat) => {
    if (typeof properties.images !== "object")
      properties.images = JSON.parse(properties.images);

    properties.typeName = this.state.types.filter(
      t => t.slug === properties.type
    )[0].name;

    let {
      title,
      images,
      excerpt,
      typeName,
      rooms,
      area,
      rent,
      deposit
    } = properties;

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
                <td>${rooms}</td>
              </tr>

              <tr>
                <td>Area</td>
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
    </div>`;

    this.mapcraft.openPopup({
      lnglat: lnglat,
      html: html
    });

    document.querySelectorAll(".app-page-trigger").forEach(element => {
      element.addEventListener("click", () => {
        this.handleChangePage(true);

        this.setState({ page: properties });
      });
    });

  //   document.querySelector('.first-property-button').addEventListener('click', () => {
  //     this.handleFirstProperty2();
  //   });

  //   document.querySelector('.second-property-button').addEventListener('click', () => {
  //     this.handleSecondProperty2();
  // });
  };
}

export default App;
