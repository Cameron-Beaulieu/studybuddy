import './Home.css';
import blobs from '../assets/blobs.png';
import title from '../assets/name.png';
import { useEffect, useState } from 'react';

function Home() {

    const [choiceLevel, setChoiceLevel] = useState(1);  // lvl 1 = choosing time, lvl 2 = choosing schedule
    const [sessionTime, setSessionTime] = useState(0); // how long session is
    const [schedule, setSchedule] = useState(''); // schedule choice

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
            return (<button key={button.name} title={button.description} onClick={() => {setSchedule(button.name);}}>{button.name}</button>)
        });
        return buttons;
    }

    // choose custom time
    function chooseCustomTime(){
        // make like a popup
        setSessionTime(0); // arbitrary; delete later
    }

    function chooseCustomSchedule(){
        // make popup
        setSchedule(''); // arbitrary; delete later
    }

    return (
        <div className="home">
            <img id="blobs" src={blobs} alt="studybuddy's logo"></img>
            <img id="title" src={title} alt="welcome to studybuddy"></img>
            <h2 className="subtitle">START WORK SESSION</h2>
            <div id="choice-1" className="button-array">
                {getTimeButtons()}
                <button key="custom" onClick={chooseCustomTime}>custom</button>
            </div>
            <div id="choice-2" className="button-array">
                <button key="restart" onClick={() => setChoiceLevel(1)}>restart</button>
                {getMethodButtons()}
                <button key="custom" onClick={chooseCustomSchedule}>custom</button>
            </div>
        </div>
    );
}

export default Home
