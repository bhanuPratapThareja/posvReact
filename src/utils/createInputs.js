import React from 'react';

const handleChange = (value, qstId) => {
    var event = new CustomEvent("emitted", { "detail": { qstId, value } });
    document.dispatchEvent(event);
}

export default function createInput(field) {
    const { qstOptType, qstText, qstId } = field.question;
    switch (qstOptType) {
        case 'radio':
            return (
                <fieldset onChange={(event) => handleChange(event.target.value, qstId)}>
                    <p>{qstText}<span>*</span></p>
                    <input type="radio" name={qstId} value="Yes" /> Yes
                    <input type="radio" name={qstId} value="No" /> No
                </fieldset>
            )
    }
}