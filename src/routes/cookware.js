import { Link, useNavigate } from 'react-router-dom';
import CookwareBackground from '../routes/components/cookware.jpg';
import './cookware.css';
import React, { useEffect, useState } from 'react';

const DisplayAllCookware = () => {
    const navigate = useNavigate();
    const [cookwareProducts, setCookwareProducts] = useState([]);
    // for display page (sets of 6)
    const [page, setPage] = useState(0);
    const productsPerPage = 6;

    useEffect(() => {
        fetch('./products.json')
            .then(response => response.json())
            .then(data => {
                const filteredCookwareProducts = data.filter(cookwareProduct => cookwareProduct.categories.split(',').includes('cookware'));
                setCookwareProducts(filteredCookwareProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const totalPages = Math.ceil(cookwareProducts.length / productsPerPage);
    // for counting of pages 
    const [currentPage, setCurrentPage] = useState(1);

    const handleNextPage = () => {
        setPage(page => page < totalPages - 1 ? page + 1 : page);
        setCurrentPage(currentPage => currentPage < totalPages ? currentPage + 1 : currentPage);
    }

    const handlePreviousPage = () => {
        setPage(page => page > 0 ? page - 1 : page);
        setCurrentPage(currentPage => currentPage > 1 ? currentPage - 1 : currentPage);
    }

    const getPagedProducts = () => {
        const startIndex = page * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        return cookwareProducts.slice(startIndex, endIndex);
    }


    // Add wishlist choices to Session Storage 
    const addProductToSessionStorage = (product) => {
        let wishlistArray = sessionStorage.getItem('wishlistarray');

        wishlistArray = wishlistArray ? JSON.parse(wishlistArray) : [];

        // Check if the product already exists in the array (based on productID).
        const isProductExist = wishlistArray.some(element => element.productID === product.productID);

        // Only add the product if it does not already exist.
        if (!isProductExist) {
            wishlistArray.push(product);
        }

        sessionStorage.setItem('wishlistarray', JSON.stringify(wishlistArray));
    }


    // State to manage whether the popup is visible
    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Function to show popup
    const informUserWishlistPopup = (product) => {
        setSelectedProduct(product);
        setShowPopup(true);

        // Set a timer to hide the popup after 5 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 5000);

        addProductToSessionStorage(product);
    };

    // Popup component
    const WishlistPopup = ({ product }) => {
        if (!product) return null;
        return (
            <div className='background-wishlist-popup' style={{ display: showPopup ? 'block' : 'none' }}>
                <h3>Product added to Wishlist</h3>
                <div>
                    <div className='wishlist-popup-img-container'>
                        <img src={product.imageURL} alt='' />
                    </div>
                    <h5>{product.productID}</h5>
                    <h5>{product.productName}</h5>
                    <div className='grid-container'>
                        <Link to={'/wishlist'}>
                            <span>Go to Wishlist</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    };


    // For handling of Rental or Purchase popup
    const [isAddToRentalPopupOpen, setIsAddToRentalPopupOpen] = useState(false);

    const closePopup = () => {
        setIsAddToRentalPopupOpen(false);
        setListOfProductInformation([]);
    }

    const openRentalOptionPopup = () => {
        setIsAddToRentalPopupOpen(true);
    }

    const [listOfProductInformation, setListOfProductInformation] = useState([]);


    const addProduct = (newProduct) => {
        setListOfProductInformation([newProduct]);
    };

    const goToRentalForm = () => {
        navigate('/rentalform', { state: { productInfo: listOfProductInformation } });
    }

    console.log(JSON.stringify(listOfProductInformation));

    const goToPurchaseForm = () => {
        navigate('/purchaseform', { state: { productInfoForPurchase: listOfProductInformation } });
    }

    const checkForLoginStatusRental = () => {
        if (localStorage.getItem('username') !== null) {
            goToRentalForm();
        } else {
            navigate('/login');
        }
    }

    const checkForLoginStatusPurchase = () => {
        if (localStorage.getItem('username') !== null) {
            goToPurchaseForm();
        } else {
            navigate('/login');
        }
    }


    return (
        <div>
            <h1>Cookware</h1>
            <ul>
                <div className='layout-cookware-listings'>
                    {getPagedProducts().map(cookwareProduct => (

                        <div className='layout-cookware-sixes' key={cookwareProduct.productID}>
                            <li>
                                <div className='image-productname-lease-onhover' onClick={() => {
                                    addProduct({
                                        productID: cookwareProduct.productID,
                                        productName: cookwareProduct.productName,
                                        price: cookwareProduct.price,
                                        rent: cookwareProduct.rent,
                                        imageURL: cookwareProduct.imageURL
                                    });
                                    openRentalOptionPopup();
                                }}>
                                    <div className='cookware-listings-image-container'>
                                        <img src={cookwareProduct.imageURL} alt='' />
                                    </div>
                                    <h2>{cookwareProduct.productName}</h2>

                                </div>
                                <p>{cookwareProduct.productDescription}</p>
                                <p>Add to Wishlist for quotation</p>
                                <button onClick={() => informUserWishlistPopup(cookwareProduct)}>Add to Wishlist</button>
                            </li>
                        </div>
                    ))}

                </div>
            </ul>
            {selectedProduct && <WishlistPopup product={selectedProduct} />}


            {isAddToRentalPopupOpen && (
                listOfProductInformation.map((product, index) => (
                    <div className='rental-option-popup'>
                        <div className='image-productname-lease-onhover'><p onClick={closePopup}>X</p></div>
                        <div className='rental-popup-image-container'>
                            <img src={product.imageURL} alt='' />
                        </div>
                        <h3>{product.productName}</h3>
                        <div className='option-purchase-or-rent'>
                            <div className='option-rent'>
                                <p>Rent: USD {product.rent} / day</p>
                                <button className='btn btn-warning' onClick={checkForLoginStatusRental}>Rent This Now</button>
                            </div>
                            <div className='option-purchase'>
                                <p>Price: USD {product.price}</p>
                                <button className='btn btn-warning' onClick={checkForLoginStatusPurchase}>Purchase</button>
                            </div>
                        </div>
                    </div>
                ))
            )}


            <div className='pagination-controls'>
                <button onClick={handlePreviousPage} disabled={page === 0}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={(page + 1) * productsPerPage >= cookwareProducts.length}
                >
                    Next
                </button>
            </div>


        </div>
    )
}


export default function Cookware() {
    return (
        <div>
            <div style={{ backgroundColor: '#FFF2CC' }}>
                <DisplayAllCookware />
            </div>
            <div className='background-image-cookware' style={{ backgroundImage: `url(${CookwareBackground})` }}></div>
        </div>
    )
}