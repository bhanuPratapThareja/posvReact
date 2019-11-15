import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import {Header} from './components/Header/Header';
import Generate_Otp from './components/Generate_Otp/Generate_Otp';
import Screenshot from './components/Screenshot/Screenshot';
import Declaration from './components/Declaration/Declaration';

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Switch>
          <Redirect exact path='/' to='/generate_otp' />
          <Route path='/generate_otp' component={Generate_Otp} />
          <Route path='/screenshot' component={Screenshot} />
          <Route path='/declaration' component={Declaration} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;