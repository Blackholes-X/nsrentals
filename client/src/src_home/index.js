import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App_home from './App_home';
import { GoogleOAuthProvider } from "@react-oauth/google"
ReactDOM.render(
  // <GoogleOAuthProvider clientId='835958615002-sv7nh5gls60un3085qtm8374qfjrdf22.apps.googleusercontent.com'>
  <React.StrictMode>
    <App_home />
  </React.StrictMode>,
// </GoogleOAuthProvider>
);
