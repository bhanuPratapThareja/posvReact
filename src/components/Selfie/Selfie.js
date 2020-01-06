import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Snackbar from './../Snackbar/Snackbar';
import { getDevice } from './../../utils/getDevice';

export default class Selfie extends Component {
    localStream;
    videoInterval;
    trackerTask;
    context;
    Webcam;

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
            loadingVideo: undefined,
            trackingColor: '#ffffff'
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
        this.startVideo()
    }


    startVideo = () => {
        if (getDevice() === 'desktop') {
            this.Webcam = window.Webcam;
            let img = document.getElementById('img');
            if (img) {
                img.parentNode.removeChild(img);
            }
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            video.style.display = 'block';
            canvas.style.visibility = 'visible';
            this.Webcam.attach(document.getElementById('canvas'));
            this.setState({ loadingVideo: false }, async () => {
                var context = canvas.getContext('2d');
                var tracking = window.tracking;
                var tracker = new tracking.ObjectTracker('face');
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                this.trackerTask = tracking.track('#video', tracker, { camera: true });
                const that = this;
                tracker.on('track', function (event) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function (rect) {
                        context.strokeStyle = '#fff';
                        context.strokeRect(rect.x + 20, rect.y + 20, rect.width - 30, rect.height - 30);
                        context.font = '11px Helvetica';
                        context.fillStyle = "#fff";
                    });
                });
            })
        }
    }

    takeSelfie = async () => {
        if (this.state.pictureTaken) {
            this.setState({ pictureTaken: false });
            if (getDevice() === 'desktop') {
                const img = document.getElementById('img');
                img.parentNode.removeChild(img);
                this.startVideo();
            } else {
                this.takeSelfieFromPhone();
            }
            return;
        }

        if (getDevice() === 'mobile') {
            this.takeSelfieFromPhone();
            return;
        }

        const that = this;
        this.Webcam.snap(function (imgData, event) {
            that.trackerTask.stop();
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
            // that.context.clearRect(0, 0, canvas.width, canvas.height);
            // that.context.strokeStyle = 'transparent';
            // that.context.fillStyle = "transparent";
            canvas.style.visibility = 'hidden';
            video.style.display = 'none';
            const img = document.createElement('img');
            img.setAttribute('id', 'img');
            img.src = imgData;
            const booth = document.getElementById('booth');
            booth.append(img);
            that.setState({ pictureTaken: true, picture: imgData })
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
        const base64 = this.state.picture
        const type = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
        const { url, body } = getApiData('verifyCustomerImage');
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
                setTimeout(() => {
                    if (getDevice() === 'desktop') {
                        const img = document.getElementById('img');
                        img.parentNode.removeChild(img);
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
        this.Webcam.reset()
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
                    <video id="video" width="320" height="240" style={imgStyles} preload={'auto'} autoPlay loop muted></video>
                    <canvas id="canvas" {...imgStyles}></canvas>
                    <div id="my_cam"></div>
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