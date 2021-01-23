import React from 'react';
import './Camera.css';

const coco = require('@tensorflow-models/coco-ssd');
const posenet = require('@tensorflow-models/posenet');
const blazeface = require('@tensorflow-models/blazeface');

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
        this.pose = undefined;
        this.face = undefined;
        this.facedata = undefined;
    }

    componentDidMount() {
        navigator.mediaDevices.getUserMedia({ video: { width: 600, height: 600 }})
        .then(stream => {
            this.cameraRef.current.srcObject = stream;
            this.cameraRef.current.onloadedmetadata = () => { this.cameraRef.current.play() };

            coco.load({
                base: "mobilenet_v2"
            })
            .then((loaded) => {
                this.model = loaded;
                setInterval(this.detectObjects.bind(this), 500)
                setInterval(this.detectSip.bind(this), 500)
            })

            blazeface.load()
            .then(loaded => {
                this.face = loaded;
                setInterval(this.detectFace.bind(this), 100);
            })

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

    detectFace() {
        this.face.estimateFaces(this.cameraRef.current, false)
        .then(data => {
            this.facedata = data;
        })
    }

    detectPose() {
        this.net.estimateSinglePose(this.cameraRef.current)
        .then(pose => {
            this.pose = pose
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

    detectSip() {
        this.state.detectedObjects.forEach(obj => {
            if ((obj.class === "donut") || (obj.class === "wine glass") || (obj.class === "bottle") || (obj.class === "cup")) {
                console.log("cup detected");
                let y = this.facedata[0].landmarks[3][1]
                let x = this.facedata[0].landmarks[3][0]
                if ((obj.bbox[0] - 50 < x) && (x < obj.bbox[0] + obj.bbox[2] + 50) && (obj.bbox[1] - 50 < y) && (y < obj.bbox[1] + obj.bbox[3] + 50)) {
                    console.log("sip");
                    return
                }
            }
        });
    }

    videoError() {
        console.log("Camera permissions are needed for this app to work");
    }

    render() {
        return (
            <div ref={this.divRef} className="camView">
                {
                    this.state.detectedObjects.map((prediction) => (
                        <>
                            <div className="highlighter" style={{left: prediction.bbox[0], top: prediction.bbox[1], width: prediction.bbox[2], height: prediction.bbox[3]}}></div>
                            <p style={{marginLeft: prediction.bbox[0], marginTop: prediction.bbox[1] - 1, width: prediction.bbox[2] - 10, top: 0, left: 0}}>{prediction.class} - with {Math.round(parseFloat(prediction.score) * 100)}% confidence</p>
                        </>
                    ))
                }
                <video ref={this.cameraRef} style={{width: 600, height: 600}} width={600} height={600} autoPlay={true} />
            </div>
        )
    }
}

export default Camera;
