import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

export default function TableData(props) {
  const [tableData, setTableData] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStyle, setErrorStyle] = useState(false);
  const [activeButton, setActiveButton] = useState('games');
  const navigate = useNavigate();
  const tableHeader = { border: "2px solid black" }
  const tableCell = { border: "2px solid black" }

  function reloadPage() {
    window.location.reload();
  }

  const handleDelete = async (topic, itemId) => {
    // Send a request to the server to delete the item
    console.log(itemId);
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/remove${topic}`,
        {
          gameID: itemId.gameID,
          playerID: itemId.playerID
        })
      console.log(response)
      reloadPage();
    }
    catch (error) {
      console.log(error.message);
      setErrorStyle(true);
      setErrorMessage(error.message);
    }
  }

  const handleAdd = async (topic) => {
    console.log(`Trying to add information.`);
    console.log("Topic:", topic);
    console.log(inputValues)
    setInputValues({ ...inputValues, participants: [] })
    // Send a request to the server to add the item using the inputData object
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/add${topic}`, inputValues);
      console.log(response);
      // reloadPage();
    }
    catch (error) {
      console.log(error.message);
      setErrorStyle(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    async function getTableData(tableType) {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/${tableType}list`)
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
      <div className='tableData'>
        <div className='navbar' style={{ width: "50vw", height: "5vh", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <button style={{ marginTop: "5vh", width: "20%", height: "80%" }} onClick={() => navigate(`/dashboard`)}>BACK</button>
          <button style={{ marginTop: "5vh", width: "20%", height: "80%" }} onClick={() => navigate(`/login`)}>LOG OUT</button>
        </div>
        <h5>Please make sure to check and uncheck boxes as needed.</h5>
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
            <button onMouseEnter={(e) => e.target.style.color = "black"} onClick={() => setActiveButton("games")} style={{ color: "black", width: "20vw", justifyContent: "center", alignItems: "center", backgroundColor: activeButton === "games" ? "white" : "transparent", border: "none", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>GAMES</  button>
            <button onMouseEnter={(e) => e.target.style.color = "black"} onClick={() => setActiveButton("players")} style={{ color: "black", width: "20vw", justifyContent: "center", alignItems: "center", backgroundColor: activeButton === "players" ? "white" : "transparent", border: "none", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>PLAYERS</button>
          </div>

          {["game", "player"].map(topic => (
            <div className='topicTable' key={topic}>
              <h1 style={{ textTransform: "uppercase" }}>{`${topic}s`}</h1>
              <table className='tableStyling'>
                <thead>
                  <tr>
                    {tableData[topic]?.headers.map((header, index) => (
                      <th key={index} style={{ ...tableHeader }}>{header === "tlvpremium" ? "TLV Premium" :
                        header.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
                          return str.toUpperCase();
                        })}</th>
                    ))}
                    <th>+/x</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData[topic]?.data.map((item, index) => (
                    <tr key={index} style={tableCell}>
                      {tableData[topic]?.headers.map((header, index) => (
                        <td key={index} style={tableCell}>
                          {typeof item[header] === 'boolean' ? (
                            <input className='checkbox' type="checkbox" checked={item[header]} readOnly />
                          ) : (
                            item[header]
                          )}
                        </td>
                      ))}
                      <td style={tableCell}>
                        <button onClick={() => handleDelete(topic, item)}>X</button>
                      </td>
                    </tr>
                  ))}
                  {topic !== 'player' && (
                    <tr className='addInformation'>
                      {tableData[topic]?.headers.map((header, index) => (
                        <td key={index} style={tableCell}>
                          {header === 'approved' ||
                            header === 'tlvpremium' ||
                            header === 'indoor' ||
                            header === 'lockerRoom' ||
                            header === 'bathroom' ||
                            header === 'showers' ||
                            header === 'vendingMachine' ||
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
                            <input type="number" placeholder={header} onChange={(e) => setInputValues({ ...inputValues, [header]: e.target.value })} />
                          ) :
                            (
                              header.trim() !== '' && (
                                <input
                                  placeholder={header}
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
                        <button onClick={() => handleAdd(topic)}>+</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
