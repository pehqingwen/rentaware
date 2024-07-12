import React, { useEffect, useState } from 'react';
import './rentalform.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import $ from 'jquery';
import { flushSync } from 'react-dom';

const PurchaseForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const productInfoForPurchase = location.state?.productInfoForPurchase || [];

    console.log(JSON.stringify(productInfoForPurchase));

    let filteredInfo = [];


    if (productInfoForPurchase.length !== 0) {
        filteredInfo = productInfoForPurchase;
    } else {
        const id = sessionStorage.getItem('prdtId');
        const name = sessionStorage.getItem('prdtName');
        const image = sessionStorage.getItem('prdtImg');
        const price = sessionStorage.getItem('prdtPrice');
        const object = { productID: id, productName: name, imageURL: image, price: price };
        filteredInfo.push(object);
        console.log('This finally works: ', filteredInfo);
    }


    const clearTransferStorage = () => {
        sessionStorage.clear();
        console.log('sessionStorage keys for product info have been cleared');
    };

    // Add event listener for beforeunload event
    window.addEventListener('beforeunload', clearTransferStorage);

    const {
        register,
        handleSubmit
    } = useForm();

    const onPurchase = async () => {

        // email is from localStorage
        const email = localStorage.getItem('email');

        try {
            const response = await axios.post('http://localhost:5000/api/purchase', {
                email: email,
                productId: filteredInfo[0].productID,
                productName: filteredInfo[0].productName,
                productPrice: filteredInfo[0].price,
                selectedQty: purchaseQty,
                totalAmount: totalAmount,
                companyName: companyName,
                contactNumber: contactNumber,
                addressLine1: addressLine1,
                addressLine2: addressLine2
            });

            navigate('/acknowledgement', { state: { requestType: isPurchaseType } });

        } catch (error) {
            if (error.response) {
                console.error('Error:', error.response.data);
            }
        }

    }


    useEffect(() => {
        const $select = $(".p1-30");
        if ($select.children().length === 0) {
            for (let i = 1; i <= 30; i++) {
                $select.append($('<option></option>').val(i).html(i));
            }
        }
    }, []);


    const [purchaseQty, setPurchaseQty] = useState(1);

    const [totalAmount, setTotalAmount] = useState(filteredInfo[0].price);


    useEffect(() => {
        setTotalAmount(purchaseQty * filteredInfo[0].price);
    }, [purchaseQty, filteredInfo]);


    // Particulars of customer 
    const [companyName, setCompanyName] = useState([]);
    const [contactNumber, setContactNumber] = useState([]);
    const [addressLine1, setAddressLine1] = useState([]);
    const [addressLine2, setAddressLine2] = useState([]);

    const [isPurchaseType, setIsPurchaseType] = useState('purchase');


    return (
        <div className='purchase-form-bg'>
            <h3>Purchase Form</h3>

            <div className='purchaseform-img-bg'>
                <img src={filteredInfo[0].imageURL} alt=''></img>
            </div>
            <h4>{filteredInfo[0].productName}</h4>

            <p>Selling Price: USD <span className='price-per-day'>{filteredInfo[0].price}</span></p>

            <form onSubmit={handleSubmit(onPurchase)}>

                <div className='spacing-between-divisions flex-display'>
                    <p>Quantity: </p>
                    <select className="p1-30" onChange={(e) => setPurchaseQty(Number(e.target.value))}></select>
                </div>

                <p>Total costs: USD <input {...register("totalAmount", { required: "This is required" })} type='text' className='total-cost-purchase' value={totalAmount} readOnly></input></p>

                <h4 style={{ paddingTop: '25px' }}>Particulars</h4>

                <p>Company Name: <input {...register("companyName", { required: "This is required" })} type='text' value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ width: '100%' }}></input></p>

                <p>Contact Number: <input {...register("contactNumber", { required: "This is required" })} placeholder="123-456-7890" type='tel' onChange={(e) => setContactNumber(e.target.value)} value={contactNumber}></input></p>

                <p>Address Line 1: <input {...register("addressLine1", { required: "This is required" })} type='text' onChange={(e) => setAddressLine1(e.target.value)} value={addressLine1} style={{ width: '100%' }}></input></p>

                <p>Address Line 2: <input {...register("addressLine2", { required: "This is required" })} type='text' onChange={(e) => setAddressLine2(e.target.value)} value={addressLine2} style={{ width: '100%' }}></input></p>

                <div className='center spacing-between-divisions'>
                    <button type='submit' className='btn btn-success'>Submit</button>
                </div>

            </form>

        </div>
    )
}

export default PurchaseForm; 
