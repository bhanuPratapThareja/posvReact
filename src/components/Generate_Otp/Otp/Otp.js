import React from 'react';
import './Otp.css';
import { allowedOtpKeys } from './../../../utils/allowedOtpKeys';
import { getDevice } from './../../../utils/getDevice';

const Otp = props => {

    const onInputChange = (event, val) => {
        const keyCode = event.keyCode;
        event.persist();
        let inputs = document.getElementsByClassName('input_otp');
        inputs[val].value = '';
        if (!allowedOtpKeys.includes(keyCode)) {
            setTimeout(() => {
                inputs[val].value = '';
            }, 10);
            return
        }
        setTimeout(() => {
            if (val < 3 && keyCode !== 8) {
                inputs[val].value = event.target.value;
                inputs[val + 1].focus();
            }
            if (val > 0 && keyCode === 8) {
                inputs[val].value = '';
                inputs[val - 1].focus();
            }
        }, 50)

    }

    const device = getDevice();
    let type;

    if(device === 'mobile'){
        type = 'tel';
    } else {
        type = 'number';
    }

    return (
        <>
            <input type={type} maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 0)} />
            <input type={type} maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 1)} />
            <input type={type} maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 2)} />
            <input type={type} maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 3)} />
        </>
    )
}

export default Otp;