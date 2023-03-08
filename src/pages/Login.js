import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [lowerLoginEmail, setLowerLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Make an arrow function to submit the form
  const handleLogin = async (e) => {
    console.log(lowerLoginEmail, loginPass);
    const response = await axios.post('http://localhost:9999/login', {
        lowerLoginEmail: lowerLoginEmail,
        loginPass: loginPass
    });
    console.log(response);
    if (response.status === 200) {
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    }
  }

  return (
    <div>
      <div>
        <h1>TLV- Hoops</h1>
        <h3>
          ADMIN LOGIN
        </h3>
        <input onChange={(e)=> setLowerLoginEmail(e.target.value)}type="text" placeholder="Email" /><br/>
        <input onChange={(e)=> setLoginPass(e.target.value)}type="password" placeholder="Password" /><br/>
        <button onClick={() => handleLogin()}>Login</button>
      </div>
    </div>
  )
}