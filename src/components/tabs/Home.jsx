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
      <header className="flex justify-center items-center h-32">
				<div className="text-4xl font-bold">Home</div>
			</header>
      <div className='mx-4 flex flex-col items-center'>
        {sports && courts && sports.map((sport, index) => (
          <div key={index} className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800' onClick={() => onSelectSport(sport)}>
            <div className="text-xl">{sport.name}</div>
            <div className="flex flex-row justify-between">
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