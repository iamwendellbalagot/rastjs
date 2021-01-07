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
    const input = useState('');
    const logs = useState(['wendel', 'jim', 'als']);

    const handleInput = (e) => {
        e.preventDefault();
        input.value && logs.setValue([...logs.value, input.value])
        input.setValue('')
    }


    return (
      <div style={style}>
        <h1>Raku</h1>
        <form style='display: flex;' eventSubmit={handleInput}>
            <input 
                placeholder='Enter a text..'
                value={input.value}
                eventInput={(e) => input.setValue(e.target.value)}
            />
            <button type='submit'>Add</button>
        </form>
        {logs.value.map(a => (<p>{a}</p>))}
      </div>
    );
}

export default App;