import './Kanban.css';
import '../components/KanbanBoard.css';
import '../components/Task.css'
import studybuddy from '../assets/name-w-blobs.png';
import Popup from 'reactjs-popup';
import Timer from '../components/Timer'
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import 'reactjs-popup/dist/index.css';

function Kanban({time}) {

    //task arrays
    const [toDoTasks, setToDo] = useState([]);
    const [progressTasks, setProgress] = useState([]);
    const [doneTasks, setDone] = useState([]);

    class Task extends React.Component {

        bounds = { // need to fix bounds
            toDo: window.innerWidth / 3 -100,
            inProgress: (window.innerWidth / 3) * 2 -100,
            done: window.innerWidth
        }
    
        constructor(props) {
            super(props);
            this.name = props.name;
            this.state = {
                position: {
                    x: 0,
                    y: 0
                },
                status: props.status
            }
        }

        componentWillUnmount() { // debugging
            console.log('unmounting');
        }

        removeFromList() {
            switch(this.state.status){
                case 'to-do': setToDo(toDoTasks.filter(task => task !== this.name)); break;
                case 'in-progress': setProgress(progressTasks.filter(task => task !== this.name)); break;
                case 'done': setDone(doneTasks.filter(task => task !== this.name)); break;
            }
            /*console.log('todo:' + toDoTasks);
            console.log('in progress: ' + progressTasks);
            console.log('done: ' + doneTasks);*/
        }
    
        handleStop = (e, ui) => {

            let offset = 0; // offsets bc ui.x is based on position relative to start position
            if (this.state.status === 'in-progress'){
                offset = this.bounds.toDo;
            }else if (this.state.status === 'done'){
                offset = this.bounds.inProgress;
            }

            let newX = ui.x + offset; // new x position
            this.removeFromList(); // remove from old board
            // add to new board based on x position
            if (newX < this.bounds.toDo){
                setToDo(toDoTasks.concat(this.name));
                this.setState({
                    status: 'to-do'
                });
            }else if (newX < this.bounds.inProgress){
                setProgress(progressTasks.concat(this.name));
                this.setState({
                    status: 'in-progress'
                });
            }else {
                setDone(doneTasks.concat(this.name));
                this.setState({
                    status: 'done'
                });
            }
        }
    
        render() {
            return (
                <Draggable onStop={this.handleStop}>
                    <div id={`task-${this.props.name}`}  className={`task ${this.state.status}`}>{this.props.name}</div>
                </Draggable>
            )
        }
    }

    //popup for adding tasks
    const [open, setOpen] = useState(false);
    const closeModal = () => setOpen(false);


    // add new task (defaults to to-do board)
    function addTask() {
        const input = document.getElementById('task-input').value;
        setToDo(toDoTasks.concat(input));
        //console.log(todo);
    }

    // populate boards based on task arrays
    function getTasks(tasks, board){
        let count = 0;
        const taskElements = tasks.map((task) => {
            //console.log(task);
            count++;
            return (<Task key={`${board}-${count}`} name={`${ task }`} status={`${board}`}/>); // name is the name of kanban board
        });
        return taskElements;
    }

    return (
        <div className="kanban">
            <Popup contentStyle={{background: 'none', borderStyle: 'none'}} open={open} closeOnDocumentClick onClose={closeModal}>
                    <div className="task-popup">
                        <span>new task:</span>
                        <form>
                        <input id="task-input" placeholder="task name..."></input>
                        <button className="btn" onClick={() => { addTask(); setOpen(false); }}>+</button>
                        </form>
                    </div>
            </Popup>
            <div className="container">
                <img id="logo" src={studybuddy} alt="studybuddy's logo"></img>
                <Timer font='Alata' fontColor='#9DA7FF' hours={time} minutes={0} seconds={0} postText="hours left"/>
            </div>
            <div id="kanban-btns">
                <button className="btn">view camera</button>
                <button className="btn" onClick={() => setOpen(o => !o)}>add task</button>
            </div>
            <div id="boards">
                <div className="board">
                    <h1>to-do</h1>
                    <hr></hr>
                    <div className="tasks">
                        {getTasks(toDoTasks, 'to-do')}
                    </div>
                </div>
                <div className="board">
                    <h1>in progress</h1>
                    <hr></hr>
                    <div className="tasks">
                        {getTasks(progressTasks, 'in-progress')}
                    </div>
                </div>
                <div className="board">
                    <h1>done</h1>
                    <hr></hr>
                    <div className="tasks">
                        {getTasks(doneTasks, 'done')}
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Kanban