import React, { useState, useEffect } from 'react'

//All the svg files
import logo from '../assets/logo.svg'
import Home from '../assets/home-solid.svg'
import Team from '../assets/social.svg'
import Calender from '../assets/sceduled.svg'
import Projects from '../assets/starred.svg'
import Map from '../assets/map.png'
import underCon from '../assets/underCon.png'
import Documents from '../assets/draft.svg'
import PowerOff from '../assets/power-off-solid.svg'
import web from '../assets/web.png'

import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  position: fixed;

  .active {
    border-right: 4px solid var(--white);

    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
    }
  }
`

const Button = styled.button`
  background-color: var(--black);
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  &::before,
  &::after {
    content: '';
    background-color: var(--white);
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }

  &::before {
    top: ${(props) => (props.clicked ? '1.5' : '1rem')};
    transform: ${(props) => (props.clicked ? 'rotate(135deg)' : 'rotate(0)')};
  }

  &::after {
    top: ${(props) => (props.clicked ? '1.2' : '1.5rem')};
    transform: ${(props) => (props.clicked ? 'rotate(-135deg)' : 'rotate(0)')};
  }
`

const SidebarContainer = styled.div`
  background-color: var(--black);
  width: 3.5rem;
  height: 80vh;
  margin-top: 1rem;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  position: relative;
`

const Logo = styled.div`
  width: 2rem;

  img {
    width: 100%;
    height: auto;
  }
`

const SlickBar = styled.ul`
  color: var(--white);
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--black);

  padding: 2rem 0;

  position: absolute;
  top: 6rem;
  left: 0;

  width: ${(props) => (props.clicked ? '12rem' : '3.5rem')};
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;
`

const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--white);
  width: 100%;
  padding: 1rem 0;
  cursor: pointer;

  display: flex;
  padding-left: 1rem;

  &:hover {
    border-right: 4px solid var(--white);

    img {
      filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
    }
  }

  img {
    width: 1.2rem;
    height: auto;
    filter: invert(92%) sepia(4%) saturate(1033%) hue-rotate(169deg) brightness(78%) contrast(85%);
  }
`

const Text = styled.span`
  width: ${(props) => (props.clicked ? '100%' : '0')};
  overflow: hidden;
  margin-left: ${(props) => (props.clicked ? '1.5rem' : '0')};
  transition: all 0.3s ease;
`

const Profile = styled.div`
  width: ${(props) => (props.clicked ? '14rem' : '3rem')};
  height: 3rem;

  padding: 0.5rem 1rem;
  /* border: 2px solid var(--white); */
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.clicked ? '9rem' : '0')};

  background-color: var(--black);
  color: var(--white);

  transition: all 0.3s ease;

  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;

    &:hover {
      border: 2px solid var(--grey);
      padding: 2px;
    }
  }
`

const Details = styled.div`
  display: ${(props) => (props.clicked ? 'flex' : 'none')};
  justify-content: space-between;
  align-items: center;
`

const Name = styled.div`
  padding: 0 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h4 {
    display: inline-block;
  }

  a {
    font-size: 0.8rem;
    text-decoration: none;
    color: var(--grey);

    &:hover {
      text-decoration: underline;
    }
  }
`

const Logout = styled.button`
  border: none;
  width: 2rem;
  height: 2rem;
  background-color: transparent;

  img {
    width: 100%;
    height: auto;
    filter: invert(15%) sepia(70%) saturate(6573%) hue-rotate(2deg) brightness(100%) contrast(126%);
    transition: all 0.3s ease;
    &:hover {
      border: none;
      padding: 0;
      opacity: 0.5;
    }
  }
`

const Sidebar = () => {
  const [click, setClick] = useState(false)
  const handleClick = () => setClick(!click)

  const [profileClick, setprofileClick] = useState(false)
  const handleProfileClick = () => setprofileClick(!profileClick)
  const navigate = useNavigate()

  const [userProfile, setUserProfile] = useState(null)
  const [name, setname] = useState(null)

  const storedUserProfile = localStorage.getItem('userProfile')

  const logOut = () => {
    console.log('sssssssssssss')
    googleLogout()
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userProfile')
    navigate('/login') // Navigate to the login route
  }

  // If userProfile exists in localStorage, parse it and set the state
  useEffect(() => {
    handleClick()
    const storedUserProfile = localStorage.getItem('userProfile')
    if (storedUserProfile) {
      const parsedUserProfile = JSON.parse(storedUserProfile)
      console.log('--------------0')
      console.log(JSON.stringify(parsedUserProfile))
      setUserProfile(parsedUserProfile)
      setname(parsedUserProfile.given_name) // Set the 'name' state
    }
  }, [])

  return (
    <Container>
      <Button clicked={click.toString()} onClick={() => handleClick()}>
        Click
      </Button>
      <SidebarContainer>
        <Logo onClick={() => {
          handleClick()
        }}>
          <img src={logo} alt="logo" />
        </Logo>
        <SlickBar clicked={click}>
          <Item onClick={() => setClick(false)} exact activeClassName="active" to="/home">
            <img src={Home} alt="Home" />
            <Text clicked={click}>Home</Text>
          </Item>
          <Item onClick={() => {
            handleClick()
            setClick(false)
            }} activeClassName="active" to="/competitors">
            <img src={Team} alt="Team" />
            <Text clicked={click}>Competitors</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/calender"
            target="_blank"
          >
            <img src={Map} alt="Calender" />
            <Text clicked={click}>Map</Text>
          </Item>
          <Item onClick={() => setClick(false)} activeClassName="active" to="/documents">
            <img src={underCon} height={50} width={50} alt="Documents" />
            <Text clicked={click}>Under Developement</Text>
          </Item>
          <Item onClick={() => setClick(false)} activeClassName="active" to="/projects">
            <img src={Projects} alt="Projects" />
            <Text clicked={click}>All Listings</Text>
          </Item>
          <Item onClick={() => setClick(false)} activeClassName="active" to="/WebScrapping">
            <img src={web} alt="Projects"/>
            <Text clicked={click}>Web Scrapping</Text>
          </Item>
        </SlickBar>

        <Profile clicked={profileClick}>
          <img onClick={() => handleProfileClick()} src="https://picsum.photos/200" alt="Profile" />
          <Details clicked={profileClick}>
            <Name>
              <h4>{name}</h4>

              <a href="/#">view&nbsp;profile</a>
            </Name>

            <Logout>
              <img
                src={PowerOff}
                alt="logout"
                onClick={() => {
                  logOut()
                }}
              />
            </Logout>
          </Details>
        </Profile>
      </SidebarContainer>
    </Container>
  )
}

export default Sidebar
