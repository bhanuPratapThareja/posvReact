import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './Generate_Otp.css';
import PositionedSnackbar from './../Snackbar/Snackbar';
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
            otp: undefined
        }
    }

    generateOtp = async () => {
        this.setState({ generatingOtp: true });
        const { url, data } = getApiData('getotp');

        try {
            const response = await axios.post(url, data, { headers })
            console.log('reaponse: ', response)
        } catch (err) {
            console.log('err: ', err)
        } finally {
            this.setState({ generatingOtp: false });
        }

    }

    SubmitOtp = () => {
        // this.setState({ submitting: true })
        const inps = document.getElementsByClassName('input_otp');
        for (let inp of inps) {
            console.log(inp.value)
        }
    }

    render() {
        return (
            <Grid container justify="center" alignItems="center" className="generate-otp__grid">
                <Grid item xs={12} sm={8}>
                    <LinearProgress style={{ visibility: this.state.generatingOtp || this.state.submitting ? 'visible' : 'hidden' }} />
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

                        <div>
                            <Button
                                variant="contained"
                                disabled={this.state.generatingOtp || this.state.submitting}
                                className="default_button"
                                style={{ marginTop: '16px' }}
                                onClick={this.generateOtp}>
                                Generate OTP
                            </Button>
                        </div>

                        <h5 className="default_text" style={{ textDecoration: 'underline' }}>Did'nt recieve the code?</h5>
                        <Button variant="contained" className="default_button" onClick={this.SubmitOtp} disabled={this.state.generatingOtp || this.state.submitting}>
                            Submit
                        </Button>
                    </Paper>
                    {this.state.generatingOtp ? <PositionedSnackbar messageInfo={'my message'} /> : null}
                </Grid>
            </Grid>
        )
    }
}

export default Generate_Otp;