// This component accepts data from MainView's state via props
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

// =======================================================================
// IMPORTS

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import "./movie-view.scss";

// =======================================================================

// destructure props arg to access properties directly
export const MovieView = ({ user, token, movieViewContentList }) => {

    // ===================================================================
    // DATA MANAGEMENT (useState hooks)
    
    const { movieId } = useParams();
    
    // note that MainView passed the whole movieList as prop as
    // URL params can only be accessed in movie-card.jsx i.e. nside the component that gets rendered 
    const movieViewContent = movieViewContentList.find((m) => m.id === movieId);
    const [userFavorites, updateUserFavorites] = useState([]);
    
    // ===================================================================
    // SIDE EFFECTS (useEffect hooks)

    // retrieve user data from API
    useEffect(
	// arg 1: code you want to run as a side effect
	() => {
	    fetch(`https://nier-my-api-abd94dc0d9b6.herokuapp.com/users/${user.username}`, {
	    headers: { Authorization: `Bearer ${token}` }
	})
		.then(
		    (response) => response.json())
		.then(
		    (data) => {
			updateUserFavorites(data.favoriteMovies);
		    })
		.catch((error) => {
		    console.error("Error fetching user data:", error);
		});
	}, 
	// arg 2: array of dependencies. When dependencies change, rerun effect
	// empty array = the effect will only run once after the initial render
	// callback doesn’t depend on any value changes in props or state
	[]
    );
    
    const favoritingHandler = () => {

	// toggles between DELETE / POST depending on whether it's already favourited
	const isFavorite = userFavorites.includes(movieId);
        const method = isFavorite ? 'DELETE' : 'PATCH';
	
	fetch(`https://nier-my-api-abd94dc0d9b6.herokuapp.com/users/${user.username}/movies/${movieId}`, {
	    method: method,
	    headers: { Authorization: `Bearer ${token}` }
	})
	    .then(response => {
		if (response.ok) {
		    console.log(`A ${method} req was sent`);
		    console.log('Button worked');
		    
		    const updatedFavorites = isFavorite
			  ? userFavorites.filter(id => id !== movieId) // Remove from favorites
			  : [...userFavorites, movieId]; // Add to favorites
		    updateUserFavorites(updatedFavorites);
		    
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
	<div>
	    
	    <h1>{movieViewContent.title}</h1>
	    
	    <br/>
	    
	    <div>Director: {movieViewContent.director.name}</div>
	    
	    <br/>
	    
	    <div>{movieViewContent.director.bio}</div>
	    
	    <br/>
	    
	    <div>Genre: {movieViewContent.genre.name}</div>

	    <br/>

	    <div>{movieViewContent.genre.description}</div>
	    
	    <br/>
	    <br/>

	    <Button
		variant="secondary"
		onClick={favoritingHandler}>
		
                {// button labelling based on js evaluation
		    userFavorites.includes(movieId) ? 'Remove from Favorites' : 'Add to Favorites'
		}
		
            </Button>

	    <br/><br/>

	    <Link to={`/`}>
		<Button
		    variant="primary"
		>Back
		</Button>
	    </Link>
	    
	</div>
    );
};
