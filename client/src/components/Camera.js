import React from 'react';
import './Camera.css';

const coco = require('@tensorflow-models/coco-ssd');
const posenet = require('@tensorflow-models/posenet');

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detectedObjects : []
        }
        this.divRef = React.createRef();
        this.cameraRef = React.createRef();
        this.model = undefined;
        this.net = undefined;
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: { width: 600, height: 600 }})
        .then(stream => {
            this.cameraRef.current.srcObject = stream;
            this.cameraRef.current.onloadedmetadata = () => { this.cameraRef.current.play() };

            /*
            coco.load()
            .then((loaded) => {
                this.model = loaded;
                setInterval(this.detectObjects.bind(this), 500)
            })
            */

            posenet.load({
                architecture: "MobileNetV1",
                multiplier: 1.0,
                outputStride: 16,
                quantBytes: 1
            })
            .then(net => {
                this.net = net;
                setInterval(this.detectPose.bind(this), 500)
            })
        })
        .catch(err => {
            console.log("Camera permissions denied");
        })
    }

    detectPose() {
        this.net.estimateSinglePose(this.cameraRef.current)
        .then(pose => {
            console.log(pose);
        })
    }

    detectObjects() {
        this.model.detect(this.cameraRef.current, 20, 0.1)
        .then((predictions) => {
            let children = []

            for (let n = 0; n < predictions.length; n++) {
                /*
                if (predictions[n].score > 0.66) {
                    children.push(predictions[n])
                }
                */
               children.push(predictions[n])
            }

            console.log(predictions)

            this.setState({ detectedObjects: children })
        })
    }

    videoError() {
        console.log("Camera permissions are needed for this app to work");
    }

    render() {
        return (
            <div ref={this.divRef} className="camView">
                {
                    /*
                    this.state.detectedObjects.map((prediction) => (
                        <>
                            <div className="highlighter" style={{left: prediction.bbox[0], top: prediction.bbox[1], width: prediction.bbox[2], height: prediction.bbox[3]}}></div>
                            <p style={{marginLeft: prediction.bbox[0], marginTop: prediction.bbox[1] - 1, width: prediction.bbox[2] - 10, top: 0, left: 0}}>{prediction.class} - with {Math.round(parseFloat(prediction.score) * 100)}% confidence</p>
                        </>
                    ))
                    */
                }
                <video ref={this.cameraRef} style={{width: 600, height: 600}} width={600} height={600} autoPlay={true} />
            </div>
        )
    }
}

export default Camera;
