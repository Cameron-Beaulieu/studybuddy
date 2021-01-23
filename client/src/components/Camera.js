import React from 'react';
import './Camera.css';

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.cameraRef = React.createRef();
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }})
        .then(stream => {
            this.cameraRef.current.srcObject = stream;
            this.cameraRef.current.onloadedmetadata = () => { this.cameraRef.current.play() };
        })
        .catch(err => {
            console.log("Camera permissions denied");
        })
    }

    videoError() {
        console.log("Camera permissions are needed for this app to work");
    }

    render() {
        return (
            <div>
                <video ref={this.cameraRef} autoPlay="true" />
            </div>
        )
    }
}

export default Camera;
