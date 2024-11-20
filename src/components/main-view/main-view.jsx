// =======================================================================
// IMPORTS

// library imports
import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// local imports
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

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
    
    const [movieList, updateMovieList] = useState([]);

    const [searchQuery, updateSearchQuery] = useState('');
    const [filteredMovies, updateFilteredMovies] = useState(movieList);
    
    // in case of state changes, React will REACT / auto-re-render component with the updated state

    // ===================================================================
    
    // SIDE EFFECTS (useEffect hooks)
    // code for performing async tasks (fetch from API) or event listeners (key bindings) go here

    // retrieve movie data from API
    useEffect(
	// arg 1: code you want to run as a side effect
	() => {
	    fetch("https://nier-myflix-backend-63a3c9fa7364.herokuapp.com/movies")
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
				description: doc.description,
				imagePath: doc.imagePath
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
    
    // manually set token to the token we got back from the login API
    // as otherwise it would be initially blank upon login
    // at that moment, UI will update and load the list of movies using the token.
    // **BEWARE**: there never was an auth gate on my /movies endpoint)
    useEffect(() => {

	if (!token) {
	    return;
	}

	// arg 1: code you want to run as a side effect
	fetch("https://nier-myflix-backend-63a3c9fa7364.herokuapp.com/movies", {
	    headers: { Authorization: `Bearer ${token}` }
	})
	    .then((response) => response.json())
	    .then((data) => {
		console.log(data);
	    });
	// arg 2: array of dependencies. When dependencies change, rerun effect
    }, [user, token]);

    // allow search
    useEffect(() => {
	// arg 1: code you want to run as a side effect
	updateFilteredMovies(
	     movieList.filter((movie) =>
		 movie.title.toLowerCase().includes(searchQuery.toLowerCase())
	    )
	);
	// arg 2: array of dependencies. When dependencies change, rerun effect
    }, [searchQuery, movieList]);

    
    // ===================================================================
    
    // UI RENDERING (MainView's UI is dynamically adjusted based on StateVars)

    // each <Route> component has a path prop (what URL it should match) and an element prop
    // note is the 3rd of the 6 <Route> components with URL path="/movies/:movieId" (display 1 film)
    // contains a URL param movieId, that allows Routes to match dynamic URLs
    // URL params are accessed in movie-card.jsx
    
    return (
	<BrowserRouter>
	    <NavigationBar
		user={user}
		onSearch={(query) => updateSearchQuery(query)}
		onLoggedOut={
		    () => {
			// clear up sessions upon log out
			updateUser(null);
			updateToken(null); 
			localStorage.clear();
		    }}
	    />
		<Row className="justify-content-center">
		    <Routes>
			<Route
			    path="/signup"
			    element={
				<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
				    {user ? (
					<Navigate to="/" />
				    ) : (
					<Col md={6}>
					    <br/><br/>
					    <h1>New here?</h1>
					    <p>Sign up to create your account!</p>
					    <br/><br/>
					    <SignupView />
					</Col>
				    )}
				</div>

			    }
			/>

			
			<Route
			    path="/login"
			    element={
				<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
				    {user ? (
					<Navigate to="/" />
				    ) : (
					<Col md={6}>
					    <br/><br/>
					    <h1>Welcome to MyFlix!</h1>
					    <p>Already a user? Log in to your account!</p>
					    <br/><br/>
					    <LoginView
						onLoggedIn={
						    // Note: Mainview owns the state User
						    // so we can only change it here
						    // updateUser is called here then passed on to
						    // LoginView as prop so that LoginView can
						    // notify MainView when logins successful
						    (user, token) => {
							updateUser(user);
							updateToken(token);
						    }}
					    />
					</Col>
				    )}
				</div>

			    }
			/>

			<Route
			    path="/users/:username"
			    element={
				<div>
				    {!user ? (
					<Navigate to="/login" replace />
				    ) : (
					<Col md={8} className="mx-auto">
					    <ProfileView
						user={user}
						token={token}
						movieList={movieList}
						onDeletion={
						    () => {
							// clear up sessions upon log out
							updateUser(null);
							updateToken(null); 
							localStorage.clear();
						    }}
						onLoggedOut={
						    () => {
							// clear up sessions upon log out
							updateUser(null);
							updateToken(null); 
							localStorage.clear();
						    }}
					    />
					</Col>
				    )}
				</div>
			    }
			/>


			<Route
			    path="/movies/:movieId"
			    element={
				<div>
				    {!user ? (
					<Navigate to="/login" replace />
				    ) : movieList.length === 0 ? (
					<Col md={6}>
					    <h1>Loading</h1>
					</Col>
				    ) : (
					<Col className="mx-auto" md={8}>
					    <MovieView
						user={user}
						token={token}
						movieViewContentList={
						    // in case of clicking on a selected movie
						    // render  MovieView, pass whole movieList as prop
						    // URL params are accessed in movie-card.jsx
						    // to display the specified movie
						    movieList
						    // NOTE: React Router only gives access to URL param
						    // inside the component / element that gets rendered 
						    // Therefore, the whole list is passed
						    // so that id matching can happen in movie-card.jsx
						}
					    />
					</Col>
				    )}
				</div>
			    }
			/>

			
			<Route
			    path="/"
			    element={
				<div>
				    {!user ? (
					<Navigate to="/login" replace />
				    ) : movieList.length === 0 ? (
					<Col md={6}>
					    <h1>Loading</h1>
					</Col>
				    ) : (
					<div style={{padding: "30px"}}>
					    <Row>
						{
						    // render moveCard components based on filteredMovies
						    // if no searchQuery, will show all movies
						    // pass movieViewContent & onMovieClick as props
						    
						    filteredMovies.map((movie) => (
							
							// display cards
							// map() maps items in list to a movieCard component
							
							// "mb" stands for "margin bottom"
							// "md" stands for "medium"
							// i.e. take up 3 shares of 12
							
							<Col
							    className="mb-1 mt-2"
							    key={movie.id}
							    lg={3} md={4} sm={6} xs={6}>
							    <MovieCard movieCardContent={movie} />
							</Col>
						    ))}
					    </Row>
					</div>
				    )}
				</div>
			    }
			/>
		    </Routes>
		</Row>
	</BrowserRouter>
    );
};

