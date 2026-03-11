import React from 'react';
import Container from 'react-bootstrap/Container';
import RBNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { useTheme } from './components/ThemeContext.jsx';
import './css/navbar.css';

const AppNavbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <RBNavbar variant="dark" expand="lg" style={{ backgroundColor: '#3d62f7' }}>
      <Container fluid>
        <RBNavbar.Brand as={NavLink} to="/">
          Minipelialusta
        </RBNavbar.Brand>

        <RBNavbar.Toggle aria-controls="main-navbar" />
        <RBNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/palapeli">
              Palapeli
            </Nav.Link>

            <Nav.Link as={NavLink} to="/sudoku">
              Sudoku
            </Nav.Link>
            <Nav.Link as={NavLink} to="/nonogram">
              Nonogram
            </Nav.Link>

            <Nav.Link as={NavLink} to="/Muistipeli">
              Muistipeli
            </Nav.Link>

            <Nav.Link as={NavLink} to="/whitetiles">
              White Tiles
            </Nav.Link>
          </Nav>

          {/*vasen reuna*/}
          <Nav className="ms-auto align-items-center gap-2">
            <div
              className={`theme-toggle-track ${isDarkMode ? 'dark' : 'light'}`}
              onClick={toggleTheme}
            >
              <div className={`theme-toggle-thumb ${isDarkMode ? 'dark' : 'light'}`} />
            </div>

            <Nav.Link as={NavLink} to="/Lobby">
              Lobby
            </Nav.Link>

            <Nav.Link as={NavLink} to="/profiili">
              Profiili
            </Nav.Link>

            <Nav.Link as={NavLink} to="/Login">
              Login
            </Nav.Link>
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default AppNavbar;

