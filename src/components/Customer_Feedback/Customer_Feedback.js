import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Health from './Health/Health';
import Product from './Product/Product';
import Psm from './Psm/Psm';
import RpSales from './Rp_Sales/Rp_Sales';
import Button from '@material-ui/core/Button';

export default class Customer_Feedback extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            currentPath: ''
        }
    }
    componentDidMount() {
        this.startLoad()
    }

    startLoad = () => {
        const currentPath = (this.props.history.location.pathname.split('/')[2]).toUpperCase();
        this.setState({ currentPath }, () => {
            this.getQuestions();
        })
    }

    onUserAnswer = (qstId, value) => {
        const questions = [...this.state.questions]
        questions.forEach(option => {
            if (option.qstId === qstId) {
                option.customerResponse = value;
                this.setState({
                    questions
                }, () => {
                    console.log(questions)
                })
            }
        })
    }

    getQuestions = async () => {
        const { url, body } = getApiData('getQuestions');
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.qstCatName = this.state.currentPath;
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        try {
            const response = await axios.post(url, body, { headers })
            const questions = response.data.response.payload.customerResponse[0].qst;
            this.setState({ questions })
        } catch (err) {
            console.log(err)
        }
    }

    submitAnswers = async () => {
        const { url, body } = getApiData('saveCustomerResponse')
        const currentPath = this.state.currentPath;
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.customerResponse.qst = [...this.state.questions]
        body.request.payload.qstCatName = currentPath;
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        try {
            const response = await axios.post(url, body, { headers })
            console.log('currentPath: ', currentPath)
            if (currentPath === 'PRODUCT') {
                this.props.history.push('/customer_feedback/psm');
                this.loadNextPath()
            } else if (currentPath === 'PSM') {
                this.props.history.push('/customer_feedback/rpsales');
                this.loadNextPath()
            } else if (currentPath === 'RPSALES') {
                this.props.history.push('/generate_otp');
            }

        } catch (err) {
            console.log(err)
        }
    }

    loadNextPath = () => {
        this.setState({ questions: [] }, () => {
            this.startLoad();
        })
    }

    render() {
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    {this.state.currentPath}
                </div>
                {/* <Health /> */}
                {this.state.currentPath === 'PRODUCT' ? <Product
                    productQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}
                {this.state.currentPath === 'PSM' ? <Psm
                    psmQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}
                {this.state.currentPath === 'RPSALES' ? <RpSales
                    rpSalesQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}
                <Button
                    variant="contained"
                    onClick={this.submitAnswers}
                    className="default_button">
                    Submit
                </Button>
            </div>
        )
    }
}