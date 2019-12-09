import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import { headers } from './../../api/headers';
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
        body.request.payload.posvRefNumber = this.props.txnId;
        body.request.payload.authToken = localStorage.getItem('authToken');
        try {
            const res = await axios.post(url, body, { headers })
            const { transcriptFile } = res.data.response.payload;
            const opened = window.open('', '_self');
            opened.document.write(transcriptFile);
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
                    <div id="pdf"></div>

                </> : null}
                {this.state.pdfFile ? <>
                    {/* <img src={this.state.pdfFile} alt="PDF" width="300" height="200" />
                    <embed src={this.state.pdfFile} width="800px" height="2100px" /> */}
                </> : null}
            </div>
        )
    }
}
