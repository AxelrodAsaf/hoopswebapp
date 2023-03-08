import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Default() {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/dashboard`)}>
      <div style={{ backgroundColor: "black", color: "red" }}>
        <h1>Error finding page.</h1>
        <h3>
          Please click here to go back to the home page.
        </h3>
      </div>
    </div>
  )
}