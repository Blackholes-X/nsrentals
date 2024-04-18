import React, { useState, useEffect } from 'react';
import Modal from 'src/src_map/components/Modal';

const EditPropertyModal = ({ isOpen, onClose, property, onSave }) => {
    const [formData, setFormData] = useState({
        listing_name: '',
        address: '',
        bedroom_count: '',
        bathroom_count: '',
        monthly_rent: '',
        dist_hospital: '',
        dist_school: '',
        dist_restaurant: '',
        dist_downtown: '',
        dist_busstop: '',
        dist_larry_uteck_area: '',
        dist_central_halifax: '',
    });

    useEffect(() => {
        if (property) {
            setFormData({
                listing_name: property.listing_name || '',
                address: property.address || '',
                bedroom_count: property.bedroom_count || '',
                bathroom_count: property.bathroom_count || '',
                monthly_rent: property.monthly_rent || '',
                dist_hospital: property.dist_hospital || '',
                dist_school: property.dist_school || '',
                dist_restaurant: property.dist_restaurant || '',
                dist_downtown: property.dist_downtown || '',
                dist_busstop: property.dist_busstop || '',
                dist_larry_uteck_area: property.dist_larry_uteck_area || '',
                dist_central_halifax: property.dist_central_halifax || '',
            });
        }
    }, [property]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(property.id, formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} style={modalStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h2 style={headingStyle}>Edit Property Details</h2>
                <div style={inputGridStyle}>
                {Object.keys(formData).map((key) => (
    key !== 'id' && (
        <div style={formGroupStyle} key={key}>
            <label style={labelStyle}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
            </label>
            <input 
                type="text" 
                name={key} 
                value={
                    formData[key] === -1 ? "N/A" :
                    (typeof formData[key] === 'number' && formData[key] % 1 !== 0 ? formData[key].toFixed(2) : formData[key])
                }
                onChange={handleChange} 
                style={inputStyle} 
            />
        </div>
    )
))}

                </div>
                <div style={buttonGroupStyle}>
                    <button type="submit" style={buttonStyle}>Save Changes</button>
                    <button type="button" onClick={onClose} style={buttonCancelStyle}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

const modalStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
};

const headingStyle = {
    marginBottom: '1px',
};

const inputGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr', // Two columns of equal width
    gap: '5px', // Space between the grid items
};

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px',
};

const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
};

const inputStyle = {
    padding: '7px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
};

const buttonGroupStyle = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
};

const buttonStyle = {
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

const buttonCancelStyle = {
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontWeight: 'bold',
};

export default EditPropertyModal;
