import { useContext } from 'react';
import './Stats.css';
import studybuddy from '../assets/name-w-blobs.svg';
import UserContext from '../userContext';
import { PieChart } from 'react-minimal-pie-chart';

function Stats() {
    const context = useContext(UserContext);

    function displayPieChart() {

        return (
            <PieChart 
            animate = {true}
            data={generateData()}
            />
        )
    }

    function displayTitle() {
        const today = new Date();
        const month = today.getMonth();
        const day = today.getDate();
        const year = today.getFullYear();
        const months = ["january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"];
        const selectedMonthName = months[month];
        return (
            <h2 id="sessionTitle">stats for session on {selectedMonthName} {day}, {year} </h2>
        )
    }

    function displayChartInfo() {
        const ratioProductive = context.productive / (context.productive + context.slack + context.breakTime + context.overBreak);
        const ratioSlack = context.slack / (context.productive + context.slack + context.breakTime + context.overBreak);
        const ratioBreak = context.breakTime / (context.productive + context.slack + context.breakTime + context.overBreak);
        const ratioOver = context.overBreak / (context.productive + context.slack + context.breakTime + context.overBreak);
        return (
            <h2 id="chartInfo">{Math.floor(ratioProductive * context.sessionTimeMinutes)} minutes productive, {Math.floor(ratioSlack * context.sessionTimeMinutes)} minutes unproductive, {Math.floor(ratioBreak * context.sessionTimeMinutes)} minutes on break, {Math.floor(ratioOver * context.sessionTimeMinutes)} minutes of extra break taken</h2>
        )
    }
    function displayStats() {
        return (
            <div id="stats">
                {displayChartInfo()}
                <h2 class="stat">{context.sips} drinks of water taken</h2>
                <h2 class="stat">your posture was bad for {context.goodPostureTime} minutes</h2>
            </div>
        )

    }
    function generateData(){
        const ratioProductive = context.productive / (context.productive + context.slack + context.breakTime + context.overBreak);
        const ratioSlack = context.slack / (context.productive + context.slack + context.breakTime + context.overBreak);
        const ratioBreak = context.breakTime / (context.productive + context.slack + context.breakTime + context.overBreak);
        const ratioOver = context.overBreak / (context.productive + context.slack + context.breakTime + context.overBreak);
        const data = [
            { title: `productive time: ${Math.floor(ratioProductive * context.sessionTimeMinutes)} minutes`, key: 'productive time', value: context.productive, color: '#00A9B4' },
            { title: `wasted time: ${Math.floor(ratioSlack * context.sessionTimeMinutes)} minutes`, key: 'wasted time', value: context.slack, color: '#AAFAFF' },
            { title: `break time: ${Math.floor(ratioBreak * context.sessionTimeMinutes)} minutes`, key: 'break time', value: context.breakTime, color: '#00747F' },
            { title: `extra break time: ${Math.floor(ratioOver * context.sessionTimeMinutes)} minutes`, key: 'extra break time', value: context.overBreak, color: '#9D669B' }
        ]
        return data;
    }
    return (
        <div id="screen">
             <div className="container">
                <img id="logo" src={studybuddy} alt="studybuddy's logo"></img>
                <button id="newSession" className="stats-btn">start new session</button>
            </div>
            <div id="innerSection">
                {displayTitle()}
                <div id="pieChart">{displayPieChart()}</div>
                <h3>here's how you did:</h3>
                {displayStats()}
                
            </div>
        </div>
    )
}

export default Stats
