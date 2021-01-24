import { useContext } from 'react';
import './Home.css';
import UserContext from '../userContext';
import blobs from '../assets/blobs.png';
import title from '../assets/name.png';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { useHistory } from 'react-router-dom';

function Home() {
    const history = useHistory();
    const [choiceLevel, setChoiceLevel] = useState(1);  // lvl 1 = choosing time, lvl 2 = choosing schedule

    const context = useContext(UserContext);
    var sessionTime = 0;
    const setSessionTime = (hour) => {
        context.setSessionTime(hour*60);
        sessionTime = hour;
    }


    // display button arrays depending on choice level
    useEffect(() =>{
        document.getElementById('choice-' + choiceLevel).style.display = 'flex';
        if (choiceLevel === 1){
            document.getElementById('choice-2').style.display = 'none';
            document.querySelector('.subtitle').innerHTML = 'START WORK SESSION';
        }else if (choiceLevel === 2){
            console.log('chosen time: ' + sessionTime);
            document.getElementById('choice-1').style.display = 'none';
            document.querySelector('.subtitle').innerHTML = 'BREAK SCHEDULING METHOD';
        }
    });

    // make buttons for choice level 1
    function getTimeButtons(){
        const buttonList = [1, 2, 4, 6];
        const buttons = buttonList.map((button) => {
            return (<button key={button} onClick={() => {setSessionTime(button); setChoiceLevel(2);}}>{button} hours</button>)
        });
        return buttons;
    }

    // make buttons for choice level 2
    function getMethodButtons(){
        const buttonList = [
            {
                name: 'pomodoro',
                description: 'For every 25 minutes, take a break. For each break, if you have taken at least 4 breaks, take a break for 15-30 minutes. Otherwise, take a break for 3-5 minutes.'
            },
            {
                name: '20/20 rule',
                description: 'For every 20 minutes of work, take 20 seconds to look off your screen.'
            }
        ]
        //['pomodoro', '20/20 rule'];
        const buttons = buttonList.map((button) => {
            return (<button className="home-btn" key={button.name} title={button.description} onClick={() => {setSchedule(button.name);}}>{button.name}</button>)
        });
        return buttons;
    }

    //popup for custom schedule
    const [openSchedule, setScheduleOpen] = useState(false);
    const closeScheduleModal = () => setScheduleOpen(false);


    // create a custom schedule
    function chooseCustomSchedule() {
        const workInput = document.getElementById('work-input').value;
        const breakInput = document.getElementById('break-input').value;
        setSchedule(`${workInput} ${breakInput}`);
    }

    //popup for adding tasks
    const [openTime, setTimeOpen] = useState(false);
    const closeTimeModal = () => setTimeOpen(false);


    // create a custom session time
    function chooseCustomTime() {
        const timeInput = document.getElementById('time-input').value;
        setSessionTime(timeInput);
    }

    function setSchedule(schedule){
        var breakTime, workTime;
        if (schedule === 'pomodoro'){
            breakTime = 300;
            workTime = 1500;
        }
        else if (schedule === '20/20 rule'){
            breakTime = 20;
            workTime = 1200;
        }
        //for custom
        else{
            var parts = schedule.split(" ")
            breakTime = parseInt(parts[1]);//however we track the break converted to seconds
            workTime = parseInt(parts[0])//however we track the workTime in seconds
        }
        var scheduleTimes = {
            breakSec: breakTime,
            workSec: workTime
        }
        context.setBreakMin(breakTime / 60);
        context.setWorkMin(workTime / 60);
        history.push("/kanban");
    }

    return (
        <div className="home">
            <Popup contentStyle={{background: 'none', borderStyle: 'none'}} open={openTime} closeOnDocumentClick onClose={closeTimeModal}>
                    <div className="popup-div">
                        <span>input total session time in minutes:</span>
                        <form>
                        <input id="time-input" placeholder="time in minutes..."></input>
                        <button className="btn" onClick={() => { chooseCustomTime(); setTimeOpen(false); }}>done</button>
                        </form>
                    </div>
            </Popup>
            <Popup contentStyle={{background: 'none', borderStyle: 'none'}} open={openSchedule} closeOnDocumentClick onClose={closeScheduleModal}>
                    <div className="popup-div">
                        <span>input interval of work time followed by break time in minutes:</span>
                        <form>
                        <input id="work-input" placeholder="work interval..."></input>
                        <input id="break-input" placeholder="break interval..."></input>
                        <button className="btn" onClick={() => { chooseCustomSchedule(); setScheduleOpen(false); }}>done</button>
                        </form>
                    </div>
            </Popup>
            <img id="blobs" src={blobs} alt="studybuddy's logo"></img>
            <img id="title" src={title} alt="welcome to studybuddy"></img>
            <h2 className="subtitle">START WORK SESSION</h2>
            <div id="choice-1" className="button-array">
                {getTimeButtons()}
                <button key="custom" onClick={() => setTimeOpen(o => !o)}>custom</button>
            </div>
            <div id="choice-2" className="button-array">
                <button className="home-btn" key="restart" onClick={() => setChoiceLevel(1)}>restart</button>
                {getMethodButtons()}
                <button key="custom" onClick={() => setScheduleOpen(o => !o)}>custom</button>
            </div>
        </div>
    );
}

export default Home
