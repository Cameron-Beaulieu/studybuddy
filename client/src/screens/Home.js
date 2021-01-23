import './Home.css';
import blobs from '../assets/blobs.png';
import title from '../assets/name.png';
import { useEffect, useState } from 'react';

function Home() {

    const [choiceLevel, setChoiceLevel] = useState(1);  // lvl 1 = choosing time, lvl 2 = choosing schedule

    // display button arrays depending on choice level
    useEffect(() =>{
        document.getElementById('choice-' + choiceLevel).style.display = 'flex';
        if (choiceLevel === 1){
            document.getElementById('choice-2').style.display = 'none';
        }else if (choiceLevel === 2){
            document.getElementById('choice-1').style.display = 'none';
        }
    });

    // make buttons for choice level 1
    function getTimeButtons(){
        const buttonList = ['1 hour', '2 hours', '4 hours', '6 hours', 'custom'];
        const buttons = buttonList.map((button) => {
            return (<button key={button} onClick={() => setChoiceLevel(2)}>{button}</button>)
        });
        return buttons;
    }

    // make buttons for choice level 2
    function getMethodButtons(){
        const buttonList = ['pomodoro', '20/20 rule', 'custom'];
        const buttons = buttonList.map((button) => {
            return (<button key={button}>{button}</button>)
        });
        return buttons;
    }

    return (
        <div className="home">
            <img id="blobs" src={blobs} alt="studybuddy's logo"></img>
            <img id="title" src={title} alt="welcome to studybuddy"></img>
            <h2 className="subtitle">START WORK SESSION</h2>
            <div id="choice-1" className="button-array">
                {getTimeButtons()}
            </div>
            <div id="choice-2" className="button-array">
                <button key="restart" onClick={() => setChoiceLevel(1)}>restart</button>
                {getMethodButtons()}
            </div>
        </div>
    );
}

export default Home
