import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const LoginView = ({ onLoggedIn }) => {

    const [username, updateUsername] = React.useState("");
    const [password, updatePassword] = React.useState("");

    // event handler to be attached to the onSubmit event of the JSX form below
    // the event handler is func that takes event obj as parameter
    const submitHandler = (username, password) => {

	// creates obj data with the username and password input values.
	const data = {
	    username: username,
	    password: password
	};
	
	fetch(
	    "https://nier-myflix-backend-63a3c9fa7364.herokuapp.com/login",
	    {
		method: "POST",
		headers: { "Content-Type": "application/json"},
		body: JSON.stringify(data)
	    })
	    .then((response) => response.json())
	    .then((data) => {
		console.log("Login response: ", data);
		if (data.user) {
		    
		    // notify MainView that login was successful and send back user
		    onLoggedIn(data.user, data.token);

		    // persist user's login session 
		    localStorage.setItem("user", JSON.stringify(data.user));
		    localStorage.setItem("token", data.token);
		    
		} else {
		    alert("No such user");
		}
	    })
	    .catch((e) => {
		alert("Something went wrong");
	    });
	
	/* DEV:
	// use the Open Library "Login API" to verify username and password
	// username: 167OLdP5BUfLZGxP
	// password: K39eKYhPMV9DDWhJ
	
	const data = {
	access: username,
	secret: password
	};
	
	fetch("https://openlibrary.org/account/login.json", {
	method: "POST",
	body: JSON.stringify(data)
	}).then((response) => {
	if (response.ok) {
	// notify MainView that login was successful and send back user
	onLoggedIn(username);
	} else {
	alert("Login failed");
	}
	});
	*/
    }

    const loginWithTestCredentials = () => {
        submitHandler("UserNameForTesting", "PasswordForTesting");
    };

    return (

	// when JSX forms are defined
	// we can attach an event handler to the onSubmit event
	// the event handler is func (see above) that takes event obj as parameter
	<Form onSubmit={(e) => {
		  // access this event object's preventDefault() method
		  // prevents default behavior of form which is to reload the entire page
		  e.preventDefault();
		  submitHandler(username, password);
              }}
	>
	    
	    <Form.Group controlId="formUsername">
		<Form.Label>Username:</Form.Label>
		<Form.Control
		    type="text"
		    value={username}
		    onChange={
			// onChange event handler
			// the onChange event is triggered with typing / deleting
			// event object e passed to the inline arrow function
			// e.target.value retrieves the current value
			// of the input field where the change event occurred.
			(e) => updateUsername(e.target.value)
			// i.e. state var kept up-to-date with the user's input
			// in real-time as well! Neat!
			// this is "binding" value of form fields to state vars
			// this creates a "single source of truth" for the data
			// there is one place where it is stored and modified
		    }
		    required
		/>
	    </Form.Group>
	    
	    <br/><br/>
	    
	    <Form.Group controlId="formPassword">
		<Form.Label>
		Password:</Form.Label>
		<Form.Control
		    type="password"
		    value={password}
		    onChange={
			// ditto
			(e) => updatePassword(e.target.value)
		    }
		    required
		/>
	    </Form.Group>

	    <br/><br/>
	    
	    <Button variant="primary" type="submit">
		Login
	    </Button>
	    
	    <br/><br/><br/>

	    <p>Psst... Your credentials are hashed and stored securely in the backend.</p>
	    <p>However, you are welcome to sign in as a test user: </p>
	    <Button variant="secondary" onClick={loginWithTestCredentials}>
                Login with Test Credentials
            </Button>
	    
	</Form>
    );
};
