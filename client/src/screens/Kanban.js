import { useContext } from 'react';
import './Kanban.css';
import '../components/KanbanBoard.css';
import '../components/Task.css'
import studybuddy from '../assets/name-w-blobs.svg';
import kevins from '../assets/kevins.svg';
import Popup from 'reactjs-popup';
import Timer from '../components/Timer';
import Camera from '../components/Camera';
import React, { useState } from 'react';
import UserContext from '../userContext';
import Draggable from 'react-draggable';
import 'reactjs-popup/dist/index.css';
import will from '../assets/will.svg';
import { useContext } from 'react';

function Kanban({ time }) {

    //task arrays
    const [toDoTasks, setToDo] = useState([]);
    const [progressTasks, setProgress] = useState([]);
    const [doneTasks, setDone] = useState([]);
    const [showCamera, setCamera] = useState(false);
    const context = useContext(UserContext);

    class Task extends React.Component {

        bounds = { // need to fix bounds
            toDo: document.body.clientWidth / 3,
            inProgress: (document.body.clientWidth / 3) * 2,
            done: document.body.clientWidth
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

        static contextType = UserContext;
        
        componentWillUnmount() { // debugging
            console.log('unmounting');
        }

        // remove task from board list
        removeFromList() {
            switch (this.state.status) {
                case 'to-do': setToDo(toDoTasks.filter(task => task !== this.name)); break;
                case 'in-progress': setProgress(progressTasks.filter(task => task !== this.name)); break;
                case 'done': setDone(doneTasks.filter(task => task !== this.name)); break;
                default: break;
            }
        }

        handleStop = (e) => {

            let currentStatus = this.state.status;

            let newX = e.clientX; // new x position
            console.log(newX);
            // add to new board based on x position
            if (newX < this.bounds.toDo) {
                if (currentStatus !== 'to-do') {
                    this.removeFromList(); // remove from old board
                    setToDo(toDoTasks.concat(this.name));
                    this.setState({
                        status: 'to-do'
                    });
                }
            } else if (newX < this.bounds.inProgress) {
                if (currentStatus !== 'in-progress') {
                    this.removeFromList(); // remove from old board
                    setProgress(progressTasks.concat(this.name));
                    this.setState({
                        status: 'in-progress'
                    });
                }
            } else if (newX >= this.bounds.inProgress) {
                if (currentStatus !== 'done') {
                    this.removeFromList(); // remove from old board
                    setDone(doneTasks.concat(this.name));
                    this.setState({
                        status: 'done'
                    });
                }
            }
        }

        render() {
            return (
                <Draggable onStop={this.handleStop}>
                    <div id={`task-${this.props.name}`} className={`task ${this.state.status}`}>{this.props.name}</div>
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
    function getTasks(tasks, board) {
        let count = 0;
        const taskElements = tasks.map((task) => {
            //console.log(task);
            count++;
            return (<Task key={`${board}-${count}`} name={`${task}`} status={`${board}`} />); // name is the name of kanban board
        });
        return taskElements;
    }

    //converts total seesion time in minutes to hours, minutes, seconds 
    function convertTime(totalSessionTimeMinutes){
        let hours = Math.floor(totalSessionTimeMinutes/60);
        let minutes = totalSessionTimeMinutes - (hours*60);
        let seconds = 60 * (totalSessionTimeMinutes - Math.floor(totalSessionTimeMinutes));
        console.log(minutes);
        return [hours, minutes, seconds];
    }

    //popup for drinking water
    const [waterPopupOpen, drinkWater] = useState(false);
    const closeWaterPopup = () => drinkWater(false);

    //popup for posture
    const [posturePopupOpen, fixPosture] = useState(false);
    const closePosturePopup = () => fixPosture(false);

    return (
        <div className="kanban">
            <Popup contentStyle={{ background: 'none', borderStyle: 'none' }} open={posturePopupOpen} closeOnDocumentClick onClose={closePosturePopup}>
                <div id="fix-posture" className="popup-div">
                    <img id="kevins" src={kevins} alt="a drawing of someone fixing their posture"></img>
                    <h2>sit up! your posture is important!</h2>
                </div>
            </Popup>
            <Popup contentStyle={{ background: 'none', borderStyle: 'none' }} open={open} closeOnDocumentClick onClose={closeModal}>
                <div className="task-popup popup-div">
                    <span>new task:</span>
                    <form>
                        <input id="task-input" placeholder="task name..."></input>
                        <button className="btn" onClick={() => { addTask(); setOpen(false); }}>+</button>
                    </form>
                </div>
            </Popup>
            <Popup contentStyle={{ background: 'none', borderStyle: 'none' }} open={waterPopupOpen} closeOnDocumentClick onClose={closeWaterPopup}>
                <div id="drink-water" className="popup-div">
                    <img id="will" src={will} alt="a drawing of a water droplet"></img>
                    <h2>here's your reminder to drink some water!</h2>
                </div>
            </Popup>
            <div className="container">
                <img id="logo" src={studybuddy} alt="studybuddy's logo"></img>
                <div id = "timers">
                <Timer fontSize = {32} font='Alata' fontColor='#9DA7FF' hours={(convertTime(context.workMin))[0]} minutes={(convertTime(context.workMin))[1]} seconds={(convertTime(context.workMin))[0]} postText="till break time" />
                <Timer fontSize = {16} font='Alata' fontColor='#9DA7FF' hours={(convertTime(context.sessionTime))[0]} minutes={convertTime(context.sessionTime)[1]} seconds={convertTime(context.sessionTime)[2]} postText="hours left" />
                </div>
            </div>
            <div id="kanban-btns">
                {showCamera ? <button className = "btn" onClick = {() => setCamera(o => !o)}>close camera</button>:<button className = "btn" onClick = {() => setCamera(o => !o)}>view camera</button>}
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