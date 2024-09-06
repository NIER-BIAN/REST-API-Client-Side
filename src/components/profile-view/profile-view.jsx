// =======================================================================
// IMPORTS

import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

// =======================================================================

export const ProfileView = ({ user, token, onDeletion}) => {
    
    // ===================================================================
    // DATA MANAGEMENT (useState hooks)
    
    const [userInfo, updateUserInfo] = useState(null);
    
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
			updateUserInfo(data);
		    })
		.catch((error) => {
		    console.error("Error fetching user data:", error);
		});
	}, 
	// arg 2: array of dependencies. When dependencies change, rerun effect
	// empty array = the effect will only run once after the initial render
	// callback doesn’t depend on any value changes in props or state
	[]
    );

    // Deregister user
    const deregistrationHandler = () => {
	fetch(`https://nier-my-api-abd94dc0d9b6.herokuapp.com/users/${user.username}`, {
	    method: 'DELETE',
	    headers: { Authorization: `Bearer ${token}` }
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
            {userInfo ? (
                <div>
		    <br/><br/>
                    <h1>{userInfo.username}'s Profile</h1>
		    <br/><br/>
                    <p>Favourited movies: {userInfo.favoriteMovies}</p>
                    <Button
			variant="danger"
			onClick={deregistrationHandler}
		    >Deregister
		    </Button>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};
