import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { getApiData } from './../../api/api';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from './../Snackbar/Snackbar';
import { getDevice } from './../../utils/getDevice';

export default class Selfie extends Component {
    localStream;
    videoInterval;

    constructor() {
        super();
        this.state = {
            video: undefined,
            pictureTaken: false,
            submitting: false,
            showSnackbar: false,
            snackbarMsgType: '',
            snackbarMsg: '',
            videoInterval: undefined,
            noOfFacesDetected: undefined,
            detectionScore: undefined
        }
    }

    componentDidMount() {
        this.initializeVideo();
    }

    initializeVideo = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        ]).then(() => {
            if (getDevice() === 'desktop') {
                this.startVideo()
            }
        })
    }

    startVideo = async () => {
        const video = document.getElementById('video');
        let stream = null;
        const constraints = { audio: false, video: true };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream

        video.addEventListener('play', () => {
            this.localStream = video.srcObject;
            const canvas = faceapi.createCanvasFromMedia(video);
            const selfie_page = document.getElementById('selfie_page');
            selfie_page.append(canvas)
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize)
            this.videoInterval = setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                // console.log(detections)
                let detectionScore;
                if (detections.length) {
                    detectionScore = detections[0].score;
                }
                this.setState({ noOfFacesDetected: detections.length, detectionScore }, () => {
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    faceapi.draw.drawDetections(canvas, resizedDetections)
                })
            }, 100);
        })

    }

    takeSelfie = () => {
        if (getDevice() === 'mobile') {
            const cameraInput = document.querySelector("[capture='camera']");
            cameraInput.click();
            cameraInput.addEventListener('change', (event) => {
                // var myImage = new Image(100, 200);
                console.log(event)
                // myImage.src = event.target.files[0];
                // console.log(myImage)
                // document.body.appendChild(myImage);
                // let canvas = document.createElement('canvas');
                // canvas.style.position = 'static';
                // const context = canvas.getContext('2d');
                // context.drawImage(myImage, 0, 0, 320, 240);
                // document.body.appendChild(canvas);
                var reader = new FileReader(event.srcElement.files[0]);
                console.log(reader)
                reader.onload = readSuccess;
                function readSuccess(evt){
                    console.log(evt)
                    console.log(evt.target)
                    console.log(evt.target.result)
                }
                reader.readAsDataURL(event.srcElement.files[0]);
                // let imgTag = document.createElement('img');
                // console.log(event)
                // imgTag.src = event.target.value.replace("C:\\fakepath\\", "");
                // console.log(imgTag)
                // imgTag.width = '340';
                // imgTag.height = '240';
                // console.log(imgTag)
                // document.body.appendChild(imgTag);
                // let canvas = document.getElementById('canvas');
                // canvas.style.position = 'static';
                // const context = canvas.getContext('2d');
                // context.drawImage(tempVideo, 0, 0, width, height);
            });
            return;
        }


        if (this.state.noOfFacesDetected !== 1) {
            const error = this.state.noOfFacesDetected === 0 ? 'No face detected' : `${this.state.noOfFacesDetected} faces detected`;
            this.handleSnackbar(true, 'error', error)
            return
        }
        if (this.state.detectionScore < 0.65) {
            const error = 'Picture not clear or face is sideways. Please retake selfie.';
            this.handleSnackbar(true, 'error', error)
            return
        }
        const video = document.getElementById('video');
        let canvas = document.querySelector('canvas');
        const height = video.height;
        const width = video.width;
        canvas.parentNode.removeChild(canvas);
        const tempVideo = video;
        video.parentNode.removeChild(video);
        this.setState({ pictureTaken: true }, () => {
            clearInterval(this.videoInterval);
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

        body.request.payload.imageFile = imgString;
        body.request.payload.fileExtension = type;

        try {
            const response = await axios.post(url, body)
            this.setState({ submitting: true })
            if (response.data && response.data.response && !response.data.response.payload.isImageValid) {
                this.handleSnackbar(true, 'error', response.data.response.payload.businessMsg)
                this.setState({ submitting: false });
                // this.initializeVideo();
                setTimeout(() => {
                    this.props.history.push('/')
                    this.props.history.push('/selfie')
                }, 2500);
                return
            }
            if (this.localStream != null) {
                this.localStream.getTracks().forEach(function (val) {
                    val.stop();
                });
            }
            const path = response.data.response.payload.qstCatName.toLowerCase();
            this.props.history.push(`/customer_feedback/${path}`)
        } catch (err) {
            this.setState({ submitting: false })
        }
    }


    handleSnackbar = (showSnackbar, snackbarMsgType, snackbarMsg) => {
        this.setState({ showSnackbar, snackbarMsgType, snackbarMsg })
        setTimeout(() => {
            this.closeSnackbar()
        }, 3000);
    }

    closeSnackbar = () => {
        this.setState({
            showSnackbar: false,
            snackbarMsgType: '',
            snackbarMsg: ''
        })
    }


    render() {
        const imgStyles = { width: '320', height: '240' };
        const buttonText = !this.state.pictureTaken ? 'Take Selfie' : 'Submit';

        return (
            <>
                <LinearProgress style={{ visibility: this.state.submitting ? 'visible' : 'hidden' }} />
                <input type="file" accept="image/*" capture="camera" style={{ visibility: 'hidden' }} />
                {this.state.showSnackbar ? <Snackbar
                    closeSnackbar={this.closeSnackbar}
                    snackbarMsgType={this.state.snackbarMsgType}
                    snackbarMsg={this.state.snackbarMsg}
                /> : null}
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