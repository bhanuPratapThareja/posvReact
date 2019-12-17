import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import createInput from './../../../utils/createInputs';

class Cancer extends Component {

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
            <>
                <div className="heading one">
                    Have you ever had or received medical advice or treatment or advised to undergo medical tests for any of the following?
                </div>
                <form>
                    {this.props.cancerQuestions.map(question => {
                        return (
                            <Field
                                label="Label"
                                name={question.qstId}
                                type={question.qstOptType}
                                key={question.qstId}
                                question={question}
                                component={createInput}
                                customProps={this.props.onUserAnswer}
                            />
                        )
                    })}
                </form>
            </>
        )
    }
}

export default reduxForm({
    form: 'cancerForm'
})(Cancer);