import React from 'react';

const handleChange = (value, qstId, type) => {
    if (type === 'checkbox') {
        value === true ? value = 'Yes' : value = 'No'
    }
    var event = new CustomEvent("emitted", { "detail": { qstId, value } });
    document.dispatchEvent(event);
}


export default function createInput(field) {
    let { qstOptType, qstText, qstId, qstOpt, customerResponse } = field.question;
    const qst = qstText.split('^^^');

    const getRadioQuestions = qst.map((q, i) => {
        return <p key={i}>{`${q}`}<span className="required"> *</span></p>
    })

    switch (qstOptType) {
        case 'radio':
            return (
                <fieldset>
                    {getRadioQuestions}
                    <input type="radio" name={qstId} value="Yes" required checked={field.question.customerResponse === 'Yes' ? true : false} onChange={(event) => handleChange(event.target.value, qstId)} /> <label>Yes</label>
                    <input type="radio" name={qstId} value="No" checked={field.question.customerResponse === 'No' ? true : false} onChange={(event) => handleChange(event.target.value, qstId)} /> <label>No</label>
                </fieldset>
            )
        case 'text':
        case 'tel':
        case 'number':
            return (
                <fieldset>
                    <input type={qstOptType} name={qstId} style={{ marginTop: '16px' }} placeholder={qstText} value={customerResponse} required onChange={(event) => handleChange(event.target.value, qstId)} />
                </fieldset>
            )
        case 'dropdown':
            // console.log('field: ', field)
            const selectedValue = customerResponse ? customerResponse : 'default';
            return (
                <fieldset>
                    <select name={qstId} style={{ marginTop: '16px' }} value={selectedValue} onChange={(event) => handleChange(event.target.value, qstId)}>
                        <option value="default" disabled hidden>{qstText}</option>
                        {qstOpt.map((el, i) => {
                            return <option key={i} value={qstOpt[i]}>{qstOpt[i]}</option>
                        })}
                    </select>
                </fieldset>
            )
        case 'checkbox':
            customerResponse = !customerResponse ? 'No' : customerResponse
            return (
                <fieldset>
                    <p className="check-sec">{qstText}<span className="required"> *</span></p>
                    <input
                        type="checkbox"
                        name={qstId}
                        className="regular-checkbox"
                        value={customerResponse}
                        checked={customerResponse === 'Yes' ? true : false}
                        onChange={(event) => handleChange(event.target.checked, qstId, 'checkbox')} />
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