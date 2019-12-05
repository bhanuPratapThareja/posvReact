import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Health from './Health/Health';
import Product from './Product/Product';
import Psm from './Psm/Psm';
import RpSales from './Rp_Sales/Rp_Sales';
import Button from '@material-ui/core/Button';
import { healthQuestions } from './Health/Health_Questions';
import './Customer_Feedback.css';

export default class Customer_Feedback extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            parentQuestions: [],
            childQuestions: [],
            currentPath: '',
            healthForm: undefined
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
                    if (qstId.length === 2) {
                        this.manageChildren(qstId, option.customerResponse)
                    }
                })
            }
        })
    }

    getQuestions = async () => {
        if (this.state.currentPath === 'HEALTH') {
            const questions = [...healthQuestions];
            let parentQuestions = [];
            let childQuestions = [];
            questions.forEach(question => {
                if (question.qstId.length === 2) {
                    parentQuestions.push(question)
                }
                if (question.qstId.length === 3) {
                    childQuestions.push(question)
                }
            })
            this.setState({ questions: parentQuestions, parentQuestions, childQuestions }, () => {
                this.setState({ healthForm: 'form1' })
            })
        } else {
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

    submitAnswers = async () => {
        const { url, body } = getApiData('saveCustomerResponse')
        const currentPath = this.state.currentPath;
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.customerResponse.qst = [...this.state.questions]
        body.request.payload.qstCatName = currentPath;
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        console.log(body)
        try {
            await axios.post(url, body, { headers })
            if (currentPath === 'HEALTH') {
                this.props.history.push('/customer_feedback/product');
                this.loadNextPath()
            }
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
            <div className="cust_feedback--page">
                <div style={{ textAlign: 'center' }}>
                    {this.state.currentPath}
                </div>

                {this.state.currentPath === 'HEALTH' ? <Health
                    healthQuestions={this.state.questions}
                    healthForm={this.state.healthForm}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}

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

                <div className="button_div">
                    <Button
                        variant="contained"

                        className="default_button">
                        Prev
                </Button>
                <Button
                        variant="contained"
                        onClick={this.submitAnswers}
                        className="default_button">
                        Submit
                </Button>
                    <Button
                        variant="contained"

                        className="default_button">
                        Next
                </Button>
                </div>
            </div>
        )
    }
}