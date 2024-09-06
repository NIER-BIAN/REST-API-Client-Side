// This component accepts data from the parent component's (MainView's) state via props
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./movie-card.scss";

export const MovieCard = (props) => {
    // only the title should be rendered on each card
    return (

	<Link
	    className="card-link"
	    to={
		/*
		  access URI param. movies/${movie.id} would usually be enough
		  However, movie ids conntains non-AN chars that don’t work well when
		  used as URL params. encodeURIComponent replaces these  w/  URL-friendly ones
		*/
		`/movies/${encodeURIComponent(props.movieCardContent.id)}`
	    }
	>
	    <Card className="h-100">
		<Card.Body>
		    <Card.Title>{props.movieCardContent.title}</Card.Title>
		    <Card.Text>{props.movieCardContent.director.name}</Card.Text>
		</Card.Body>
	    </Card>
	</Link>
    );
};

// Define props constraints for MovieCard
// Note that PropTypes are defined based on the props that the component expects
// regardless of how we access them within the component i.e. whether we've destructured prop
MovieCard.propTypes = {
    
    movieCardContent: PropTypes.shape({
	
	id: PropTypes.string.isRequired,
	
	title: PropTypes.string.isRequired,
	
	director: PropTypes.shape({
	    name: PropTypes.string.isRequired,
	    bio: PropTypes.string.isRequired,
	    dob: PropTypes.string
	}).isRequired,
	
	genre: PropTypes.shape({
	    name: PropTypes.string.isRequired,
	    description: PropTypes.string.isRequired
	}).isRequired,
	
    }).isRequired,
    
};
