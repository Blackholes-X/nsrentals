import React, { useEffect, useState } from "react";

function Sample() {
  const [message, setMessage] = useState(""); // State to store the response

  useEffect(() => {
    // Function to fetch data from the backend
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/sample`
      );
      const data = await response.text(); // Assuming the response is just plain text
      setMessage(data); // Set the message state with the response
    };

    fetchData().catch(console.error); // Fetch data from the backend and catch any error
  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
    <div>
      <h1>Welcome to the Sample Component!</h1>
      <p>This is a simple component called by App.js.</p>
      {/* Display the response from the backend */}
      <p>Response from backend: {message}</p>
    </div>
  );
}

export default Sample;
