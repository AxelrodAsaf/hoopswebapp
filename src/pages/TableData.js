import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css';
import logo from '../logo.png';

export default function TableData(props) {
  const [tableData, setTableData] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStyle, setErrorStyle] = useState(false);
  const [activeButton, setActiveButton] = useState('games');
  const navigate = useNavigate();
  const tableHeader = { border: "2px solid black", width: "auto" }
  const tableCell = { border: "2px solid black", width: "auto" }

  function reloadPage() {
    window.location.reload();
  }

  const handleDelete = async (topic, itemId) => {
    // Send a request to the server to delete the item
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/remove${topic}`,
        {
          gameID: itemId.gameID,
          playerID: itemId.playerID
        })
      reloadPage();
      console.log(response);
    }
    catch (error) {
      setErrorStyle(true);
      setErrorMessage(error.message);
    }
  }

  const handleAdd = async (topic) => {
    setInputValues({ ...inputValues, participants: [] })
    // Send a request to the server to add the item using the inputData object
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/add${topic}`, inputValues);
      reloadPage();
      console.log(response);
    }
    catch (error) {
      setErrorStyle(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    async function getTableData(tableType) {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/${tableType}list`)
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
      const hideHeaders = ["gameID", "playerID", "approved"];
      const displayHeaders = headers.filter(header => !hideHeaders.includes(header));

      setTableData(prevData => ({
        ...prevData,
        [tableType]: {
          data: tableData,
          headers: displayHeaders
        }
      }));
    }

    async function getTables() {
      ["game", "player"].forEach(async (tableTopic) => {
        await getTableData(tableTopic);
      });
    }

    getTables();
  }, [])

  return (
    <div style={errorStyle ? {
      border: "red 5px solid",
      borderRadius: "5px",
      backgroundColor: "rgba(255,0,0, 0.15)"
    } : null}>
      <img src={logo} style={{ width: "10vw", height: "10vw", marginLeft: "0vw", marginTop: "0vh", marginBottom: "0vh", zIndex: "50" }} alt="logo" />
      <div className='tableData'>
        <div className='navbar' style={{ width: "50vw", height: "5vh", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <button onClick={() => navigate(`/dashboard`)}>BACK</button>
          <button onClick={() => navigate(`/login`)}>LOG OUT</button>
        </div>
        <h5 style={{ marginTop: "0vh" }}>Please make sure to check and uncheck boxes as needed.</h5>
        <div className='pageContent'>
          <div style={errorStyle ? {
            color: "red",
            fontWeight: "bold",
            fontSize: "200%",
            textDecoration: "underline",
          } : { display: "none" }}>
            {errorMessage}
          </div>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
            <button onClick={() => setActiveButton("games")} style={{ width: "20vw", justifyContent: "center", alignItems: "center", color: activeButton === "games" ? "#3a98b9" : "white", backgroundColor: activeButton === "games" ? "white" : "transparent", border: "white 1px solid", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>GAMES</  button>
            <button onClick={() => setActiveButton("players")} style={{ width: "20vw", justifyContent: "center", alignItems: "center", color: activeButton === "players" ? "#3a98b9" : "white", backgroundColor: activeButton === "players" ? "white" : "transparent", border: "white 1px solid", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>PLAYERS</button>
          </div>

          {activeButton === 'games' && tableData['game'] && (
            <>
              <p>Rows are sorted in reverse chronological order...</p>
              <table style={{ width: "100%", margin: "auto", marginBottom: "20px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {tableData['game'].headers.map((header, index) => (
                      <th key={index} style={{ ...tableHeader }}>
                        {header === "tlvpremium" ? "TLV Premium" : header === "" ? "Delete" : header.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData['game'].data
                    .sort((a, b) => {
                      const aDate = new Date(`${a['date'].substr(4, 4)}-${a['date'].substr(2, 2)}-${a['date'].substr(0, 2)}`);
                      const bDate = new Date(`${b['date'].substr(4, 4)}-${b['date'].substr(2, 2)}-${b['date'].substr(0, 2)}`);
                      return bDate - aDate;
                    })
                    .map((game, index) => (
                      <tr key={index}>
                        {tableData['game'].headers.map((header, index) => (
                          <td key={index} style={tableCell}>
                            {header === '' && (
                              <button onClick={() => handleDelete('game', { gameID: game['gameID'] })}>DELETE</button>
                            )}
                            {header !== '' && typeof game[header] === 'boolean' ? (
                              <input className='checkbox' type="checkbox" checked={game[header]} readOnly />
                            ) : (
                              header === 'date' ? (
                                game[header].slice(0, 2) + '.' + game[header].slice(2, 4) + '.' + game[header].slice(4)
                              ) : (
                                header === 'startTime' || header === 'endTime' ? (
                                  game[header].substring(0, 2) + ':' + game[header].substring(2)
                                ) : (
                                  game[header]
                                )
                              )
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  }
                  < tr className='addInformation'>
                    {tableData['game']?.headers.map((header, index) => (
                      <td key={index} style={tableCell}>
                        {
                          header === "delete" ? (
                            <button onClick={() => handleAdd('game')}>+</button>
                          ) :
                            header === 'approved' ||
                              header === 'tlvpremium' ||
                              header === 'indoor' ||
                              header === 'admin' ? (
                              null
                            ) : (
                              header === 'date' ||
                              header === 'startTime' ||
                              header === 'endTime' ||
                              header === 'maximumPlayers' ||
                              header === 'ageMin' ||
                              header === 'ageMax' ||
                              header === 'price' ||
                              header === 'courtNumber' ||
                              header === 'benchSpace'
                            ) ? (
                              // <input type="number" placeholder={header} onChange={(e) => setInputValues({ ...inputValues, [header]: e.target.value })} />
                              <input
                                type="number"
                                placeholder={header.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
                                onChange={(e) => setInputValues({ ...inputValues, [header]: e.target.value })} />
                            ) :
                              (
                                header.trim() !== '' && (
                                  <input
                                    placeholder={header.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
                                    onChange={(e) =>
                                      setInputValues({
                                        ...inputValues,
                                        [header]: e.target.value,
                                      })
                                    }
                                  />
                                )
                              )}
                      </td>
                    ))}
                    <td style={tableCell}>
                      <button onClick={() => handleAdd('game')}>+</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}

          {activeButton === 'players' && tableData['player'] && (
            <>
              <p>Rows are sorted by players' last names in alphabetical order...</p>
              <table style={{ width: "100%", margin: "auto", marginBottom: "20px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {tableData['player'].headers.map((header, index) => (
                      <th key={index} style={{ ...tableHeader }}>
                        {header === "" ? "Delete" : header.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData['player'].data.sort((a, b) => a.lastName.localeCompare(b.lastName)).map((player, index) => (
                    <tr key={index}>
                      {tableData['player'].headers.map((header, index) => (
                        <td key={index} style={tableCell}>
                          {header === '' && (
                            <button onClick={() => handleDelete('player', { playerID: player['playerID'] })}>DELETE</button>
                          )}
                          {typeof player[header] === 'boolean' ? (
                            <input className='checkbox' type="checkbox" checked={player[header]} readOnly />
                          ) : (
                            header === 'birthDate' ? (
                              player[header].slice(0, 2) + '.' + player[header].slice(2, 4) + '.' + player[header].slice(4)
                            ) : (
                              header === 'createdAt' || header === 'updatedAt' ? (
                                new Date(player[header]).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' ')
                              ) : (
                                player[header]
                              )
                            )
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}




        </div>
      </div>
    </div >
  );
}
