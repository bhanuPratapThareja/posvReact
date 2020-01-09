import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import CreateInput from '../../../utils/createInputs';

class Health2 extends Component {

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
                    {this.props.health2Questions.map(question => {
                        return (
                            <Field
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
            </>
        )
    }
}

export default reduxForm({
    form: 'health2Form'
})(Health2);