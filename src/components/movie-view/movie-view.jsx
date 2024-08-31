// use props to pass data from a component’s state to one of its children
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

// destructure props arg to access properties directly
export const MovieView = ({ movieViewContent, onBackClick }) => {
    return (
	<div>
	    <button onClick={onBackClick}>Back</button>
	    <div>
		<span>Title: </span>
		<span>{movieViewContent.title}</span>
	    </div>
	    <div>
		<span>Director: </span>
		<span>{movieViewContent.director}</span>
	    </div>
	    <div>
		<span>Genre: </span>
		<span>{movieViewContent.genre}</span>
	    </div>
	</div>
    );
};
// note that here we are passing a reference to the onBackClick func
// "when there is a click, invoke func"
