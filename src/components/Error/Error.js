import React from 'react';
import Button from '@material-ui/core/Button';

export default Error = props => {
    return (
        <div className="cstm-wrap">
            {props.errorMsg}
            <Button
                variant="contained"
                onClick={props.errorFunction}
                className="default_button">
                {props.buttonText}
            </Button>
        </div>
    )
}