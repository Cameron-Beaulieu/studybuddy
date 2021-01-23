import React from 'react';
import './Camera.css';

const coco = require('@tensorflow-models/coco-ssd');

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detectedObjects : []
        }
        this.divRef = React.createRef();
        this.cameraRef = React.createRef();
        this.model = undefined;
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }})
        .then(stream => {
            this.cameraRef.current.srcObject = stream;
            this.cameraRef.current.onloadedmetadata = () => { this.cameraRef.current.play() };

            coco.load()
            .then((loaded) => {
                this.model = loaded;
                setInterval(this.detectObjects.bind(this), 500)
            })
        })
        .catch(err => {
            console.log("Camera permissions denied");
        })
    }

    detectObjects() {
        this.model.detect(this.cameraRef.current, 20, 0.1)
        .then((predictions) => {
            let children = []

            for (let n = 0; n < predictions.length; n++) {
               children.push(predictions[n])
            }

            this.setState({ detectedObjects: children })
        })
    }

    videoError() {
        console.log("Camera permissions are needed for this app to work");
    }

    render() {
        return (
            <div ref={this.divRef} className="camView">
                <video ref={this.cameraRef} autoPlay="true" />
            </div>
        )
    }
}

export default Camera;
