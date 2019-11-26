import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { mli_logo } from './../../images/images';

export const Header = () => {
    return (
        <AppBar position="static" style={{marginBottom: '16px', position: 'fixed', top: '0', width: '100%', float: 'left'}}>
            <Toolbar className="header">
                <img src={mli_logo}  alt="Logo"/>
            </Toolbar>
        </AppBar>
    )
}