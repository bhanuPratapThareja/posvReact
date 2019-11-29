import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from './components/Header/Header';
import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import Error from './components/Error/Error';
import Snackbar from './components/Snackbar/Snackbar'

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
    return (
      <BrowserRouter>
        <Header />
        {this.state.showSnackbar ? <Snackbar
          closeSnackbar={this.closeSnackbar}
          snackbarMsgType={this.state.snackbarMsgType}
          snackbarMsg={this.state.snackbarMsg}
        /> : null}
        <Switch>
          <Redirect exact path='/' to='/generate_otp' />
          <Route path='/verify_user' render={props => <Verify {...props} params={window.location.search} />} />
          <Route path='/generate_otp' render={props => <Generate_Otp {...props} showMessageInScackbar={(options) => this.showMessageInScackbar(options)} />} />
          <Route path='/selfie' component={Selfie} />
          <Route path='/declaration' render={props => <Declaration {...props}  />} showMessageInScackbar={(options) => this.showMessageInScackbar(options)} />
          <Route path='/thankyou' render={props => <Thankyou {...props } showMessageInScackbar={(options) => this.showMessageInScackbar(options)} />} />
          <Route path='/error' component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;