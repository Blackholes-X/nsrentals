import React, { useEffect } from 'react';
import AOS from 'aos';
import "aos/dist/aos.css";
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
// All pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import DemoProduct from './pages/DemoProduct'
// import Login from './components/Login';
import {useDocTitle} from './components/CustomHook'
import ScrollToTop from './components/ScrollToTop'
// import Login from 'src/views/pages/login/Login';
// import Login from 'src/views/pages/login/Login';
import Login from '../src_home/components/Login'
import HomePage from './components/HomePage'
import '../src_side/index.css'
import Team from 'src/src_side/Pages/Team'
import Home2 from 'src/src_side/Pages/Home2'
import Calender from "src/src_side/Pages/Calender"
import Documents from "src/src_side/Pages/Documents"
import Projects from "src/src_side/Pages/Projects"
import styled from "styled-components"
import Sidebar from 'src/src_side/Sidebar'
import { GoogleOAuthProvider } from "@react-oauth/google"
import App from 'src/src_map/components/app'
import PropetyDetailPage from 'src/src_side/Pages/PropetyDetailPage';
import PropertyList from 'src/src_side/Pages/PropertyList';
function App_home() {


  useEffect(() => {
    const aos_init = () => {
      AOS.init({
        once: true,
        duration: 1000,
        easing: 'ease-out-cubic',
      });
    }

    window.addEventListener('load', () => {
      aos_init();
    });
  }, []);

  useDocTitle("Hello | By Blackholes");

  const LoginWithOAuth = () => {
    return (
      <GoogleOAuthProvider clientId='835958615002-sv7nh5gls60un3085qtm8374qfjrdf22.apps.googleusercontent.com'>
        <Login/>
      </GoogleOAuthProvider>
    );
  };

  function loadTeamElement(){
    return(
      <>
      <Sidebar/>
      <PagesForCopititorPage>
      <Team/>
      </PagesForCopititorPage>
      </>
    )
  }

  function loadHomeElement(){
    return(
      <>
      <Sidebar/>
      <Pages>
      <Home2/>
      </Pages>
      </>
    )
  }

  function loadCalenderElement(){
    return(
      <>
      {/* <Sidebar/> */}
      {/* <Pages> */}
      <App/>
      {/* </Pages> */}
      </>
    )
  }

  function loadDocumentsElement(){
    return(
      <>
      <Sidebar/>
      <PagesForCopititorPage>
      <Documents/>
      </PagesForCopititorPage>
      </>
    )
  }

  function loadProjectsElement(){
    return(
      <>
      <Sidebar/>
      <PagesForCopititorPage>
      <Projects/>
      </PagesForCopititorPage>
      </>
    )
  }

  
  function loadPropertyDetailElement(){
    return(
      <>
      <Sidebar/>
      <PagesForCopititorPage>
      <PropetyDetailPage/>
      </PagesForCopititorPage>
      </>
    )
  }

  function loadPropertyListElement(){
    return(
      <>
      <Sidebar/>
      <PagesForCopititorPage>
      <PropertyList/>
      </PagesForCopititorPage>
      </>
    )
  }




  const Pages = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: calc(2rem + 2vw);
    background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const PagesForCopititorPage = styled.div`
  width: 100vw;
  height: 100vh;
  // display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: calc(2rem + 2vw);
    background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

  return (
    <>
      {/* <Router> */}

        <ScrollToTop>
          {/* <GoogleOAuthProvider clientId='835958615002-sv7nh5gls60un3085qtm8374qfjrdf22.apps.googleusercontent.com'> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/get-demo" element={<DemoProduct />} /> 
            <Route path="/Login/*" element={<LoginWithOAuth/>} />
            <Route path="/HomePage" element={<HomePage/>} />
            <Route path="/home" element={loadHomeElement()} />            
            <Route path="/competitors" element={loadTeamElement()} />            
            <Route path="/calender" element={loadCalenderElement()} />
            <Route path="/documents" element={loadDocumentsElement()} />
            <Route path="/projects" element={loadProjectsElement()} />
            <Route path="/property/:propertName" element={loadPropertyDetailElement()} />
            <Route path="/propertyList/:propertyName" element={loadPropertyListElement()}/>
          </Routes>
          {/* </GoogleOAuthProvider> */}
        </ScrollToTop>
      {/* </Router> */}
    </>
  );
}


export default App_home;
