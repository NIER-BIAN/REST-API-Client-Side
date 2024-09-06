// This component accepts data from MainView's state via props
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

import { useParams } from "react-router";
import { Link } from "react-router-dom";

import "./movie-view.scss";

// destructure props arg to access properties directly
export const MovieView = ({ movieViewContentList }) => {

    const { movieId } = useParams();
    
    const movieViewContent = movieViewContentList.find((m) => m.id === movieId);

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

	    <Link to={`/`}>
		<button className="back-button">Back</button>
	    </Link>
	    
	</div>
    );
};
