import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { mli_logo } from './../../images/images';
import LinearProgress from '@material-ui/core/LinearProgress';
import './Header.css';

export default class Header extends Component {

    render() {
        return (
            <AppBar position="static" className="appbar">
                <Toolbar className="header">
                    <img src={mli_logo}  alt="Logo"/>
                </Toolbar>
                {/* <LinearProgress style={{ visibility: 'hidden' }} /> */}
            </AppBar>
        )
    }
}