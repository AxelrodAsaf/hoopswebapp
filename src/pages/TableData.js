import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../src/App.css'

export default function TableData(props) {
  const [tableData, setTableData] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [errorStyle, setErrorStyle] = useState(false);
  const navigate = useNavigate();
  const tableStyling = { borderCollapse: "collapse", border: "2px solid black", backgroundColor: "rgba(0, 0, 0, 0.15)", width: "100%" }
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
          locationID: itemId.locationID,
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
    // Send a request to the server to add the item using the inputData object
    try {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/add${topic}`, inputValues);
      console.log(response);
      reloadPage();
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
        const keysToRemove = ['locationName', 'createdByUser', '_id', 'password', '__v'];
        const cleanedTableItem = Object.keys(tableItem).reduce((acc, key) => {
          if (!keysToRemove.includes(key)) {
            acc[key] = tableItem[key];
          }
          if (key === 'participants') {
            acc[key] = (
              <ul>
                {tableItem[key].map(participant => (
                  <li>{participant.firstName} {participant.lastName}</li>
                ))}
              </ul>
            );
          }
          return acc;
        }, {});
        return cleanedTableItem;
      })
      const headers = [...Object.keys(tableData[0]), ''];
      const hideHeaders = ["gameID", ".", "playerID"];
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
      ["game", "player", "location"].forEach(async (tableTopic) => {
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
          <button style={{ marginTop: "5vh", width: "25%", height: "100%", fontWeight: "bold", backgroundColor: "teal", color: "white" }} onClick={() => navigate(`/login`)}>LOG OUT</button>
          <button style={{ marginTop: "5vh", width: "25%", height: "100%", fontWeight: "bold", backgroundColor: "teal", color: "white" }} onClick={() => navigate(`/dashboard`)}>BACK</button>
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
          {["game", "location", "player"].map(topic => (
            <div className='topicTable' key={topic}>
              <h1 style={{ textTransform: "uppercase" }}>{`${topic}s`}</h1>
              <table style={tableStyling}>
                <thead>
                  <tr>
                    {tableData[topic]?.headers.map((header, index) => (
                      <th key={index} style={{ ...tableHeader }}>{header}</th>
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
                            <input type="checkbox" checked={item[header]} readOnly />
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
                            <input
                              type="checkbox"
                              onChange={(e) =>
                                setInputValues({
                                  ...inputValues,
                                  [header]: e.target.checked,
                                })
                              }
                            />
                          ) : (header === 'participants') ? (
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
