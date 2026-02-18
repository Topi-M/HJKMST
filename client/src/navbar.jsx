import React from 'react';
import Container from 'react-bootstrap/Container';
import RBNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

const AppNavbar = () => {
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
            <Nav.Link as={NavLink} to="/placeholder3">
              Nonogram
            </Nav.Link>

            <Nav.Link as= {NavLink} to="/Muistipeli">
              Muistipeli
            </Nav.Link>

            <Nav.Link as= {NavLink} to="/Login">
              Login
            </Nav.Link>
            
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default AppNavbar;

