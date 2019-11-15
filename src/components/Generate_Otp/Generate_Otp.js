import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import './Generate_Otp.css';
// import PositionedSnackbar from './../Snackbar/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { getApiData } from './../../api/api';

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
        const headers = { 'x-api-key': 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg' }

        console.log(url)
        console.log(data)
        console.log(headers)

        try {
            const response = await axios.post(url, data, { headers })
            console.log('reaponse: ', response)
        } catch (err) {
            console.log('err: ', err)
        } finally {
            console.log('finnayy');
            setTimeout(() => {
                
                this.setState({ generatingOtp: false });
            }, 4000);
        }

    }

    render() {
        return (
            <Grid container justify="center" alignItems="center" className="generate-otp__grid">
                <Grid item xs={12} sm={8}>
                <LinearProgress  style={{ visibility: this.state.generatingOtp || this.state.submitting ? 'visible': 'hidden' }} />
                    <Paper className="paper">
                        <div >
                            <img src="" atl="image" className="phone_image" />
                        </div>
                        <div>
                            <p className="default_text">Please click on Generate OTP button to get the otp.</p>
                            <h4 className="default_text">Enter 4 - Digit code</h4>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div id="divOuter">
                                <div id="divInner">
                                    <input id="partitioned" type="text" maxLength="4" disabled={this.state.generatingOtp || this.state.submitting} />
                                </div>
                            </div>
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
                        <Button variant="contained" className="default_button" disabled={this.state.generatingOtp || this.state.submitting}>
                            Submit
                        </Button>
                    </Paper>
                    {/* {this.state.generatingOtp ? <PositionedSnackbar messageInfo={'my message'} /> : null} */}
                </Grid>
                {/* <div id="wrapper">
                    <div id="dialog">
                        <button class="close">×</button>
                        <h3>Please enter the 4-digit verification code we sent via SMS:</h3>
                        <span>(we want to make sure it's you before we contact our movers)</span>
                        <div id="form">
                            <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                            <input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" /><input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" /><input type="text" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
                            <button class="btn btn-primary btn-embossed">Verify</button>
                        </div>

                        <div>
                            Didn't receive the code?<br />
                            <a href="#">Send code again</a><br />
                            <a href="#">Change phone number</a>
                        </div>
                        <img src="http://jira.moovooz.com/secure/attachment/10424/VmVyaWZpY2F0aW9uLnN2Zw==" alt="test" />
                    </div>
                </div> */}
            </Grid>
        )
    }
}

export default Generate_Otp;