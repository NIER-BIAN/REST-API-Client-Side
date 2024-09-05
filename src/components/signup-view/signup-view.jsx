// Dev:
// Username: NierTestSignup
// Password: Password

import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const SignupView = () => {

    const [username, updateUsername] = React.useState("");
    const [password, updatePassword] = React.useState("");
    
    // event handler to be attached to the onSubmit event of the JSX form below
    // the event handler is func that takes event obj as parameter
    const submitHandler = (event) => {

	event.preventDefault();

	const data = {
	    username: username,
	    password: password,
	};

	fetch("https://nier-my-api-abd94dc0d9b6.herokuapp.com/users", {
	    method: "POST",
	    body: JSON.stringify(data),
	    headers: {
		"Content-Type": "application/json"
	    }
	}).then((response) => {
	    if (response.ok) {
		alert("Signup successful");
		window.location.reload();
	    } else {
		alert("Signup failed");
	    }
	});
    };

    return (
	<Form onSubmit={submitHandler}>
	    <Form.Group controlId="formUsername">
		<Form.Label>Username:</Form.Label>
		<Form.Control
		    type="text"
		    value={username}
		    onChange={(e) => updateUsername(e.target.value)}
		    required
		    minLength="5"
		/>
	    </Form.Group>

	    <br/><br/>
	    
	    <Form.Group controlId="formPassword">
		<Form.Label>Password:</Form.Label>
		<Form.Control
		    type="password"
		    value={password}
		    onChange={(e) => updatePassword(e.target.value)}
		    required
		/>
	    </Form.Group>

	    <br/><br/>
	    
	    <Button variant="primary" type="submit">
		Register
	    </Button>

	    <br/><br/>
	    
	</Form>
    );
};
