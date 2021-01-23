import { useState } from 'react';
import './Task.css';

function Task({name, status}){

    const order = ['to-do', 'in-progress', 'done']

    const [taskStatus, setStatus] = useState(status);

    return (
        <div className={`task ${ taskStatus }`}>
            {name} 
        </div>
    );
}

//<button onClick={() => {setStatus(order[1]);}}>move</button>

export default Task