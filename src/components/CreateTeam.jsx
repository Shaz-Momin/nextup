import React, { useState, useEffect } from 'react'
import { getDatabase, get, ref, onValue, set } from 'firebase/database'

const CreateTeam = (sportId, setCreateTeam) => {

  const [sports, setSports] = useState()
  const [players, setPlayers] = useState()
  const [teams, setTeams] = useState()
  const [courts, setCourts] = useState()
  const db = getDatabase()

  const playersRef = ref(db, 'players');
  useEffect(() => {
      get(playersRef).then((response) => {
          setPlayers(response.val());
      })
      onValue(playersRef, (response) => {
          setPlayers(response.val());
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


  const sportsRef = ref(db, 'sports');
  useEffect(() => {
    get(sportsRef).then((response) => {
      setSports(response.val());
    })
    onValue(sportsRef, (response) => {
      setSports(response.val());
    })
  }, [])



  const [sport, setSport] = useState()
  useEffect(() => {
    if (sports) {
      setSport(sports.find(s => s.id === sportId));
    }
  }, [sports])

  let [teamSaved, setTeamSaved] = useState(false)
  let [currentPlayers, setCurrentPlayers] = useState([])
  let [sportCategory, setSportCategory] = useState("")
  let [teamInfo, setTeamInfo] = useState({name: '', sport: '', avgSkillLevel: 0})


  const teamsRef = ref(db, 'teams');
  useEffect(() => {
    get(teamsRef).then((response) => {
      setTeams(response.val());
    })
    onValue(teamsRef, (response) => {
      setTeams(response.val());
    })
  }, [])

  useEffect(() => {
    if (teams) {
      for (const teamId in teams) {
        const team = teams[teamId]
        if (team.players.includes(60)) {
          setTeamSaved(true)
          for (const sportId in sports) {
            const currSport = sports[sportId]
            const currSportName = currSport.type
            for (const courtId in currSport.courts) {
              const currCourt = courts[currSport.courts[courtId] - 1]
              if (currCourt.waitlist.includes(team.id)) {
                setSportCategory(currSportName)
              }
            }
          }
          const teamRef = ref(db, 'teams/' + (team.id - 1))
          get(teamRef).then((response) => {
            setTeamInfo(response.val())
            setCurrentPlayers(response.val().players)
          })
        }
      }
    }
  }, [teams])

  // const countTeams = (courtIds) => {
  //   let count = 0
    
  //   for (let i = 0; i < courtIds.length; i++) {
  //     if (courts) {
  //       const court = courts.find(c => c.id === courtIds[i]);
  //     }

  //     if (court) {
  //       count += court.waitlist.length
  //     }
  //   }

  //   return count
  // }

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
    let player;
    if (players) {
      player = players.find(p => p.name === playerUsername)
    }
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

  const leaveTeam = () => {
    const teamPlayersRef = ref(db, 'teams/' + (teamInfo.id - 1) + '/' + "players")
    get(teamPlayersRef).then((response) => {
        const teamPlayers = response.val();
        const newTeam = []
        teamPlayers.forEach((player) => {
          if (player !== 60) {
            newTeam.push(player)
          }
        })
        set(teamPlayersRef, newTeam);
        setTeamInfo({name: '', sport: '', avgSkillLevel: 0})
        setTeamSaved(false)
    })
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
                  {sports && sports.map((sport, index) => (
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
              {players && currentPlayers.map((playerId, index) => {
                const player = players.find(p => p.id === playerId)
                if (player) {
                  return (
                    <div key={index} className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800'>
                      <div className="text-xl">{player.name}</div>
                      <div className="flex flex-row justify-between">
                      <div className="text-sm">Skill: {player.sportsInfo[sportCategory].skillLevel}</div>
                      <div className="text-sm">Phone Number: {player.phone}</div>
                    </div>
                </div>
                  )
                }
              })}
            </div>
            <button className="p-2 bg-slate-300 text-slate-800 rounded border border-slate-800 my-4" onClick={() => leaveTeam()}>Leave Team</button>
          </>
          }
        </div>
      </div>
    </div>
  )
}

export default CreateTeam