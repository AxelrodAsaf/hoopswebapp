import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Default() {
  const navigate = useNavigate();
  const [playerList, setPlayerList] = useState([]);
  const [playerKeys, setPlayerKeys] = useState([]);
  const [selectedPlayerObject, setSelectedPlayerObject] = useState();
  const [updatedPlayer, setUpdatedPlayer] = useState({});
  const [errorStyle, setErrorStyle] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleUpdate = async () => {
    try {
      const userUpdateObject = {
        ...updatedPlayer,
        email: selectedPlayerObject.email,
      };
      console.log(userUpdateObject);
      const response = await axios.post(
        'https://tlv-hoops-server.onrender.com/editPlayer',
        userUpdateObject
      );
      console.log(response);
    } catch (error) {
      console.log(error);
      setErrorStyle(true);
      setErrorMessage(error.message);
    }
  };



  useEffect(() => {
    const getData = async () => {
      try {
        // Get the list of users from the database using an axios post request
        const response = await axios.post('https://tlv-hoops-server.onrender.com/playerList')
        const playerList = response.data;
        // console.log(playerList);
        setPlayerList(playerList);
        // Get the keys of the first player's object
        setErrorStyle(true);
        setErrorMessage(response.message);
      } catch (error) {
        console.log(error);
        setErrorStyle(true);
        setErrorMessage(error.message);
      }
    };
    getData();
  }, []);
  const playerProfilePicked = async (e) => {
    if (playerList.length > 0) {
      setPlayerKeys(Object.keys(playerList[0]));
      setSelectedPlayerObject(playerList.find(player => player.email === e.target.value))
      // Set the default value of each input field to the value of the corresponding player object property
      Object.keys(playerList[0]).forEach((key) => {
        if (key !== '_id' &&
          key !== '__v' &&
          key !== 'password' &&
          key !== 'email' &&
          key !== 'playerID' &&
          key !== 'requests') {
        }
      });
    }
  }


  return (
    <div>
      <div>
        <div style={{ marginTop: "5vh" }}><div style={errorStyle ? {
          color: "red",
          fontWeight: "bold",
          fontSize: "200%",
          textDecoration: "underline",
        } : { display: "none" }}>
          {errorMessage}
        </div>
          <div>
            <button style={{ marginTop: "5vh", width: "20%", height: "80%" }} onClick={() => navigate(`/dashboard`)}>BACK</button>
            <button style={{ marginTop: "5vh", width: "20%", height: "80%" }} onClick={() => navigate(`/login`)}>LOG OUT</button>
          </div>
          <h1>EDIT A PLAYER</h1>
          <h3>
            Enter the fields that are necessary to update and click "Update"
          </h3>
        </div>
        <div>
          <label htmlFor="email">Email: </label><br />
          <select onChange={playerProfilePicked} value={selectedPlayerObject && selectedPlayerObject.email}>
            {selectedPlayerObject ? (
              playerList.map((player) => (
                <option key={player.email} value={player.email}>
                  {player.email}
                </option>
              ))
            ) : (
              <>
                <option value="">Select a Player</option>
                {playerList.map((player) => (
                  <option key={player.email} value={player.email}>
                    {player.email}
                  </option>
                ))}
              </>
            )}
          </select>
          {playerKeys.length > 0 &&
            <div>
              {playerKeys.map((key) => (
                key !== '_id' &&
                key !== '__v' &&
                key !== 'password' &&
                key !== 'email' &&
                key !== 'playerID' &&
                key !== 'requests' &&
                key !== 'createdAt' &&
                key !== 'updatedAt' &&
                <div key={key} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  {key === 'admin' ?
                    <div>
                      <br />
                      <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}: </label>
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={updatedPlayer.admin ?? selectedPlayerObject.admin}
                        onChange={(e) => {
                          setUpdatedPlayer({ ...updatedPlayer, admin: e.target.checked });
                        }}
                      />
                    </div>
                    :
                    <div style={{ width: "15%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <br />
                      <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })}: </label>
                      <input type="text" id={key} name={key} placeholder={updatedPlayer[key] ?? selectedPlayerObject[key]} onChange={(e) => setUpdatedPlayer({ ...updatedPlayer, [key]: e.target.value })} />
                    </div>
                  }
                </div>
              ))}
              <br />
              <br />
            </div>
          }
          {playerKeys.length > 0 &&
            <button onClick={handleUpdate}>UPDATE</button>
          }
        </div>
      </div>
    </div>
  )
}
