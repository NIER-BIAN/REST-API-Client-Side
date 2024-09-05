// This component accepts data from the parent component's (MainView's) state via props
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";

export const MovieCard = (props) => {
    // only the title should be rendered on each card
    return (
	<Card
	    onClick={
		// onClick event attr only works as an event listener
		// with JSX elements but not with components
		// which is why it's here, as opposed to mainview
		// onMovieClick function is received as prop from mainview
		// where updateSelectedMovie() is called
		() => 
		// note the new arrow function:
		// "when there is a click, invoke this new arrow func""
		// .i.e. it's not: onClick={props.onMovieClick(props.movieCardContent)}
		// as that would mean "pass the result of having called func"
		// the () will be immediately invoked when component renders
		// and not wait for onClick event
		props.onMovieClick(props.movieCardContent)
	    }
	    className="h-100"
	    style={
		// note the 2 pairs of curly-braces! To both:
		// 1. tell React value is to be evaluated as js and 2. create obj "style"
		    { cursor: "pointer" }
		}
	>
	    <Card.Body>
		<Card.Title>{props.movieCardContent.title}</Card.Title>
		<Card.Text>{props.movieCardContent.director.name}</Card.Text>
	    </Card.Body>
	</Card>
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
    
    onMovieClick: PropTypes.func.isRequired
    
};
