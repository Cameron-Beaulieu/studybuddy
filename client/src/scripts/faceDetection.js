export async function checkEyePosition(videoElement){
    const posenet = require('@tensorflow-models/posenet');
    const net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      quantBytes: 1,
      multiplier: 0.75
    });
    const pose = await net.estimateSinglePose(videoElement,{
      flipHorizontal: true
    })
    return [pose.keypoints[1].position.x,pose.keypoints[1].position.y,pose.keypoints[2].position.x,pose.keypoints[2].position.y];
}

export async function checkShouldersPosition(videoElement){
    const posenet = require('@tensorflow-models/posenet');
    const net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      quantBytes: 1,
      multiplier: 0.75
    });
    const pose = await net.estimateSinglePose(videoElement,{
      flipHorizontal: true
    })
    return [pose.keypoints[5].position.x,pose.keypoints[5].position.y,pose.keypoints[6].position.x,pose.keypoints[6].position.y];
}

export function findMax(){
    var xMaxRightEye,yMaxRightEye,xMinRightEye,yMinRightEye,xMaxLeftEye,yMaxLeftEye,xMinLeftEye,yMinLeftEye;
    var xMaxRightShoulder,yMaxRightShoulder,xMinRightShoulder,yMinRightShoulder,xMaxLeftShoulder,yMaxLeftShoulder,xMinLeftShoulder,yMinLeftShoulder;
    var poseEye = checkEyePosition(document.getElementById('video'));
    var poseShoulders = checkShouldersPosition(document.getElementById('video'));
    var i = 0;
    while(i < 100){
        poseEye = checkEyePosition(document.getElementById('video'));
        poseShoulders = checkShouldersPosition(document.getElementById('video'));
        if (poseEye[0] > xMaxLeftEye)
            xMaxLeftEye = poseEye[0];
        else if(poseEye[0] < xMinLeftEye)
            xMinLeftEye = poseEye[0];
        if (poseEye[1] > yMaxLeftEye)
            yMaxLeftEye = poseEye[1];
        else if(poseEye[1] < yMinLeftEye)
            yMinLeftEye = poseEye[1];
        if (poseEye[2] > xMaxRightEye)
            xMaxRightEye = poseEye[2];
        else if(poseEye[2] < xMinRightEye)
            xMinRightEye = poseEye[2];
        if (poseEye[3] > yMaxRightEye)
            yMaxRightEye = poseEye[3];
        else if(poseEye[3] < yMinRightEye)
            yMinRightEye = poseEye[3];
        if (poseShoulders[0] > xMaxLeftShoulder)
            xMaxLeftShoulder = poseShoulders[0];
        else if (poseShoulders[0] < xMinLeftShoulder)
            xMinLeftShoulder = poseShoulders[0];
        if (poseShoulders[1] > yMaxLeftShoulder)
            yMaxLeftShoulder = poseShoulders[1];
        else if (poseShoulders[1] < yMinLeftShoulder)
            yMinLeftShoulder = poseShoulders[1];
        if(poseShoulders[2] > xMaxRightShoulder)
            xMaxRightShoulder = poseShoulders[2];
        else if(poseShoulders[2] < xMinRightShoulder)
            xMinRightShoulder = poseShoulders[2];
        if(poseShoulders[3] > yMaxRightShoulder)
            yMaxRightShoulder = poseShoulders[3]
        else if(poseShoulders[3] < yMinRightShoulder)
            yMinRightShoulder = poseShoulders[3];
        i++;
    }
    return [xMaxRightEye,yMaxRightEye,xMinRightEye,yMinRightEye,xMaxLeftEye,yMaxLeftEye,xMinLeftEye,yMinLeftEye,xMaxRightShoulder,yMaxRightShoulder,xMinRightShoulder,yMinRightShoulder,xMaxLeftShoulder,yMaxLeftShoulder,xMinLeftShoulder,yMinLeftShoulder];
}

export function checkFace(xMaxRightEye,yMaxRightEye,xMinRightEye,yMinRightEye,xMaxLeftEye,yMaxLeftEye,xMinLeftEye,yMinLeftEye){
    const poseEye = checkEyePosition(document.getElementById('video'));
    if (poseEye[0] > xMaxLeftEye || poseEye[0] < xMinLeftEye || poseEye[1] > yMaxLeftEye || poseEye[1] < yMinLeftEye || poseEye[2] > xMaxRightEye || poseEye[2] < xMinRightEye || poseEye[3] > yMaxRightEye || poseEye[3] < yMinRightEye){
        return true;
    }
    return false;
}

export function checkShoulders(xMaxRightShoulder,yMaxRightShoulder,xMinRightShoulder,yMinRightShoulder,xMaxLeftShoulder,yMaxLeftShoulder,xMinLeftShoulder,yMinLeftShoulder){
    const poseShoulders = checkShouldersPosition(document.getElementById('video'));
    if (poseShoulders[0] > xMaxLeftShoulder || poseShoulders[0] < xMinLeftShoulder || poseShoulders[1] > yMaxLeftShoulder || poseShoulders[1] < yMinLeftShoulder || poseShoulders[2] > xMaxRightShoulder || poseShoulders[2] < xMinRightShoulder || poseShoulders[3] > yMaxRightShoulder || poseShoulders[3] < yMinRightShoulder){
        return true;
    }
    return false;
}