import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import CreateInput from '../../../utils/createInputs';

class RpSales extends Component {
    
    componentDidMount() {
        document.addEventListener('emitted', this.updateFunction)
    }

    componentWillUnmount() {
        document.removeEventListener('emitted', this.updateFunction)
    }

    updateFunction = (event) => {
        const { qstId, value } = event.detail;
        this.props.onUserAnswer(qstId, value)
    }

    render() {
        return (
            <form>
                {this.props.rpSalesQuestions.map(question => {
                    return (
                        <Field
                            label="Label"
                            name={question.qstId}
                            type={question.qstOptType}
                            key={question.qstId}
                            question={question}
                            component={CreateInput}
                            customProps={this.props.onUserAnswer}
                        />
                    )
                })}
            </form>
        )
    }
}

export default reduxForm({
    form: 'rpSalesForm'
})(RpSales);