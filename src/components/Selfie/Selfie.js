import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import * as faceapi from 'face-api.js';
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
            retakeMode: false,
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
        window.Webcam.attach('#canvas');
        this.startVideo()
    }

    createVideoTag = () => {
        const video = document.createElement('video');
        video.setAttribute("width", "320px");
        video.setAttribute("height", "240px");
        video.setAttribute("id", "video")
        video.setAttribute("preload", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("loop", "");
        video.setAttribute("muted", "");
        const booth = document.getElementById('booth');
        booth.prepend(video);
        return video;
    }

    startVideo = () => {
        this.setState({ loadingVideo: false }, async () => {
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');

            const tracking = window.tracking;
            var tracker = new tracking.ObjectTracker('face');
            tracker.setInitialScale(4);
            tracker.setStepSize(2);
            tracker.setEdgesDensity(0.1);

            tracking.track('#video', tracker, { camera: true });

            tracker.on('track', function (event) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                let xAxis = false;
                event.data.forEach(function (rect) {
                    context.strokeStyle = '#FFFFFF';
                    context.strokeRect(rect.x + 20, rect.y + 20, rect.width - 30, rect.height - 30);
                    context.font = '11px Helvetica';
                    context.fillStyle = "#fff";
                    xAxis = (rect.x != null) ? true : false;
                });
            });
        })
    }

    takeSelfie = async () => {
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

        window.Webcam.snap(function (imgData, event) {
            console.log('event: ', event)
            console.log(imgData)
            const video = document.getElementById('video');
            const canvas = event;
            const height = video.height;
            const width = video.width;
            canvas.style.position = 'static';
            var ctx = canvas.getContext('2d');
            // ctx.drawImage(imgData, 0, 0, width, height);

            var image = new Image();
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
            };
            image.src = `${imgData}`;

            const img = document.createElement('img');
            video.append(image)
            
            // document.body.append(canvas);

            // img.src = imgData;
            // img.height = '320';
            // img.width = '240';
            // // const video = document.getElementById('video');
            video.parentNode.removeChild(video);
            // const booth = document.getElementById('booth');
            // booth.append(img)

        })

        // const video = document.getElementById('video');
        // const canvas = document.getElementById('canvas');
        // const context = canvas.getContext("2d");
        // canvas.style.position = 'static';
        // context.drawImage(video, 0, 0, video.width, video.height);
        // let img = document.createElement('img');
        // img.src = `${this.state.picture}.png`;
        // img.height = '320';
        // img.width = '240';
        // console.log(img)
        // const booth = document.getElementById('booth');
        // booth.append(img);
        // this.setState({ picture: base64 })

        // if (this.state.pictureTaken) {
        //     this.setState({ pictureTaken: false });
        //     if (getDevice() === 'desktop') {
        //         this.initializeVideo();
        //     } else {
        //         this.takeSelfieFromPhone();
        //     }
        //     return;
        // }
        // if (getDevice() === 'mobile') {
        //     this.takeSelfieFromPhone();
        //     return;
        // }

        // const video = document.getElementById('video');
        // let canvas = document.querySelector('canvas');
        // console.log('canvas: ', canvas)
        // const height = video.height;
        // const width = video.width;

        // const tempVideo = video;
        // video.parentNode.removeChild(video);
        // this.setState({ pictureTaken: true, pictureTakenOnce: true }, () => {

        //     canvas = document.getElementById('canvas');
        //     canvas.style.position = 'static';
        //     const context = canvas.getContext('2d');
        //     context.drawImage(video, 0, 0, width, height);
        //     const base64 = canvas.toDataURL();
        //     this.setState({ picture: base64 })
        // })
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
                    if (!img) {
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
        if (getDevice() === 'desktop') {
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
                    <video id="video" width="320" height="240" style={imgStyles} autoPlay loop
                        muted></video>
                    <canvas id="canvas" width="320" height="240" style={imgStyles}></canvas>
                    <div className="my_camera" id="my_camera"
                        style={{ width: '240px', height: '240px' }}></div>

                    <input type="hidden" id="selfiImage" name="selfiImage" value="" />
                </>
            )
        }
    }

    render() {
        const imgStyles = { width: '320', height: '240' };
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


                <div className="selfie_page" id="selfie_page" >
                    <div className="booth" id="booth">
                        <video id="video" width="320" height="240" style={imgStyles} preload={'auto'} autoPlay loop muted></video>
                        <canvas id="canvas" {...imgStyles}></canvas>
                    </div>
                    <div>
                        <p>Position your face inside the frame and click on Take Selfie button</p>

                        <Button disabled={this.state.submitting} onClick={(event) => this.takeSelfie(event)} variant="contained" id="selfie_button" className="default_button" style={{ width: '320px' }}>
                            {buttonText}
                        </Button>


                        <Button disabled={this.state.submitting || !this.state.pictureTaken} onClick={this.submitSelfie} variant="contained" className="default_button" style={{ width: '320px' }}>
                            Submit
                        </Button>

                    </div>


                </div>
            </>
        )
    }
}