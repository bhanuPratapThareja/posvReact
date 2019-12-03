import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import Health from './Health/Health';

export default class Customer_Feedback extends Component {
    componentDidMount() {
        this.getQuestions();
    }

    getQuestions = async () => {
        const { url, body } = getApiData('getQuestions');
        body.request.payload.posvRefNumber = localStorage.getItem('posvRefNumber');
        body.request.payload.authToken = localStorage.getItem('authToken');
        console.log(url, body)
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        try {
            const response = await axios.post(url, body, { headers })
            console.log(response)
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        return (
            <div>
                <Health />
            </div>
        )
    }
}