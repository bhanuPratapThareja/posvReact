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
            loading: true
        }
    }

    componentDidMount() {
        this.getPdf();
    }

    getPdf = async () => {
        const { url, body } = getApiData('pdf');
        body.request.payload.posvRefNumber = this.props.txnId;
        try {
            const res = await axios.post(url, body, { headers })
            const { transcriptFile } = res.data.response.payload;
            const opened = window.open('', '_self');
            opened.document.write(transcriptFile);
        } catch (err) {
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
            </div>
        )
    }
}
