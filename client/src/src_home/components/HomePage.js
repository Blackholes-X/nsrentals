import React, { useState,useEffect } from 'react';
import './Navbar/style.css'; // Importing CSS file
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


const HomePage = () => {
   
    return (
        <div className="wrapper">
            <p>This is home page</p>

        </div>
    );
}

export default HomePage;
