// This component accepts data from the parent component's (MainView's) state via props
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

// destructure props arg to access properties directly
export const MovieView = ({ movieViewContent, onBackClick }) => {
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

	    <button onClick={onBackClick}>Back</button>
	    
	</div>
    );
};
// note that here we are passing a reference to the onBackClick func
// "when there is a click, invoke func"
