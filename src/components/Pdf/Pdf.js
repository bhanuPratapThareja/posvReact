import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import { appHeaders } from './../../api/headers';
import Loader from '../Loader/Loader';
import './Pdf.css';

export default class Pdf extends Component {
    constructor() {
        super();
        this.state = { 
            loading: true,
            pdfFile: undefined 
        }
    }

    componentDidMount() {
         this.getPdf();
    }

    getPdf = async () => {
        const { url, body } = getApiData('pdf');
        console.log(url, body)
        body.request.payload.posvRefNumber = '1234567';
        body.request.payload.authToken = localStorage.getItem('authToken');
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        try {
            const response = await axios.post(url, body, { headers })
            console.log(response)
            let { transcriptFile: pdfFile, extension: ext } = response.data.response.payload
            pdfFile = `data:image/png;base64,${pdfFile}.jpg`;
            console.log(pdfFile);
            this.setState({ loading: false, pdfFile })
        } catch (err) {
            console.log(err)
            this.setState({ loading: false })
        }
    }

    render() {
        return (
            <div className="pdf_page">
                {this.state.loading ? <>
                    <Loader />
                    <div className="loading_text">
                        Please wait ...
                    </div>
                </> : null}
                {this.state.pdfFile ? <>
                    <img src={this.state.pdfFile} alt="PDF" width="300" height="200" />
                </> : null}
            </div>
        )
    }
}