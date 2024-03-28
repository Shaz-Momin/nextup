import React, { useState } from 'react'
import sports from '../data/sports.json'
import courts from '../data/courts.json'
import players from '../data/players.json'

const CreateTeam = (sportId, setCreateTeam) => {
  const sport = sports.find(s => s.id === sportId);
  let [teamSaved, setTeamSaved] = useState(false)
  let [currentPlayers, setCurrentPlayers] = useState([])
  let [sportCategory, setSportCategory] = useState("")
  let [teamInfo, setTeamInfo] = useState({name: '', sport: '', avgSkillLevel: 0})

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

  const createTeam = (e) => {
    e.preventDefault()
    const teamName = document.getElementById('teamName').value
    const sport = document.getElementById('sportSelection').value

    if (teamName === '' || sport === '') return

    setTeamSaved(true)

    setTeamInfo({name: teamName, sport: sports[sport - 1].name, avgSkillLevel: 3})
    setSportCategory(sports[sport - 1].type)
    setCurrentPlayers([1])

  }

  const addPlayer = (playerUsername) => {
    if (playerUsername === '') return

    const player = players.find(p => p.name === playerUsername)
    if (player) {
      if (currentPlayers.includes(player.id)) {
        alert('Player already in team')
        return
      }

      setCurrentPlayers([...currentPlayers, player.id])
    } else {
      alert('Player not found')
    }
  }



  return (
    <div>
      <header className="flex flex-col justify-center items-center h-32">
        <div className="text-4xl font-bold">{teamSaved ? teamInfo.name : "Create Your Team"}</div>
        {teamSaved && <div className="text-md italic">{teamInfo.sport}</div>}
      </header>
      <div>
        <div className='mx-4 flex flex-col justify-center items-center text-xl'>
          {!teamSaved &&
            <form>
              <div className='flex flex-row p-2'>
                <label for="teamName" className='font-semibold mr-2'>Team Name:</label><br />
                <input type="text" id="teamName" name="teamName" placeholder='Vikings' required /><br />
              </div>
              <div className='flex flex-row p-2'>
                <label for="sportSelection" className='font-semibold mr-2'>Select sport:</label><br />
                <select id="sportSelection" name="sportSelection" required>
                  {sports.map((sport, index) => (
                    <option key={index} value={sport.id}>{sport.name}</option>
                  ))}
                </select>
              </div>
              <div className='flex justify-center items-center my-4'>
                <input type='submit' className="p-2 bg-slate-300 text-slate-800 rounded border border-slate-800" onClick={(e) => createTeam(e)} value="Save Team"/>
              </div>
            </form>
          }
          {teamSaved && 
          <>
            <div className='flex flex-row items-center p-2'>
              <label for="playerUsername" className='font-semibold mr-2'>Add players:</label><br />
              <input className="p-2 border border-slate-500 rounded" type="text" id="playerUsername" name="playerUsername" placeholder='username' required /><br />
            </div>
            <button className="p-2 bg-slate-300 text-slate-800 rounded border border-slate-800 my-4" onClick={() => addPlayer(document.getElementById('playerUsername').value)}>Add Player</button>
            <div className='w-full flex flex-col'>
              <div className='text-xl my-4 underline text-center'>Players on the team</div>
              {currentPlayers.map((playerId, index) => {
                const player = players.find(p => p.id === playerId)
                return (
                  <div key={index} className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800'>
                    <div className="text-xl">{player.name}</div>
                    <div className="flex flex-row justify-between">
                    <div className="text-sm">Skill: {player.sportsInfo[sportCategory].skillLevel}</div>
                    <div className="text-sm">Phone Number: {player.phone}</div>
                  </div>
              </div>
                )
              })}
            </div>
          </>
          }
        </div>
      </div>
    </div>
  )
}

export default CreateTeam