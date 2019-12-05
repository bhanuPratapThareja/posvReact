import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import createInput from './../../../utils/createInputs';

class Cancer extends Component {
    
    componentDidMount() {
        console.log('cancer mounter')
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
        if (!this.props.cancerQuestions || this.props.cancerQuestions.length == '0') {
            return (
                <div>Please wait</div>
            )
        }
        return (
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
        )
    }
}

export default reduxForm({
    form: 'cancerForm'
})(Cancer);