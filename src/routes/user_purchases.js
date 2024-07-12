import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPurchases = () => {

    const [rentals, setRentals] = useState([]);
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/rentalinfo');
                console.log('Rental data retrieved: ', response.data);
                // setRentals according to email logged in
                const emailLoggedIn = JSON.parse(localStorage.getItem('email'));
                console.log("check email: ", emailLoggedIn);
                setRentals(response.data.filter(item => item.rental_email === emailLoggedIn));
                console.log(rentals);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error('Error:', error.response.data);
                } else {
                    console.error('Error getting rental info:', error.response ? error.response.data : error.message);
                }
            }
        }

        fetchRentals();
    }, []);


    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/purchaseinfo');
                console.log('Purchase data retrieved: ', response.data);
                const emailLoggedIn = JSON.parse(localStorage.getItem('email'));
                console.log("check email: ", emailLoggedIn);
                setPurchases(response.data.filter(item => item.purchase_email === emailLoggedIn));
                console.log(purchases);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error('Error:', error.response.data);
                } else {
                    console.error('Error getting purchase info:', error.response ? error.response.data : error.message);
                }
            }
        }

        fetchPurchases();
    }, []);


    const generateIndex = (number) => {
        return number + 1;
    }


    return (
        <div>
            <h1>Purchases</h1>
            <div>
                <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Rental <br></br> ID</th>
                            <th>Product Name</th>
                            <th>Selected Quantity</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(rentals && rentals.length > 0) ? (
                            rentals.map((rental, index) => (
                                <tr key={generateIndex(index)}>
                                    <td>{generateIndex(index)}</td>
                                    <td>{rental.rental_id}</td>
                                    <td>{rental.product_name}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{rental.selected_quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <p>No data available.</p>
                        )}
                    </tbody>

                </table>
            </div>

            <h1>Rentals</h1>
            <div>
                <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>

                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Purchase <br></br> ID</th>
                            <th>Product Name</th>
                            <th>Selected Quantity</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(purchases && purchases.length > 0) ? (
                            purchases.map((purchase, index) => (
                                <tr key={generateIndex(index)}>
                                    <td>{generateIndex(index)}</td>
                                    <td>{purchase.purchase_id}</td>
                                    <td>{purchase.product_name}</td>
                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{purchase.selected_quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <p>No data available.</p>
                        )}
                    </tbody>

                </table>
            </div>

            <br></br>

        </div>
    )
}

export default UserPurchases; 