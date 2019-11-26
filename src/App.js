import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import {Header} from './components/Header/Header';
import Verify from './components/Verify/Verify';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Selfie from './components/Selfie/Selfie';
import Declaration from './components/Declaration/Declaration';
import Thankyou from './components/Thankyou/Thankyou';
import Error from './components/Error/Error';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Switch>
          <Redirect exact path='/' to='/generate_otp' />
          <Route path='/verify_user' render={props => <Verify {...props} params={window.location.search} />} />
          <Route path='/generate_otp' component={Generate_Otp} />
          <Route path='/selfie' component={Selfie} />
          <Route path='/declaration' component={Declaration} />
          <Route path='/thankyou' component={Thankyou} />
          <Route path='/error' component={Error} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;