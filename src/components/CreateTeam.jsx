import React, { useState } from 'react'
import sports from '../data/sports.json'
import courts from '../data/courts.json'
import players from '../data/players.json'

const CreateTeam = (sportId, setCreateTeam) => {
  const sport = sports.find(s => s.id === sportId);
  let [currentPlayers, setCurrentPlayers] = useState([1])

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

  const addPlayer = (playerUsername) => {
    const player = players.find(p => p.name === playerUsername)
    if (player) {
      setCurrentPlayers([...currentPlayers, player.id])
    }
  }



  return (
    <div>
      <header className="flex justify-center items-center h-32">
        <div className="text-4xl font-bold">Create Your Team</div>
      </header>
      <div>
        <div className='mx-4 flex flex-col justify-center items-center text-xl'>
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
            <div className='flex flex-row p-2'>
              <label for="playerUsername" className='font-semibold mr-2'>Add players (by username):</label><br />
              <input type="text" id="playerUsername" name="playerUsername" placeholder='Player 1' required /><br />
            </div>
            <button type='button' onClick={() => addPlayer(document.getElementById('playerUsername').value)}>Add Player</button>
          </form>
          <div>
            <div className='text-xl mt-4 underline'>Players on the team</div>
            {currentPlayers.map((playerId, index) => {
              const player = players.find(p => p.id === playerId)
              return (
                <div key={index} className='p-2'>
                  {player.name}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTeam