import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Thankyou.css';
import Icon from '@material-ui/core/Icon';

const Thankyou = () => {
    
    return (
        <Grid container justify="center" alignItems="center">
            <Grid item>
                <div className="thank_you">
                <Icon className="checkbox_circle">checkbox-marked-circle</Icon>
                    <p>Thank you for your response</p>
                </div>
            </Grid>
        </Grid>
    )
}

export default Thankyou;