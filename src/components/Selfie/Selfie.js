import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { getApiData } from './../../api/api';
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
            pictureTakenOnce: false,
            submitting: false,
            showSnackbar: false,
            snackbarMsgType: '',
            snackbarMsg: '',
            videoInterval: undefined,
            loadingVideo: undefined
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.props.history.listen((location, action) => {
            // alert(action)
            if (action === 'POP') {
                this.props.history.push('/selfie')
            }
        });
        if (getDevice() === 'desktop') {
            // this.props.manageLoader(true)
            this.setState({ loadingVideo: true }, () => {
                this.initializeVideo();
            })
        }
    }

    initializeVideo = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        ]).then(() => {
            this.startVideo()
        })
    }

    createVideoTag = () => {
        const video = document.createElement('video');
        video.setAttribute("width", "320px");
        video.setAttribute("height", "240px");
        video.setAttribute("id", "video")
        video.setAttribute("autoplay", "");
        const booth = document.getElementById('booth');
        booth.prepend(video);
        return video;
    }

    startVideo = async () => {
        let video = document.getElementById('video');
        if (!video) {
            video = this.createVideoTag();
            let stream = null;
            const constraints = { audio: false, video: true };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            if (this.localStream) {
                this.localStream.getTracks().map(function (val) {
                    val.stop();
                    val.enabled = false;
                });
                this.localStream = null;
            }
            video.addEventListener('play', () => {
                this.localStream = video.srcObject;
                const canvas = faceapi.createCanvasFromMedia(video);
                const selfie_page = document.getElementById('selfie_page');
                selfie_page.append(canvas);
                const displaySize = { width: video.width, height: video.height };
                faceapi.matchDimensions(canvas, displaySize);
                // this.props.manageLoader(false);
                this.videoInterval = setInterval(async () => {
                    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416 }));
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    faceapi.draw.drawDetections(canvas, resizedDetections);
                    this.setState({ loadingVideo: false });
                }, 250);
            })

        }

    }

    takeSelfie = () => {
        if (this.state.pictureTaken) {
            this.setState({ pictureTaken: false });
            if (getDevice() === 'desktop') {
                this.initializeVideo();
            } else {
                this.takeSelfieFromPhone();
            }
            return;
        }
        if (getDevice() === 'mobile') {
            this.takeSelfieFromPhone();
            return;
        }

        const video = document.getElementById('video');
        let canvas = document.querySelector('canvas');
        const height = video.height;
        const width = video.width;
        canvas.parentNode.removeChild(canvas);
        const tempVideo = video;
        video.parentNode.removeChild(video);
        this.setState({ pictureTaken: true, pictureTakenOnce: true }, () => {
            clearInterval(this.videoInterval);
            canvas = document.getElementById('canvas');
            canvas.style.position = 'static';
            const context = canvas.getContext('2d');
            context.drawImage(tempVideo, 0, 0, width, height);
            const base64 = canvas.toDataURL();
            this.setState({ picture: base64 })
        })
    }

    takeSelfieFromPhone = () => {
        const cameraInput = document.querySelector("[capture='camera']");
        cameraInput.click();
        cameraInput.addEventListener('change', (event) => {
            var reader = new FileReader(event.srcElement.files[0]);
            reader.onload = readSuccess;
            const that = this;
            function readSuccess(evt) {
                that.setState({ picture: evt.target.result }, () => {
                    let img = document.getElementById('selfie');
                    if(!img){
                       img = document.createElement('img');
                    }
                    img.setAttribute('id', 'selfie');
                    img.src = that.state.picture;
                    img.alt = 'Selfie';
                    img.width = '320';
                    img.height = '240';
                    const booth = document.getElementById('booth');
                    booth.append(img);
                    that.setState({ pictureTaken: true })
                })
            }
            reader.readAsDataURL(event.srcElement.files[0]);
        });
    }
    
    submitSelfie = async () => {
        this.props.manageLoader(true)
        await this.setState({ submitting: true })
        // const canvas = document.getElementById('canvas');
        const base64 = this.state.picture
        const type = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
        const { url, body } = getApiData('verifyCustomerImage');
        // const type = this.state.type;
        const imgString = this.state.picture.split(",")[1]
        body.request.payload.imageFile = imgString;
        body.request.payload.fileExtension = type;

        
        try {
            const response = await axios.post(url, body)
            console.log('response: ', response)
            if (response.data && response.data.response && !response.data.response.payload.isImageValid) {
                this.handleSnackbar(true, 'error', response.data.response.payload.businessMsg)
                this.props.manageLoader(false)
                this.setState({ submitting: false });
                // this.initializeVideo();
                setTimeout(() => {
                    if (getDevice() === 'desktop') {
                        this.setState({ pictureTaken: false });
                        this.initializeVideo();
                    }
                }, 2500);
                return
            }
            const path = response.data.response.payload.qstCatName.toLowerCase();
            if (!path) {
                this.props.history.push('/generate_otp')
                return
            }
            this.props.history.push(`/customer_feedback/${path}`)
        } catch (err) {
            this.props.manageLoader(false)
            this.setState({ submitting: false })
        }
    }

    componentWillUnmount() {
        if(getDevice() === 'desktop'){
            this.closeWebcam();
        }
    }

    closeWebcam = () => {
        this.localStream.getTracks().map(function (val) {
            val.stop();
            val.enabled = false;
        });
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
                    {/* <video id="video" autoPlay muted {...imgStyles}></video> */}
                    <div className="canvas">
                        {this.state.pictureTaken ? <canvas id="canvas" {...imgStyles}></canvas> : null}
                    </div>
                </>
            )
        }
    }

    render() {
        const buttonText = !this.state.pictureTaken ? 'Take Selfie' : 'Retake Selfie';
        return (
            <>

                <div className="display_text" style={{ visibility: this.state.loadingVideo ? 'visible' : 'hidden' }}>
                    Please wait ...
                </div>

                {this.state.showSnackbar ? <Snackbar
                    closeSnackbar={this.closeSnackbar}
                    snackbarMsgType={this.state.snackbarMsgType}
                    snackbarMsg={this.state.snackbarMsg}
                /> : null}


                <div className="selfie_page" id="selfie_page" style={{ visibility: !this.state.loadingVideo ? 'visible' : 'hidden' }}>
                    <div className="booth" id="booth">
                        {this.getHtml()}
                    </div>
                    <div>
                        <p>Position your face inside the frame and click on Take Selfie button</p>

                        <Button disabled={this.state.submitting} onClick={(event) => this.takeSelfie(event)} variant="contained" id="selfie_button" className="default_button">
                            {buttonText}
                        </Button>


                        <Button disabled={this.state.submitting || !this.state.pictureTaken} onClick={this.submitSelfie} variant="contained" className="default_button">
                            Submit
                        </Button>
                    </div>


                </div>
            </>
        )
    }
}