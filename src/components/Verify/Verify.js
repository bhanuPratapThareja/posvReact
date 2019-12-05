import React, { Component } from 'react';
import axios from 'axios';
import { headers } from './../../api/headers';
import './Verify.css';
import Loader from './../Loader/Loader';
import { getApiData } from './../../api/api';
import Error from './../Error/Error';

class Verify extends Component {
    constructor() {
        super();
        this.state = {
            txnId: undefined,
            verificationError: false,
            errorMsg: undefined
        }
    }

    componentDidMount() {
        this.startLoad();
        // this.props.history.push({ pathname: 'verify_user', search: '?color=blue'})
    }

    startLoad = () => {
        const txnId = this.props.txnId;
        if (!txnId) {
            this.setState({ verificationError: true, errorMsg: 'No transaction ID found' })
            return
        }
        this.setState({ txnId }, () => {
            this.verifyUser(txnId);
        })
    }

    verifyUser = async txnId => {
        const { url, body } = getApiData('verifyUser');
        body.request.payload.posvRefNumber = txnId;
        try {
            const response = await axios.post(url, body, { headers })
            if (response.data.errorMessage) {
                this.setState({ verificationError: true, errorMsg: 'Invalid Transaction ID' })
                return
            }
            const { posvRefNumber, authToken, businessMsg, isLinkValid, category } = response.data.response.payload;
            if (isLinkValid) {
                localStorage.setItem('posvRefNumber', posvRefNumber)
                localStorage.setItem('authToken', authToken)
                this.goToPage(category);
            } else {
                this.setState({ verificationError: true, errorMsg: businessMsg })
            }
        } catch (err) {
            this.setState({ verificationError: true })
        }
    }

    goToPage = category => {
        let path = '/customer_feedback/';
        let url;
        switch (category) {
            case 'pdf':
                url = '/pdf';
                break;
            default:
                url = `/customer_feedback/product`

        }
        this.props.history.push(`${url}`, { category });
    }

    // goToUrl = category => {
    //     let path = '/customer_feedback';
    //     let url;
    //     switch (category) {
    //         case 'pdf':
    //             url = '/pdf';
    //             break;
    //         default:
    //             const product = 'product'
    //             url = `${path}?questionnair=${product}`

    //     }
    //     this.props.history.push(url);
    // }

    retryVerification = () => {
        this.setState({ verificationError: false })
        this.startLoad();
    }

    render() {
        return (
            <div className="cstm-wrap">
                <div className="verify_user">
                    {!this.state.verificationError ? <div>
                        <Loader />
                        <div className="loading_text">
                            Please wait ...
                        </div>
                    </div> : null}
                    {this.state.verificationError ? <div>
                        <Error
                            errorMsg={this.state.errorMsg}
                            errorFunction={this.retryVerification}
                            buttonText={"Retry"}
                        />
                    </div> : null}
                </div>
            </div>
        )
    }
}

export default Verify