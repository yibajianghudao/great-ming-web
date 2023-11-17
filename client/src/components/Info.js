import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ApiUrl} from "./config";

function Info({ currentUser }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Added a loading state

  useEffect(() => {
    console.log(currentUser);
    if(currentUser) {
      axios.get(`${ApiUrl}/users/${currentUser}`)
        .then(response => {
            setUser(response.data[0]);
            setLoading(false);  // Set loading to false once data is fetched
        })
        .catch(error => {
            console.log(error);
            setLoading(false);  // Also set loading to false in case of an error to not leave the user hanging
        });
    } else {
      setLoading(false);  // If currentUser is not available, we also set loading to false to indicate no data is coming.
    }
  }, [currentUser]);

  return (
    <div className="Info">
      {loading ? (
        // Show a loading message while the data is being fetched
        <p>Loading user data...</p>
      ) : (
        // Render the user data once it's available
        <>
          <h1>User Details</h1>
          <p>Username: {user.username}</p>
          <p>Tag: {user.tag}</p>
          <p>Rank: {user.ranks}</p>
          <p>Company: {user.company}</p>
          <p>Kills: {user.kills}</p>
          <p>Attandance: {user.attendance}</p>
          <p>Balance: {user.balance}</p>
          <p>Creat at: {user.create_at}</p>
          {/* You can add other user fields similarly */}
        </>
      )}
    </div>
  );
}

export default Info;
