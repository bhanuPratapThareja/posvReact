import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Thankyou.css';
import Icon from '@material-ui/core/Icon';

const Thankyou = (props) => {

    props.history.listen((location, action) => {
        // alert(action)
        if(action === 'POP'){
            props.history.push('/thankyou')
        }
    });
    
    return (
        <Grid container justify="center" alignItems="center" className="cstm-wrap">
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