// use props to pass data from a component’s state to one of its children
// props allows tinkering with parent and child independently
// as long as parent passes on all props expected by the child

export const MovieCard = (props) => {
    // only the title should be rendered on each card
    return (
	<div
	    onClick={
		// onClick event attr only works as an event listener with JSX elements but not with components
		// which is why it's here, added to div in MovieCard's render method, as opposed to mainview
		// onMovieClick function is received as prop from mainview where updateSelectedMovie() is called
		() => {
		    // note the new arrow function: "when there is a click, invoke this new arrow func""
		    // .i.e. it's not:
		    // onClick={props.onMovieClick(props.movieCardContent)}
		    // as that would be passing the result of having called a function
		    // the () will be immediately invoked when component renders and not wait for onClick event
		    props.onMovieClick(props.movieCardContent);
		}
	    }
	>
	    {props.movieCardContent.title}
	</div>
    );
};
