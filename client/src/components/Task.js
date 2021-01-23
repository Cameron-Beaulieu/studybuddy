import React from 'react';
import './Task.css';
import Draggable from 'react-draggable'; // Both at the same time

class Task extends React.Component {

    bounds = {
        toDo: window.innerWidth / 3 -100,
        inProgress: (window.innerWidth / 3) * 2 -100,
        done: window.innerWidth
    }

    constructor(props) {
        super(props);
        this.state = {
            position: {
                x: 0,
                y: 0
            },
            status: props.status
        }
    }

    handleStop = (e, ui) => {
        this.setState({
            position: {
                x: ui.x,
                y: ui.y
            }
        });

        let newX = this.state.position.x;

        if (newX < this.bounds.toDo){
            this.setState({
                status: 'to-do'
            });
        }else if (newX < this.bounds.inProgress){
            this.setState({
                status: 'in-progress'
            })
        }else {
            this.setState({
                status: 'done'
            })
        }

        console.log(this.state.position);
    }

    render() {
        return (
            <Draggable onStop={this.handleStop} position={this.state.position}>
                <div className={`task ${this.state.status}`}>{this.props.name}</div>
            </Draggable>
        )
    }
}

/*function Task({ name, status }) {

    const order = ['to-do', 'in-progress', 'done'];

    const [position, setPosition] = useState(
        {
            x: 0,
            y: 0
        }
    );

    let handleStop = (e) => {
        setPosition({
            x: position.x + e.clientX,
            y: position.y + e.clientY
        })
    }

    const [taskStatus, setStatus] = useState(status);

    return (
        <Draggable onStop={(e) => { setPosition({ x: e.clientX, y: e.clientY }); console.log(position) }} position={position}>
            <div className={`task ${taskStatus}`}>
                {name}
            </div>
        </Draggable>
    );

}*/

//<button onClick={() => {setStatus(order[1]);}}>move</button>

export default Task
