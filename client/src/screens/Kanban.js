import './Kanban.css';
import KanbanBoard from '../components/KanbanBoard';
import Task from '../components/Task';
import studybuddy from '../assets/name-w-blobs.png';
import Popup from 'reactjs-popup';
import { useState, useEffect } from 'react';
import 'reactjs-popup/dist/index.css';

function Kanban() {

    //boards
    const [toDoTasks, setToDo] = useState([]);
    const [progressTasks, setProgress] = useState([]);
    const [doneTasks, setDone] = useState([]);

    //popup
    const[open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);


    function addTask(){
        const input = document.getElementById('task-input').value;
        setToDo(toDoTasks.concat(input));
        //console.log(todo);
    }


    return (
        <div className="kanban">
            <div className="container">
                <img id="logo" src={studybuddy}></img>
            </div>
            <div id="kanban-btns">
                <button className="btn">view camera</button>
                <button className="btn" onClick={() => setOpen (o => !o)}>add task</button>
                <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                    <div className="content">
                        <input id="task-input" placeholder="task name..."></input>
                        <button className="btn" onClick={() => {addTask(); setOpen(false);}}>add!</button>
                    </div>
                </Popup>
            </div>
            <div id="boards">
                <KanbanBoard name="to-do" tasks={toDoTasks}></KanbanBoard>
                <KanbanBoard name="in progress" tasks={progressTasks}></KanbanBoard>
                <KanbanBoard name="done!" tasks={doneTasks}></KanbanBoard>
            </div>


        </div>
    );
}

export default Kanban
