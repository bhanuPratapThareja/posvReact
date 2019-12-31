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
            videoInterval: undefined
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if(getDevice() === 'desktop'){
            this.initializeVideo();
        }
    }

    initializeVideo = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        ]).then(() => {
            this.startVideo()
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
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resizedDetections)

            }, 100);
        })

    }

    takeSelfie = () => {
        if (getDevice() === 'mobile') {
            const cameraInput = document.querySelector("[capture='camera']");
            cameraInput.click();
            cameraInput.addEventListener('change', (event) => {
                var reader = new FileReader(event.srcElement.files[0]);
                reader.onload = readSuccess;
                const that = this;
                function readSuccess(evt) {
                    that.setState({ picture: evt.target.result }, () => {
                        const img = document.createElement('img');
                        img.src = that.state.picture;
                        img.alt = 'Selfie';
                        img.width = '320';
                        img.height = '240';
                        const booth = document.getElementById('booth');
                        booth.append(img);
                        that.setState({ pictureTaken: true }, () => {
                            booth.style.transform = 'rotate(-90deg)'
                        })
                    })
                }
                reader.readAsDataURL(event.srcElement.files[0]);
            });
            return;
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
            const base64 = canvas.toDataURL();
            this.setState({ picture: base64 })
        })
    }

    submitSelfie = async () => {
        await this.setState({ submitting: true })
        // const canvas = document.getElementById('canvas');
        const base64 = this.state.picture
        const type = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
        const { url, body } = getApiData('verifyCustomerImage');
        // const type = this.state.type;
        // const imgString = base64.split(",")[1]
        body.request.payload.imageFile = this.state.picture;
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
            if (!path) {
                this.props.history.push('/generate_otp')
                return
            }
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

    getHtml = () => {
        if (getDevice() === 'mobile') {
            return (
                <>
                    <input type="file" accept="image/*" capture="camera" style={{ visibility: 'hidden', position: 'fixed', top: '0', left: '0' }} />
                </>
            )
        } else {
            const imgStyles = { width: '320', height: '240' };
            return (
                <>
                    <video id="video" autoPlay muted {...imgStyles}></video>
                    <div className="canvas">
                        {this.state.pictureTaken ? <canvas id="canvas" {...imgStyles}></canvas> : null}
                    </div>
                </>
            )
        }
    }

    render() {
        const buttonText = !this.state.pictureTaken ? 'Take Selfie' : 'Submit';

        return (
            <>
                <LinearProgress style={{ visibility: this.state.submitting ? 'visible' : 'hidden' }} />

                {this.state.showSnackbar ? <Snackbar
                    closeSnackbar={this.closeSnackbar}
                    snackbarMsgType={this.state.snackbarMsgType}
                    snackbarMsg={this.state.snackbarMsg}
                /> : null}
                <div className="selfie_page" id="selfie_page">
                    <div className="booth" id="booth">
                        {this.getHtml()}
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