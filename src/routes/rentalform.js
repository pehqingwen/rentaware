import React, { useState, useEffect } from 'react';
import './rentalform.css';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const RentalRequest = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const productInfo = location.state?.productInfo || [];
    const rawEmail = localStorage.getItem('email');
    const email = rawEmail.slice(1, -1);

    console.log('Received product info:', JSON.stringify(productInfo)); // Debugging to check received data
    console.log('This is email: ', email);

    const productId = productInfo[0].productID;
    const productName = productInfo[0].productName;
    const costPerDay = productInfo[0].rent;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue, watch
    } = useForm();

    const onRentalRequest = async () => {

        try {
            const response = await axios.post('http://localhost:5000/api/rentalrequest', {
                email: email,
                productId: productId,
                productName: productName,
                startDate: startDate,
                endDate: endDate,
                selectedQty: selectedQty,
                numberOfDays: numberOfDays,
                costPerDay: costPerDay,
                totalCosts: totalCosts,
                companyName: companyName,
                contactNumber: contactNumber,
                addressLine1: addressLine1,
                addressLine2: addressLine2
            });

            navigate('/acknowledgement', { state: { requestType: isRentalReq } });

        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Error:', error.response.data);
                setError('numberOfDays', { type: 'manual', message: error.response.data });
            } else {
                console.error('Error logging in:', error.response ? error.response.data : error.message);
            }
        }

    }


    const dateNow = new Date();
    const dayNow = dateNow.getDate() + 1;
    const monthNow = dateNow.getMonth() + 1; // Months are zero-indexed in JS 
    const yearNow = dateNow.getFullYear();

    const [selectedDay, setSelectedDay] = useState(dayNow);
    const [selectedMonth, setSelectedMonth] = useState(monthNow);
    const [selectedYear, setSelectedYear] = useState(yearNow);

    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 7);
    const dayEnd = dateEnd.getDate() + 1;
    const monthEnd = dateEnd.getMonth() + 1;
    const yearEnd = dateEnd.getFullYear();

    const [selectedEndDay, setSelectedEndDay] = useState(dayEnd);
    const [selectedEndMonth, setSelectedEndMonth] = useState(monthEnd);
    const [selectedEndYear, setSelectedEndYear] = useState(yearEnd);


    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const startYear = 2024;
    const endYear = 2034;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);


    useEffect(() => {
        const $select = $(".1-30");
        if ($select.children().length === 0) {
            for (let i = 1; i <= 30; i++) {
                $select.append($('<option></option>').val(i).html(i));
            }
        }
    }, []);


    // Function for making day,month,year into a date
    const formatDate = (day, month, year) => {
        const date = new Date(year, month - 1, day); // month is zero-indexed
        return date;
    }

    const [startDate, setStartDate] = useState(formatDate(selectedDay, selectedMonth, selectedYear));
    const [endDate, setEndDate] = useState(formatDate(selectedEndDay, selectedEndMonth, selectedEndYear));

    useEffect(() => {
        setStartDate(formatDate(selectedDay, selectedMonth, selectedYear));
        setEndDate(formatDate(selectedEndDay, selectedEndMonth, selectedEndYear));
    }, [selectedDay, selectedEndDay, selectedMonth, selectedEndMonth, selectedYear, selectedEndYear]);

    useEffect(() => {
        setNumberOfDays(calculateDaysBetween(startDate, endDate));
    }, [startDate, endDate]);

    const calculateDaysBetween = (start, end) => {
        if (!(start instanceof Date) || !(end instanceof Date)) {
            throw new Error('Both startDate and endDate must be Date objects');
        }
        const oneDay = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
        const diffInTime = end.getTime() - start.getTime();
        return Math.round(diffInTime / oneDay);
    };

    const [numberOfDays, setNumberOfDays] = useState(calculateDaysBetween(startDate, endDate));
    const [isNotLogicalPeriod, setIsNotLogicalPeriod] = useState(false); // endDate < startDate
    const [isTooShortPeriod, setIsTooShortPeriod] = useState(false); // < 7 days rental period 
    const [isNotExistingStartDate, setIsNotExistingStartDate] = useState(false); // startDate <= dateNow
    const [isTooCostlyRental, setIsTooCostlyRental] = useState(false);

    useEffect(() => {
        if (endDate < startDate) {
            setIsNotLogicalPeriod(true);
            return console.error("Please choose a starting date that is before the end rental date.");
        }
        setIsNotLogicalPeriod(false);
    }, [startDate, endDate]);

    useEffect(() => {
        if (numberOfDays < 7) {
            setIsTooShortPeriod(true);
            return console.error("Please choose a rental period of minimum 7 days.");
        }
        setIsTooShortPeriod(false);
    }, [numberOfDays]);

    useEffect(() => {
        if (startDate < dateNow) {
            setIsNotExistingStartDate(true);
            return console.error("Please choose a starting date that exist.")
        }
        setIsNotExistingStartDate(false);
    }, [startDate]);


    const [isPositiveCount, setIsPositiveCount] = useState(false);

    useEffect(() => {
        setIsPositiveCount(numberOfDays >= 7);
    }, [numberOfDays]);


    const [selectedQty, setSelectedQty] = useState(1);
    const [totalCosts, setTotalCosts] = useState(0);

    useEffect(() => {
        if (productInfo[0] && productInfo[0].rent) {
            setTotalCosts(productInfo[0].rent * selectedQty * numberOfDays);
        }
    }, [productInfo, selectedQty, numberOfDays]);


    useEffect(() => {
        if (isPositiveCount) {
            setValue('numberOfDays', numberOfDays);
            setValue('totalCosts', totalCosts);
        }
    }, [isPositiveCount, numberOfDays, totalCosts, setValue]);


    useEffect(() => {
        if ((totalCosts / selectedQty) > productInfo[0].price) {
            setIsTooCostlyRental(true);
            return console.error("The rental costs is higher than price. Consider purchasing here.");
        }
        setIsTooCostlyRental(false);
    }, [totalCosts, selectedQty, productInfo]);


    const goToPurchaseForm = () => {
        navigate('/purchaseform');
    }

    // Transfer prdt info to purchase form 
    sessionStorage.setItem('prdtName', productInfo[0].productName);
    sessionStorage.setItem('prdtId', productInfo[0].productID);
    sessionStorage.setItem('prdtPrice', productInfo[0].price);
    sessionStorage.setItem('prdtImg', productInfo[0].imageURL);


    // Particulars of customer 
    const [companyName, setCompanyName] = useState([]);
    const [contactNumber, setContactNumber] = useState([]);
    const [addressLine1, setAddressLine1] = useState([]);
    const [addressLine2, setAddressLine2] = useState([]);


    let newStartDate = new Date(startDate);
    let newEndDate = new Date(endDate);

    var year1 = newStartDate.getUTCFullYear();
    var month1 = String(newStartDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    var day1 = String(newStartDate.getUTCDate()).padStart(2, '0');

    var year2 = newEndDate.getUTCFullYear();
    var month2 = String(newEndDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    var day2 = String(newEndDate.getUTCDate()).padStart(2, '0');

    const formattedStartDate = `${year1}-${month1}-${day1}`;
    const formattedEndDate = `${year2}-${month2}-${day2}`;

    const [isRentalReq, setIsRentalReq] = useState('rental');


    return (
        <div className='rental-form-bg'>

            <h3>Rental Request</h3>

            <div className='rentalform-img-bg'>
                <img src={productInfo[0].imageURL} alt=''></img>
            </div>
            <h4>{productInfo[0].productName}</h4>
            <p>Price per day: USD <span className='price-per-day'>{productInfo[0].rent}</span></p>

            <form onSubmit={handleSubmit(onRentalRequest)}>
                <div className='spacing-between-divisions flex-display'>
                    <p>Quantity: </p>
                    <select className="1-30" onChange={(e) => setSelectedQty(Number(e.target.value))}></select>
                </div>

                <div className='space-between spacing-between-divisions'>
                    <label>Start Date:</label>
                    <div>
                        <select className='start-day' value={selectedDay} onChange={(e) => setSelectedDay(Number(e.target.value))}>
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <select className='start-month' value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                            {months.map((month, index) => (
                                <option key={index + 1} value={index + 1}>{month}</option>
                            ))}
                        </select>
                        <select className='start-year' value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {isNotLogicalPeriod && (
                    <div>
                        <p style={{ color: 'red' }}>Please choose a starting date that is before the end rental date.</p>
                    </div>
                )}

                {isNotExistingStartDate && (
                    <div>
                        <p style={{ color: 'red' }}>Please choose a starting date that exist.</p>
                    </div>
                )}

                <div className='space-between spacing-between-divisions'>
                    <label>End Date:</label>
                    <div>
                        <select className='end-day' value={selectedEndDay} onChange={(e) => setSelectedEndDay(Number(e.target.value))}>
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        <select className='end-month' value={selectedEndMonth} onChange={(e) => setSelectedEndMonth(Number(e.target.value))}>
                            {months.map((month, index) => (
                                <option key={index + 1} value={index + 1}>{month}</option>
                            ))}
                        </select>
                        <select className='end-year' value={selectedEndYear} onChange={(e) => setSelectedEndYear(Number(e.target.value))}>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isTooShortPeriod && (
                    <div>
                        <p style={{ color: 'red' }}>Please choose a rental period of minimum 7 days.</p>
                    </div>
                )}

                {isTooCostlyRental && (
                    <div>
                        <p style={{ color: 'red' }}>The rental costs is higher than price. Consider purchasing <Link><p onClick={goToPurchaseForm}>here</p></Link></p>
                    </div>
                )}


                {isPositiveCount && !isNotExistingStartDate && !isTooCostlyRental && (
                    <p>Number of days: <input {...register("numberOfDays", { required: "This is required" })} type='text' className='count-days-value' value={numberOfDays} readOnly></input>
                        {errors.numberOfDays && <span style={{ color: 'red' }}>{errors.numberOfDays.message}</span>}
                    </p>
                )}

                {isPositiveCount && !isNotExistingStartDate && !isTooCostlyRental && (
                    <p>Total cost of rental: USD <input {...register("totalCosts", { required: "This is required" })} type='text' className='total-cost-rental' value={totalCosts} readOnly></input>
                        {errors.totalCosts && <span style={{ color: 'red' }}>{errors.totalCosts.message}</span>}
                    </p>
                )}


                <h4 style={{ paddingTop: '25px' }}>Particulars</h4>

                <p>Company Name: <input {...register("companyName", { required: "This is required" })} type='text' value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ width: '100%' }}></input>
                    {errors.companyName && <span style={{ color: 'red' }}>{errors.companyName.message}</span>}
                </p>
                <p>Contact Number: <input {...register("contactNumber", { required: "This is required" })} placeholder="123-456-7890" type='tel' onChange={(e) => setContactNumber(e.target.value)} value={contactNumber}></input>
                    {errors.contactNumber && <span style={{ color: 'red' }}>{errors.contactNumber.message}</span>}
                </p>
                <p>Address Line 1: <input {...register("addressLine1", { required: "This is required" })} type='text' onChange={(e) => setAddressLine1(e.target.value)} value={addressLine1} style={{ width: '100%' }}></input>
                    {errors.addressLine1 && <span style={{ color: 'red' }}>{errors.addressLine1.message}</span>}
                </p>
                <p>Address Line 2: <input {...register("addressLine2", { required: "This is required" })} type='text' onChange={(e) => setAddressLine2(e.target.value)} value={addressLine2} style={{ width: '100%' }}></input>
                    {errors.addressLine2 && <span style={{ color: 'red' }}>{errors.addressLine2.message}</span>}
                </p>


                {isPositiveCount && !isNotExistingStartDate && !isTooCostlyRental && (
                    <div className='center spacing-between-divisions'>
                        <button type='submit' className='btn btn-warning'>Submit</button>
                    </div>
                )}

            </form>

        </div>
    )
}

export default RentalRequest; 