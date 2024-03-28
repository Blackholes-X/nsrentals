import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App'
import App from './src_map/components/app'
import App_home from './src_home/App_home'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import 'stylecraft/dist/stylecraft.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import './css/index.css'
import './css/fonts.css'
import './css/input-range.css'
import './css/hacks.css'
import './css/mapbox-hacks.css'
import { GoogleOAuthProvider } from "@react-oauth/google"
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    
    <BrowserRouter>
     <App_home/>
    </BrowserRouter>
   
  </Provider>,
  // </GoogleOAuthProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
