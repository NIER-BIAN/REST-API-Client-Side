// =======================================================================
// IMPORTS

// third-party
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";

// local
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

// =======================================================================

// expose MainView component
export const MainView = () => {
    // here there is separation of concerns between **data management (state)** and **UI rendering**
    // describe, don't command: describe UI rendering based on state
    // w.o. having  UI directly manipulating  data

    // ===================================================================
    
    // DATA MANAGEMENT (useState hooks)
    // state: what the component needs to operate
    // e.g. state var that identifies whether there was a user click or not
    // e.g. a list of all movies

    // syntax: [stateVar, setStateVar] = useState(initialConditions)
    // useState returns an array with 2 elements: the state var and func to update this state var

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, updateUser] = useState(storedUser? storedUser : null);
    const [token, updateToken] = useState(storedToken? storedToken : null);
    
    const [selectedMovie, updateSelectedMovie] = useState(null);
    const [movieList, updateMovieList] = useState([]);
    // currentStateVar now holds the initial list
    // in case of state changes (e.g. more movies are added or removed)
    // React will REACT / auto-re-render component with the updated state

    // ===================================================================
    
    // SIDE EFFECTS (useEffect hooks)
    // code for performing async tasks (fetch from API) or event listeners (key bindings) go here

    // retrieve data from API
    useEffect(
	// arg 1: code you want to run as a side effect
	() => {
	    fetch("https://nier-my-api-abd94dc0d9b6.herokuapp.com/movies")
		.then(
		    (response) => response.json()
		)
		.then(
		    (data) => {
			
			const dataFromApi = data.map((doc) => {
			    return {
				id: doc._id,
				title: doc.title,
				director: doc.director,
				genre: doc.genre,
			    };
			});
			
			updateMovieList(dataFromApi);
		    }
		);
	}, 
	// arg 2: array of dependencies. When dependencies change, rerun effect
	// empty array = the effect will only run once after the initial render
	// callback doesn’t depend on any value changes in props or state
	[]
    );

    // token is initially blank upon login
    // manually set it to the token we got back from the login API
    // at that moment, UI will update and load the list of movies using the token.
    // **BEWARE**: there never was an auth gate on my /movies endpoint)
    useEffect(() => {

	if (!token) {
	    return;
	}

	// arg 1: code you want to run as a side effect
	fetch("https://nier-my-api-abd94dc0d9b6.herokuapp.com/movies", {
	    headers: { Authorization: `Bearer ${token}` }
	})
	    .then((response) => response.json())
	    .then((data) => {
		console.log(data);
	    });
	// arg 2: array of dependencies. When dependencies change, rerun effect
    }, [token]);

    
    // ===================================================================
    
    // UI RENDERING (MainView's UI is dynamically adjusted based on StateVars)

    // in case of visitors who are yet to login
    // Note: similar to below, Mainview owns the state User, so it's changed here
    // updateUser is called here then passed on to LoginView as prop
    // so that LoginView can notify MainView when logins successful
    if (!user) {
	return (
	    <Row className="justify-content-md-center"> 
		<Col md={6}>
		    <h1>Welcome to MyFlix!</h1>
		    <br/>
		    <LoginView
			onLoggedIn={(user, token) => {
			    updateUser(user);
			    updateToken(token);
			}}
		    />
		    <hr/>
		    <h4>New to MyFlix? Sign up!</h4>
		    <br/>
		    <SignupView />
		</Col>
	    </Row>
	);
    }
		
    // in case of clicking on a selected movie (selectedMovie is default null)
    // render the MovieView component, passing selectedMovie and func onBackClick as prop
    if (selectedMovie) {
	return (
	<Row className="justify-content-md-center">
	    <Col md={8}>
			<MovieView 
			    movieViewContent={selectedMovie} 
			    onBackClick={() => updateSelectedMovie(null)} 
			/>
	    </Col>
	</Row>
	);
    }

    // in case of empty list
    if (movieList.length === 0) {
	return (
	    <Row className="justify-content-md-center"> 
		<Col md={6}>
		    <h1>Whoops. Something is wrong on the backend.</h1>
		    <p> movieList is empty!</p>
		</Col>
	    </Row>
	);
    }

    
    /*in case of user logged in, no selected movie, and the list isn't empty
      render moveCard components based on movieList
      pass movieViewContent (based on movieList) and onMovieClick as props*/	

    /*Note: Mainview owns the state selectedMovie, so only mainview can change it
      updateSelectedMovie() called then passed on to movie-card as prop.
      the actual event listener is in movie-card
      on the JSX element / the div tag in MovieCard's render method*/

    return (
	<div>
	    <Row className="justify-content-md-center">

		{movieList.map((movie, index) => (
		    // display cards
		    // map() maps items in list to a movieCard component
		    
		    // "mb" stands for "margin bottom"
		    // "md" stands for "medium"
		    // i.e. take up 3 shares of 12 if screen larger than 768px
		    <Col className="mb-2" key={movie.id} md={3}>
			<MovieCard
			    movieCardContent={movie}
			    onMovieClick={(newSelectedMovie) => {
				updateSelectedMovie(newSelectedMovie);
			    }}
			/>
		    </Col>
		))}
	    </Row>

	    <Button
		variant="primary"
		onClick={
		    () => {
			// clear up sessions upon log out
			updateUser(null);
			updateToken(null); 
			localStorage.clear();
		    }}
	    >Logout</Button>
	</div>
    );
};
