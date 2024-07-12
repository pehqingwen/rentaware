import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserQuotations = () => {

    const [quotations, setQuotations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('Making request...');
            try {
                const response = await axios.get('http://localhost:5000/api/accountinfo');
                console.log('Data retrieved: ', response.data);
                // setQuotations according to email logged in
                const emailLoggedIn = JSON.parse(localStorage.getItem('email'));
                setQuotations(response.data.filter(item => item.quotation_email.replace(/["\\]/g, '') === emailLoggedIn));
                console.log(quotations);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error('Error:', error.response.data);
                } else {
                    console.error('Error getting quotation info:', error.response ? error.response.data : error.message);
                }
            }
        };

        fetchData();
    }, []);


    const indexCount = (index) => {
        return index + 1;
    }

    const datePart = (string) => {
        return string.split('T')[0];
    }

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('./products.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                setAllProducts(data);
                console.log(allProducts);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
        fetchProducts();
    }, []);


    // Compare & get productNames for each array of IDs 
    // Compare with allProducts
    let arrayOfCorrespondingPrdtNames = [];
    const changeIdToNames = (arrayOfIds) => {
        arrayOfCorrespondingPrdtNames = [];
        arrayOfIds.forEach((itemId) => {

            for (let i = 0; i < allProducts.length; i++) {
                if (itemId === allProducts[i].productID) {
                    arrayOfCorrespondingPrdtNames.push(allProducts[i].productName + ', ');
                }
            }

        })

        if (arrayOfCorrespondingPrdtNames && arrayOfCorrespondingPrdtNames.length > 0) {
            const lastIndex = arrayOfCorrespondingPrdtNames.length - 1;
            if (arrayOfCorrespondingPrdtNames[lastIndex]) {
                const length = arrayOfCorrespondingPrdtNames[lastIndex].length;
                arrayOfCorrespondingPrdtNames[lastIndex] = arrayOfCorrespondingPrdtNames[lastIndex].substring(0, length - 2);
            }
        }

        return arrayOfCorrespondingPrdtNames;

    }


    return (
        <div>
            <h1>Quotations</h1>

            <div className='white-bg'>
                <table style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                    <thead>
                        {quotations && quotations.length > 0 && (
                            <tr>
                                <th>No.</th>
                                <th>Quotation <br></br>ID</th>
                                <th>Date of Request</th>
                                <th>Product Names</th>
                            </tr>
                        )}
                    </thead>

                    <tbody>
                        {(quotations && quotations.length > 0) ? (
                            quotations.map((quotation, index) => (
                                <tr key={indexCount(index)}>

                                    <td>{indexCount(index)}</td>

                                    <td>{quotation.quotation_id}</td>

                                    <td>{datePart(quotation.date_of_creation)}</td>

                                    <td>{changeIdToNames(quotation.productid_combination)}</td>
                                </tr>
                            ))

                        ) : (
                            <p>No data available.</p>
                        )}
                    </tbody>
                </table>
            </div>

            <br></br>

        </div >
    )
}

export default UserQuotations; 