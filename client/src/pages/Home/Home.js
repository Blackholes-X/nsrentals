import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to navigate to Competitors page
  const goToCompetitors = () => {
    navigate("/Competitors");
  };

  return (
    <div className="home-container">
      <h1>Nova Scotia Rentals</h1>
      <p>Powered by @Blackholes-X</p>
      <button onClick={goToCompetitors} className="navigate-button">
        Go to Competitors Analysis
      </button>
    </div>
  );
}

export default Home;
