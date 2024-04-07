import React, { useState, useEffect } from 'react';
import { get, getDatabase,ref, onValue } from "firebase/database";
import { FaCog } from 'react-icons/fa';

const Profile = () => {

  const [players, setPlayers] = useState();
  const db = getDatabase();

  const playersRef = ref(db, 'players');
    useEffect(() => {
        get(playersRef).then((response) => {
            setPlayers(response.val());
        })
        onValue(playersRef, (response) => {
            setPlayers(response.val());
        })
    }, [])

  const [user, setUser] = useState();
  useEffect(() => {
    if (players) {
      setUser(players.find(u => u.id === 1))
    }
  }, [players])

  const renderStars = (level) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= level ? '#FFD700' : '#CCCCCC' }}>★</span>
      );
    }
    return stars;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'right' }}>
        <button style={{ fontSize: '24px', cursor: 'pointer', border: 'none', background: 'none' }}>
          <FaCog />
        </button>
      </div>
      {players && user && <>
      <div style={{ textAlign: 'center' }}>
        <img src={user.profilePhoto} alt="profile" style={{ width: '150px', borderRadius: '50%' }} />
        <h1>{user.name}</h1>
        <p>Phone: {user.phone}</p>
      </div>
      <div>
        <h2>Sports Information:</h2>
        {Object.entries(user.sportsInfo).map(([sport, { position, skillLevel }]) => (
          <div key={sport}>
            <h3>{sport}</h3>
            <p>Position: {position}</p>
            <p>Skill Level: {renderStars(skillLevel)}</p>
          </div>
        ))}
      </div>
      </>}
    </div>
  );
};

export default Profile;
