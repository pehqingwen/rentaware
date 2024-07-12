import React from 'react';
import { Link } from 'react-router-dom';

const Notification = () => {
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h2>Successful Registration!</h2>
        <Link to='/'>
            <span>Go to Login</span>
        </Link>
    </div>
}

export default Notification; 