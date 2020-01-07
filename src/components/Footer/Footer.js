import React from 'react';
import { footer } from './../../images/images';
import './Footer.css';

export default function Footer() {
    return (
        <div className="footerWrapper">
            <img src={footer} alt="Footer" className="footer_img" />
        </div>
    )
}