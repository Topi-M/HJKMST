import React from 'react';
import Container from 'react-bootstrap/Container';
import RBNavbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const AppNavbar = () => {
  return (
    <RBNavbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <RBNavbar.Brand href="/">Kemikaalirekisteri</RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="main-navbar" />
        <RBNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="#placeholder1">placeholder1</Nav.Link>
            <Nav.Link href="#placeholder2">placeholder2</Nav.Link>
            <Nav.Link href="#placeholder3">placeholder3</Nav.Link>
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default AppNavbar;
