import './Stats.css';
import studybuddy from '../assets/name-w-blobs.png';
import { PieChart } from 'react-minimal-pie-chart';

function Stats({ productive, slack, breakTime, overBreak, sips, postureChecks, sessionTimeMinutes }) {


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
        const ratioProductive = productive / (productive + slack + breakTime + overBreak);
        const ratioSlack = slack / (productive + slack + breakTime + overBreak);
        const ratioBreak = breakTime / (productive + slack + breakTime + overBreak);
        const ratioOver = overBreak / (productive + slack + breakTime + overBreak);
        return (
            <h2 id="chartInfo">{Math.floor(ratioProductive * sessionTimeMinutes)} minutes productive, {Math.floor(ratioSlack * sessionTimeMinutes)} minutes unproductive, {Math.floor(ratioBreak * sessionTimeMinutes)} minutes on break, {Math.floor(ratioOver * sessionTimeMinutes)} minutes of extra break taken</h2>
        )
    }
    function displayStats() {
        return (
            <div id="stats">
                {displayChartInfo()}
                <h2 class="stat">{sips} drinks of water taken</h2>
                <h2 class="stat">your posture was bad {postureChecks} times</h2>
            </div>
        )

    }
    function generateData(){
        const ratioProductive = productive / (productive + slack + breakTime + overBreak);
        const ratioSlack = slack / (productive + slack + breakTime + overBreak);
        const ratioBreak = breakTime / (productive + slack + breakTime + overBreak);
        const ratioOver = overBreak / (productive + slack + breakTime + overBreak);
        const data = [
            { title: `productive time: ${Math.floor(ratioProductive * sessionTimeMinutes)} minutes`, key: 'productive time', value: productive, color: '#00A9B4' },
            { title: `wasted time: ${Math.floor(ratioSlack * sessionTimeMinutes)} minutes`, key: 'wasted time', value: slack, color: '#AAFAFF' },
            { title: `break time: ${Math.floor(ratioBreak * sessionTimeMinutes)} minutes`, key: 'break time', value: breakTime, color: '#00747F' },
            { title: `extra break time: ${Math.floor(ratioOver * sessionTimeMinutes)} minutes`, key: 'extra break time', value: overBreak, color: '#9D669B' }
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
