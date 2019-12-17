import React, { Component } from 'react';
import axios from 'axios';
import { getApiData } from './../../api/api';
import './Pdf.css';

export default class Pdf extends Component {
    constructor() {
        super();
        this.state = {
            errorMsg: ''
        }
    }

    componentDidMount() {
        this.getPdf();
    }

    getPdf = async () => {
        this.props.manageLoader(true)
        const { url, body } = getApiData('pdf');
        body.request.payload.posvRefNumber = this.props.txnId;
        try {
            const res = await axios.post(url, body)
            const { response } = res.data;

            if (response && response.msgInfo && response.msgInfo.msgCode == 500) {
                this.setState({ errorMsg: response.msgInfo.msgDescription })
                return
            }
            const { transcriptFile } = res.data.response.payload;
            const opened = window.open('', '_self');
            opened.document.write(transcriptFile);
        } catch (err) {
            console.log(err)
            // this.setState({ loading: false })
        } finally {
            this.props.manageLoader(false)
        }
    }

    render() {
        return (
            <>
                {this.props.loading ? <>
                    <div className="display_text">
                        Please wait ...
                    </div>
                </> : null}
                {this.state.errorMsg ? <div className="display_text">
                    {this.state.errorMsg}
                </div> : null}
            </>
        )
    }
}
