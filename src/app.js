import {useState, createElement} from '../Raku';
/** @jsx createElement */

const style = "background-color: red"
function App() {
    const [num, setNum] = useState(0);
    // const handleSun = () => {
    //   setNum(num + 1)
    // }
    return (
      <div style={style}>
        <h1 class='text' onClick={() => setNum(num + 1)}>{`Counter: ${num}`}</h1>
      </div>
    );
}

export default App;