import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { mli_logo } from './../../images/images';
import './Header.css';
import LinearProgress from '@material-ui/core/LinearProgress';

export default class Header extends Component {
    render() {
        return (
            <>
            <AppBar className="appbar">
                <Toolbar className="header">
                    <img src={mli_logo}  alt="Logo"/>
                </Toolbar>
            </AppBar>
            <LinearProgress style={{visibility: this.props.loading ? 'visible': 'hidden' }}  />
            </>
        )
    }
}