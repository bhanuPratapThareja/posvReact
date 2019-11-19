import React, { Component } from 'react';
import './Screenshot.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

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

        // navigator.getMedia({
        //     video: true,
        //     audio: false
        // }, function (stream) {
        //     video.srcObject = stream;
        //     video.play();
        //     that.setState({ video })
        // }, function (error) {

        // })
    }

    takeScreenshot = () => {
        // console.log(context)
        this.setState({ pictureTaken: true }, () => {
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            context.drawImage(this.state.video, 0, 0, 400, 300);
        })

    }

    render() {
        const boothStyles = { width: '400px' }
        const imgStyles = { width: '400', height: '300' };

        return (
            <Grid container justify="center" alignItems="center">
                <Grid item xs={6}>
                    <div className="booth" style={boothStyles}>
                        {!this.state.pictureTaken ? <video id="video" {...imgStyles}></video> : null}
                        {this.state.pictureTaken ? <canvas id="canvas" {...imgStyles}></canvas> : null}
                        <Button onClick={this.takeScreenshot} variant="contained" className="default_button" style={{ width: '100%' }}>
                            Take Selfie
                        </Button>
                    </div>
                    <br />
                    <Paper>
                        <Typography variant="h6" component="h6" style={{textAlign: 'center'}}>
                            Position your face inside the frame and click on Take Selfie button
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}