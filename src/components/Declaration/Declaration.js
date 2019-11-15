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

class Declaration extends Component {

    constructor() {
        super();
        this.state = {
            checked: false,
            proceeding: false
        }
    }

    handleChange = (checked) => {
        this.setState({ checked })
    }

    proceed = async () => {
        this.setState({ proceeding: true });
        const { url, data } = getApiData('getotp');
        const headers = { 'x-api-key': 'U8eL0A3syl3wPN0U1tMuN7OJH66cXw0llUlC4deg' }

        console.log(url)
        console.log(data)
        console.log(headers)

        try {
            const response = await axios.post(url, data, { headers })
        } catch (err) {
            console.log('err: ', err)
        } finally {
            setTimeout(() => {
                this.setState({ proceeding: false });
            }, 4000);
        }
    }

    render() {

        const declaration = `I have recieved, seen and understood the benefil illustration and proposal form sent on my mobile number and email.
                            I have also filled up the verification and health and habit questions on my mobile which will also for part of the proposal form.
                            I confirm that all the content / information therein are truea and correct to the best of my knowledge and belief.`;

        return (
            <Grid container justify="center">
                <Grid item xs={12} sm={8}>
                    <LinearProgress  style={{ visibility: this.state.proceeding ? 'visible': 'hidden' }} />
                    <Card style={{padding: '8px'}}>
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
        )
    }
}

export default Declaration;