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
            if (response.data && response.data.errorMessage) {
                throw(response.data.errorMessage)
            }
            const { posvRefNumber, businessMsg, isLinkValid, category, planCode, chanelName: channelName } = response.data.response.payload;
            if(!planCode || !channelName){
               throw ('Invalid Transaction ID')
            }
            if (isLinkValid) {
                localStorage.clear();
                localStorage.setItem('posvRefNumber', posvRefNumber)
                localStorage.setItem('planCode', planCode)
                localStorage.setItem('channelName', channelName.toLowerCase())
                this.goToPage(category);
            } else {
                throw(businessMsg)
            }
        } catch (errorMsg) {
            this.props.manageLoader(false)
            this.setState({ verificationError: true, errorMsg })
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
                            buttonText={"Retry"}
                        />
                        : null}
                </div>
            </div>
        )
    }
}

export default Verify