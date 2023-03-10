import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [lowerLoginEmail, setLowerLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [errorDisplay, setErrorDisplay] = useState('');

  // Make an arrow function to submit the form
  const handleLogin = async (e) => {
    try {
      console.log(lowerLoginEmail, loginPass);
      const response = await axios.post('https://tlv-hoops-server.onrender.com/login', {
        lowerLoginEmail: lowerLoginEmail,
        loginPass: loginPass
      });
      console.log(response);
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
      <div style={{ width: "90vw", height: "75vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <>
          <h1>TLV- Hoops</h1>
          <h3>
            ADMIN LOGIN
          </h3>
          <input onChange={(e) => setLowerLoginEmail(e.target.value)} type="text" placeholder="Email" /><br />
          <input onChange={(e) => setLoginPass(e.target.value)} type="password" placeholder="Password" /><br />
          <button onClick={() => handleLogin()}>LOG IN</button>
        </>
      </div>
      {setErrorDisplay ? <h1 style={{ color: "red", fontWeight: "bolder" }}>{errorDisplay}</h1> : null}
    </div>
  )
}