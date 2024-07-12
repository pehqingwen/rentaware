import React from 'react';
import { useLocation } from 'react-router-dom';

const Acknowledgement = () => {
    const location = useLocation();
    const requestType = location.state?.requestType || [];

    return (
        <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>
                <h1>Thank you</h1>
                <h3>Your {requestType} request is received.</h3>
            </div>
        </div>
    )
}

export default Acknowledgement; 
