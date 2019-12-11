import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import createInput from './../../../utils/createInputs';

class Health1 extends Component {

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
        if (!this.props.health1Questions || this.props.health1Questions.length == '0') {
            return (
                <div>Please wait</div>
            )
        }
        return (
            <>
                <div className="heading one">
                    Have you ever had or received medical advice or treatment or advised to undergo medical tests for any of the following?
                </div>
                <form>
                    {this.props.health1Questions.map(question => {
                        return (
                            <Field
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
    form: 'health1Form'
})(Health1);