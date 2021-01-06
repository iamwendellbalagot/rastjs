import {useState, createElement} from '../Raku';
/** @jsx createElement */

const style = 
    `
        background-color: gray;
        height: 100vh;
        width: 100vw;
        margin:0;
        padding:0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `
function App() {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([]);
    // const handleSun = () => {
    //   setNum(num + 1)
    // }

    const handleInput = (e) => {
        console.log(input)
    }
    return (
      <div style={style}>
        <h1>Raku</h1>
        <div style='display: flex;'>
            <input 
                placeholder='Enter a text..'
                value={input}
                onInput={(e) => setInput(e.target.value)}
            />
            <button onClick={handleInput}>Add</button>
        </div>
        
      </div>
    );
}

export default App;