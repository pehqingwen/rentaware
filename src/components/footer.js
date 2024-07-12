import React from 'react';
import './navbar.css';
import Twitter from './images/twitter.svg';
import Facebook from './images/facebook.svg';
import Instagram from './images/instagram.svg';
import Whatsapp from './images/whatsapp.svg';
import Messenger from './images/messenger.svg';

const Footer = () => {
    return (
        <div className='whole-footer-style'>
            <div className='footer-style-alignment'>
                <div>
                    <h5>Connect</h5>
                    <img src={Facebook} alt='' className='change-on-hover' />
                    <img src={Twitter} alt='' className='change-on-hover' />
                    <img src={Instagram} alt='' className='change-on-hover' />
                </div>

                <div>
                    <h5>Contact</h5>
                    <img src={Whatsapp} alt='' className='change-on-hover' />
                    <img src={Messenger} alt='' className='change-on-hover' />
                </div>
            </div>

            <div style={{display: 'grid', justifyContent: 'center'}}>
                <h6 style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>Address</h6>
                <p>1 Changi Village Rd, Singapore 500001</p>
            </div>

            <hr></hr>

            <div className='footer-style-alignment'>
                <p className='change-on-hover'>Standard Terms & Conditions</p>
                <p className='change-on-hover'>Privacy Policy</p>
            </div>

            <div className='footer-copyright'>
                <p className='footer-copyright-no-spacing'>Copyright 2024 RentAWare Pte Ltd. All Rights Reserved</p>
            </div>

        </div>
    )
}

export default Footer;