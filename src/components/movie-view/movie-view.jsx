// This component accepts data from MainView's state via props
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

// =======================================================================
// IMPORTS

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

// local imports
import "./movie-view.scss";
import { MovieCard } from '../movie-card/movie-card';

// =======================================================================

// destructure props arg to access properties directly
export const MovieView = ({ user, token, movieViewContentList }) => {

    // ===================================================================
    // DATA MANAGEMENT (useState hooks)
    
    const { movieId } = useParams();
    
    // note that MainView passed the whole movieList as prop as
    // URL params can only be accessed in movie-card.jsx i.e. inside the component that gets rendered 
    const movieViewContent = movieViewContentList.find((m) => m.id === movieId);
    
    const [isFavorited, updateIsFavorited] = useState(null);

    const similarMovies = movieViewContentList.filter(
	m => m.genre.name === movieViewContent.genre.name && m.title !== movieViewContent.title
	// same genre but isn't the current movie
    );
    
    // ===================================================================
    // SIDE EFFECTS (useEffect hooks)

    // retrieve user data from API
    useEffect(
	// arg 1: code you want to run as a side effect
	() => {
	    fetch(`https://nier-myflix-backend-63a3c9fa7364.herokuapp.com/users/${user.username}`, {
		headers: { Authorization: `Bearer ${token}` }
	    })
		.then(
		    (response) => response.json())
		.then(
		    (data) => {
			updateIsFavorited(data.favoriteMovies.includes(movieId));
		    })
		.catch((error) => {
		    console.error("Error fetching user data:", error);
		});
	}, 
	// arg 2: array of dependencies. When dependencies change, rerun effect
	// empty array = the effect will only run once after the initial render
	// callback doesn’t depend on any value changes in props or state
	[user, token, movieId]
    );
    
    const favoritingHandler = () => {

	// toggles between DELETE / POST depending on whether it's already favourited
        const method = isFavorited ? 'DELETE' : 'PATCH';
	
	fetch(`https://nier-myflix-backend-63a3c9fa7364.herokuapp.com/users/${user.username}/movies/${movieId}`, {
	    method: method,
	    headers: { Authorization: `Bearer ${token}` }
	})
	    .then(response => {
		if (response.ok) {
		    // console.log(`A ${method} req was sent`);
		    // console.log('Button worked');
		    updateIsFavorited(!isFavorited);
                } else {
                    throw new Error('Failed to toggle movie status');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // ===================================================================
    // UI RENDERING (MainView's UI is dynamically adjusted based on StateVars)
    
    return (
	<Container>
	    <Row className="mt-4">
		<Col lg={6} md={12}>
		    <img
			style={{ maxHeight: "100%" }}
			className="img-fluid mb-4"
			src={movieViewContent.imagePath} />
		</Col>
		<Col lg={6} md={12}>
		    
		    <h1>{movieViewContent.title}</h1>

		    <div>{movieViewContent.description}</div>

		     <br/>
		    
		    <div>Director: {movieViewContent.director.name}</div>
		    
		    <br/>
		    
		    <div>{movieViewContent.director.bio}</div>
		    
		    <br/>
		    <br/>

		    {isFavorited !== null && ( // Only render button after API call
			<Button variant="secondary" onClick={favoritingHandler}>
			    {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
			</Button>
		    )}

		    <br/><br/>

		    <Link to={`/`}>
			<Button
			    variant="primary"
			>Back
			</Button>
		    </Link>
		    
		</Col>
	    </Row>
	    
	    <Row>
		<Col>
		    <br/>
		    <h3>More movies of the same genre:</h3>
		    
		    <div>{movieViewContent.genre.description}</div>
		    
		    <br/>
		    
		    <Row>
			{ similarMovies.length === 0
			  ? ( <Col className="mb-4">
				  <em>Seems like this is the only {movieViewContent.genre.name} movie in the database right now.</em>
			      </Col> )
			  : (
			      similarMovies.map((movie) => (

				  // display cards
				  
				  // "mb" stands for "margin bottom"
				  // "md" stands for "medium"
				  // i.e. take up 3 shares of 12
				  
				  <Col className="mb-4"
				       key={movie.id}
				       md={4} sm={6} xs={6}>
				      <MovieCard movieCardContent={movie} />
				  </Col>
			      ))
			  )
			}
		    </Row>
		</Col>
	    </Row>
	    
	</Container>
    );
};
