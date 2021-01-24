import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import useSound from 'use-sound';
import waterSfx from '../assets/water.wav';
import postureSfx from '../assets/posture.wav';
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

function Kanban() {

    //task arrays
    const [toDoTasks, setToDo] = useState([]);
    const [progressTasks, setProgress] = useState([]);
    const [doneTasks, setDone] = useState([]);
    const [showCamera, setCamera] = useState(false);
    const [calibrating, setCalibrating] = useState(true);
    const context = useContext(UserContext);
    const [playWater] = useSound(waterSfx);
    const [playPosture] = useSound(postureSfx);
    const history = useHistory();

    class Task extends React.Component {

        bounds = { 
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
            this.removeFromList(); // remove from old board
            // add to new board based on x position
            if (newX < this.bounds.toDo) {
                if (currentStatus !== 'to-do') {
                    setToDo(toDoTasks.concat(this.name));
                    this.setState({
                        status: 'to-do'
                    });
                }else {
                    setToDo(toDoTasks);
                }
            } else if (newX < this.bounds.inProgress) {
                if (currentStatus !== 'in-progress') {
                    setProgress(progressTasks.concat(this.name));
                    this.setState({
                        status: 'in-progress'
                    });
                }else {
                    setProgress(progressTasks);
                }
            } else if (newX >= this.bounds.inProgress) {
                if (currentStatus !== 'done') {
                    setDone(doneTasks.concat(this.name));
                    this.setState({
                        status: 'done'
                    });
                }else {
                    setDone(doneTasks);
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

    // break popup
    const [onBreak, setOnBreak] = useState(false);

    const [sound, setSound] = useState(true);

    // add new task (defaults to to-do board)
    function addTask() {
        const input = document.getElementById('task-input').value;
        setToDo(toDoTasks.concat(input));
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
        return [hours, minutes, seconds];
    }

    //popup for drinking water
    const [waterPopupOpen, drinkWater] = useState(false);
    const closeWaterPopup = () => drinkWater(false);

    //popup for posture
    const [posturePopupOpen, fixPosture] = useState(false);
    const closePosturePopup = () => fixPosture(false);

    // break suggestions
    const suggestions = ['go for a walk.'] //, 'do some jumping jacks.', 'talk to the people you live with.', 'stretch.', 'go talk to someone.', 'fill up your water.', 'go to the washroom.', 'get some fresh air'];

    function getRandomSuggestion(){
        let random = Math.floor(Math.random() * suggestions.length);
        return suggestions[random];
    }

    let randomSuggestion = getRandomSuggestion();

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
            <Popup contentStyle={{ background: 'none', borderStyle: 'none' }} open={onBreak} onClose={() => {
                context.setOnBreak(false);
                setOnBreak(false);
            }}>
                <div id="break" className="popup-div">
                    <Timer fontSize = {16} font='Alata' fontColor='#FFFFFF' hours={(convertTime(context.breakMin))[0]} minutes={convertTime(context.breakMin)[1]} seconds={convertTime(context.breakMin)[2]} postText="'til break is over" onFinish={() => {
                        context.setOnBreak(false);
                        setOnBreak(false);
                    }} onSecondTick={() => {
                        context.setTimeOnBreak(context.timeOnBreak + 1/60);
                    }}/>
                    <div id="suggestion">break time suggestion: {randomSuggestion}</div>
                </div>
            </Popup>
            <div className="container">
                <img id="logo" src={studybuddy} alt="studybuddy's logo"></img>
                <div id = "timers">
                {onBreak ? null : <Timer fontSize = {32} font='Alata' fontColor='#9DA7FF' hours={(convertTime(context.workMin))[0]} minutes={(convertTime(context.workMin))[1]} seconds={(convertTime(context.workMin))[0]} postText="'til break time" onFinish={() => {
                    context.setOnBreak(true);
                    setOnBreak(true);
                }}/>}
                <Timer fontSize = {16} font='Alata' fontColor='#9DA7FF' hours={(convertTime(context.sessionTime))[0]} minutes={convertTime(context.sessionTime)[1]} seconds={convertTime(context.sessionTime)[2]} postText="left in session" onFinish={() => history.push('/stats')}/>
                </div>
            </div>
            <div id="kanban-btns">
                {showCamera ? <button className = "btn" onClick = {() => setCamera(o => !o)}>close camera</button>:<button className = "btn" onClick = {() => setCamera(o => !o)}>view camera</button>}
                {calibrating ? <button className="btn">calibrating...</button> : <button className="btn" onClick={() => setCalibrating(true)}>re-calibrate</button>}
                <button className="btn" onClick={() => setSound(o => !o)}>sound currently {sound ? "on" : "off"}</button>
                <button className="btn" onClick={() => setOpen(o => !o)}>add task</button>
            </div>
            <Camera visible={showCamera} calibrating={calibrating} onCalibrate={() => setCalibrating(false)} onSipWarning={waterPopupOpen ? () => {} : () => {
                if (sound) {
                    playWater();
                }
                drinkWater(true)
            }} onPostureWarning={posturePopupOpen ? () => {} : () => {
                if (sound) {
                    playPosture();
                }
                fixPosture(true);
            }}></Camera>
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