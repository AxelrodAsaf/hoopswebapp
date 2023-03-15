import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css';
import Lottie from 'react-lottie';
import animationData from '../SpinningBallLottie.json';
import logo from '../logo.png';

export default function ApproveGames() {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState();
  const tableHeader = { border: "2px solid black" }
  const tableCell = { border: "2px solid black" }
  const [showAnimation, setShowAnimation] = useState(true);

  function reloadPage() {
    window.location.reload();
  }

  useEffect(() => {
    async function getTableData() {
      const response = await axios.post(`http://localhost:9999/allGamesList`)
      const tableData = response.data.map(tableItem => {
        const keysToRemove = ['createdByUser', '_id', 'password', '__v', 'requests', 'requestArray'];
        const cleanedTableItem = Object.keys(tableItem).reduce((acc, key) => {
          if (!keysToRemove.includes(key)) {
            acc[key] = tableItem[key];
          }
          if (key === 'participants') {
            acc[key] = (
              <ul>
                {tableItem[key].map(participant => (
                  <li>{participant}</li>
                ))}
              </ul>
            );
          }
          return acc;
        }, {});
        return cleanedTableItem;
      })
      const headers = [...Object.keys(tableData[0]), ''];
      const hideHeaders = ["gameID", "playerID", "ageMin", "ageMax", "maximumPlayers", "participants", "tlvpremium", "level"];
      const displayHeaders = headers.filter(header => !hideHeaders.includes(header));

      // Find if there is a game with approved as false
      const notApprovedGames = tableData.filter(tableItem => tableItem.approved === false);
      if (notApprovedGames.length !== 0) {
        setShowAnimation(false);
      } else {
        setShowAnimation(true);
        // Set a timer for 2 seconds to reload the page
        setTimeout(getTableData, 2000);
      }

      setTableData(prevData => ({
        ...prevData,
        data: tableData,
        headers: displayHeaders
      }));
    }

    getTableData();

  }, [])

  const handleApprove = async (row) => {
    // Send a request to the server to approve the item
    try {
      const response = await axios.post(`http://localhost:9999/approveGame`,
        {
          gameID: row.gameID,
        })
      reloadPage();
    }
    catch (error) {
    }
  }

  const handleDelete = async (row) => {
    // Send a request to the server to delete the item
    try {
      const response = await axios.post(`http://localhost:9999/removeGame`,
        {
          gameID: row.gameID,
        })
      reloadPage();
    }
    catch (error) {
    }
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <div>
      <img src={logo} style={{ width: "10vw", height: "10vw", marginLeft: "0vw", marginTop: "0vh", zIndex: "50" }} alt="logo" />
      <div>
        <button onClick={() => navigate(`/dashboard`)}>BACK</button>
        <button onClick={() => navigate(`/login`)}>LOG OUT</button>
        <h1>
          Approve Games
        </h1>
        <div className='pageContent'>
          {!showAnimation ? (
            <table>
              <thead>
                <tr>
                  {tableData.headers && tableData.headers.map((header, index) => (
                    <th key={index} style={{ ...tableHeader }}>{header.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}</th>
                  ))}
                  <th style={{ ...tableHeader }}>APPROVE</th>
                  <th style={{ ...tableHeader }}>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {tableData.data && tableData.data
                  .filter(row => !row.approved)
                  .map((row, index) => (
                    <tr key={index}>
                      {tableData.headers.map((header, index) => (
                        <td key={index} style={tableCell}>
                          {typeof row[header] === 'boolean' ? (
                            <input className='checkbox' type="checkbox" checked={row[header]} readOnly />
                          ) : (
                            row[header]
                          )}
                        </td>
                      ))}
                      <td style={{ ...tableCell }}>
                        <button onClick={() => handleApprove(row)} className='flipButton'> APPROVE GAME </button>
                      </td>
                      <td style={{ ...tableCell }}>
                        <button onClick={() => handleDelete(row)}>DEL</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div>
              <Lottie options={defaultOptions} height={400} width={400} />
              <h3 style={{ marginTop: "-5vh" }}>Nothing to see here...</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}