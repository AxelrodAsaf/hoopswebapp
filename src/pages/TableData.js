import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TableData(props) {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const tableStyling = { borderCollapse: "collapse", border: "2px solid black", backgroundColor: "rgba(0, 0, 0, 0.15)", width: "100%" }
  const tableHeader = { border: "2px solid black" }
  const tableCell = { border: "2px solid black" }

  const handleDelete = async (topic, itemId) => {
    // eslint-disable-next-line
    const response = await axios.delete(`https://tlv-hoops-server.onrender.com/${topic}/${itemId._id}`);
    // remove the deleted item from the data and update the state
    const newData = tableData[topic].data.filter(item => item._id !== itemId);
    setTableData(prevData => ({
      ...prevData,
      [topic]: {
        ...prevData[topic],
        data: newData
      }
    }));
  }

  useEffect(() => {
    async function getTableData(tableType) {
      const response = await axios.post(`https://tlv-hoops-server.onrender.com/${tableType}list`)
      const tableData = response.data.map(tableItem => {
        const keysToRemove = ['gameID', 'playerID', '=', 'locationName', 'createdByUser', '_id', 'password', '__v'];
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

      setTableData(prevData => ({
        ...prevData,
        [tableType]: {
          data: tableData,
          headers: [...Object.keys(tableData[0]), '']
        }
      }));
    }

    async function getTables() {
      const tableTopics = ["game", "player", "location"];
      for (const tableTopic of tableTopics) {
        await getTableData(tableTopic);
      }
    }

    getTables();
  }, [])

  return (
    <div className='all'>
      <div style={{ display: "flex", width: "95%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "10%", height: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
          <h1 onClick={() => navigate(`/dashboard`)}>Main</h1>
          <h1 onClick={() => navigate(`/addData`)}>Add</h1>
        </div>
        <br />
        <div style={{ width: "90%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
          {["game", "player", "location"].map(topic => (
            <div key={topic}>
              <h1>{`All ${topic}s`}</h1>
              <table style={tableStyling}>
                <thead>
                  <tr>
                    {tableData[topic]?.headers.map((header, index) => (
                      <th key={index} style={tableHeader}>{header}</th>
                    ))}
                    <th>Delete</th>
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
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}