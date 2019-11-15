import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export const Header = () => {
    return (
        <AppBar position="static" style={{marginBottom: '16px'}}>
            <Toolbar className="header"></Toolbar>
        </AppBar>
    )
}