import MotionHoc from "./MotionHoc";
import React, { useState, useEffect } from 'react';
import PropetyDetailPage from "./PropetyDetailPage";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Typewriter from "../componant/Typewriter";

const Dashboard = () => {

  return (
    <div style={styles.container}>
      <div style={styles.cardsContainer}>
      <iframe title="MCDA_Datamining_Hackathon" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=bf6b3425-045a-4387-86d6-2c73e598e2b7&autoAuth=true&ctid=4711194d-93f6-4861-9472-a801087b4888" frameborder="0" allowFullScreen="true"></iframe>
      </div>
    </div>
  );
};


const Home2 = () => {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
};

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={{ margin: 0, fontSize: '15px',  textAlign: 'center' }}>Dashboard</h1>
    </div>
  );
};

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
};
export default Home2;