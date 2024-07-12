import React, { useEffect, useState } from 'react';
import './wishlist.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {

    const navigate = useNavigate();
    const [storedData, setStoredData] = useState([]);

    useEffect(() => {
        setStoredData(JSON.parse(sessionStorage.getItem('wishlistarray')));
    }, [])

    const cancelItemWishlist = (index) => {
        const newArray = storedData.filter((item, idx) => idx !== index);
        setStoredData(newArray);
        sessionStorage.setItem('wishlistarray', JSON.stringify(newArray));
    }

    const thereIsProducts = () => {
        if (storedData === null) {
            return false;
        }
        return storedData.length > 0;
    }

    const removeAllItemsWishlist = () => {
        sessionStorage.removeItem('wishlistarray');
        setStoredData(JSON.parse(sessionStorage.getItem('wishlistarray')));
    }

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const closeNotifyPopup = () => {
        setIsPopupOpen(false);
    }

    const checkForLoginStatusQuoteRequest = () => {
        if (localStorage.getItem('username') !== null) {
            requestQuotation();
        } else {
            navigate('/login');
        }
    }

    const requestQuotation = async () => {
        const wishlist = JSON.parse(sessionStorage.getItem('wishlistarray'));
        const email = localStorage.getItem('email');
        // Send the client-side localStorage email & sessionStorage wishlistarray
        try {
            const response = await axios.post('http://localhost:5000/api/quote', {
                wishlist: wishlist,
                email: email
            });
            console.log('Quotation info sent: ', response.data);

            // Manage the notification popup
            console.log('Setting popup to open');
            setIsPopupOpen(true);


        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
            } else {
                // Something else happened
                console.error('Error', error.message);
            }

        }

    };


    return (
        <div>
            <h1>WISHLIST</h1>
            <button onClick={removeAllItemsWishlist} className='btn btn-danger' style={{ float: 'right' }}>Remove All</button>
            <div className='white-bg'>
                <table className='outlined-table'>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th>Cancel</th>
                        </tr>
                    </thead>
                    {(storedData) ? (
                        storedData.map((product, index) => (
                            <tbody key={index}>
                                <tr>
                                    <td><img src={product.imageURL} alt='' style={{ width: '100px', height: 'auto' }} /></td>
                                    <td>{product.productID}</td>
                                    <td>{product.productName}</td>
                                    <td className='cancel-product-wishlist' onClick={() => cancelItemWishlist(index)}>X</td>
                                </tr>
                            </tbody>
                        ))
                    ) : (
                        <p>No items in Wishlist.</p> // storedData === null 
                    )}
                </table>
            </div>

            {thereIsProducts() && (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
                    <button className='btn btn-warning' style={{ width: '95%' }} onClick={checkForLoginStatusQuoteRequest}>Request for Price Quotations</button>
                </div>
            )}


            {isPopupOpen && (
                <div className='quotes-request-bg' style={{ display: 'block' }}>
                    <p>Quotation Request Sent!</p>
                    <p>Kindly allow 1-5 working days for follow-up email.</p>
                    <button onClick={closeNotifyPopup}>Close</button>
                </div>
            )}

        </div>
    );
}

export default Wishlist; 
