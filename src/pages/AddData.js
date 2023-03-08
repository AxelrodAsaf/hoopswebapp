import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TableData(props) {
  // eslint-disable-next-line
  const tableTopics = ["game", "player", "location"];

  const navigate = useNavigate();
  const [topicData, setTopicData] = useState({});

  // Fetch data for each topic and store it in state
  useEffect(() => {
    async function fetchData() {
      const newData = {};
      for (const topic of tableTopics) {
        const response = await axios.post(`https://tlv-hoops-server.onrender.com/${topic}list`);
        newData[topic] = response.data;
      }
      setTopicData(newData);
    }
    fetchData();
  }, [tableTopics]);

  // Get the keys for a given topic
  const getKeysForTopic = (topic) => {
    if (topicData[topic] && topicData[topic].length > 0) {
      return (
        Object.keys(topicData[topic][0])
          // If there is a key with the name "__v", remove it
          .filter(key => key !== "__v")
          .filter(key => key !== "_id")
          .filter(key => key !== "password")
          .filter(key => key !== "gameID")
          .filter(key => key !== "locationID")
          .filter(key => key !== "playerID")
          .filter(key => key !== "participants")
          .filter(key => key !== "approved")
      )
    }
    return [];
  };

  return (
    <div className='all'>
      <div style={{ display: "flex", width: "95%", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "10%", height: "100%", textAlign: "left", display: "flex", flexDirection: "column" }}>
          <h1 onClick={() => navigate(`/dashboard`)}>Main</h1>
          <h1 onClick={() => navigate(`/tabledata`)}>Data</h1>
        </div>
        <br />
        <div style={{ width: "90%", height: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
          {tableTopics.map(topic => {
            return (
              <div key={topic} style={{ display: "flex", flexDirection: "column" }}>
                <h3>{topic}</h3>
                {getKeysForTopic(topic).map(key => (
                  <input key={key} placeholder={key.toUpperCase()} style={{ width: "100%" }} />
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
