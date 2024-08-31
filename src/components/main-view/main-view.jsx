import { useState } from "react";
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

// expose MainView component
export const MainView = () => {
    // here there is separation of concerns between **data management (state)** and **UI rendering**
    // describe, don't command: describe UI rendering based on state
    // w.o. having  UI directly manipulating  data

    // 1. Data management (state): what the component needs to operate
    // e.g. state var that identifies whether there was a user click or not
    // e.g. a list of all movies

    // syntax: [stateVar, setStateVar] = useState(initialConditions)
    // useState returns an array with 2 elements: the state var and func to update this state var
    const [selectedMovie, updateSelectedMovie] = useState(null);
    const [movieList, updateMovieList] = useState([

	{
	    oid: "6685570bf67a085dc3261cd1",
	    title: "Amélie",
	    director: "Jean-Pierre Jeunet",
	    genre: "Romantic Comedy",
	},

	{
	    oid: "6685570bf67a085dc3261cd2",
	    title: "Interstellar",
	    director: "Christopher Nolan",
	    genre: "Science Fiction",
	},

	{
	    oid: "6685570bf67a085dc3261cd3",
	    title: "Pride & Prejudice",
	    director: "Joe Wright",
	    genre: "Drama",
	},
    ]);
    // currentStateVar now holds the initial list
    // in case of state changes (e.g. more movies are added or removed)
    // React will REACT / auto-re-render component with the updated state

    // 2. UI rendering: MainView's UI is then dynamically adjusted based on currentStateVar

    // in case of empty list
    if (movieList.length === 0) {
	return <div>The list is empty!</div>;
    }

    // in case of clicking on a selected movie (selectedMovie is default null)
    // render the MovieView component
    // pass selectedMovie and the function onBackClick as prop
    if (selectedMovie) {
	return (
	    <MovieView
		movieViewContent={selectedMovie}
		onBackClick={() => updateSelectedMovie(null)}
	    />
	);
    }

    // in case of no selected movie
    // render moveCard components based on movieList
    // pass movieViewContent (based on movieList) and onMovieClick as props
    return (
	// map() maps each element in the books array to a piece of UI / a moveCard component

	// Note that: Mainview owns the state selectedMovie, and so only mainview can directly change it
	// updateSelectedMovie() is called here then passed on to movie-card as prop.
	// the actual event listener is in movie-card, on the JSX element / the div tag in MovieCard's render method
	
	<div>
	    {movieList.map((movie) => (
		<MovieCard
		    key={movie.oid}
		    movieCardContent={movie}
		    onMovieClick={(newSelectedMovie) => {
			updateSelectedMovie(newSelectedMovie);
		    }}
		/>
	    ))}
	</div>
    );
};
