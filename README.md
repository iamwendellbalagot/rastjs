<table align="center"><tr><td align="center" width="9999">
<img src="https://drive.google.com/uc?export=view&id=1kybX7EAbhNyDJN03ORD82tpvThHwJch5" height="150" align='center' />

# RastJS
JavaScript front-end library that supports concurrent mode
</td></tr></table>

  * **RastJS provides a Virtual DOM** abstraction on top of the actual DOM and it's fast, thanks to a simple and predictable reconcile algorithm implementation.
  * Like react, when a component's state data changes, the rendered elements in the **DOM will be updated**.
  
### Installation

``` js
npm install rastjs
```

 * Link to CLI repo that generates rastJS app boilerplate.<br/>
https://github.com/iamwendellbalagot/rast-app
 
### Usage
``` js
import Rast, { initializeValue, DOMnode } from "rastjs";
/** @jsx DOMnode */

const App = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default App;

```
  * **Note**: you need to add *//** @jsx DOMnode*/ to every .js files that uses JSX to transpile it (see the example above).
### Known Issue
When you use ternary operators or (map/forEach) to render JSX elements, you need to put a div element as a wrapper.
``` jsx
//Example 1
<div>{myState.value? <p>Hello, World</p> : null}</div>
//Example 2
<div>{mystate.value.map(item => (<p>{item}</p>))}</div>
```
### initializeValue Hook
Like react, you can also declare a state in your application using RastJS.

``` js
//State Implementation
import {DOMnode, initializeValue, initializeEffect} from 'rastjs';
/** @jsx DOMnode */
const App = () => {
  const myState = initializeValue('value'); // Initialize a state
  
  initializeEffect([myState.value], () => {
    //You can get the value of a certain state by using:
    console.log(myState.value);
  });
  
  const handleState = () => {
    //Change the state value
    myInput.setValue('new value');
  }
  
  return;
}
export default App;
```

### initializeEffect Hook
``` js
import {DOMnode, initializeValue, initializeEffect} from 'rastjs';
/** @jsx DOMnode */ 

const App = () => {
  const myState = initializeValue('value'); // Initialize a state
  
  //Initialize an effect that runs whenever the **myState** value changes.
  initializeEffect([myState.value], () => {
    console.log(`myState value UPDATED to ${myState.value}`)
  });
  
  const handleState = () => {
    //Change the state value
    myInput.setValue('new value');
    //You can get the value of a certain state by using:
    console.log(myState.value);
  }
  
  return;
}
export default App;
```
### CSS & SCSS usage
CSS & SASS loaders are already installed and configured. You can modify the webpack.config.js to add custom loaders.<br/>
 * There are two ways to import CSS and SCSS files.
``` js
//import the css or scss file
import './styles.css'

...
// Assign a class on a element.
<div className='app'>
  <p>Hello, World</p>
</div>
```

``` js
//import the css or scss file
import styles from './styles.css'

...
// Assign a class on a element.
<div className={styles.app}>
  <p>Hello, World</p>
</div>
```
### Inline Styling
Use camel-casing, **do not use (background-color)** when declaring a style, rast will complain.
``` js
<div style={{backgroundColor: 'steelblue'}}>
  <p>Hello, World</p>
</div>
```

### Event Listeners
When adding an event listener on a certain element, use *event + event-name*  (example: eventClick).<br />
Here is the link of available DOM element events: <br/>
https://www.w3schools.com/jsref/dom_obj_event.asp

``` jsx
<button eventClick={your_function} >Add</button>
<input eventInput={(e) => myState.setValue(e.target.value)} />
<form eventSubmit={handleSubmit}></form>
```

### Importing images
use: 
``` jsx
//Assuming that the image is on the assets folder
import yourImage from '../assets/your-image.png';
<img src={yourImage} />

//DO NOT USE THIS:
<img src='../assets/your-image.png' />
//If you use this kind of syntax, webpack will not include the image when you bundle the app.
```

## License
This repo is under the MIT license.
