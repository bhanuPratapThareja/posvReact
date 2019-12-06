import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';


const handleChange = (value, qstId, type) => {
    if(type === 'checkbox'){
        value === true ? value = 'Yes' : value = 'No'
    }
    var event = new CustomEvent("emitted", { "detail": { qstId, value } });
    document.dispatchEvent(event);
}


export default function createInput(field) {

    const { qstOptType, qstText, qstId, qstOpt, rows, cols } = field.question;

    switch (qstOptType) {
        case 'radio':
            return (

                // <FormControl component="fieldset" onChange={(event) => handleChange(event.target.value, qstId)}>
                //     <FormLabel component="legend">{qstText}</FormLabel>
                //         Yes <Radio name={qstId} value="Yes" />
                //         No <Radio  name={qstId} value="No" />
                // </FormControl>



                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span>*</span></p>
                    <input type="radio" name={qstId} value="Yes" /> <label>Yes</label>
                    <input type="radio" name={qstId} value="No" /> <label>No</label>
                </fieldset>
            )
        case 'text':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span>*</span></p>
                    <input type="text" name={qstId} />
                </fieldset>
            )
        case 'dropdown':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span>*</span></p>
                    <select name={qstId} selected={'default'}>
                        <option value={'default'}>Please select one</option>
                        {qstOpt.map((el, i) => {
                            return <option key={i} value={qstOpt[i]}>{qstOpt[i]}</option>
                        })}
                    </select>
                </fieldset>
            )
        case 'checkbox':
            return (
                    <fieldset onChange={(event) => handleChange(event.target.checked, qstId, 'checkbox')}>
                        <p className="check-sec">{qstText}<span>*</span></p>
                        <input type="checkbox" name={qstId} className="regular-checkbox" />
                    </fieldset>
                )
        case 'textarea':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span>*</span></p>
                    <textarea rows={5} cols={30}></textarea>
                </fieldset>
            )
        default:
            return null
    }
}