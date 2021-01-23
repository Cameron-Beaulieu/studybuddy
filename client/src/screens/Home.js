import './Home.css';
import blobs from '../assets/blobs.png';
import title from '../assets/name.png';
//import './screens.css';

function Home() {

    function getStartButtons(){
        const buttonList = ['1 hour', '2 hours', '4 hours', '6 hours', 'custom'];
        const buttons = buttonList.map((button) => createButton(button));
        return buttons;
    }

    function getMethodButtons(){
        const buttonList = ['pomodoro', '20/20 rule', 'custom'];
        const buttons = buttonList.map((button) => createButton(button));
        return buttons;
    }

    function createButton(name){
        return (
            <button key={name}>{name}</button>
        );
    }

    return (
        <div className="home">
            <img id="blobs" src={blobs}></img>
            <img id="title" src={title}></img>
            <h2 className="subtitle">START WORK SESSION</h2>
            <div className="button-array">
                {getStartButtons()}
            </div>
        </div>
    );
}

export default Home
