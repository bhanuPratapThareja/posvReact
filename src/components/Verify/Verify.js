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
        let url = '';
        switch (category) {
            case 'product':
                url = '/customer_feedback/product';
                break;
            case 'health':
                url = '/customer_feedback/health';
                break;
            case 'psm':
                url = '/customer_feedback/psm';
                break;
            case 'rpsales':
                url = '/customer_feedback/rpsales';
                break;
            case 'selfie':
                url = '/customer_feedback/product';
                break;
            case 'pdf':
                url = '/pdf';
                break;
        }
        this.props.history.push(`${url}`, { category });
    }

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