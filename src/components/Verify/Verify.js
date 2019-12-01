import React, { Component } from 'react';
import axios from 'axios';
import { verifyHeader, appHeaders } from './../../api/headers';
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
        if(!txnId){
            this.props.history.push('/customer_feedback/health');
            // this.setState({ verificationError: true, errorMsg: 'No transaction ID found' })
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
            const response = await axios.post(url, body, { headers: verifyHeader })
            console.log(response)
            if(response.data.errorMessage){
                this.setState({ verificationError: true, errorMsg: 'Invalid Transaction ID' })
                return
            }
            const { posvRefNumber, authToken, businessMsg, isLinkValid } = response.data.response.payload;
            if (isLinkValid) {
                localStorage.setItem('posvRefNumber', posvRefNumber)
                localStorage.setItem('authToken', authToken)
                appHeaders.headers = authToken;
                this.props.history.push('/generate_otp');
            } else {
                this.setState({ verificationError: true, errorMsg: businessMsg })
            }
        } catch (err) {
            console.log(err)
            this.setState({ verificationError: true })
        }
    }

    retryVerification = () => {
        console.log('test')
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