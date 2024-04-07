import React, { useState, useEffect } from 'react'
import { get, getDatabase,ref, onValue } from "firebase/database";

const Home = ({ onSelectSport }) => {

  const [sports, setSports] = useState();
  const [courts, setCourts] = useState();

  const db = getDatabase();
  const sportsRef = ref(db, 'sports');
  useEffect(() => {
    get(sportsRef).then((response) => {
      setSports(response.val());
    })
    onValue(sportsRef, (response) => {
      setSports(response.val());
    })
  }, [])

  const courtsRef = ref(db, 'courts');
  useEffect(() => {
    get(courtsRef).then((response) => {
      setCourts(response.val());
    })
    onValue(courtsRef, (response) => {
      setCourts(response.val());
    })
  }, [])

  const countTeams = (courtIds) => {
    let count = 0
    
    for (let i = 0; i < courtIds.length; i++) {
      const court = courts.find(c => c.id === courtIds[i]);

      if (court) {
        count += court.waitlist.length
      }
    }

    return count
  }

  return (
    <div className='w-full'>
      <header className="flex justify-center items-center h-32 sticky top-0 w-full bg-white">
				<div className="text-4xl font-bold">Home</div>
			</header>
      <div className='mx-4 flex flex-col items-center mb-32'>
        {sports && courts && sports.map((sport, index) => (
          <div key={index} className='w-full lg:w-2/4 p-4 flex flex-col justify-between rounded mb-4 bg-custom-red hover:bg-red-600' onClick={() => onSelectSport(sport)}>
            <div className="text-2xl text-white font-semibold tracking-wide mb-2">{sport.name}</div>
            <div className="flex flex-row justify-between text-lg italic">
              <div className="text-md">Courts: {sport.courts.length}</div>
              {sport?.courts && <div className="text-md">Teams Waiting: {countTeams(sport?.courts)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home