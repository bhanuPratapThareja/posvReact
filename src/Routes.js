import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import Customer_Feedback from './components/Customer_Feedback/Customer_Feedback';
import Pdf from './components/Pdf/Pdf';

export default function Routes(props) {
    console.log(props)
    return (
            <Switch>
                <Redirect exact path='/' to={props.redirectRoute} />
                <Route path='/verify_user' render={props => <Verify {...props} txnId={props.txnId} />} />
                <Route path='/pdf' render={props => <Pdf {...props} txnId={props.txnId} />} />
                <Route path='/customer_feedback/product' component={Customer_Feedback} />
                <Route path='/customer_feedback/health-1' component={Customer_Feedback} />
                <Route path='/customer_feedback/health-2' component={Customer_Feedback} />
                <Route path='/customer_feedback/psm' component={Customer_Feedback} />
                <Route path='/customer_feedback/rpsales' component={Customer_Feedback} />
                <Route path='/customer_feedback/cancer' component={Customer_Feedback} />
                <Route path='/generate_otp' render={props => <Generate_Otp showMessageInScackbar={(options) => props.showMessageInScackbar(options)} {...props} />} />
                <Route path='/selfie' component={Selfie} />
                <Route path='/declaration' render={props => <Declaration {...props} />} showMessageInScackbar={(options) => props.showMessageInScackbar(options)} />
                <Route path='/thankyou' render={props => <Thankyou {...props} showMessageInScackbar={(options) => props.showMessageInScackbar(options)} />} />
            </Switch>
    )
}