import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Health1 from './Health-1/Health-1';
import Health2 from './Health-2/Health-2';
import Product from './Product/Product';
import Psm from './Psm/Psm';
import RpSales from './Rp_Sales/Rp_Sales';
import Cancer from './Cancer/Cancer';
import Button from '@material-ui/core/Button';
import './Customer_Feedback.css';
import { headers } from './../../api/headers';
import Loader from './../Loader/Loader';

export default class Customer_Feedback extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            parentQuestions: [],
            childQuestions: [],
            qstCatName: '',
            qstCatNameNext: '',
            qstCatNamePrevious: '',
            proceeding: false,
            allFieldsMandatoryError: false
        }
    }

    showMessageInScackbar = ({ showSnackbar, snackbarMsgType, snackbarMsg }) => {
        this.setState({ showSnackbar, snackbarMsgType, snackbarMsg })
    }

    componentDidMount() {
        const qstCatName = this.props.location.pathname.split('/')[2].toUpperCase();
        this.setState({ qstCatName }, () => {
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
        const questions = this.state.questions
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
            this.setState({ questions: flattendArray, proceeding: false })
        } else {
            const newArray = questions.filter((currentValue, index, arr) => {
                return arr[index].qstPrtId !== qstId
            })
            this.setState({ questions: newArray, proceeding: false })
        }
    }

    getQuestions = async (qstCatNamePrevious) => {
        await this.setState({ proceeding: true })
        const { url, body } = getApiData('getQuestions');
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.planCode = localStorage.getItem('planCode');
        qstCatNamePrevious ? body.request.payload.qstCatName = qstCatNamePrevious : body.request.payload.qstCatName = this.state.qstCatName;
        try {
            const response = await axios.post(url, body, { headers })
            const res = JSON.parse(JSON.stringify(response))
            this.handleRsponse(res)
        } catch (err) {
            console.log(err)
        }
    }

    handleRsponse = (response) => {
        if (response && !response.data.response.payload.customerResponse) {
            this.props.history.push('/declaration')
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
                if (!question.qstOptType && question.qstOptType === 'checkbox') {
                    question.customerResponse = 'No'
                }
                childQuestions.push(question)
            }
        })
        const { qstCatNamePrevious, qstCatName, qstCatNameNext } = response.data.response.payload;
        const path = qstCatName;

        this.props.history.push(path.toLowerCase());
        this.setState({
            questions: parentQuestions,
            parentQuestions,
            childQuestions,
            qstCatNamePrevious,
            qstCatName,
            qstCatNameNext,
        }, () => {
            this.state.questions.forEach(question => {
                setTimeout(() => {
                    this.manageChildren(question.qstId, question.customerResponse)
                }, 100);

            })
        })
    }

    submitAnswers = async () => {
        const mandatoryArray = [];
        this.state.questions.forEach(question => {
            if (question.customerResponse) mandatoryArray.push(question.customerResponse)
        })
        if (mandatoryArray.length < this.state.questions.length) {
            this.setState({ allFieldsMandatoryError: true })
            return
        }
        await this.setState({ proceeding: true })
        const { url, body } = getApiData('saveCustomerResponse')
        const { qstCatName } = this.state;
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        body.request.payload.qstCatName = qstCatName;
        body.request.payload.customerResponse.qstCatName = qstCatName;
        body.request.payload.customerResponse.qst = [...this.state.questions]
        try {
            const response = await axios.post(url, body, { headers })
            await this.setState({ proceeding: false, allFieldsMandatoryError: false })
            this.handleRsponse(response)
        } catch (err) {
            this.setState({ proceeding: false, allFieldsMandatoryError: false })
            console.log(err)
        }
    }

    gotToPage = (direction) => {
        if (direction === 'previous') {
            this.getQuestions(this.state.qstCatNamePrevious)
        } else {
            this.submitAnswers()
        }
    }

    getPageName(tag) {
        if (tag === 'HEALTH-1' || tag === 'HEALTH-2') {
            return 'Health'
        }
        return tag.toLowerCase();
    }

    render() {
        if (this.state.proceeding) {
            return <Loader />
        }


        return (
            <div className="cust_feedback--page">
                
                {this.state.qstCatName ? <div style={{ textAlign: 'center', textTransform: 'capitalize' }}>
                    {this.getPageName(this.state.qstCatName)} Related Questions
                    </div> : null}

                {this.state.qstCatName === 'HEALTH-1' ? <Health1
                    health1Questions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}

                {this.state.qstCatName === 'HEALTH-2' ? <Health2
                    health2Questions={this.state.questions}
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
                {this.state.qstCatName === 'CANCER' ? <Cancer
                    cancerQuestions={this.state.questions}
                    onUserAnswer={(value, qstId) => this.onUserAnswer(value, qstId)}
                /> : null}

                {this.state.allFieldsMandatoryError ? <div
                    className="required"
                    style={{ textAlign: 'center' }}
                >All fields are mandatory.</div> : null}

                <div className="button_div">
                    {this.state.qstCatNamePrevious ? <Button
                        variant="contained"
                        onClick={() => this.gotToPage('previous')}
                        className="default_button">
                        Previous
                    </Button> : null}

                    <Button
                        variant="contained"
                        onClick={() => this.gotToPage('next')}
                        className="default_button">
                        Next
                        </Button>
                </div>
            </div>
        )
    }
}