import React, { Component } from 'react';
import './Health.css';
import Button from '@material-ui/core/Button';
import Form1 from './Form1/Form1';
import Form2 from './Form2/Form2';

class Health extends Component {
    render() {
        console.log(this.props)
        if (!this.props.healthQuestions || this.props.healthQuestions.length == '0') {
            return (
                <div>Please wait</div>
            )
        }

        return (
            <div className="health_page">
                <div className="heading">
                    Health Related Questions
                </div>
                <div className="heading one">
                    Have you ever had or received medical advice or treatment or advised to undergo medical tests for any of the following?
                </div>

                {this.props.healthQuestions && this.props.healthQuestions.length > 0 ? <>
                    {this.props.healthForm === 'HEALTH-1' ? <Form1
                        healthQuestions={this.props.healthQuestions}
                        onUserAnswer={(value, qstId) => this.props.onUserAnswer(value, qstId)}
                    /> : null}

                    {this.props.healthForm === 'HEALTH-2' ? <Form2
                        healthQuestions={this.props.healthQuestions}
                        onUserAnswer={(value, qstId) => this.props.onUserAnswer(value, qstId)}
                    /> : null}
                </> : null}

                <p>Pls answer all the mandatory questions (marked with *)</p>
            </div>
        )
    }
}

export default Health