import React, { Component } from 'react';
import * as faceapi from 'face-api.js';

class Video extends Component {

    componentDidMount() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]).then(this.startVideo)
    }

    startVideo = () => {

        const video = document.getElementById('inputVideo');

        navigator.getMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        navigator.getMedia(
            { video: {} },
            stream => video.srcObject = stream,
            err => console.log(err)
        )

        video.addEventListener('play', () => {
            // setInterval(async () => {
            //     const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
            //     console.log(detections)
            // }, 100);
        })
    }

    

    render() {
        const imgStyles = { width: '320', height: '240' };
        return (
            <div>
                <video id="inputVideo" autoPlay muted {...imgStyles}></video>
                <canvas id="overlay" />
            </div>
        )
    }
}

export default Video;