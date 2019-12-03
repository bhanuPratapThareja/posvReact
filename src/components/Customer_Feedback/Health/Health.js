import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadHealthQuestions } from './../../../actions/health/actions_health';
import './Health.css';
import Button from '@material-ui/core/Button';
import Form1 from './Form1/Form1';
import Form2 from './Form2/Form2';

class Health extends Component {

    constructor() {
        super();
        this.state = {
            showForm: 'form1',
            showDiabetesExtraQuestions: false,
            showHypertentionExtraQuestions: false,
             
        }
    }

    componentDidMount() {
        this.props.loadHealthQuestions()
    }

    getFromValues = () => {
        console.log(this.state)
    }

    handleChange = (e, tag) => {
        console.log(tag)
        this.setState({
            [tag]: e.target.value
        }, () => {
            console.log(this.state)
            if(this.state.diabetes === "yes"){
                this.setState({showDiabetesExtraQuestions: true })
            }
            if(this.state.diabetes === "no" || this.state.diabetes === undefined){
                this.setState({showDiabetesExtraQuestions: false })
            }
            if(this.state.hypertension === "yes"){
                this.setState({showHypertentionExtraQuestions: true })
            }
        })
    }

    gotToPrevious = () => {
        this.setState({ showForm: 'form1' })
    }

    goToNext = () => {
        this.setState({ showForm: 'form2' })
    }

    render() {
        return (
            <div className="health_page">
                <div>
                    Health Related Questions
                </div>
                <div>
                    Have you ever had or received medical advice or treatment or advised to undergo medical tests for any of the following?
                </div>

                {this.state.showForm == 'form1' ? <Form1
                    showDiabetesExtraQuestions={this.state.showDiabetesExtraQuestions}
                    showHypertentionExtraQuestions={this.state.showHypertentionExtraQuestions}
                    handleChange={this.handleChange} 
                /> : null}
                
                {this.state.showForm == 'form2' ? <Form2 handleChange={this.handleChange} /> : null}

                <p>Pls answer all the mandatory questions (marked with *)</p>
                {<Button
                    variant="contained"
                    onClick={this.gotToPrevious}
                    className="default_button">
                    Prev
                </Button>}
                <Button
                    variant="contained"
                    onClick={this.goToNext}
                    className="default_button">
                    Next
                </Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loadHealthQuestions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Health)