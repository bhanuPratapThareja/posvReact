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
            allFieldsMandatoryError: false
        }
    }

    showMessageInScackbar = ({ showSnackbar, snackbarMsgType, snackbarMsg }) => {
        this.setState({ showSnackbar, snackbarMsgType, snackbarMsg })
    }

    componentDidMount() {
        console.log(this.props)
        const qstCatName = this.props.location.pathname.split('/')[2].toUpperCase();
        console.log('qstCatName: ', qstCatName)
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
                    if (option.qstType === 'Secondary' && (option.qstOptType === 'checkbox' || option.qstOptType === 'radio')) {
                        this.manageCheckboxText()
                    }
                })
            }
        })
        // setTimeout(() => {
        //     console.log(this.state)
        // }, 1000);
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

            this.setState({ questions: flattendArray }, () => {
                this.manageCheckboxText()
            })
        } else {
            const newArray = questions.filter((currentValue, index, arr) => {
                return arr[index].qstPrtId !== qstId
            })
            this.setState({ questions: newArray })
        }

        setTimeout(() => {
            // console.log(this.state.questions)
        }, 1000);
    }

    manageCheckboxText = () => {
        let children = [];
        let textParents = [];
        this.state.questions.forEach(question => {
            if (question.qstType && question.qstOptType === 'text') {
                textParents.push(question.qstPrtId)
            }
        })

        textParents.forEach(qId => {
            let array = [];
            this.state.questions.forEach(question => {
                if (qId === question.qstPrtId) {
                    array.push(question)
                }
            })
            children.push(array)
        })

        children.forEach(child => {
            if (child.length > 1) {
                for (let i = 0; i < child.length; i++) {
                    if ((child[i].qstOptType === 'checkbox' && child[i].customerResponse && child[i].customerResponse === 'Yes') || 
                        (child[i].qstOptType === 'radio' && child[i].customerResponse && child[i].customerResponse === 'No')) {
                            
                        child.forEach(question => {
                            if (question.qstOptType === 'text') {
                                question.mandatory = false
                            }
                        })
                        break;
                    } else {
                        child.forEach(question => {
                            if (question.qstOptType === 'text') {
                                question.mandatory = true
                            }
                        })
                    }
                }
            }
        })
    }

    getQuestions = async (qstCatNamePrevious) => {
        this.props.manageLoader(true)
        const { url, body } = getApiData('getQuestions');
        qstCatNamePrevious ? body.request.payload.qstCatName = qstCatNamePrevious : body.request.payload.qstCatName = this.state.qstCatName;
        try {
            const response = await axios.post(url, body)
            const res = JSON.parse(JSON.stringify(response))
            this.handleRsponse(res)
        } catch (err) {
            console.log(err)
        } finally {
            this.props.manageLoader(false)
        }
    }

    handleRsponse = (response) => {
        if (response && !response.data.response.payload.customerResponse) {
            if (localStorage.getItem('channelName').toLowerCase() === 'x') {
                this.props.history.push('/declaration')
            } else {
                this.props.history.push('/generate_otp')
            }
            return;
        }
        const questions = [...response.data.response.payload.customerResponse[0].qst];
        // console.log('questions:', questions)
        let parentQuestions = [];
        let childQuestions = [];
        questions.forEach(question => {
            if (question.qstType === 'Primary') {
                parentQuestions.push(question)
            }
            if (question.qstType === 'Secondary') {
                if (question.qstOptType && question.qstOptType === 'checkbox') {
                    if (!question.customerResponse || question.custResponse === 'No') {
                        question.customerResponse = 'No'
                    } else if (question.customerResponse && question.customerResponse === 'Yes') {
                        question.customerResponse = 'Yes'
                    }
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
            // console.log(this.state)
            this.state.questions.forEach(question => {
                setTimeout(() => {
                    this.manageChildren(question.qstId, question.customerResponse)
                }, 100);

            })
        })
    }

    submitAnswers = async () => {
        this.setState({ allFieldsMandatoryError: false })
        const mandatoryArray = [];
        const customerResponseArray = [];

        this.state.questions.forEach(question => {
            if (question.mandatory === true && !question.customerResponse) mandatoryArray.push(question)
        })
        console.log(mandatoryArray)
        if (mandatoryArray.length > 0) {
            this.setState({ allFieldsMandatoryError: true })
        }

        this.state.questions.forEach(question => {
            if (question.customerResponse) customerResponseArray.push(question)
            if (question.mandatory === false) customerResponseArray.push('')
        })

        console.log(customerResponseArray.length)
        console.log(this.state.questions.length)

        if (customerResponseArray.length < this.state.questions.length) {
            this.setState({ allFieldsMandatoryError: true })
            return
        }
   
        const { url, body } = getApiData('saveCustomerResponse')
        const { qstCatName } = this.state;
        body.request.payload.qstCatName = qstCatName;
        body.request.payload.customerResponse.qstCatName = qstCatName;
        body.request.payload.customerResponse.qst = [...this.state.questions]
        try {
            this.props.manageLoader(true)
            const response = await axios.post(url, body)
            this.handleRsponse(response)
        } catch (err) {
            console.log(err)
        } finally {
            this.props.manageLoader(false)
            this.setState({ allFieldsMandatoryError: false })
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


        return (
            <>
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
                        style={{ textAlign: 'center', marginTop: '1rem' }}
                    >All fields are mandatory.</div> : null}

                    {this.state.questions.length ? <div className="button_div">
                        {this.state.qstCatNamePrevious ?
                            <Button
                                variant="contained"
                                onClick={() => this.gotToPage('previous')}
                                className="default_button"
                                disabled={this.props.loading}>
                                Previous
                            </Button> : null}

                            <Button
                                variant="contained"
                                onClick={() => this.gotToPage('next')}
                                className="default_button"
                                disabled={this.props.loading}>
                                Next
                            </Button>
                    </div>: null}
                </div>
            </>
        )
    }
}