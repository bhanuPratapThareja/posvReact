import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loader from './../Loader/Loader';
import { getQuestions } from './../../actions/questionnair/actions_questionnair';

class Questionnair extends Component {

    constructor(){
        this.state = {
            proceeding: false,
            questions: [],
            parentQuestions: [],
            childQuestions: [],
            allFieldsMandatoryError: false
        }
    }

    componentDidMount() {
        const qstCatName = this.props.location.pathname.split('/')[2].toUpperCase();
        this.setState({ qstCatName }, () => {
            this.getQuestions();
        })
    }

    getQuestions = () => {
        this.setState({ proceeding: true })
        this.props.getQuestions()
    }

    render() {
        if (this.state.proceeding) {
            return <Loader />
        }
    }
}

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getQuestions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnair);