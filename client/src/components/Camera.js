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
        this.poseCanvasRef = React.createRef();
        this.faceCanvasRef = React.createRef();
        this.drawn = false;
        this.canvasContext = undefined;
        this.faceCanvasContext = undefined;
        this.poseCanvasContext = undefined;
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
                setInterval(this.detectFace.bind(this), 500);
            })

            posenet.load({
                architecture: "MobileNetV1",
                multiplier: 1.0,
                outputStride: 16,
                inputResolution: {width: 600, height: 600},
                quantBytes: 2
            })
            .then(net => {
                this.net = net;
                setInterval(this.detectPose.bind(this), 500)
            })

            this.faceCanvasContext = this.faceCanvasRef.current.getContext('2d');
            this.poseCanvasContext = this.poseCanvasRef.current.getContext('2d');
        })
        .catch(err => {
            console.log("Camera permissions denied");
        })
    }

    detectFace() {
        this.face.estimateFaces(this.cameraRef.current, false)
        .then(data => {
            this.facedata = data;
            this.drawFace()
        })
    }

    detectPose() {
        this.net.estimateSinglePose(this.cameraRef.current)
        .then(pose => {
            this.pose = pose
            this.drawSkeleton()
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
            if (this.facedata !== undefined) {
                if ((obj.class === "donut") || (obj.class === "wine glass") || (obj.class === "bottle") || (obj.class === "cup")) {
                    let y = this.facedata[0].landmarks[3][1]
                    let x = this.facedata[0].landmarks[3][0]
                    if ((obj.bbox[0] - 50 < x) && (x < obj.bbox[0] + obj.bbox[2] + 50) && (obj.bbox[1] - 50 < y) && (y < obj.bbox[1] + obj.bbox[3] + 50)) {
                        console.log("sip");
                        return
                    }
                }
            }
        });
    }

    drawSkeleton() {
        if (this.pose) {
            this.poseCanvasContext.clearRect(0, 0, 600, 600);
            this.pose.keypoints.forEach((part, index) => {
                if (part.score >= 0.2) {
                    if ((part.part === "rightShoulder") || (part.part === "leftShoulder")) {
                        this.poseCanvasContext.beginPath()
                        this.poseCanvasContext.arc(part.position.x, part.position.y, 5, 0, 2*Math.PI)
                        this.poseCanvasContext.fillStyle = '#F218D9'
                        this.poseCanvasContext.fill()
                    }
                }
            })

            const adjacent = posenet.getAdjacentKeyPoints(this.pose.keypoints, 0.2)

            adjacent.forEach(points => {
                this.poseCanvasContext.beginPath();
                this.poseCanvasContext.moveTo(points[0].position.x, points[0].position.y);
                this.poseCanvasContext.lineTo(points[1].position.x, points[1].position.y);
                this.poseCanvasContext.lineWidth = 3;
                this.poseCanvasContext.strokeStyle = '#F218D9'
                this.poseCanvasContext.stroke();
            })
        }
    }

    drawFace() {
        if (this.facedata[0]) {
            this.faceCanvasContext.clearRect(0, 0, 600, 600);
            this.facedata[0].landmarks.forEach(part => {
                this.faceCanvasContext.beginPath()
                this.faceCanvasContext.arc(part[0], part[1], 5, 0, 2*Math.PI)
                this.faceCanvasContext.fillStyle = '#33FFE4'
                this.faceCanvasContext.fill()
            })
        }
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
                <canvas className="face" style={{width: 600, height: 600}} width={600} height={600} ref={this.faceCanvasRef}></canvas>
                <canvas className="pose" style={{width: 600, height: 600}} width={600} height={600} ref={this.poseCanvasRef}></canvas>
            </div>
        )
    }
}

export default Camera;
