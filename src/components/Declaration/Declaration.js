import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';
import { getApiData } from './../../api/api';
import './Declaration.css';

class Declaration extends Component {

    constructor() {
        super();
        this.state = {
            checked: false,
            proceeding: false
        }
        if(localStorage.getItem('selfie')){
            localStorage.removeItem('selfie')
            window.location.reload();
        }
    }

    handleChange = (checked) => {
        this.setState({ checked })
    }

    proceed = async () => {
        await this.setState({ proceeding: true });
        const { url, body } = getApiData('declaration');
        body.request.payload.customerDisclaimer = 'Agreed';

        try {
            await axios.post(url, body);
            this.setState({ proceeding: false });
            this.props.history.push('/generate_otp');
        } catch (err) {
            this.setState({ proceeding: false });
            this.handleSnackbar(true, 'error', 'Something went wrong. Please try again')
        }
    }

    handleSnackbar = (showSnackbar, snackbarMsgType, snackbarMsg) => {
        const options = { showSnackbar, snackbarMsgType, snackbarMsg }
        this.props.showMessageInScackbar(options)
    }

    render() {

        const declaration = `I have received, seen and understood the benefit illustration and proposal form sent on my registered mobile
        number and email. I have also filled up the verification and health & habit questions on my mobile which will
        also form part of the proposal form. I confirm that all the content / information therein are true and correct
        to the best of my knowledge and belief. I also hereby consent to the benefit illustration and the proposal form
        including the verification and health & habit questions.`;

        return (
            <>
                <LinearProgress style={{ visibility: this.state.proceeding ? 'visible' : 'hidden' }} />
                <Grid container justify="center" className="cstm-wrap">
                    <Grid item xs={12} sm={8}>
                        <Card style={{ padding: '8px' }}>
                            <CardContent>
                                <h4 style={{ textAlign: 'center' }}>Declaration</h4>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {declaration}
                                </Typography>

                                <Checkbox
                                    value={this.state.checked}
                                    onChange={event => this.handleChange(event.target.checked)}
                                    color="default"
                                    disabled={this.state.proceeding}
                                />
                                <label>I agree</label>

                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        variant="contained"
                                        onClick={this.proceed}
                                        className="default_button"
                                        disabled={!this.state.checked || this.state.proceeding}>
                                        Proceed
                                </Button>
                                    {/* <CircularProgress style={{ display: this.state.proceeding ? 'inline-block': 'none' }} /> */}
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default Declaration;