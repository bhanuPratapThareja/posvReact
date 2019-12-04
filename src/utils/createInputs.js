import React from 'react';

const handleChange = (value, qstId) => {
    var event = new CustomEvent("emitted", { "detail": { qstId, value } });
    document.dispatchEvent(event);
}

export default function createInput(field) {
    const { qstOptType, qstText, qstId, qstOpt } = field.question;

    switch (qstOptType) {
        case 'radio':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span>*</span></p>
                    <input type="radio" name={qstId} value="Yes" /> Yes
                    <input type="radio" name={qstId} value="No" /> No
                </fieldset>
            )
        case 'Text Field':
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
        default:
            return null
    }
}