import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './Generate_Otp.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { getApiData } from './../../api/api';
import { headers } from './../../api/headers';
import Otp from './Otp/Otp';

class Generate_Otp extends Component {
    constructor() {
        super();
        this.state = {
            generatingOtp: false,
            showMessage: false,
            submitting: false,
            submitButtonEnabled: false,
            otp: undefined,
            otpButtonText: 'Genrate Otp',
            showCallButton: false,
            callAttemptsSuccess: 0,
            otpTime: 5
        }
    }

    componentDidMount() {
        document.addEventListener('keyup', this.inputFunction);
        document.getElementsByClassName('input_otp')[0].focus();
    }

    inputFunction = () => {
        const [i0, i1, i2, i3] = document.querySelectorAll('.input_otp');
        if (i0.value && i1.value && i2.value && i3.value) {
            this.setState({ submitButtonEnabled: true })
        } else {
            this.setState({ submitButtonEnabled: false })
        }
    }

    generateOtp = async (type) => {
        console.log(type)
        this.setState({ generatingOtp: true, otpButtonText: 'Regenerate' }, () => {
            if (this.state.callAttemptsSuccess <= 3) {
                this.setState({ showCallButton: true })
            }
        });
        let interval;
        interval = setInterval(() => {
            this.setState({ otpTime: --this.state.otpTime });
            if (this.state.otpTime === 0) {
                clearInterval(interval);
                this.setState({ generatingOtp: false, otpTime: 5 })
            }
        }, 1000);

        let { url, body } = getApiData('getotp');
        body = JSON.parse(JSON.stringify(body))
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        if(type === 'call'){
            body.request.payload.onCallOTP = 'Yes';
        }

        try {
            const response = await axios.post(url, body, { headers })
            if (type === 'call') {
                this.setState({ callAttemptsSuccess: this.state.callAttemptsSuccess + 1 }, () => {
                    if (this.state.callAttemptsSuccess >= 3) {
                        this.setState({ showCallButton: false })
                    }
                })
            }
            const msg = response.data.response.msgInfo.msgDescription
            this.handleSnackbar(true, 'success', msg)
        } catch (err) {
            this.handleSnackbar(true, 'error', 'Please try again')
        } finally {
            clearInterval(interval);
            this.setState({ generatingOtp: false, otpTime: 5 });
        }

    }

    SubmitOtp = async () => {
        this.setState({ submitting: true })
        const inps = document.getElementsByClassName('input_otp');
        let otp = '';
        for (let inp of inps) {
            otp += inp.value
        }
        const { url, body } = getApiData('validateOtp');
        body.request.payload.otp = otp;
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');

        try {
            const response = await axios.post(url, body, { headers })
            if (response.data.response.messageInfo.msgCode == 700) {
                this.handleSnackbar(true, 'error', response.data.response.messageInfo.msgDescription)
                return
            }
            document.removeEventListener('keyup', this.inputFunction)
            this.props.history.push('/declaration')
        } catch (err) {
            this.setState({ submitting: false })
            this.handleSnackbar(true, 'error', 'Something went wrong. Please check otp and try again')
        } finally {
            this.setState({ submitting: false })
        }
    }

    onDidntGetOtp = () => {
        console.log('didint get otp')
    }

    handleSnackbar = (showSnackbar, snackbarMsgType, snackbarMsg) => {
        const options = { showSnackbar, snackbarMsgType, snackbarMsg }
        this.props.showMessageInScackbar(options)
    }

    render() {
        return (
            <div>
                <LinearProgress style={{ visibility: this.state.generatingOtp || this.state.submitting ? 'visible' : 'hidden' }} />
                <div className="generate-otp__grid">
                    <Paper className="paper">
                        <div >
                            <img src="" atl="image" className="phone_image" />
                        </div>
                        <div>
                            <p className="default_text">Please click on Generate OTP button to get the otp.</p>
                            <h4 className="default_text">Enter 4 - Digit code</h4>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>

                            <Otp submitting={this.state.submitting} />

                        </div>

                        <div className="buttons_div__otp">
                            <Button
                                variant="contained"
                                disabled={this.state.generatingOtp || this.state.submitting}
                                className="default_button"
                                onClick={() => this.generateOtp('generate')}>
                                {this.state.otpButtonText}
                            </Button>

                            {this.state.showCallButton ? <Button
                                variant="contained"
                                disabled={this.state.generatingOtp || this.state.submitting}
                                className="default_button"
                                id="call_button"
                                onClick={() => this.generateOtp('call')}>
                                Call
                                </Button> : null}
                            {this.state.generatingOtp ? <span className="otpTime">{this.state.otpTime}</span> : null}
                        </div>

                        <h5 onClick={this.onDidntGetOtp} className="default_text" style={{ textDecoration: 'underline', cursor: 'pointer' }}>Did'nt recieve the code?</h5>
                        <Button variant="contained" className="default_button" onClick={this.SubmitOtp} disabled={this.state.generatingOtp || this.state.submitting || !this.state.submitButtonEnabled}>
                            Submit
                    </Button>
                    </Paper>
                </div>
            </div>
        )
    }
}

export default Generate_Otp;