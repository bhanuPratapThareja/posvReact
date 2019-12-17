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
import LinearProgress from '@material-ui/core/LinearProgress';

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
                    if (option.qstType === 'Secondary' && option.qstOptType === 'checkbox') {
                        this.manageCheckboxText()
                    }
                })
            }
        })
        setTimeout(() => {
            // console.log(this.state)
        }, 1000);
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

            this.setState({ questions: flattendArray, proceeding: false }, () => {
                this.manageCheckboxText()
            })
        } else {
            const newArray = questions.filter((currentValue, index, arr) => {
                return arr[index].qstPrtId !== qstId
            })
            this.setState({ questions: newArray, proceeding: false })
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
            let array = new Array();
            this.state.questions.forEach(question => {
                if (qId === question.qstPrtId) {
                    array.push(question)
                }
            })
            children.push(array)
        })

        children.forEach(child => {
            if (child.length > 1) {
                outer: for (let i = 0; i < child.length; i++) {
                    if (child[i].qstOptType === 'checkbox' && child[i].customerResponse === 'Yes') {
                        child.forEach(question => {
                            if (question.qstOptType === 'text') {
                                question.mandatory = false
                            }
                        })
                        break outer;
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
        setTimeout(() => {
            console.log('state: ', this.state.questions)
        }, 1000);
    }

    getQuestions = async (qstCatNamePrevious) => {
        await this.setState({ proceeding: true })
        const { url, body } = getApiData('getQuestions');
        qstCatNamePrevious ? body.request.payload.qstCatName = qstCatNamePrevious : body.request.payload.qstCatName = this.state.qstCatName;
        try {
            const response = await axios.post(url, body)
            const res = JSON.parse(JSON.stringify(response))
            this.handleRsponse(res)
        } catch (err) {
            console.log(err)
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
        const mandatoryArray = [];
        const customerResponseArray = [];

        this.state.questions.forEach(question => {
            if (question.mandatory === true && !question.customerResponse) mandatoryArray.push(question)
        })

        if (mandatoryArray.length > 0) {
            // console.log(mandatoryArray)
            this.setState({ allFieldsMandatoryError: true })
            return
        }

        this.state.questions.forEach(question => {
            if (question.customerResponse) customerResponseArray.push(question)
            if (question.mandatory === false) customerResponseArray.push('')
        })

        // console.log(customerResponseArray.length)
        // console.log(this.state.questions.length)

        if (customerResponseArray.length < this.state.questions.length) {
            this.setState({ allFieldsMandatoryError: true })
            return
        }
        await this.setState({ proceeding: true })
        const { url, body } = getApiData('saveCustomerResponse')
        const { qstCatName } = this.state;
        body.request.payload.qstCatName = qstCatName;
        body.request.payload.customerResponse.qstCatName = qstCatName;
        body.request.payload.customerResponse.qst = [...this.state.questions]
        try {
            const response = await axios.post(url, body)
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
        // if (this.state.proceeding) {
        //     return <Loader />
        // }

        const progressStyle = {
            visibility: this.state.proceeding ? 'visible' : 'hidden'
        }

        return (
            <>
                <LinearProgress style={progressStyle} />
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

                    {this.state.questions.length ? <div className="button_div">
                        {this.state.qstCatNamePrevious ?
                            <Button
                                variant="contained"
                                onClick={() => this.gotToPage('previous')}
                                className="default_button"
                                disabled={this.state.proceeding}>
                                Previous
                            </Button> : null}

                            <Button
                                variant="contained"
                                onClick={() => this.gotToPage('next')}
                                className="default_button"
                                disabled={this.state.proceeding}>
                                Next
                            </Button>
                    </div>: null}
                </div>
            </>
        )
    }
}