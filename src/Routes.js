import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import Error from './components/Error/Error';

export default function Routes(props) {
    console.log(props)
    return (
        <BrowserRouter>
            <Switch>
                <Redirect exact path='/' to='/verify_user' />
                <Route path='/verify_user' render={props => <Verify {...props} txnId={props.txnId} params={window.location.search} />} />
                <Route path='/generate_otp' render={props => <Generate_Otp {...props} showMessageInScackbar={(options) => props.showMessageInScackbar(options)} />} />
                <Route path='/selfie' component={Selfie} />
                <Route path='/declaration' render={props => <Declaration {...props} />} showMessageInScackbar={(options) => props.showMessageInScackbar(options)} />
                <Route path='/thankyou' render={props => <Thankyou {...props} showMessageInScackbar={(options) => props.showMessageInScackbar(options)} />} />
                <Route path='/error' component={Error} />
            </Switch>
        </BrowserRouter>
    )
}