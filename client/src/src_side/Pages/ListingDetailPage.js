import React from 'react';

const ListingDetailPage = ({ item }) => {
  return (
    <div style={styles.container}>
      <img src={item.image} alt={item.listing_name} style={styles.image} />
      <h2 style={styles.heading}>{item.listing_name}</h2>
      <p><strong>Address:</strong> {item.address}</p>
      <p><strong>Property Management Name:</strong> {item.property_management_name}</p>
      <p><strong>Monthly Rent:</strong> {item.monthly_rent}</p>
      <p><strong>Bedroom Count:</strong> {item.bedroom_count}</p>
      <p><strong>Bathroom Count:</strong> {item.bathroom_count}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Availability Status:</strong> {item.availability_status}</p>
      <a href={item.source} target="_blank" rel="noopener noreferrer" style={styles.link}>View Source</a>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
    borderRadius: '5px',
  },
  heading: {
    color: '#333',
    fontSize: '24px',
    marginBottom: '10px',
  },
  link: {
    display: 'block',
    marginTop: '20px',
    textDecoration: 'none',
    color: 'blue',
  }
};

export default ListingDetailPage;
