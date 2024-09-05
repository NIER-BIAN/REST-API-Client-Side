import React from "react";

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

	fetch("SIGNUP_URL", {
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
	<form onSubmit={submitHandler}>
	    <label>
		Username:<br/>
		<input
		    type="text"
		    value={username}
		    onChange={(e) => updateUsername(e.target.value)}
		    required
		    minLength="5"
		/>
	    </label>

	    <br/><br/>
	    
	    <label>
		Password:<br/>
		<input
		    type="password"
		    value={password}
		    onChange={(e) => updatePassword(e.target.value)}
		    required
		/>
	    </label>

	    <br/><br/>
	    
	    <button type="submit">Register</button>
	</form>
    );
};
