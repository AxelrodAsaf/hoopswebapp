import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css';

export default function ApproveGames() {

  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const tableHeader = { border: "2px solid black" }
  const tableCell = { border: "2px solid black" }

  function reloadPage() {
    window.location.reload();
  }

  useEffect(() => {
    async function getTableData() {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/allGamesList`)
      const tableData = response.data.map(tableItem => {
        const keysToRemove = ['createdByUser', '_id', 'password', '__v', 'requests'];
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

      setTableData(prevData => ({
        ...prevData,
        data: tableData,
        headers: displayHeaders
      }));
    }

    async function getTables() {
      ["game", "player"].forEach(async (tableTopic) => {
        await getTableData(tableTopic);
      });
    }

    getTables();
  }, [])

  const handleApprove = async (row) => {
    // Send a request to the server to approve the item
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/approveGame`,
        {
          gameID: row.gameID,
        })
      console.log(response)
      reloadPage();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const handleDelete = async (row) => {
    // Send a request to the server to delete the item
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/removeGame`,
        {
          gameID: row.gameID,
        })
      console.log(response)
      reloadPage();
    }
    catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>
      <button onClick={() => navigate(`/dashboard`)}>BACK</button>
      <button onClick={() => navigate(`/login`)}>LOG OUT</button>
      <h1>
        Approve Games
      </h1>
      <div className='pageContent'>
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
                  {tableData.headers && tableData.headers.map((header, index) => (
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
      </div>
    </div>
  )
}