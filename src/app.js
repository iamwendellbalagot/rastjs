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
    const [logs, setLogs] = useState(['wendel', 'jim', 'als']);
    const [show, setShow] = useState(false);

    const handleInput = (e) => {
        e.preventDefault();
        input && setLogs([...logs, input])
        setShow(!show)
    }

    const ar = ['wendel', 'jim', 'als'];

    return (
      <div style={style}>
        <h1>Raku</h1>
        <form style='display: flex;' eventSubmit={handleInput}>
            <input 
                placeholder='Enter a text..'
                value={input}
                eventInput={(e) => setInput(e.target.value)}
            />
            <button type='submit'>Add</button>
        </form>
        {logs.map(a => (<p>{a}</p>))}
      </div>
    );
}

export default App;