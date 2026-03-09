import React from 'react';
import Container from 'react-bootstrap/Container';
import RBNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { useTheme } from './components/ThemeContext.jsx';

const AppNavbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <RBNavbar bg="primary" variant="dark" expand="lg">
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

            <Nav.Link as={NavLink} to="/profiili">
              Profiili
            </Nav.Link>

            <Nav.Link as={NavLink} to="/Login">
              Login
            </Nav.Link>

          </Nav>
          <Nav className="ms-auto">
            <Button
              variant="outline-light"
              onClick={toggleTheme}
              style={{ borderRadius: '10px', padding: '5px 10px' }}
            >
              {isDarkMode ? '☀️ Light ' : '🌙 Dark '}
            </Button>
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default AppNavbar;

