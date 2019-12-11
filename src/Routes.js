import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import Customer_Feedback from './components/Customer_Feedback/Customer_Feedback';
import Pdf from './components/Pdf/Pdf';

export default function Routes() {
    let [param, txnId] = window.location.search.split("=");
    param = param.substr(1)
    let redirectRoute = '/verify_user';
    if (param === 'pdf') {
        redirectRoute = '/pdf'
    }

    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact path='/' to={redirectRoute} />
                <Route path='/verify_user' render={props => <Verify {...props} txnId={txnId} />} />
                <Route path='/pdf' render={props => <Pdf {...props} txnId={txnId} />} />
                <Route path='/customer_feedback/product' component={Customer_Feedback} />
                <Route path='/customer_feedback/health-1' component={Customer_Feedback} />
                <Route path='/customer_feedback/health-2' component={Customer_Feedback} />
                <Route path='/customer_feedback/psm' component={Customer_Feedback} />
                <Route path='/customer_feedback/rpsales' component={Customer_Feedback} />
                <Route path='/customer_feedback/cancer' component={Customer_Feedback} />
                <Route path='/generate_otp' component={Generate_Otp} />
                <Route path='/selfie' component={Selfie} />
                <Route path='/declaration' component={Declaration} />
                <Route path='/thankyou' component={Thankyou} />
            </Switch>
        </BrowserRouter>
    )
}