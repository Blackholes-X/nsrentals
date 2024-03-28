import React, { Component } from "react";
import InputRange from "react-input-range";
import photo1 from "../icon-apartment.png"
class Sreach extends Component {
  state = {
    firstPropertySelected: false,
    secondPropertySelected: false
  };

  handleFirstProperty = () => {
    this.setState({ firstPropertySelected: !firstPropertySelected });
  };

  handleSecondProperty = () => {
    this.setState({ secondPropertySelected: !secondPropertySelected });
  };

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
      secondPropertySelected
    } = this.props;
    const fileUploadLabelStyle = {
      cursor: 'pointer',
      display: 'inline-block',
      padding: '10px 15px',
      border: '2px solid #ddd',
      borderRadius: '5px', // Making it square
      color: '#555',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#f0f0f0'
      },
      'i': {
        marginRight: '5px'
      },
      width: '95%', // Set width to match height
      height: '100px', // Set height
      textAlign: 'center',
      lineHeight: '100px' // Center content vertically
    };

    const fileUploadSelectedLabelStyle = {
      cursor: 'pointer',
      display: 'inline-block',
      padding: '10px 15px',
      border: '2px solid green',
      borderRadius: '5px', // Making it square
      color: '#555',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#f0f0f0'
      },
      'i': {
        marginRight: '5px'
      },
      width: '95%', // Set width to match height
      height: '100px', // Set height
      textAlign: 'center',
      lineHeight: '100px' // Center content vertically
    };
    

    const fileUploadInputStyle = {
      display: 'none'
    };

    return (
      <React.Fragment>
        <header className="sc-slide-header">
          <h5>Comparision</h5>

          <i
            className="sc-icon-menu sc-slide-toggle"
            onClick={() => {
              onChangeSlide(!slideOpen);
            }}
          ></i>
        </header>

        <div className="sc-slide-body">
          <form className="sc-form">
          

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Applying inline style */}
          <h6>Select Southwest property</h6>
          <label htmlFor="file-upload" style={firstPropertySelected ? fileUploadSelectedLabelStyle : fileUploadLabelStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <i className="fas fa-cloud-upload-alt" style={{ marginBottom: '5px' }}></i>
              <img src={photo1} alt="client" />                           
              First Property
            </div>
          </label>
        </div>

        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Applying inline style */}
          <h6>Select any other property</h6>
          <label htmlFor="file-upload" style={secondPropertySelected ? fileUploadSelectedLabelStyle : fileUploadLabelStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <i className="fas fa-cloud-upload-alt" style={{ marginBottom: '5px' }}></i>
              <img src={photo1} alt="client" />                           
              Second Property
            </div>
          </label>
        </div>

        <header className="sc-slide-header">
          <h5>Filters</h5>

         
        </header>

        <h6>Data filter</h6>

        <div className="sc-form-group sc-grid-2">
          { dataFilter.map((dataFilter, index) => {
            return (
              <div className="sc-form-radio" key={index}>
                <input
                  type="radio"
                  name="dataFilter"
                  id={dataFilter.slug}
                  data-datafilter={dataFilter.slug}
                  checked={dataFilter.checked}
                  onChange={event => {
                    onChangeDataFilter(event);
                  }}
                />

                <label htmlFor={dataFilter.slug}>
                  <i className="sc-icon-radio"></i>

                  <span>{dataFilter.name}</span>
                </label>
              </div>
            );
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
                      onChange={event => {
                        onChangeType(event);
                      }}
                    />

                    <label htmlFor={type.slug}>
                      <i className="sc-icon-checkbox"></i>

                      <span>{type.name}</span>
                    </label>
                  </div>
                );
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
                      onChange={event => {
                        onChangeRoom(event);
                      }}
                    />

                    <label htmlFor={room.slug}>
                      <i className="sc-icon-radio"></i>

                      <span>{room.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>

            <h6>Area</h6>

            <div className="sc-form-group sc-grid-1">
              <InputRange
                maxValue={200}
                minValue={20}
                step={5}
                value={{ min: areas.from, max: areas.to }}
                onChange={value => {
                  onChangeArea(value);
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
                onChange={value => {
                  onChangeRent(value);
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
                onChange={value => {
                  onChangeDeposit(value);
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
                  onChangeTour("start-tour");
                }}
              >
                <i className="sc-icon-route"></i>

                <span>Tour through the results</span>
              </button>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Sreach;
