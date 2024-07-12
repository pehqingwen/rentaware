import React, { useState, useRef, useEffect } from 'react';
import Email from './images/envelope-open.svg';
import Telephone from './images/telephone-inbound.svg';
import Likes from './images/suit-heart.svg';
import Login from './images/person.svg';
import Signup from './images/person-plus.svg';
import './navbar.css';
import Logo from './images/logo.png'
import { Link } from 'react-router-dom';
import EmailFunction from './popupemailfunction';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

//extra wrappings may affect original functionality e.g. <Link><img></Link>
//re-render error: useState functions use in event handlers e.g. onClick={() => function}
//re-render error: useEffect with dependency array [] will run only once 
//re-render error: setter function should not be a dependency in useEffect
// ----------------------------------
// PROPER SECTION NAMING 
// ----------------------------------

// For testing purposes: 
// 1. evepoh evepoh@gmail.com eww 
// 2. pastrypros pastrypros@official.co haha 


const NavBar = ({ searchResults, setSearchResults }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const popupRef = useRef(null);
    const navigate = useNavigate();

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }

    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            setIsPopupOpen(false);
        }
    };

    useEffect(() => {
        if (isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPopupOpen]);


    const navigateToWishlist = () => {
        navigate('/wishlist');
    }

    const navigateToSignup = () => {
        navigate('/register');
    }

    const navigateToLogin = () => {
        navigate('/login');
    }


    const [isUserAccount, setIsUserAccount] = useState(false);

    useEffect(() => {
        const userAccount = JSON.parse(localStorage.getItem('useraccount'));
        const email = localStorage.getItem('email');
        if (userAccount && email) {
            setIsUserAccount(true);
        } else {
            setIsUserAccount(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsUserAccount(false);
        navigate('/');
    };

    const navigateToAccount = () => {
        navigate('/account');
    }


    function contactMethods() {

        return (
            <div className='navbar-outer-div'>
                <div className='navbar-inner-div'>
                    <div className='change-on-hover'>
                        <span onClick={togglePopup}><img src={Email} alt='' className='svg-image' /> SALES@RENTAWARE.COM</span>
                    </div>

                    <span>  |  </span>

                    <div className='change-on-hover'>
                        <span><img src={Telephone} alt='' className='svg-image' /> +65 8936 3356</span>
                    </div>
                </div>


                {isUserAccount ? (

                    <div className='navbar-inner-div'>
                        <div className='change-on-hover'>
                            <span onClick={navigateToWishlist}>
                                <img src={Likes} alt='' className='svg-image' /> My Wishlist
                            </span>
                        </div>
                        <span>  |  </span>
                        <div className='change-on-hover'>
                            {/* Retrieve username from local storage */}
                            <span onClick={navigateToAccount}>
                                <img src={Login} alt='' className='svg-image' /> Welcome, {JSON.parse(localStorage.getItem('username'))}
                            </span>
                        </div>
                        <span>  |  </span>
                        <div className='change-on-hover'>
                            {/* Sign out & remove local storage data */}
                            <span onClick={handleLogout}>Sign Out</span>
                        </div>
                    </div>

                ) : (


                    <div className='navbar-inner-div'>
                        <div className='change-on-hover'>

                            <span onClick={navigateToWishlist}><img src={Likes} alt='' className='svg-image' /> My Wishlist</span>

                        </div>

                        <span>  |  </span>

                        <div className='change-on-hover'>
                            <span onClick={navigateToLogin}><img src={Login} alt='' className='svg-image' />Login</span>
                        </div>

                        <span>  |  </span>

                        <div className='change-on-hover'>
                            <span onClick={navigateToSignup}><img src={Signup} alt='' className='svg-image' />Sign Up</span>
                        </div>

                    </div>

                )}

            </div>
        )
    }

    const navigateToCookware = () => {
        navigate('/cookware');
    }

    const navigateToBakeware = () => {
        navigate('/bakeware');
    }

    function mainNavbar() {
        return (
            <div>
                <div className='main-navbar-layout'>

                    <div className='change-on-hover'>
                        <span onClick={navigateToCookware}>Cookware</span>
                    </div>

                    <Link to="/">
                        <img src={Logo} alt='' />
                    </Link>

                    <div className='change-on-hover'>
                        <span onClick={navigateToBakeware}>Bakeware</span>
                    </div>

                </div>

                <div>
                    <SearchBar setSearchResults={setSearchResults} searchResults={searchResults} />
                </div>

            </div>
        )
    }

    return (
        <div>
            {contactMethods()}
            {mainNavbar()}

            {/* pass togglePopup function to EmailFunction as a prop */}
            {isPopupOpen && (
                <EmailFunction closePopup={togglePopup} popupRef={popupRef} />
            )}

        </div>
    )
}

const SearchBar = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // Fetch data based on keyword, then navigate
        fetch('./products.json')
            .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product => product.productName.toLowerCase().includes(keyword.toLowerCase()));

                navigate('/searchresults', { state: { searchResults: filteredProducts, keyword: keyword } });
            })
            .catch(error => console.error('Error fetching products:', error));
    };


    return (
        <div>
            <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
                <div className='searchbar-styling'>
                    <input className="form-control mr-sm-2" type="search" placeholder="Search" value={keyword} onChange={handleInputChange}></input>

                    {/* Link placed here(wrapping button) may affect button's submit function */}
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>

                </div>
            </form >
        </div>
    )
}

export default NavBar; 