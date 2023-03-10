import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();


  return (
    <div className='dashboard'>
      <h1>Hello there! Welcome to the TLV-Hoops admin area.</h1>
      <h2>This is where you can see and edit all the information needed.</h2>
      <div className='navBar' style={{ display: "flex", flexDirection: "column" }}>
        <button onClick={() => navigate(`/tabledata`)}>LIVE DATA</button> <br />
        <button onClick={() => navigate(`/login`)}>LOG OUT</button>
      </div>

      <div className='dashboardContent'>
      </div>
    </div>
  )
}
