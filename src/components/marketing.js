import React, { useState, useEffect } from 'react';
import './marketing.css';
import MarketingBakingImg from './images/marketing-bake.jpg';
import MarketingCookingImg from './images/marketing-cook.jpg';
import { useNavigate } from 'react-router-dom';
import Tools from './images/tools.svg'; 
import Tech from './images/robot.svg'; 
import Thumbsup from './images/hand-thumbs-up.svg'; 
import Moneysign from './images/currency-dollar.svg'; 

const MarketingForBaking = () => {
    const navigate = useNavigate();

    const handleClickGoBakeware = () => {
        navigate('/bakeware');
    };

    return (
        <div>
            <div className='marketing-container'>
                <img src={MarketingBakingImg} />
                <div className='marketing-overlay'></div>
                <div className='baking-slogan'>
                    <h1>No Upfront Costs</h1>
                    <h2>Grow your business the smart way!</h2>
                    <button type='button' onClick={handleClickGoBakeware} className='btn btn-info'>Bakeware Catalogue</button>
                </div>
            </div>
        </div>
    )
}

const MarketingForCooking = () => {
    const navigate = useNavigate();

    const handleClickGoCookware = () => {
        navigate('/cookware');
    };

    return (
        <div>
            <div className='marketing-container'>
                <img src={MarketingCookingImg} />
                <div className='marketing-overlay'></div>
                <div className='cooking-slogan'>
                    <h1>No Upfront Costs</h1>
                    <h2>Look through our catalogues for more information!</h2>
                    <button type='button' onClick={handleClickGoCookware} className='btn btn-success'>Cookware Catalogue</button>
                </div>
            </div>
        </div>
    )
}

export default function Marketing() {
    const [showBaking, setShowBaking] = useState(true);
    const [animationClass, setAnimationClass] = useState('slide-in-left');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowBaking(prevShowBaking => !prevShowBaking);
            setAnimationClass(prevClass => {
                const classes = ['slide-in-left', 'slide-in-right', 'slide-in-top', 'slide-in-bottom'];
                return classes[Math.floor(Math.random() * classes.length)];
            })
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div className={`alternate-marketing-slides' ${animationClass}`}>
                {showBaking ? <MarketingForBaking /> : <MarketingForCooking />}
            </div>

            <div className='marketing-rent-benefits'>
                <div className='marketing-benefit-container'>
                    <img src={Tools} alt='' className='marketing-benefit-icon'/>
                    <h2>Free repairs & servicing</h2>
                </div>
                <div className='marketing-benefit-container'>
                    <img src={Moneysign} alt='' className='marketing-benefit-icon'/>
                    <h2>Conserve working capital</h2>
                </div>
                <div className='marketing-benefit-container'>
                    <img src={Tech} alt='' className='marketing-benefit-icon'/>
                    <h2>Great flexibility & technology</h2>
                </div>
                <div className='marketing-benefit-container'>
                    <img src={Thumbsup} alt='' className='marketing-benefit-icon'/>
                    <h2>Try before buying</h2>
                </div>
            </div>

            {/* footer */}


        </div>
    )
}