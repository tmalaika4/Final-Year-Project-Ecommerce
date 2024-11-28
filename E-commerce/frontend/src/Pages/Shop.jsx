import React from 'react';
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/offers/offers';
import NewCollection from '../Components/NewCollection/NewCollection';
import NewLetter from '../Components/NewsLetter/NewsLetter';
import LoginSignUp from './LoginSignUp';

const Shop = () => {
  return (
    <div>
      <Hero/>
      <Popular/>
      <Offers/>
      <NewCollection/>
      <NewLetter/>
    </div>
  );
};

export default Shop;