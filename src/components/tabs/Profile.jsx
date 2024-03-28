import React from 'react';
import { FaCog } from 'react-icons/fa';
import players from '../../data/players.json';

const Profile = () => {
  const user = players.find(u => u.id === 1);

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
    </div>
  );
};

export default Profile;
