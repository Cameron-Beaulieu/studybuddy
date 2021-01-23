export function checkEyePosition(pose){
    return [pose[0].landmarks[1][0],pose[0].landmarks[1][1],pose[0].landmarks[0][0],pose[0].landmarks[0][1]];
}

export function checkShouldersPosition(pose){
    return [pose.keypoints[5].position.x,pose.keypoints[5].position.y,pose.keypoints[6].position.x,pose.keypoints[6].position.y];
}

export function checkFace(face, xMaxRightEye,yMaxRightEye,xMinRightEye,yMinRightEye,xMaxLeftEye,yMaxLeftEye,xMinLeftEye,yMinLeftEye){
    const poseEye = checkEyePosition(face);
    if (poseEye[0] > xMaxLeftEye || poseEye[0] < xMinLeftEye || poseEye[1] > yMaxLeftEye || poseEye[1] < yMinLeftEye || poseEye[2] > xMaxRightEye || poseEye[2] < xMinRightEye || poseEye[3] > yMaxRightEye || poseEye[3] < yMinRightEye){
        return true;
    }
    return false;
}

export function checkShoulders(pose, xMaxRightShoulder,yMaxRightShoulder,xMinRightShoulder,yMinRightShoulder,xMaxLeftShoulder,yMaxLeftShoulder,xMinLeftShoulder,yMinLeftShoulder){
    const poseShoulders = checkShouldersPosition(pose);
    if (poseShoulders[0] > xMaxLeftShoulder || poseShoulders[0] < xMinLeftShoulder || poseShoulders[1] > yMaxLeftShoulder || poseShoulders[1] < yMinLeftShoulder || poseShoulders[2] > xMaxRightShoulder || poseShoulders[2] < xMinRightShoulder || poseShoulders[3] > yMaxRightShoulder || poseShoulders[3] < yMinRightShoulder){
        return true;
    }
    return false;
}
