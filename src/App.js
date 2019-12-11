import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Routes from './Routes';

import Header from './components/Header/Header';
// import Questionnair from './components/Questionnair/Questionnair';

class App extends Component {

  render() {
    return (
      <>
        <Header />
        <Routes />
      </>
    );
  }
}

export default App;