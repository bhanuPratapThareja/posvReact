import React, { Component } from 'react';
import MaskedInput from 'react-maskedinput';

export default class CreateInput extends Component {

    constructor(){
        super();
        this.state = {}
    }

    handleChange = (e, qstId, type) => {
        let value = type === 'checkbox' ? e.target.checked : e.target.value;
        if (type === 'checkbox') {
            value === true ? value = 'Yes' : value = 'No'
        }
        if ((type === 'number' && value.length === 1 && value === '0') || (type === 'number' && isNaN(Number(value)))) {
            value = value.slice(0, -1)
        }
        if(type === 'text'){
            this.setState({ ...this.state, [qstId]: value })
        }
        var event = new CustomEvent("emitted", { "detail": { qstId, value, type } });
        document.dispatchEvent(event);
    }

    componentDidMount() {
        let { qstOptType, qstText, qstId, qstOpt, customerResponse } = this.props.question;
        if(qstOptType === 'text'){
            this.setState({ ...this.state, [qstId]: customerResponse}, () => {
                
            })
        }
    }

    render() {
        let { qstOptType, qstText, qstId, qstOpt, customerResponse } = this.props.question;
        
        const qst = qstText.split('^^^');

        const getRadioQuestions = qst.map((q, i) => {
            return <p key={i}>{`${q}`}<span className="required"> *</span></p>
        })

        switch (qstOptType) {
            case 'radio':
                return (
                    <fieldset>
                        {getRadioQuestions}
                        <input type="radio" name={qstId} value="Yes" required checked={this.props.question.customerResponse === 'Yes' ? true : false} onChange={(event) => this.handleChange(event, qstId)} /> <label>Yes</label>
                        <input type="radio" name={qstId} value="No" checked={this.props.question.customerResponse === 'No' ? true : false} onChange={(event) => this.handleChange(event, qstId)} /> <label>No</label>
                    </fieldset>
                )
            case 'text':
            case 'tel':
                return (
                    <fieldset>
                        <input
                            type={qstOptType}
                            name={qstId}
                            style={{ marginTop: '16px' }}
                            placeholder={qstText}
                            value={this.state.qstId ? this.state.qstId : customerResponse}
                            required
                            onChange={(event) => this.handleChange(event, qstId, qstOptType)} />
                    </fieldset>
                )
            case 'number':
                return (
                    <fieldset>
                        <input
                            type={'text'}
                            name={qstId}
                            pattern="/^\d*[1-9]\d*$/"
                            style={{ marginTop: '16px' }}
                            placeholder={qstText}
                            value={customerResponse}
                            required
                            onChange={(event) => this.handleChange(event, qstId, qstOptType)} />
                    </fieldset>
                )
            case 'dropdown':
                // console.log('field: ', field)
                const selectedValue = customerResponse ? customerResponse : 'default';
                return (
                    <fieldset>
                        <select name={qstId} style={{ marginTop: '16px', minWidth: 'auto' }} value={selectedValue} onChange={(event) => this.handleChange(event, qstId)}>
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
                            onChange={(event) => this.handleChange(event, qstId, 'checkbox')} />
                    </fieldset>
                )
            case 'textarea':
                return (
                    <fieldset onChange={(event) => this.handleChange(event, qstId)}>
                        <p>{qstText}<span className="required"> *</span></p>
                        <textarea rows={5} cols={30}></textarea>
                    </fieldset>
                )
            case 'dateYearMask':
                return (
                    <fieldset>
                        <MaskedInput style={{ marginTop: '16px' }} mask="11/1111" name={qstId} id={qstId} value={customerResponse} placeholder={qstText} onChange={(event) => this.handleChange(event, qstId, 'dateYearMask')} />
                    </fieldset>
                )
            default:
                return null
        }
    }
}


// export default function createInput(field) {
//     let { qstOptType, qstText, qstId, qstOpt, customerResponse } = field.question;
//     const qst = qstText.split('^^^');

//     const getRadioQuestions = qst.map((q, i) => {
//         return <p key={i}>{`${q}`}<span className="required"> *</span></p>
//     })


// }