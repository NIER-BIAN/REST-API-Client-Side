import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onSearch, onLoggedOut }) => {
    
    const handleSearch = (e) => {
	onSearch(e.target.value);
    };
    
    return (
	<Navbar
	    bg="light"
	    expand="lg"
	    sticky="top"
	    className="py-3 w-100"
	>
	    <Container>
		<Navbar.Brand as={Link} to="/">
		    MyFlix
		</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
		    <Nav className="me-auto">
			{!user && (
			    // if unauthenticated, dropdown shows links to the Login/Signup pages
			    <>
				<Nav.Link as={Link} to="/login">
				    Login
				</Nav.Link>
				<Nav.Link as={Link} to="/signup">
				    Signup
				</Nav.Link>
				<Nav.Link as={Link} to="https://github.com/NIER-BIAN/myFlix-React-client/tree/main" target="_blank">
				    View Source
				</Nav.Link>
			    </>
			)}
			{user && (
			    // if authenticated, dropdown shows links to root ("/"), profile, and logout
			    <>
				<Nav.Link as={Link} to="/">
				    Home
				</Nav.Link>
				<Nav.Link as={Link} to={`/users/${user.username}`}>
				    My profile
				</Nav.Link>
				
				<Nav.Link
				    onClick={onLoggedOut}
				>Logout
				</Nav.Link>
				
				<Form>
				    <FormControl
					type="search"
					placeholder="Search for a movie"
					className="ms-2"
					aria-label="Search"
					onChange={handleSearch}
				    />
				</Form>
				<Nav.Link as={Link} to="https://github.com/NIER-BIAN/myFlix-React-client" target="_blank">
				    View Source
				</Nav.Link>
			    </>
			)}
		    </Nav>
		</Navbar.Collapse>
	    </Container>
	</Navbar>
    );
};
