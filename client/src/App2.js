import React from "react";
import "./App.css";
// Import the Sample component
import Sample from "./pages/Sample/Sample"; // Make sure the path matches the location of your Sample.js file

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Render the Sample component as part of the app */}
        <Sample />
        <a
          className="App-link"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nova Scotial Rentals - A work in progress by Blackholes
        </a>
      </header>
    </div>
  );
}

export default App;
