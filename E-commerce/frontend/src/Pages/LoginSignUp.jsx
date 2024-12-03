import React, { useState } from 'react';
import './CSS/LoginSignUp.css'
const LoginSignUp = () => {
  
  const [state, setState] = useState("Login");
  const [formData,setFromData] = useState({
    name: "",
    email: "",
    password:""
  })

  const changeHandler = (e) => {
    setFromData({...formData,[e.target.name]:e.target.value})
  }
  const login = async () => {
    console.log("Login Function Executed", formData);
    try {
      const response = await fetch('http://localhost:5000/login?email='+formData.email, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");  // Or use React Router if applicable
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  
  const signup = async () => {
    console.log("signup Function Executed", formData);
    try {
      const response = await fetch(`http://localhost:5000/signup?name=${formData.name}&email=${formData.email}&password=${formData.password}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      
      });
  
      const responseData = await response.json();
  
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace("/");  // Or use React Router if applicable
      } else {
        alert(responseData.errors);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
      <h1>{state}</h1>
      <div className="loginsignup-fields">
        {state === "Sign Up"?<input name ='name' value={formData.name} onChange={changeHandler} type="text" placeholder='Your Name'/>:<></>}
        <input name ='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address'/>
        <input name ='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password'/>
      </div>
      <button onClick = {()=>{state === "Login"?login():signup()}}>Continue</button>
      {state === "Sign Up"
      ?<p className = "loginsignup-login">Already have an account? <span onClick ={()=>{setState("Login")}}>Login here</span></p>
      :<p className = "loginsignup-login">Create an account? <span onClick ={()=>{setState("Sign Up")}}>Click here</span></p>}
      
      
      <div className="loginsignup-agree">
        <input type="checkbox" name='' id=''/>
        <p>By continuing, i agree to the terms of use & privacy policy.</p>
      </div>
      </div> 
    </div>
  );
};

export default LoginSignUp;