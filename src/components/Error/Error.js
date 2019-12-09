import React from 'react';
import Button from '@material-ui/core/Button';
// import RefreshIcon from '@material-ui/icons/Refresh';

export default function Error(props) {
    const textStyles = {
        color: '#00236e',
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '0.5rem'
    }

    return (
        <div className="cstm-wrap">
            <div style={textStyles}>{props.errorMsg}</div>
            <Button
                variant="contained"
                onClick={props.errorFunction}
                className="default_button">
                {props.buttonText}
            </Button>
        </div>
    )
}