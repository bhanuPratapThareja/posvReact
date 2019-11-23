import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Video from './Video/Video';
import * as faceapi from 'face-api.js';

export default class Selfie extends Component {

    constructor() {
        super();
        this.state = {
            video: undefined,
            pictureTaken: false
        }
    }

    componentDidMount() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]).then(this.startVideo)
    }

    startVideo = () => {

        const video = document.getElementById('video');

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
            const canvas = faceapi.createCanvasFromMedia(video);
            document.body.append(canvas);
            const displaySize = { width: video.width, height: video.height };
            console.log(displaySize)
            faceapi.matchDimensions(canvas, displaySize)
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resizedDetections)
            }, 100);
        })
    }

    takeSelfie = () => {
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, video.width, video.height);
    }


    render() {
        // const boothStyles = { width: '320px' }
        const imgStyles = { width: '720', height: '560' };

        return (
           <div className="booth">
                        {!this.state.pictureTaken ? <video id="video" autoPlay muted {...imgStyles}></video> : null}
                        <canvas id="canvas" {...imgStyles}></canvas>
                        {/* <Button onClick={this.takeSelfie} variant="contained" className="default_button" style={{ width: '100%' }}>
                            Take Selfie
                        </Button>
                    
                    <br />
                    <Paper>
                        <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
                            Position your face inside the frame and click on Take Selfie button
                        </Typography>
                    </Paper> */}
                    <Button onClick={this.takeSelfie} variant="contained" className="default_button" style={{ width: '100%' }}>
                            Take Selfie
                        </Button>
               </div> 
        )
    }
}