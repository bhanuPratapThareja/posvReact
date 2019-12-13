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

    componentWillMount() {
        this.startLoad();
    }

    startLoad = () => {
        const txnId = this.props.txnId;
        if (!txnId) {
            this.setState({ verificationError: true, errorMsg: 'No transaction ID found' })
            return
        }
        this.verifyUser(txnId);
    }

    verifyUser = async txnId => {
        const { url, body } = getApiData('verifyUser');
        body.request.payload.posvRefNumber = txnId;
        try {
            const response = await axios.post(url, body, { headers })
            console.log(response)
            // return
            if (response.data.errorMessage) {
                this.setState({ verificationError: true, errorMsg: 'Invalid Transaction ID' })
                return
            }
            const { posvRefNumber, authToken, businessMsg, isLinkValid, category, planCode, chanelName } = response.data.response.payload;
            if (isLinkValid) {
                localStorage.clear();
                localStorage.setItem('posvRefNumber', posvRefNumber)
                localStorage.setItem('authToken', authToken)
                localStorage.setItem('planCode', planCode)
                localStorage.setItem('channelName', chanelName.toLowerCase())
                this.goToPage(category);
            } else {
                this.setState({ verificationError: true, errorMsg: businessMsg })
            }
        } catch (err) {
            this.setState({ verificationError: true })
        }
    }

    goToPage = category => {
        category = category.toLowerCase();
        let url = '';
        switch (category) {
            case 'selfie' || 'generate_otp' || 'pdf':
                url = `/${category}`;
                break;
            default:
                url = `/customer_feedback/${category}`
        }
        console.log(url, category)
        this.props.history.push(url, { category });
    }

    retryVerification = () => {
        console.log('retrying')
        this.setState({ verificationError: false })
        // this.startLoad();
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
                    {this.state.verificationError ?
                        <Error
                            errorMsg={this.state.errorMsg}
                            errorFunction={() => this.retryVerification()}
                            buttonText={"Retry"}
                        />
                        : null}
                </div>
            </div>
        )
    }
}

export default Verify