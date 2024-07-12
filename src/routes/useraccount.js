import React from 'react';
import { Link } from 'react-router-dom';

const UserAccount = () => {

    return (
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor:'lightgray', height:'200px', alignItems:'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div style={{padding: '10px'}}>
                    <Link to="/quotes">List of Requested Quotations</Link>
                </div>
                <div style={{padding: '10px'}}>
                    <Link to="/purchases">List of Previous Purchases</Link>
                </div>
            </div>
        </div>
    )
}

export default UserAccount; 