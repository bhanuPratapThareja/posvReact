import React from 'react';
import Grid from '@material-ui/core/Grid';
import './Thankyou.css';

const Thankyou = (props) => {
    window.scrollTo(0, 0)
    props.history.listen((location, action) => {
        // alert(action)
        if (action === 'POP') {
            props.history.push('/thankyou')
        }
    });

    return (
        <Grid container justify="center" alignItems="center" className="cstm-wrap">
            <Grid item>
                <div className="thank_you">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                    <p style={{ marginTop: '32px' }}>Thank you for your response</p>
                </div>
            </Grid>
        </Grid>
    )
}

export default Thankyou;