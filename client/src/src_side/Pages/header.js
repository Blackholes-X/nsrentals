import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Container = styled.div`
  background-color: var(--black);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  width: 2rem;

  img {
    width: 100%;
    height: auto;
  }
`;

const NavLinks = styled.ul`
  list-style: none;
  display: flex;
`;

const Item = styled(NavLink)`
  text-decoration: none;
  color: var(--white);
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    border-bottom: 2px solid var(--white);
  }
`;

const Header = () => {
  return (
    <Container>
      <Logo>
        {/* <img src={logo} alt="logo" /> */}
      </Logo>
      <NavLinks>
        <Item exact activeClassName="active" to="/home">
          Home
        </Item>
        <Item activeClassName="active" to="/competitors">
          Competitors
        </Item>
        <Item activeClassName="active" to="/calendar">
          Calendar
        </Item>
        <Item activeClassName="active" to="/documents">
          Documents
        </Item>
        <Item activeClassName="active" to="/projects">
          Projects
        </Item>
      </NavLinks>
    </Container>
  );
};

export default Header;
