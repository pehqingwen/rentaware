import BakewareBackground from '../routes/components/bakeware.jpeg';
import './bakeware.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ContainerforBakeware = () => {
    return (
        <div>
            <DisplayAllBakeware />
        </div>
    )
}

const DisplayAllBakeware = () => {
    const [bakewareProducts, setBakewareProducts] = useState([]);
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        fetch('./products.json')
            .then(response => response.json())
            .then(data => {
                const filteredBakewareProducts = data.filter(bakewareProduct =>
                    bakewareProduct.categories.split(',').map(category => category.trim()).includes('bakeware')
                );

                setBakewareProducts(filteredBakewareProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const totalPages = Math.ceil(bakewareProducts.length / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1);
        setCurrentPage(currentPage => (currentPage < totalPages ? currentPage + 1 : currentPage));
    };

    const handlePreviousPage = () => {
        setPage(prevPage => (prevPage > 0 ? prevPage - 1 : 0));
        setCurrentPage(currentPage => (currentPage > 1 ? currentPage - 1 : currentPage));
    };

    const getPagedProducts = () => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return bakewareProducts.slice(startIndex, endIndex);
    };


    const addToWishlist = (product) => {
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

    const [showPopup, setShowPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const initiatePopupAddWishlist = (product) => {
        setSelectedProduct(product);
        setShowPopup(true);

        // Set a timer to hide the popup after 5 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 5000);

        addToWishlist(product);
    }

    const WishlistPopupBakeware = ({ product }) => {
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
    }


    const [isAddToRentalPopupOpen, setIsAddToRentalPopupOpen] = useState(false);

    const closePopup = () => {
        setIsAddToRentalPopupOpen(false);
        setListOfProductInformation([]);
    }

    const openRentalOptionPopup = () => {
        setIsAddToRentalPopupOpen(true);
    }

    const [listOfProductInformation, setListOfProductInformation] = useState([]);


    // Function to show a single product popup at any one time
    const addProduct = (newProduct) => {
        // setListOfProductInformation([...listOfProductInformation, newProduct]);
        setListOfProductInformation([newProduct]);
    };


    const goToRentalForm = () => {
        navigate('/rentalform', { state: { productInfo: listOfProductInformation } });
    }

    // console.log(JSON.stringify(listOfProductInformation));

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
            <h1>Bakeware</h1>
            <ul>
                <div className='layout-bakeware-listings'>
                    {getPagedProducts().map(bakewareProduct => (
                        <div key={bakewareProduct.productID} className='layout-bakeware-sixes'>
                            <li>
                                <div className='image-productname-lease-onhover' onClick={() => {
                                    addProduct({
                                        productID: bakewareProduct.productID,
                                        productName: bakewareProduct.productName,
                                        price: bakewareProduct.price,
                                        rent: bakewareProduct.rent,
                                        imageURL: bakewareProduct.imageURL
                                    });
                                    openRentalOptionPopup();
                                }}>
                                    <div className='bakeware-listings-image-container'>
                                        <img src={bakewareProduct.imageURL} alt='' title='Click to lease' className='hover-image' />
                                    </div>
                                    <h2>{bakewareProduct.productName}</h2>

                                </div>
                                <p>{bakewareProduct.productDescription}</p>
                                <p>Add to Wishlist for quotation</p>
                                <button onClick={() => initiatePopupAddWishlist(bakewareProduct)}>Add to Wishlist</button>
                            </li>

                        </div>
                    ))}
                </div>
            </ul>
            {selectedProduct && <WishlistPopupBakeware product={selectedProduct} />}


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
                    disabled={(page + 1) * itemsPerPage >= bakewareProducts.length}
                >
                    Next
                </button>
            </div>

        </div>
    )
}

export default function Bakeware() {
    return (
        <div>
            <div style={{ backgroundColor: '#C0C0C0' }}>
                <ContainerforBakeware />
            </div>
            <div className='background-image-bakeware' style={{ backgroundImage: `url(${BakewareBackground})` }}></div>
        </div>
    )
}