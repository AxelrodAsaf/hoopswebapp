import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();


  return (
    <div className='all' style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <h1>Hello there! Welcome to the TLV-Hoops admin area.</h1>
      <h2>This is where you can see and edit all the information needed.</h2>
        <div className='navBar' style={{display: "flex", flexDirection: "column"}}>
          <p onClick={() => navigate(`/tabledata`)}>Live Data</p>
        </div>

        <div className='dashboardContent'>
        </div>
    </div>
  )
}
