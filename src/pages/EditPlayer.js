import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import logo from '../logo.png';

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
      const response = await axios.post(
        'http://localhost:9999/editPlayer',
        userUpdateObject
      );
      if (response.status === 200) {
        setErrorMessage('Player updated successfully');
        setErrorStyle(true);
      }
    } catch (error) {
      setErrorStyle(true);
      setErrorMessage(error.message);
    }
  };



  useEffect(() => {
    const getData = async () => {
      try {
        // Get the list of users from the database using an axios post request
        const response = await axios.post('http://localhost:9999/playerList')
        const playerList = response.data;
        setPlayerList(playerList);
        // Get the keys of the first player's object
        setErrorStyle(true);
        setErrorMessage(response.message);
      } catch (error) {
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
          padding: "3vh"
        } : { display: "none" }}>
          {errorMessage}
        </div>

          <img src={logo} style={{ width: "10vw", height: "10vw", marginLeft: "0vw", marginTop: "-3vh", marginBottom: "0vh", zIndex: "50" }} alt="logo" />
          <div>
            <button onClick={() => navigate(`/dashboard`)}>BACK</button>
            <button onClick={() => navigate(`/login`)}>LOG OUT</button>
          </div>
          <h1>EDIT A PLAYER</h1>
          <h3>
            Enter the fields that are necessary to update and click "Update"
          </h3>
        </div>
        <div>
          <label htmlFor="email">Email: </label><br />
          <select onChange={playerProfilePicked} value={selectedPlayerObject && selectedPlayerObject.email}>
            {selectedPlayerObject ?
              (
                playerList
                  .sort((a, b) => a.email.localeCompare(b.email)) // Sort the array alphabetically by email
                  .map((player) => (
                    <option key={player.email} value={player.email}>
                      {player.email}
                    </option>
                  ))
              ) : (
                <>
                  <option value="">Select a Player</option>
                  {playerList
                    .sort((a, b) => a.email.localeCompare(b.email)) // Sort the array alphabetically by email
                    .map((player) => (
                      <option key={player.email} value={player.email}>
                        {player.email}
                      </option>
                    ))
                  }
                </>
              )
            }

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
            <button style={{ width: "5vw", height: "3vh" }} onClick={handleUpdate}>UPDATE</button>
          }
        </div>
      </div>
    </div>
  )
}
