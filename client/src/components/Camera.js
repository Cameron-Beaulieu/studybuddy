import React from 'react';
import UserContext from '../userContext';
import './Camera.css';

import * as processPose from '../scripts/faceDetection';

const coco = require('@tensorflow-models/coco-ssd');
const posenet = require('@tensorflow-models/posenet');
const blazeface = require('@tensorflow-models/blazeface');

class Camera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detectedObjects: [],
            calibrationBoxes: []
        }
        this.divRef = React.createRef();
        this.cameraRef = React.createRef();
        this.poseCanvasRef = React.createRef();
        this.faceCanvasRef = React.createRef();
        this.sippsed = false;
        this.drawn = false;
        this.calibrated = false;
        this.boxes = [];
        this.eyeCalibrationPadding = 30;
        this.shoulderCalibrationPadding = 10;
        this.canvasContext = undefined;
        this.faceCanvasContext = undefined;
        this.poseCanvasContext = undefined;
        this.model = undefined;
        this.net = undefined;
        this.pose = undefined;
        this.face = undefined;
        this.facedata = undefined;
    }

    static contextType = UserContext;

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

                blazeface.load()
                .then(loaded => {
                    this.face = loaded;
                    setInterval(this.detectFace.bind(this), 500);

                    posenet.load({
                        architecture: "MobileNetV1",
                        multiplier: 1.0,
                        outputStride: 16,
                        inputResolution: {width: 600, height: 600},
                        quantBytes: 2
                    })
                    .then(net => {
                        this.net = net;
                        setInterval(this.detectPose.bind(this), 500);
                        this.calibrate();
                    })
                })
            })

            this.faceCanvasContext = this.faceCanvasRef.current.getContext('2d');
            this.poseCanvasContext = this.poseCanvasRef.current.getContext('2d');
        })
        .catch(err => {
            console.log("Camera permissions denied");
        })
    }

    calibrate() {
        this.calibrated = false;
        console.log("Starting calibration")
        setTimeout(() => {
            this.calibrated = true
            let boxes = []
            boxes.push({
                left: this.xMinLeftEye - this.eyeCalibrationPadding,
                top: this.yMinLeftEye - this.eyeCalibrationPadding,
                width: this.xMaxLeftEye - this.xMinLeftEye + this.eyeCalibrationPadding * 2,
                height: this.yMaxLeftEye - this.yMinLeftEye + this.eyeCalibrationPadding * 2
            })
            boxes.push({
                left: this.xMinRightEye - this.eyeCalibrationPadding,
                top: this.yMinRightEye - this.eyeCalibrationPadding,
                width: this.xMaxRightEye - this.xMinRightEye + this.eyeCalibrationPadding * 2,
                height: this.yMaxRightEye - this.yMinRightEye + this.eyeCalibrationPadding * 2
            })
            boxes.push({
                left: this.xMinLeftShoulder - this.shoulderCalibrationPadding,
                top: this.yMinLeftShoulder - this.shoulderCalibrationPadding,
                width: this.xMaxLeftShoulder - this.xMinLeftShoulder + this.shoulderCalibrationPadding * 2,
                height: this.yMaxLeftShoulder - this.yMinLeftShoulder + this.shoulderCalibrationPadding * 2
            })
            boxes.push({
                left: this.xMinRightShoulder - this.shoulderCalibrationPadding,
                top: this.yMinRightShoulder - this.shoulderCalibrationPadding,
                width: this.xMaxRightShoulder - this.xMinRightShoulder + this.shoulderCalibrationPadding * 2,
                height: this.yMaxRightShoulder - this.yMinRightShoulder + this.shoulderCalibrationPadding * 2
            })
            console.log("Calibration complete")
            this.setState({ calibrationBoxes: boxes });
        }, 10000)
    }

    detectFace() {
        this.face.estimateFaces(this.cameraRef.current, false)
        .then(data => {
            this.facedata = data;
            this.drawFace()
            if (!this.calibrated) {
                this.findMaxFace(data)
            } else {
                if (processPose.checkFace(data, this.xMaxRightEye,this.yMaxRightEye,this.xMinRightEye,this.yMinRightEye,this.xMaxLeftEye,this.yMaxLeftEye,this.xMinLeftEye,this.yMinLeftEye)) {
                    this.context.setSlack(this.context.slack + 0.5/60);
                } else {
                    this.context.setProductive(this.context.productive + 0.5/60);
                }
            }
        })
    }

    detectPose() {
        this.net.estimateSinglePose(this.cameraRef.current)
        .then(pose => {
            this.pose = pose
            this.drawSkeleton()
            if (!this.calibrated) {
                this.findMaxPose(pose)
            } else {
                if (processPose.checkShoulders(pose, this.xMaxRightShoulder,this.yMaxRightShoulder,this.xMinRightShoulder,this.yMinRightShoulder,this.xMaxLeftShoulder,this.yMaxLeftShoulder,this.xMinLeftShoulder,this.yMinLeftShoulder)) {
                    this.context.setBadPostureTime(this.context.badPostureTime + 0.5/60);
                } else {
                    this.context.setGoodPostureTime(this.context.goodPostureTime + 0.5/60);
                }
            }
        })
    }

    findMaxFace(face) {
        var poseEye = processPose.checkEyePosition(face);
        if (poseEye[0] > this.xMaxLeftEye || !this.xMaxLeftEye)
            this.xMaxLeftEye = poseEye[0];
        else if(poseEye[0] < this.xMinLeftEye || !this.xMinLeftEye)
            this.xMinLeftEye = poseEye[0];
        if (poseEye[1] > this.yMaxLeftEye || !this.yMaxLeftEye)
            this.yMaxLeftEye = poseEye[1];
        else if(poseEye[1] < this.yMinLeftEye || !this.yMinLeftEye)
            this.yMinLeftEye = poseEye[1];
        if (poseEye[2] > this.xMaxRightEye || !this.xMaxRightEye)
            this.xMaxRightEye = poseEye[2];
        else if(poseEye[2] < this.xMinRightEye || !this.xMinRightEye)
            this.xMinRightEye = poseEye[2];
        if (poseEye[3] > this.yMaxRightEye || !this.yMaxRightEye)
            this.yMaxRightEye = poseEye[3];
        else if(poseEye[3] < this.yMinRightEye || !this.yMinRightEye)
            this.yMinRightEye = poseEye[3];
    }

    findMaxPose(pose) {
        var poseShoulders = processPose.checkShouldersPosition(pose);
        if (poseShoulders[0] > this.xMaxLeftShoulder || !this.xMaxLeftShoulder)
            this.xMaxLeftShoulder = poseShoulders[0];
        else if (poseShoulders[0] < this.xMinLeftShoulder || !this.xMinLeftShoulder)
            this.xMinLeftShoulder = poseShoulders[0];
        if (poseShoulders[1] > this.yMaxLeftShoulder || !this.yMaxLeftShoulder)
            this.yMaxLeftShoulder = poseShoulders[1];
        else if (poseShoulders[1] < this.yMinLeftShoulder || !this.yMinLeftShoulder)
            this.yMinLeftShoulder = poseShoulders[1];
        if(poseShoulders[2] > this.xMaxRightShoulder || !this.xMaxRightShoulder)
            this.xMaxRightShoulder = poseShoulders[2];
        else if(poseShoulders[2] < this.xMinRightShoulder || !this.xMinRightShoulder)
            this.xMinRightShoulder = poseShoulders[2];
        if(poseShoulders[3] > this.yMaxRightShoulder || !this.yMaxRightShoulder)
            this.yMaxRightShoulder = poseShoulders[3]
        else if(poseShoulders[3] < this.yMinRightShoulder || !this.yMinRightShoulder)
            this.yMinRightShoulder = poseShoulders[3];
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
            if (this.facedata) {
                if ((obj.class === "donut") || (obj.class === "wine glass") || (obj.class === "bottle") || (obj.class === "cup")) {
                    let y = this.facedata[0].landmarks[3][1]
                    let x = this.facedata[0].landmarks[3][0]
                    if ((obj.bbox[0] - 50 < x) && (x < obj.bbox[0] + obj.bbox[2] + 50) && (obj.bbox[1] - 50 < y) && (y < obj.bbox[1] + obj.bbox[3] + 50)) {
                        if ((!this.sipped && new Date().getTime() - this.sipCooldown > 2000) || (!this.sipCooldown)) {
                            console.log("sip");
                            this.sipped = true;
                            this.context.setSips(this.context.sips + 1);
                        }
                        this.sipCooldown = new Date().getTime()
                        return
                    } else {
                        this.sipped = false;
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
            <div ref={this.divRef} className="camView" style={{visibility: this.props.visible ? "visible" : "hidden", position: this.props.visible ? "relative" : "absolute"}}>
                {
                    this.state.detectedObjects.map((prediction, index) => (
                        <>
                            <div key={index + "obj-h"} className="highlighter" style={{left: prediction.bbox[0], top: prediction.bbox[1], width: prediction.bbox[2], height: prediction.bbox[3]}}></div>
                            <p key={index + "obj-p"} style={{marginLeft: prediction.bbox[0], marginTop: prediction.bbox[1] - 1, width: prediction.bbox[2] - 10, top: 0, left: 0}}>{prediction.class} - with {Math.round(parseFloat(prediction.score) * 100)}% confidence</p>
                        </>
                    ))
                }
                {
                    this.state.calibrationBoxes.map((box, index) => (
                        <>
                            <div className="highlighter calibration" style={{left: box.left, top: box.top, width: box.width, height: box.height}} key={index + "cal-h"}></div>
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
