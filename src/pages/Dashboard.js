import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

export default function Dashboard() {
  const navigate = useNavigate();


  return (
    <div className='dashboard'>
      <img src={logo} style={{ width: "10vw", height: "10vw" }} alt="logo" />
      <h1>Hello there! Welcome to the TLV-Hoops admin area.</h1>
      <h2 style={{ marginTop: "-2vh" }}>This is where you can see and edit all the information needed.</h2>
      <div className='navBar' style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ height: "5vh", width: "50vw", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
          <button style={{height: "100%"}} onClick={() => navigate(`/tabledata`)}>LIVE DATA</button>
          <button style={{height: "100%"}} onClick={() => navigate(`/approvegames`)}>APPROVE GAMES</button>
          <button style={{height: "100%"}} onClick={() => navigate(`/editplayer`)}>EDIT PLAYER</button>
        </div>
        <br />
        <button style={{ height: "5vh", width: "20vw" }} onClick={() => navigate(`/login`)}>LOG OUT</button>
      </div>

      <div className='dashboardContent'>
      </div>
    </div>
  )
}
