import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './Generate_Otp.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { getApiData } from './../../api/api';
import { headers } from './../../api/headers';
import Otp from './Otp/Otp';
import Snackbar from './../Snackbar/Snackbar';

class Generate_Otp extends Component {
    constructor() {
        super();
        this.state = {
            generatingOtp: false,
            submitting: false,
            disableSubmitButton: true,
            disableGenerateOtpButton: false,
            otp: undefined,
            otpButtonText: 'Generate Otp',
            showCallButton: false,
            disableCallButton: false,
            callAttemptsSuccess: 0,
            generateOtpTime: 20,
            callOtpTime: 20,
            showGenerateOtpTime: false,
            showCallTime: false,
            showSnackbar: false,
            snackbarMsgType: '',
            snackbarMsg: '',
            displayMessage: 'Please click on Generate OTP button to get the otp.',
            checkboxValue: false
        }
    }

    componentDidMount() {
        document.addEventListener('keyup', this.inputFunction);
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.inputFunction);
    }

    inputFunction = () => {
        const [i0, i1, i2, i3] = document.querySelectorAll('.input_otp');
        if (i0.value && i1.value && i2.value && i3.value) {
            this.setState({ disableSubmitButton: false })
        } else {
            this.setState({ disableSubmitButton: true })
        }
    }

    generateOtp = async (type) => {
        this.setState({ generatingOtp: true });
        let generateOtpinterval;
        if (type !== 'call') {
            generateOtpinterval = setInterval(() => {
                this.setState({ showGenerateOtpTime: true, generateOtpTime: --this.state.generateOtpTime, disableGenerateOtpButton: true });
                if (this.state.generateOtpTime === 0) {
                    clearInterval(generateOtpinterval);
                    this.setState({ showGenerateOtpTime: false, generateOtpTime: 20, disableGenerateOtpButton: false })
                }
            }, 1000);
        }

        let { url, body } = getApiData('getotp');
        body = JSON.parse(JSON.stringify(body))
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');

        let callInterval;
        if (type === 'call') {
            body.request.payload.onCallOTP = 'Yes';
            callInterval = setInterval(() => {
                this.setState({ showCallTime: true, callOtpTime: --this.state.callOtpTime, disableCallButton: true });
                if (this.state.callOtpTime === 0) {
                    clearInterval(callInterval);
                    this.setState({ showCallTime: false, callOtpTime: 20, disableCallButton: false })
                }
            }, 1000);
        }

        try {
            const response = await axios.post(url, body, { headers })
            this.setState({ displayMessage: response.data.response.payload.levelMessage, generatingOtp: false })
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
            if (generateOtpinterval) {
                clearInterval(generateOtpinterval);
            }
            if(callInterval){
                clearInterval(callInterval)
            }
            this.handleSnackbar(true, 'error', 'Please try again')
        } finally {
            this.setState({ showCallButton: true, otpButtonText: 'Regenerate OTP' });
        }

    }

    handleCheckbox = value => {
        this.setState({ checkboxValue: value })
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
        body.request.payload.planCode = localStorage.getItem('planCode');

        try {
            const response = await axios.post(url, body, { headers })
            if (response.data.response.messageInfo.msgCode == 700) {
                this.handleSnackbar(true, 'error', response.data.response.messageInfo.msgDescription)
                return
            }
            document.removeEventListener('keyup', this.inputFunction)
            this.props.history.push('/thankyou')
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
        this.setState({ showSnackbar, snackbarMsgType, snackbarMsg })
        setTimeout(() => {
            this.closeSnackbar()
        }, 2500);
    }

    closeSnackbar = () => {
        this.setState({
            showSnackbar: false,
            snackbarMsgType: '',
            snackbarMsg: ''
        })
    }

    render() {
        const channelName = localStorage.getItem('channelName');

        return (
            <div>
                <LinearProgress style={{ visibility: this.state.generatingOtp || this.state.submitting ? 'visible' : 'hidden' }} />
                {this.state.showSnackbar ? <Snackbar
                    closeSnackbar={this.closeSnackbar}
                    snackbarMsgType={this.state.snackbarMsgType}
                    snackbarMsg={this.state.snackbarMsg}
                /> : null}
                <div className="dsclmr-wrap">

                    <div className="generate-otp__grid">

                        <Paper className="paper">
                            <div >
                                <img src="" atl="image" className="phone_image" />
                            </div>
                            <div>
                                <p className="default_text">{this.state.displayMessage}</p>
                                <h4 className="default_text">Enter 4 - Digit code</h4>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>

                                <Otp submitting={this.state.submitting} />

                            </div>

                            <div className="buttons_div__otp">
                                {this.state.showGenerateOtpTime ? <span className="otpTime">{this.state.generateOtpTime}</span> : null}
                                <Button
                                    variant="contained"
                                    disabled={this.state.submitting || this.state.disableGenerateOtpButton}
                                    className="default_button"
                                    onClick={() => this.generateOtp('generate')}>
                                    {this.state.otpButtonText}
                                </Button>

                                {this.state.showCallButton ? <Button
                                    variant="contained"
                                    disabled={this.state.submitting || this.state.disableCallButton}
                                    className="default_button"
                                    id="call_button"
                                    onClick={() => this.generateOtp('call')}>
                                    Get OTP on Call
                                    </Button> : null}
                                {this.state.showCallTime ? <span className="otpTime">{this.state.callOtpTime}</span> : null}
                            </div>
                            {channelName === 'x' ?
                                <Button variant="contained" className="default_button submit_button--generate_otp" onClick={this.SubmitOtp} disabled={this.state.submitting || this.state.disableSubmitButton}>
                                    Submit
                            </Button> : null}
                        </Paper>
                    </div>
                    {channelName !== 'x' ?
                        <div className="tnc-txt">
                            <form>
                                <p>
                                    <input disabled={this.state.submitting} type="checkbox" value={this.state.checkboxValue} onChange={event => this.handleCheckbox(event.target.checked)} />
                                    I have received, seen and understood the benefit illustration and proposal form sent on my registered mobile number and email. I have also filled up the verification and health & habit questions on my mobile which will also form part of the proposal form. I confirm that all the content / information therein are true and correct to the best of my knowledge and belief. I also hereby consent to the benefit illustration and the proposal form including the verification and health & habit questions.
                            </p>
                                <Button
                                    variant="contained"
                                    className="default_button submit_button--generate_otp"
                                    onClick={this.SubmitOtp}
                                    disabled={this.state.submitting || this.state.disableSubmitButton || !this.state.checkboxValue}>
                                    Submit
                            </Button>
                            </form>
                        </div> : null}
                </div>
            </div>
        )
    }
}

export default Generate_Otp;