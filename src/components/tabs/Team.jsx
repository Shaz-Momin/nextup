import React, { useState, useEffect } from 'react';
import { get, getDatabase, ref, onValue } from "firebase/database";
import CreateTeam from '../CreateTeam'

const Team = () => {

  const [teams, setTeams] = useState()
  const db = getDatabase()

  const teamsRef = ref(db, 'teams');
    useEffect(() => {
        get(teamsRef).then((response) => {
            setTeams(response.val());
        })
        onValue(teamsRef, (response) => {
            setTeams(response.val());
        })
    }, [])



  const [createTeam, setCreateTeam] = useState(true) // change this to see your teams vs create teams

  const currTeam = () => {
    let team = []
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].name === 'Lions') {
        team = teams[i]
        break
      }
    }

    return team
  }

  return (
    <div className='w-full'>
      {teams && (createTeam ? <CreateTeam sportId={1} setCreateTeam={setCreateTeam} /> :
      <>
        <header className="flex justify-center items-center h-32">
          <div className="text-4xl font-bold">Team</div>
        </header>
        <div className='mx-4'>
          <div className='text-lg font-semibold my-2'>Your Team:</div>
          <div className='w-full p-2 rounded border-slate-900 border mb-4'>
            <div className="text-xl">{currTeam().name}</div>
            <div className="text-md">Sport: {currTeam().sport}</div>
            <div className="text-md">Players: {currTeam().players.length}</div>
          </div>
        </div>
      </>
      
      )}
    </div>
  )
}

export default Team