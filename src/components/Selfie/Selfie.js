import React, { Component } from 'react';
import axios from 'axios';
import Snackbar from './../Snackbar/Snackbar';
import Button from '@material-ui/core/Button';
import { getApiData } from './../../api/api';
import { getDevice, getIfIOS } from './../../utils/getDevice';
import './Selfie.css';

export default class Selfie extends Component {
    trackerTask;

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
            loadingVideo: undefined,
            mediaSupport: true,
            boothWidth: '320px',
            boothHeight: '240px',
            gotEvent: false
        }

        props.history.listen((location, action) => {
            if (action === 'POP') {
                this.props.history.push('/selfie');
                this.props.manageLoader(false);
            }
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({ loadingVideo: true }, () => {
            // if(getDevice() === 'mobile'){
            //     this.setState({ boothWidth: '50%', boothHeight: '50%' })
            // }
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
            window.Webcam.attach(document.querySelector('canvas'));
            window.Webcam.set({});

            this.setState({ loadingVideo: false }, () => {
                var context = canvas.getContext('2d');
                const tracking = window.tracking;
                const tracker = new tracking.ObjectTracker('face');
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                this.trackerTask = tracking.track('#video', tracker, { camera: true });
                const that = this;
                this.setState({ xAxis: null });
                tracker.on('track', function (event) {
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
            const constraints = { audio: false, video: { facingMode: "user" } }
            window.Webcam.attach(document.querySelector('canvas'));
            window.Webcam.set({ constraints });
            console.log(window.Webcam)
            this.setState({ mediaSupport: false, loadingVideo: false })
        }
    }

    handleBoothClick = () => {
        if (!(navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !getIfIOS())) {
            this.takeSelfie()
        }
    }

    takeSelfie = async () => {
        if (this.state.pictureTaken) {
            if (this.state.mediaSupport) {
                this.setState({ pictureTaken: false });
                const img = document.getElementById('img');
                if (img) {
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

        if (!this.state.xAxis) {
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
            const img = new Image();
            img.setAttribute('id', 'img');
            img.src = imgData;
            const booth = document.getElementById('booth');
            img.onload = () => {
                if (getDevice() === 'mobile') {
                    booth.style.width = img.width;
                    booth.style.height = img.height;
                    booth.style.border = 'none';
                    img.style.border = '8px solid lightgrey';
                }
                booth.append(img);
                that.setState({ pictureTaken: true, picture: imgData })
            }
        })
    }

    takeSelfieFromPhone = () => {
        const cameraInput = document.querySelector("[capture='camera']");
        cameraInput.click();
        cameraInput.addEventListener('change', (event) => {
            event.stopImmediatePropagation();
            if (!event.target.value) {
                return
            }
            var reader = new FileReader(event.srcElement.files[0]);

            reader.onload = readSuccess;
            const that = this;
            function readSuccess(evt) {
                that.setState({ picture: evt.target.result }, () => {

                    const booth = document.getElementById('booth');
                    booth.style.border = 'none';
                    let img = document.getElementById('selfie');
                    if (img) {
                        img.parentNode.removeChild(img)
                    }
                    img = new Image();
                    img.alt = 'Selfie';
                    img.setAttribute('id', 'selfie');
                    img.src = that.state.picture;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext("2d");

                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        img.style.border = '8px solid lightgrey';

                        booth.append(img);
                        const images = document.querySelectorAll('#selfie');
                        if (images.length > 1) {
                            const rmImage = images[1];
                            rmImage.parentNode.removeChild(rmImage)
                        }
                        that.setState({ pictureTaken: true }, () => {
                            let base64 = img.src;
                            const type = base64.substring(base64.indexOf('/') + 1, base64.indexOf(';base64'));
                            ctx.drawImage(img, 0, 0, img.width, img.height);
                            const phonePicture = canvas.toDataURL(`image/${type}`, 0.2);
                            var stringLength = phonePicture.length - `data:image/${type};base64,`.length;
                            var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
                            var sizeInKb = sizeInBytes / 1024;
                            console.log('sizeInBytes: ', sizeInBytes)
                            console.log('sizeInKb: ', sizeInKb)
                            that.setState({ phonePicture })
                        })
                    }
                })
            }
            reader.readAsDataURL(event.srcElement.files[0]);
        });
    }

    submitSelfie = async () => {
        this.props.manageLoader(true)
        await this.setState({ submitting: true })

        const base64 = this.state.phonePicture ? this.state.phonePicture : this.state.picture;
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
                        if (img) {
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
            this.handleSnackbar(true, 'error', 'Something went wrong. Please try again.')
            this.props.manageLoader(false)
            this.setState({ submitting: false })
        }
    }

    componentWillUnmount() {
        if (navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !getIfIOS()) {
            this.closeWebcam();
        }
    }

    closeWebcam = () => {
        const video = document.getElementById('video')
        setTimeout(function () {
            window.Webcam.reset();
            if (video && video.srcObject) {
                video.pause(); video.srcObject.getVideoTracks()[0].stop();
            }
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
        const camTextStyle = { display: this.state.picture ? 'none' : 'block' }
        const imgStyles = { width: '320', height: '240' };
        if (this.state.mediaSupport) {
            return (
                <>
                    <video id="video" width="320" height="240" style={imgStyles} preload={'auto'} autoPlay loop muted></video>
                    <canvas id="canvas" {...imgStyles}></canvas>
                </>
            )
        } else {
            return (
                <>
                    <input type="file" accept="image/*" capture="camera" className="selfie_camera--image" />
                    <div className="camera_text" style={camTextStyle}>
                        Click here to open camera
                    </div>
                    <canvas id="canvas" {...imgStyles}></canvas>
                </>
            )
        }
    }

    render() {
        const buttonText = !this.state.pictureTaken ? 'Take Selfie' : 'Retake Selfie';
        const boothStyles = { width: this.state.boothWidth, height: this.state.boothHeight }
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
                    <div className="booth" style={boothStyles} id="booth" onClick={this.handleBoothClick}>
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