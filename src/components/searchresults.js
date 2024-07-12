import React, { useState } from 'react';
import './searchresults.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SearchResults = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || [];
    const keyword = location.state?.keyword || '';

    console.log('Received search results:', searchResults); // Debugging to check received data
    console.log('Keyword for displaying:', keyword);

    // for display page (sets of 6)
    const [page, setPage] = useState(0);
    const productsPerPage = 6;
    // for counting of pages 
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(searchResults.length / productsPerPage);

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
        return searchResults.slice(startIndex, endIndex);
    }

    
    const addProductToWishlist = (product) => {
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

    const showPopupForWishlist = (product) => {
        setSelectedProduct(product);
        setShowPopup(true);

        // Set a timer to hide the popup after 5 seconds
        setTimeout(() => {
            setShowPopup(false);
        }, 5000);

        addProductToWishlist(product);
    }

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
    }


    return (
        <div className='background-searchresults'>
            <h1>Search results for '{keyword}'</h1>

            <ul>
                <div className='layout-searchresults'>
                    {searchResults.length > 0 ? (
                        getPagedProducts().map((product, index) => (
                            <div key={index} className='layout-searchresults-sixes'>
                                <li>
                                    <div className='searchresults-listings-img-container'>
                                        <img src={product.imageURL} alt='' />
                                    </div>
                                    <h2>{product.productName}</h2>
                                    <p>{product.productDescription}</p>
                                    <p>Add to Wishlist for quotation</p>
                                    <button onClick={() => showPopupForWishlist(product)}>Add to Wishlist</button>
                                </li>
                            </div>
                        ))
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            </ul>
            {selectedProduct && <WishlistPopup product={selectedProduct} />}


            <div className='pagination-controls'>
                <button onClick={handlePreviousPage} disabled={page === 0}>
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={(page + 1) * productsPerPage >= searchResults.length}
                >
                    Next
                </button>
            </div>


        </div>
    )
}

export default SearchResults; 