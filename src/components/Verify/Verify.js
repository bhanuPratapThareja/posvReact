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
        const txnId = window.location.search.split("=")[1];
        this.setState({ txnId }, () => {
            this.verifyUser(txnId);
        })
    }

    verifyUser = async txnId => {
        const { url, body } = getApiData('verifyUser');
        // body.request.payload.posvRefNumber = txnId;
        try {
            const response = await axios.post(url, body, { headers })
            console.log('reaponse: ', response)
            if(response.data.response.payload.isLinkValid){
                localStorage.setItem('posvRefNumber', response.data.response.payload.posvRefNumber)
                // this.props.history.push('/selfie')
            } else {
                this.setState({ verificationError: true })    
            }
            
        } catch (err) {
            this.setState({ verificationError: true })
        }
    }

    retryVerification = () => {
        this.setState({ verificationError: false })  
        this.startLoad();
    }

    render() {
        return (
            <div className="verify_user">
                {!this.state.verificationError ? <div>
                    <Loader />
                    <div>
                        Please wait ...
                    </div>
                </div>: null}
                {this.state.verificationError ? <div>
                    <Error
                        errorMsg={"Error"}
                        errorFunction={this.retryVerification}
                        buttonText={"Retry"}
                    />
                </div> : null}
            </div>
        )
    }
}

export default Verify