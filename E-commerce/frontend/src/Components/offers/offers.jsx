import React from 'react';
import './offer.css'
import exlusive_image from '../Assets/exclusive_image.png'
const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Exlusives</h1>
            <h1>Offers For You</h1>
            <p>ONLY ON BEST SELLERS PRODUCTS</p>
            <button>Check Now</button>
        </div>
        <div className="offers-right">
            <img src={exlusive_image} alt=""/>
        </div>
      <h1></h1>
    </div>
  );
};

export default Offers;