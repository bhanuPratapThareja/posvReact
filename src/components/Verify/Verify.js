import React, { Component } from 'react';
import axios from 'axios';
import './Verify.css';
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
        this.props.manageLoader(true)
        const { url, body } = getApiData('verifyUser');
        body.request.payload.posvRefNumber = txnId;
        try {
            const response = await axios.post(url, body);
            if (response.data.errorMessage) {
                this.props.manageLoader(false)
                this.setState({ verificationError: true, errorMsg: 'Invalid Transaction ID' })
                return
            }
            const { posvRefNumber, businessMsg, isLinkValid, category, planCode, chanelName } = response.data.response.payload;
            if (isLinkValid) {
                localStorage.clear();
                localStorage.setItem('posvRefNumber', posvRefNumber)
                localStorage.setItem('planCode', planCode)
                localStorage.setItem('channelName', chanelName.toLowerCase())
                this.goToPage(category);
            } else {
                this.props.manageLoader(false)
                this.setState({ verificationError: true, errorMsg: businessMsg })
            }
        } catch (err) {
            this.props.manageLoader(false)
            this.setState({ verificationError: true })
        }
    }

    goToPage = category => {
        category = category.toLowerCase();
        let url = '';
        switch (category) {
            case 'selfie' || 'generate_otp' || 'pdf':
                this.props.manageLoader(false)
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
                        {this.props.loading ? <div className="display_text">
                            Please wait...
                            </div> : null}
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