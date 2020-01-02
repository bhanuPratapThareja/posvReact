import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import CustomerFeedback from './components/CustomerFeedback/CustomerFeedback';
import Pdf from './components/Pdf/Pdf';

export default class Routes extends Component {

    render(){
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
                    <Route path='/verify_user' render={props => <Verify {...props} txnId={txnId} manageLoader={loading => this.props.manageLoader(loading)} loading={this.props.loading} />} />
                    <Route path='/pdf' render={props => <Pdf {...props} txnId={txnId} manageLoader={loading => this.props.manageLoader(loading)} loading={this.props.loading} />} />
                    <Route path='/customer_feedback/product' render={props => <CustomerFeedback {...props} manageLoader={loading => this.props.manageLoader(loading)} />} />
                    <Route path='/customer_feedback/health-1' render={props => <CustomerFeedback {...props} manageLoader={loading => this.props.manageLoader(loading)} />} />
                    <Route path='/customer_feedback/health-2' render={props => <CustomerFeedback {...props} manageLoader={loading => this.props.manageLoader(loading)} />} />
                    <Route path='/customer_feedback/psm' render={props => <CustomerFeedback {...props} manageLoader={loading => this.props.manageLoader(loading)} />} />
                    <Route path='/customer_feedback/rpsales' render={props => <CustomerFeedback {...props} manageLoader={loading => this.props.manageLoader(loading)} />} />
                    <Route path='/customer_feedback/cancer' render={props => <CustomerFeedback {...props} manageLoader={loading => this.props.manageLoader(loading)} />} />
                    <Route path='/generate_otp' component={Generate_Otp} manageLoader={loading => this.props.manageLoader(loading)} />
                    <Route path='/selfie' render={props => <Selfie {...props} txnId={txnId} manageLoader={loading => this.props.manageLoader(loading)} loading={this.props.loading} />} />
                    <Route path='/declaration' component={Declaration} />
                    <Route path='/thankyou' component={Thankyou} />
                </Switch>
            </BrowserRouter>
        )
    }
}