import React from 'react';

export default Error = props => {
    return (
        <div style={{ marginTop: '70px' }}>
            {props.errorMsg}
            <button onClick={props.errorFunction}>{props.buttonText}</button>
        </div>
    )
}