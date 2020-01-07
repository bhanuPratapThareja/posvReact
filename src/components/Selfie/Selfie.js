import React, { Component } from 'react';
import './Selfie.css';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Snackbar from './../Snackbar/Snackbar';
import { getDevice, getIfIOS } from './../../utils/getDevice';

export default class Selfie extends Component {
    localStream;
    videoInterval;
    trackerTask;
    context;
    Webcam;
    tracker;
    tracking;

    constructor(props) {
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
            mediaSupport: true
        }
        props.history.listen((location, action) => {
            console.log(location)
            console.log(action)
            if (action === 'POP') {
                this.props.history.push('/selfie')
            }
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
            this.setState({ loadingVideo: true }, () => {
                this.initializeVideo();
            })
    }

    initializeVideo = () => {
        this.startVideo()
    }


    startVideo = () => {
        if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !getIfIOS()) {
            let img = document.getElementById('img');
            if (img) {
                img.parentNode.removeChild(img);
            }
            let video = document.getElementById('video');
            let canvas = document.getElementById('canvas');
            video.style.display = 'block';
            canvas.style.visibility = 'visible';
            
            window.Webcam.reset();
            window.Webcam.attach(document.getElementById('canvas'));
            
            this.setState({ loadingVideo: false }, () => {
                var context = canvas.getContext('2d');
                this.tracking = window.tracking;
                this.tracker = new this.tracking.ObjectTracker('face');
                this.tracker.setInitialScale(4);
                this.tracker.setStepSize(2);
                this.tracker.setEdgesDensity(0.1);
                this.trackerTask = this.tracking.track('#video', this.tracker, { camera: true });
                const that = this;
                this.setState({ xAxis: null });
                this.tracker.on('track', function (event) {
                    that.setState({ xAxis: event.data.length })
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function (rect) {
                        context.strokeStyle = '#fff';
                        context.strokeRect(rect.x + 20, rect.y + 20, rect.width - 30, rect.height - 30);
                        context.font = '11px Helvetica';
                        context.fillStyle = "#fff";
                    });
                });
            })
        } else {
            this.setState({ mediaSupport: false, loadingVideo: false })
        }
    }

    takeSelfie = async () => {
        if (this.state.pictureTaken) {
            this.setState({ pictureTaken: false });
            if (this.state.mediaSupport) {
                const img = document.getElementById('img');
                if(img){
                    img.parentNode.removeChild(img);
                }
                this.startVideo();
            } else {
                this.takeSelfieFromPhone();
            }
            return;
        }

        if (!this.state.mediaSupport) {
            this.takeSelfieFromPhone();
            return;
        }

        if(!this.state.xAxis){
            this.handleSnackbar(true, 'error', 'Take selfie when blinking box appears on your face.')
            return;
        }

        const that = this;
        window.Webcam.snap(function (imgData, event) {
            that.trackerTask.stop();
            const video = document.getElementById('video');
            const canvas = document.getElementById('canvas');
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
            if (response.data && response.data.response && !response.data.response.payload.isImageValid) {
                this.handleSnackbar(true, 'error', response.data.response.payload.businessMsg)
                this.props.manageLoader(false)
                this.setState({ submitting: false });
                setTimeout(() => {
                    if (this.state.mediaSupport) {
                        const img = document.getElementById('img');
                        if(img){
                            img.parentNode.removeChild(img);
                        }
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
        const video = document.getElementById('video')
        setTimeout(function () { 
            window.Webcam.reset();
            video.pause(); video.srcObject.getVideoTracks()[0].stop(); 
        }, 100);
        
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
        if (this.state.mediaSupport) {
            const imgStyles = { width: '320', height: '240' };
            return (
                <>
                    {/* <input type="file" accept="image/*" capture="camera" style={{ visibility: 'hidden', position: 'fixed', top: '0', left: '0' }} /> */}
                    <video id="video" width="320" height="240" style={imgStyles} preload={'auto'} autoPlay loop muted></video>
                    <canvas id="canvas" {...imgStyles}></canvas>
                    <div id="my_cam"></div>
                </>
            )
        } else {
            return (
                <>
                    <input type="file" accept="image/*" capture="camera" style={{ visibility: 'hidden', position: 'fixed', top: '0', left: '0' }} />
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