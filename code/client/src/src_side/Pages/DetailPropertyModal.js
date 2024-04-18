import React from 'react';
import Modal from 'src/src_map/components/Modal';
import uparrow from '../../src_side/assets/uparrow.png'
import downarrow from '../../src_side/assets/downarrow.png'
import blackByLogo from '../../src_side/assets/blackByLogo.png'
import dummyImg from '../../src_map/dummyImg.jpg'

const DetailPropertyModal = ({ isOpen, onClose, property }) => {
    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between', // Spread the title and the predicted rent across the header space
        alignItems: 'baseline', // Align items along their baseline for a uniform look
        width: '100%' // Ensure the header uses the full width of the modal content area
    };

    const highlightStyle = {
        color: '#FF5722', // a bright color for highlighting
        fontSize: '1.2rem', // slightly larger font size for emphasis
        fontWeight: 'bold'
    };
    const handleImageError = (e) => {
        e.target.src = dummyImg; // Set the source to your dummy image
      };
    return (
        <Modal isOpen={isOpen} onClose={onClose} style={modalStyle}>
            <div style={modalContentStyle}>
                <img src={property.image || dummyImg} alt="Property" style={imageStyle} onError={handleImageError} />
                <div style={detailsStyle}>
                    <div style={headerStyle}>
                        <h2>{property.listing_name}</h2>
                        {property.predicted_rent && <span style={highlightStyle}><u>Predicted Rent: ${property.predicted_rent} / month</u></span>}
                        {property.rent_difference != null ? 
                    parseFloat(property.rent_difference) < 0 ? 
                    <img src={uparrow} alt="Up" height="15" width="15"/> : 
                    <img src={downarrow} alt="Down" height="15" width="15"/>
                    : null
                  }
                    </div>
                    <div style={detailsGridStyle}>
                        <div><b>Bedrooms:</b> {property.bedroom_count}</div>
                        <div><b>Bathrooms:</b> {property.bathroom_count}</div>
                        <div><b>Monthly Rent:</b> {property.monthly_rent == "-1" ? "n/a" : "$"+property.monthly_rent }</div>
                        <div><b>Parking Availability:</b> {property.parking_availability}</div>
                        <div><b>Source:</b> <a href={property.source} target="_blank" rel="noopener noreferrer">{property.source}</a></div>
                        <div><b>Website:</b> <a href={property.website} target="_blank" rel="noopener noreferrer">{property.website}</a></div>
                        <div><b><u>Distance from : </u></b></div>
                        <div></div>
                        <div><b>Hospital:</b> {parseFloat(property.dist_hospital).toFixed(2)} miles</div>
                        <div><b>School:</b> {parseFloat(property.dist_school).toFixed(2)} miles</div>
                        <div><b>Restaurant:</b> {parseFloat(property.dist_restaurant).toFixed(2)} miles</div>
                        <div><b>Downtown:</b> {parseFloat(property.dist_downtown).toFixed(2)} miles</div>
                        <div><b>Bus Stop:</b> {parseFloat(property.dist_busstop).toFixed(2)} miles</div>
                        <div><b>Larry Uteck Area:</b> {parseFloat(property.dist_larry_uteck_area).toFixed(2)} miles</div>
                        <div><b>Central Halifax:</b> {parseFloat(property.dist_central_halifax).toFixed(2)} miles</div>
                        <div><b>Clayton Park:</b> {parseFloat(property.dist_clayton_park).toFixed(2)} miles</div>
                        <div><b>Rockingham:</b> {parseFloat(property.dist_rockingham).toFixed(2)} miles</div>
                        <div></div>

                        <div><b>Description:</b> {property.description}</div>

                    </div>
                    <button onClick={onClose} style={buttonStyle}>Close</button>
                </div>
            </div>
        </Modal>
    );

};


const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    width: '90%',
};

const modalContentStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    overflow: 'auto', 
};

const imageStyle = {
    width: '30%',
    height: 'auto',
    borderRadius: '8px',
    marginRight: '20px',
};

const detailsStyle = {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    wordWrap: 'break-word',
};

const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Two columns of equal width
    gap: '10px', // Space between the grid items
    marginBottom: '10px', // Space below the grid before the close button
    overflow: 'auto',
};

const distanceStyle = {
    gridColumn: '1 / -1', // Span across all columns
    fontWeight: 'bold',
    marginTop: '10px',
};

const fullWidthStyle = {
    gridColumn: '1 / -1', // Span across all columns for full width
};

const buttonStyle = {
    padding: '10px 20px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    width: '100%', // Ensure button width matches the modal width
    textAlign: 'center',
    wordWrap: 'break-word',
};

export default DetailPropertyModal;
