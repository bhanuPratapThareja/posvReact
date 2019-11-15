import React, { Component } from 'react';
import './Screenshot.css';
import Button from '@material-ui/core/Button';

export default class Screenshot extends Component {

    constructor() {
        super();
        this.state = {
            video: undefined,
            pictureTaken: false
        }
    }

    componentDidMount() {
        this.initializeMedia();
    }

    initializeMedia = () => {
        let video = document.getElementById('video');
        // let vendorUrl = window.URL || window.webkitURL;

        navigator.getMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

        let that = this;

        navigator.getMedia({
            video: true,
            audio: false
        }, function (stream) {
            video.srcObject = stream;
            video.play();
            that.setState({ video })
        }, function (error) {

        })
    }

    takeScreenshot = () => {
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        context.drawImage(this.state.video, 0, 0, 400, 300);
        let photo = document.getElementById('photo');
        photo.setAttribute('src', canvas.toDataURL('image/png'))
    }

    render() {
        const boothStyles = { width: '400px' }
        const imgStyles = { width: '400', height: '300' };

        return (
            <>
                <div className="booth" style={boothStyles}>
                    <video id="video" {...imgStyles}></video>
                    <canvas id="canvas" {...imgStyles} ></canvas>
                    <Button onClick={this.takeScreenshot} variant="contained" className="default_button" style={{ width: '100%' }}>
                        Capture
                    </Button>
                </div>
            </>
        )
    }
}