import {initializeValue, createElement} from '../Raku';
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
const nodes = 
    `
        border: 1px solid lightgreen;
        padding-top: 10px;
        width: 300px;
        text-align: center;
        border-radius: 3px;
    `
function App() {
    const input = initializeValue('');
    const logs = initializeValue(['wendel', 'jim', 'als']);

    const handleInput = (e) => {
        e.preventDefault();
        input.value && logs.setValue([...logs.value, input.value])
        input.setValue('')
    }

    const handleDelete = (idx) => { 
        const newLogs = [...logs.value].filter(val => val !== logs.value[idx])
        logs.setValue(newLogs)
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
        {logs.value.map((a,idx) => (
            <p style={nodes} eventClick={() => handleDelete(idx)}>{a}</p>
        ))}
      </div>
    );
}

export default App;