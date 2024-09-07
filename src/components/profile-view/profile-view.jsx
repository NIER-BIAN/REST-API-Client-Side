// =======================================================================
// IMPORTS

// library imports
import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

// local imports
import { MovieCard } from '../movie-card/movie-card';

// =======================================================================

export const ProfileView = ({ user, token, movieList, onDeletion, onLoggedOut }) => {
    
    // ===================================================================
    // DATA MANAGEMENT (useState hooks)
    
    const [userInfoFromAPI, updateUserInfoFromAPI] = useState(null);
    // note: anything we want accessible within  component's scope
    // we define and updae it as a state within the useEffect hook 
    const [readableFavoritesList, updateReadableFavoritesList] = useState([]);

    const [newUsername, updateNewUsername] = useState("");
    const [newPassword, updateNewPassword] = useState("");
    
    
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
			updateUserInfoFromAPI(data);

			// convert to string before formulating list
			favoriteMovieIds = data.favoriteMovies.map(id => String(id));
			faves = movieList.filter(movie => favoriteMovieIds.includes(String(movie.id)));
			updateReadableFavoritesList(faves);
		    })
		.catch((error) => {
		    console.error("Error fetching user data:", error);
		});
	}, 
	// arg 2: array of dependencies. When dependencies change, rerun effect
	// empty array = the effect will only run once after the initial render
	// callback doesn’t depend on any value changes in props or state
	[user]
    );
    
    // Change username & password event handler
    // the event handler is func that takes event obj as parameter
    const submitHandler = (event) => {

	event.preventDefault();
	
	const data = {
	    username: newUsername,
	    password: newPassword,
	};

	fetch(`https://nier-my-api-abd94dc0d9b6.herokuapp.com/users/${user.username}`, {
	    method: "PUT",
	    body: JSON.stringify(data),
	    headers: {
		'Authorization': `Bearer ${token}`,
		'Content-Type': "application/json"
	    }
	}).then((response) => {
	    if (response.ok) {
		alert("You details have been updated. Please log back in with your new credentials.");
		onLoggedOut();
	    } else {
		alert("Update failed");
	    }
	});
    };

    // Deregister user
    const deregistrationHandler = () => {
	fetch(`https://nier-my-api-abd94dc0d9b6.herokuapp.com/users/${user.username}`, {
	    method: 'DELETE',
	    headers: { 'Authorization': `Bearer ${token}` }
	})
	    .then(response => {
		if (response.ok) {
		    onDeletion();
		    alert('We are sorry to see you go. Your account has been deleted!');
                } else {
                    throw new Error('Failed to deregister user');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    
    // ===================================================================
    
    // UI RENDERING
    
    return (
        <div>
            {userInfoFromAPI ? (
                <div>
		    
		    <br/><br/>
                    <h1>{userInfoFromAPI.username}'s Profile</h1>
		    <br/><br/>
                    <p>Favourited movies:</p>
		    <Container>
			<Row>
			    {
				readableFavoritesList.map((movie) => (
				    
				    // display cards
				    
				    // "mb" stands for "margin bottom"
				    // "md" stands for "medium"
				    // i.e. take up 3 shares of 12
				    
				    <Col className="mb-2" key={movie.id} md={3}>
					<MovieCard movieCardContent={movie} />
				    </Col>
				))}
			</Row>
		    </Container>


		    <br/><hr/><br/>
                    <h1>Wanna change things up a bit?</h1>
		    <br/><br/>
		    <Form onSubmit={submitHandler}>
			<Form.Group controlId="formUsername">
			    <Form.Label>New username:</Form.Label>
			    <Form.Control
				type="text"
				value={newUsername}
				onChange={(e) => updateNewUsername(e.target.value)}
				required
				minLength="5"
			    />
			</Form.Group>

			<br/><br/>
			
			<Form.Group controlId="formPassword">
			    <Form.Label>New password:</Form.Label>
			    <Form.Control
				type="password"
				value={newPassword}
				onChange={(e) => updateNewPassword(e.target.value)}
				required
			    />
			</Form.Group>

			<br/><br/>
			
			<Button
			    variant="primary"
			    type="submit"
			>Update my details
			</Button>

			<br/><br/>
			
		    </Form>

		    <br/><hr/><br/>
		    <h1>Had enough of us?</h1>
		    <br/><br/>
                    <Button
			variant="danger"
			onClick={deregistrationHandler}
		    >Deregister
		    </Button>
		    <br/><br/><br/><br/>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};
