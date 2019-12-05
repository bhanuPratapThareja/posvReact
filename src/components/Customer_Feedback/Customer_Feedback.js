import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Health from './Health/Health';
import Product from './Product/Product';
import Psm from './Psm/Psm';
import RpSales from './Rp_Sales/Rp_Sales';
import Button from '@material-ui/core/Button';
import './Customer_Feedback.css';
import { headers } from './../../api/headers';
import Icon from '@material-ui/core/Icon';

export default class Customer_Feedback extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            parentQuestions: [],
            childQuestions: [],
            qstCatName: 'PRODUCT',
            qstCatNameNext: '',
            qstCatNamePrevious: '',
            healthForm: 'form1'
        }
    }
    componentDidMount() {
        let { state } = this.props.location;
        this.setState({ qstCatName: 'product'.toUpperCase() }, () => {
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
                    if (option.qstType === 'Primary') {
                        this.manageChildren(qstId, option.customerResponse)
                    }
                })
            }
        })
    }

    manageChildren = (qstId, custResponse) => {
        const questions = [...this.state.questions];
        if (custResponse === 'Yes') {
            let childArray = []
            this.state.childQuestions.forEach(question => {
                if (question.qstPrtId === qstId) {
                    childArray.push(question)
                }
            })
            questions.forEach(question => {
                if (question.qstId === qstId) {
                    const index = questions.indexOf(question)
                    questions.splice(index + 1, 0, childArray)
                }
            })
            const flattendArray = [].concat.apply([], questions);
            this.setState({ questions: flattendArray })
        } else {
            const newArray = questions.filter((currentValue, index, arr) => {
                return arr[index].qstPrtId !== qstId
            })
            this.setState({ questions: newArray })
        }
    }

    getQuestions = async () => {
        const { url, body } = getApiData('getQuestions');
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.qstCatName = this.state.qstCatName;
        try {
            const response = await axios.post(url, body, { headers })
            const res = JSON.parse(JSON.stringify(response))
            this.handleRsponse(res)
        } catch (err) {
            console.log(err)
        }
    }

    handleRsponse = (response) => {
        console.log('response: ', response.data.response.payload.customerResponse)
        if (response && !response.data.response.payload.customerResponse) {
            console.log('testing')
            this.props.history.push('/generate_otp')
            return;
        }
        const questions = [...response.data.response.payload.customerResponse[0].qst];
        let parentQuestions = [];
        let childQuestions = [];
        questions.forEach(question => {
            if (question.qstType === 'Primary') {
                parentQuestions.push(question)
            }
            if (question.qstType === 'Secondary') {
                childQuestions.push(question)
            }
        })
        const { qstCatNamePrevious, qstCatName, qstCatNameNext } = response.data.response.payload;
        const path = qstCatName;

        let url = '';
        if (path === 'HEALTH-1') {
            url = '/customer_feedback/health';
            this.setState({ healthForm: 'form1' })
        } else if (path === 'PRODUCT') {
            url = '/customer_feedback/product';
        } else if (path === 'PSM') {
            url = '/customer_feedback/psm';
        } else if (path === 'RPSALES') {
            url = '/customer_feedback/rpsales';
        } else if (path === 'HEALTH-2') {
            url = '/customer_feedback/health';
            this.setState({ healthForm: 'form2' })
        }
        this.props.history.push(url);
        this.setState({
            questions: [...parentQuestions],
            parentQuestions,
            childQuestions,
            qstCatNamePrevious,
            qstCatName,
            qstCatNameNext,
        })
    }

    submitAnswers = async () => {
        const { url, body } = getApiData('saveCustomerResponse')
        const { qstCatName } = this.state;
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.qstCatName = qstCatName;
        body.request.payload.customerResponse.qstCatName = qstCatName;
        body.request.payload.customerResponse.qst = [...this.state.questions]
        try {
            const response = await axios.post(url, body, { headers })
            this.handleRsponse(response)
        } catch (err) {
            console.log(err)
        }
    }

    loadNextPath = () => {
        const path = this.state.qstCatName;
        let url = '';
        if (path === 'HEALTH-1') {
            url = '/customer_feedback/health';
        } else if (path === 'PRODUCT') {
            url = '/customer_feedback/product';
        } else if (path === 'PSM') {
            url = '/customer_feedback/psm';
        } else if (path === 'RPSALES') {
            url = '/customer_feedback/rpsales';
        } else if (path === 'GENERATE_OTP') {
            url = '/generate_otp';
        }
        this.props.history.push(url);
    }

    gotToPage = (direction) => {
        console.log(direction)
    }

    render() {
        return (
            <div className="cust_feedback--page">
                <div style={{ textAlign: 'center' }}>
                    {this.state.qstCatName}
                </div>

                {this.state.qstCatName === 'HEALTH-1' || this.state.qstCatName === 'HEALTH-2' ? <Health
                    healthQuestions={this.state.questions}
                    healthForm={this.state.qstCatName}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}

                {this.state.qstCatName === 'PRODUCT' ? <Product
                    productQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}
                {this.state.qstCatName === 'PSM' ? <Psm
                    psmQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}
                {this.state.qstCatName === 'RPSALES' ? <RpSales
                    rpSalesQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}

                <div className="button_div">
                    {this.state.qstCatNamePrevious ? <Icon
                        color="primary"
                        className="chevron"
                        onClick={() => this.gotToPage('previous')}
                    >chevron_left</Icon> : null}

                    <Button
                        variant="contained"
                        onClick={this.submitAnswers}
                        className="default_button">
                        Submit
                    </Button>

                    {this.state.qstCatNameNext ? <Icon
                        color="primary"
                        className="chevron"
                        onClick={() => this.gotToPage('next')}
                    >chevron_right</Icon> : null}
                </div>
            </div>
        )
    }
}