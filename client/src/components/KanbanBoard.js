import './KanbanBoard.css';
import Task from './Task';

function KanbanBoard({name, tasks}){

    function getTasks(tasks){
        let count = 0;
        const taskElements = tasks["tasks"].map((task) => {
            //console.log(task);
            count++;
            return (<Task key={`${name}-${count}`} name={`${ task }`} status={`${name}`}></Task>); // name is the name of kanban board
        });
        return taskElements;
    }

    return (
        <div className="board">
            <h1>{name}</h1>
            <hr></hr>
            <div id="tasks">
                {getTasks({tasks})}
            </div>
        </div>
    )
}

export default KanbanBoard