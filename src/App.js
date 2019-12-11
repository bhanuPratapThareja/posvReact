import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from './components/Header/Header';
import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import Snackbar from './components/Snackbar/Snackbar';
import Customer_Feedback from './components/Customer_Feedback/Customer_Feedback';
import Health from './components/Customer_Feedback/Health/Health';
import Pdf from './components/Pdf/Pdf';
// import Questionnair from './components/Questionnair/Questionnair';

class App extends Component {
  constructor() {
    super();
    this.state = {
      showSnackbar: false,
      snackbarMsgType: '',
      snackbarMsg: ''
    }
  }

  showMessageInScackbar = ({showSnackbar, snackbarMsgType, snackbarMsg}) => {
    this.setState({ showSnackbar, snackbarMsgType, snackbarMsg })
  }

  closeSnackbar = () => {
    this.setState({
      showSnackbar: false,
      snackbarMsgType: '',
      snackbarMsg: ''
    })
  }

  render() {
    let [param, txnId] = window.location.search.split("=");
    param = param.substr(1)
    let redirectRoute = '/verify_user';
    if(param === 'pdf'){
      redirectRoute = '/pdf'
    }
    return (
      <BrowserRouter>
        <Header />
        {this.state.showSnackbar ? <Snackbar
          closeSnackbar={this.closeSnackbar}
          snackbarMsgType={this.state.snackbarMsgType}
          snackbarMsg={this.state.snackbarMsg}
        /> : null}
        <Switch>
          <Redirect exact path='/' to={redirectRoute} />
          <Route path='/verify_user' render={props => <Verify {...props} txnId={txnId} params={window.location.search} />} />
          <Route path='/pdf'render={props => <Pdf {...props} txnId={txnId} />} />
          <Route path='/customer_feedback/product' component={Customer_Feedback} />
          <Route path='/customer_feedback/health' component={Customer_Feedback} />
          <Route path='/customer_feedback/psm' component={Customer_Feedback} />
          <Route path='/customer_feedback/rpsales' component={Customer_Feedback} />
          <Route path='/customer_feedback/cancer' component={Customer_Feedback} />
          <Route path='/generate_otp' render={props => <Generate_Otp {...props} showMessageInScackbar={(options) => this.showMessageInScackbar(options)} />} />
          <Route path='/selfie' component={Selfie} />
          <Route path='/declaration' render={props => <Declaration {...props}  />} showMessageInScackbar={(options) => this.showMessageInScackbar(options)} />
          <Route path='/thankyou' render={props => <Thankyou {...props } showMessageInScackbar={(options) => this.showMessageInScackbar(options)} />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;