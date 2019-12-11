import React from 'react';
import './Otp.css';
import { allowedOtpKeys } from './../../../utils/allowedOtpKeys';

const Otp = props => {
    
    const onInputChange = (event, val) => {
        const keyCode = event.keyCode;
        console.log('keyCode: ', keyCode)
        if(!allowedOtpKeys.includes(keyCode)){
            return
        }
        event.persist();
        if(keyCode === 37 || keyCode === 39){
            return
        }
        let inputs = document.getElementsByClassName('input_otp');
        inputs[val].value = '';
        setTimeout(() => {
            if (val < 3 && keyCode !== 8) {
                inputs[val].value = event.target.value;
                inputs[val + 1].focus();
            }
            if(val > 0 && keyCode === 8) {
                inputs[val].value = '';
                inputs[val - 1].focus();
            }
        }, 50)
    }

        return (
            <>
                <input type="number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 0)} />
                <input type="number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 1)} />
                <input type="number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 2)} />
                <input type="number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" disabled={props.submitting} className="input_otp" onKeyDown={event => onInputChange(event, 3)} />
            </>
        )
}

export default Otp;