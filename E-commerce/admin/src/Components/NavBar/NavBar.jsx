import React from 'react';
import './NavBar.css'
import navlogo from '../../assets/logo.jpg'
import navProfile from '../../assets/nav-profile.svg'

const NavBar = () => {
  return (
    <div className='navbar'>
      <div className='left-nav'>
        <img src={navlogo} alt ="" className="nav-logo" />
        <h1>InStyle</h1>
      </div>
      <div className='right-nav'>
         <img src={navProfile} className='nav-profile' alt=''/> 
      </div>
      
      

    </div>
  )
}

export default NavBar