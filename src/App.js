import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
// import Questionnair from './components/Questionnair/Questionnair';

class App extends Component {

  constructor(){
    super();
    this.state = { loading: false }
  }

  manageLoader = loading => {
    this.setState({ loading })
  }


  render() {
    return (
      <>
        <Header loading={this.state.loading} />
        <Routes manageLoader={loading => this.manageLoader(loading)} loading={this.state.loading} />
        <Footer />
      </>
    );
  }
}

export default App;