// import statement to indicate files that parcel needs to bundle


// library imports
import { createRoot } from 'react-dom/client';

// css imports
import Container from 'react-bootstrap/Container';
import './index.scss';

// local imports
import { MainView } from './components/main-view/main-view';

// ===========================================================================

// main component (will eventually use all the others)
const App = () => {
    // Container wraps around MainView (essentially the whole app) in index.jsx
    // so that MainView can have rows and cols
    return (
	<Container style={{ minWidth: "100%" }}>
	    <MainView />
	</Container>
    )
};

// finds root of  app
const container = document.querySelector("#root");
const root = createRoot(container);

// tells React to render your app in the root DOM element
root.render(<App />);
