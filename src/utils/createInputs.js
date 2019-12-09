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
    console.log(field)
    const { qstOptType, qstText, qstId, qstOpt, rows, cols } = field.question;

    switch (qstOptType) {
        case 'radio':
            return (
                <fieldset>
                    <p>{qstText}<span className="required"> *</span></p>
                    <input type="radio" name={qstId} value="Yes" required checked={field.question.customerResponse === 'Yes' ? true : false} onChange={(event) => handleChange(event.target.value, qstId)} /> <label>Yes</label>
                    <input type="radio" name={qstId} value="No" checked={field.question.customerResponse === 'No' ? true : false}  onChange={(event) => handleChange(event.target.value, qstId)}/> <label>No</label>
                </fieldset>
            )
        case 'text':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span className="required"> *</span></p>
                    <input type="text" name={qstId} required />
                </fieldset>
            )
        case 'dropdown':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span className="required"> *</span></p>
                    <select name={qstId} selected={'default'}>
                        <option disabled>Please select one</option>
                        {qstOpt.map((el, i) => {
                            return <option key={i} value={qstOpt[i]}>{qstOpt[i]}</option>
                        })}
                    </select>
                </fieldset>
            )
        case 'checkbox':
            return (
                    <fieldset onChange={(event) => handleChange(event.target.checked, qstId, 'checkbox')}>
                        <p className="check-sec">{qstText}<span className="required"> *</span></p>
                        <input type="checkbox" name={qstId} className="regular-checkbox" />
                    </fieldset>
                )
        case 'textarea':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span className="required"> *</span></p>
                    <textarea rows={5} cols={30}></textarea>
                </fieldset>
            )
        default:
            return null
    }
}