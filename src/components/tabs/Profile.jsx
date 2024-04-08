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
      setUser(players.find(u => u.id === 60))
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
    <div className="w-full m-8 lg:max-w-screen-sm">
      <div className="float-right">
        <button style={{ fontSize: '24px', cursor: 'pointer', border: 'none', background: 'none' }}>
          <FaCog />
        </button>
      </div>
      {players && user && <>
      <div className="flex">
        <img src={user.profilePhoto} alt="profile" style={{ width: '150px', borderRadius: '50%' }} />
        <div className="flex flex-col items-left justify-center pl-5">
          <h1 className="text-3xl font-semibold">{user.name}</h1>
          <p className="italic text-md">Phone: {user.phone}</p>
        </div>
      </div>
      <div className="w-full my-6">
        <h2 className="text-center font-semibold uppercase tracking-wide text-xl text-custom-red">Sports Information</h2>
        <div className="py-4">
          {Object.entries(user.sportsInfo).map(([sport, { position, skillLevel }]) => (
            <div key={sport} className="mb-4 bg-custom-green px-6 py-4 rounded-lg">
              <h3 className="font-semibold italic text-xl mb-1">{sport}</h3>
              <p className="flex justify-between text-lg">
                <span>Position:</span>
                <span className="italic">{position}</span>
              </p>
              <p className="flex justify-between text-lg">
                <span>Skill Level:</span>
                <span className="text-xl tracking-wider">{renderStars(skillLevel)}</span></p>
            </div>
          ))}
        </div>
      </div>
      </>}
    </div>
  );
};

export default Profile;
