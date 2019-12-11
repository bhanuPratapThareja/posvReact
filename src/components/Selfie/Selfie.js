import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { getApiData } from './../../api/api';
import { headers } from './../../api/headers';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class Selfie extends Component {
    localStream;

    constructor() {
        super();
        this.state = {
            video: undefined,
            pictureTaken: false,
            submitting: false
        }
    }

    componentDidMount() {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        ]).then(() => {
            this.startVideo()
        })
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
            this.localStream = video.srcObject;
            const canvas = faceapi.createCanvasFromMedia(video);
            const selfie_page = document.getElementById('selfie_page');
            selfie_page.append(canvas)
            const displaySize = { width: video.width, height: video.height };
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
        let canvas = document.querySelector('canvas');
        const height = video.height;
        const width = video.width;
        canvas.parentNode.removeChild(canvas);
        const tempVideo = video;
        video.parentNode.removeChild(video);
        this.setState({ pictureTaken: true }, () => {
            canvas = document.getElementById('canvas');
            canvas.style.position = 'static';
            const context = canvas.getContext('2d');
            context.drawImage(tempVideo, 0, 0, width, height);
        })
    }

    submitSelfie = async () => {
        await this.setState({ submitting: true })
        const canvas = document.getElementById('canvas');
        const base64 = canvas.toDataURL();
        const { url, body } = getApiData('verifyCustomerImage');
        const type = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
        const imgString = base64.split(",")[1]

        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber')
        body.request.payload.authToken = localStorage.getItem('authToken')
        body.request.payload.imageFile = imgString;
        body.request.payload.fileExtension = type;

        try {
            const response = await axios.post(url, body, { headers })
            this.setState({ submitting: false })
            if (this.localStream != null) {
                this.localStream.getTracks().map(function (val) {
                    val.stop();
                });
            }
            const path = response.data.response.payload.qstCatName.toLowerCase();
            this.props.history.push(`/customer_feedback/${path}`)
        } catch (err) {
            this.setState({ submitting: false })
        }
    }


    render() {
        const imgStyles = { width: '320', height: '240' };
        const buttonText = !this.state.pictureTaken ? 'Take Selfie' : 'Submit';

        return (
            <>
                <LinearProgress style={{ visibility: this.state.submitting ? 'visible' : 'hidden' }} />
                <div className="selfie_page" id="selfie_page">
                    <div className="booth" id="booth">
                        <video id="video" autoPlay muted {...imgStyles}></video>
                        <div className="canvas">
                            {this.state.pictureTaken ? <canvas id="canvas" {...imgStyles}></canvas> : null}
                        </div>

                    </div>
                    <div>
                        {!this.state.pictureTaken ? <Button onClick={(event) => this.takeSelfie(event)} variant="contained" id="selfie_button" className="default_button" style={{ width: '320px' }}>
                            {buttonText}
                        </Button> : null}
                        {this.state.pictureTaken ? <Button disabled={this.state.submitting} onClick={this.submitSelfie} variant="contained" className="default_button" style={{ width: '320px' }}>
                            Submit
                </Button> : null}
                    </div>

                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
            </>
        )
    }
}