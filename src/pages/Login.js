import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';


export default function Login() {
  const navigate = useNavigate();
  const [lowerLoginEmail, setLowerLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('');

  // Make an arrow function to submit the form
  const handleLogin = async (e) => {
    try {
      const response = await axios.post('https://tlv-hoops-server.onrender.com/login', {
        lowerLoginEmail: lowerLoginEmail.toLowerCase(),
        loginPass: loginPass
      });
      if ((response.status === 200) && (response.data.admin === true)) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      }
      else {
        setErrorDisplay("YOU MUST BE AN ADMIN TO SIGN IN HERE.");
      }
    } catch (error) {
      console.error(error);
      setErrorDisplay(error.response.data.message);
    }
  }

  return (
    <div>
      <div style={{ width: "100vw", height: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <img src={logo} style={{ width: "10vw", height: "10vw" }} alt="logo" />
        <br />
        <br />
        <br />
        <h3>
          ADMIN LOGIN
        </h3>
        <input onChange={(e) => setLowerLoginEmail(e.target.value)} type="text" placeholder="Email" /><br />
        <input onChange={(e) => setLoginPass(e.target.value)} type="password" placeholder="Password" /><br />
        <button onClick={() => handleLogin()} style={{ width: "5%", height: "5%" }}>LOG IN</button>
      </div>
      {setErrorDisplay ? <h1 style={{ color: "red", fontWeight: "bolder" }}>{errorDisplay}</h1> : null}
    </div>
  )
}