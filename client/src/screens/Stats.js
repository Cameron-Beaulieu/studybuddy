import './Stats.css';
import header from '../assets/name-w-blobs.png';
import { PieChart } from 'react-minimal-pie-chart'

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
        const month = new Date().getMonth();
        const day = new Date().getDate();
        const year = new Date().getYear() + 1900;
        const months = ["january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"];
        const selectedMonthName = months[month];
        return (
            <h1 id="title">stats for session on {selectedMonthName} {day}, {year} </h1>
        )
    }

    function displayChartInfo() {
        const ratioProductive = productive / (productive + slack + breakTime + overBreak);
        const ratioSlack = slack / (productive + slack + breakTime + overBreak);
        const ratioBreak = breakTime / (productive + slack + breakTime + overBreak);
        const ratioOver = overBreak / (productive + slack + breakTime + overBreak);
        return (
            <h1 id="chartInfo">{Math.floor(ratioProductive * sessionTimeMinutes)} minutes productive, {Math.floor(ratioSlack * sessionTimeMinutes)} minutes unproductive, {Math.floor(ratioBreak * sessionTimeMinutes)} minutes on break, {Math.floor(ratioOver * sessionTimeMinutes)} minutes of extra break taken</h1>
        )
    }
    function displayStats() {
        return (
            <div id="stats">
                <h1 class="stat">{sips} drinks of water taken</h1>
                <h1 class="stat">your posture was bad {postureChecks} times</h1>
            </div>
        )

    }
    function generateData(){
        const ratioProductive = productive / (productive + slack + breakTime + overBreak);
        const ratioSlack = slack / (productive + slack + breakTime + overBreak);
        const ratioBreak = breakTime / (productive + slack + breakTime + overBreak);
        const ratioOver = overBreak / (productive + slack + breakTime + overBreak);
        const data = [
            { title: `Productive Time: ${Math.floor(ratioProductive * sessionTimeMinutes)} minutes`, key: 'Productive Time', value: productive, color: '#00A9B4' },
            { title: `Wasted Time: ${Math.floor(ratioSlack * sessionTimeMinutes)} minutes`, key: 'Wasted Time', value: slack, color: '#AAFAFF' },
            { title: `Break Time: ${Math.floor(ratioBreak * sessionTimeMinutes)} minutes`, key: 'Break Time', value: breakTime, color: '#00747F' },
            { title: `Extra Break Time: ${Math.floor(ratioOver * sessionTimeMinutes)} minutes`, key: 'Extra Break Time', value: overBreak, color: '#9D669B' }
        ]
        return data;
    }
    return (
        <div id="screen">
            <img id="name-w-blobs" src={header} alt="Study Buddy"></img>
            <div id="innerSection">
                {displayTitle()}
                <div id="pieChart">{displayPieChart()}</div>
                {displayChartInfo()}
                {displayStats()}
                
            </div>
        </div>
    )
}

export default Stats
