import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getQuestions } from './../../actions/questionnair/actions_questionnair';

class Questionnair extends Component {

    componentDidMount() {
        this.props.getQuestions('PRODUCT')
    }
    render() {
        return (
            <>
                <p>Questionnair</p>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return state
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getQuestions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Questionnair);