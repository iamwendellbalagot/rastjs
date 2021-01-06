import {render, createElement} from './Raku'
/** @jsx createElement */
import Welcome from './src/app';
const App = () => {
    return (
        <div>
            <Welcome />
        </div>
    )
}

const element = <App />;
const container = document.getElementById("root");
render(element, container);
