import React, { useState, useEffect } from 'react'
import { getDatabase, get, ref, onValue, set, push } from 'firebase/database'

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

  const [teamSaved, setTeamSaved] = useState(false)
  const [currentPlayers, setCurrentPlayers] = useState([])
  const [sportCategory, setSportCategory] = useState("")
  const [sportMax, setSportMax] = useState()
  const [teamInfo, setTeamInfo] = useState({name: '', avgSkillLevel: 0})
  const [teamSport, setTeamSport] = useState("")
  const [currentCourt, setCurrentCourt] = useState()


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
            const currSportType = currSport.type
            const currSportName = currSport.name
            for (const courtId in currSport.courts) {
              const currCourt = courts[currSport.courts[courtId] - 1]
              if (currCourt.waitlist.includes(team.id)) {
                setSportCategory(currSportType)
                setTeamSport(currSportName)
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

  const createTeam = (e) => {
    e.preventDefault()
    const teamName = document.getElementById('teamName').value
    const sport = document.getElementById('sportSelection').value

    if (teamName === '' || sport === '') return

    setTeamSaved(true)

    setSportCategory(sports[sport - 1].type)
    setSportMax(sports[sport - 1].maxPlayers)
    setCurrentPlayers([60])
    setTeamSport(sports[sport - 1].name)
    setTeamInfo({name: teamName, avgSkillLevel: 3, players: currentPlayers})
  }

  useEffect(() => {
    setTeamInfo({
      name: teamInfo.name,
      avgSkillLevel: teamInfo.avgSkillLevel,
      players: currentPlayers,
      id: teamInfo.id
    })
  }, [currentPlayers])

  useEffect(() => {
    if(!teamInfo.id) {
      teamInfo.id = teams?.length + 1
    }
    if (teamInfo.players?.length > 0) {
      const thisTeamRef = ref(db, 'teams/' + (teamInfo.id - 1))
      set(thisTeamRef, teamInfo);
      let onCourt = false;
      for (const sportId in sports) {
        const currSport = sports[sportId]
        for (const courtId in currSport.courts) {
          const currCourt = courts[currSport.courts[courtId] - 1]
          if (currCourt.waitlist.includes(teamInfo.id)) {
            onCourt = true;
            setCurrentCourt(currCourt.id)
          }
        }
      }
      if (!onCourt) {
        for (const sportId in sports) {
          const currSport = sports[sportId]
          if (currSport.name == teamSport) {
            let minWaitlist = 1000000
            let minIndex = -1
            for (const courtId in currSport.courts) {
              const currCourt = courts[currSport.courts[courtId] - 1]
              if (currCourt.waitlist.length < minWaitlist) {
                minWaitlist = currCourt.waitlist.length
                minIndex = currCourt.id - 1
              } 
            }
            const newCourts = {...courts}
            newCourts[minIndex].waitlist.push(teamInfo.id)
            setCourts(newCourts)
            setCurrentCourt(minIndex + 1)
          }
        }
      }
    }
  }, [teamInfo])

  useEffect(() => {
    if (courts) {
      set(courtsRef, courts)
    }
  }, [courts])

  const addPlayer = (playerUsername) => {
    if (playerUsername === '') return
    if (sportMax - currentPlayers.length <= 0) {
      alert('Team is already full')
      return
    }
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
        if (newTeam.length === 0) {
          const deleteTeamRef = ref(db, 'teams/' + (teamInfo.id - 1))
          set(deleteTeamRef, {})
          for (const sportId in sports) {
            const currSport = sports[sportId]
            for (const courtId in currSport.courts) {
              const currCourt = courts[currSport.courts[courtId] - 1]
              if (currCourt.waitlist.includes(teamInfo.id)) {
                const deleteCourtRef = ref(db, 'courts/' + (currCourt.id - 1) + '/waitlist')
                get(deleteCourtRef).then((response) => {
                  const newWaitlist = response.val()
                  newWaitlist.pop()
                  const newCourts = {...courts}
                  newCourts[currCourt.id - 1].waitlist = newWaitlist
                  setCourts(newCourts)
                })
              }
            }
          }
        } else {
          set(teamPlayersRef, newTeam);
        }
        setSportCategory()
        setSportMax()
        setTeamSaved(false)
        setCurrentPlayers([])
        setTeamInfo({name: '', avgSkillLevel: 0, id: null})
        setCurrentCourt()
    })
  }

  return (
    <div>
      <header className="flex flex-col justify-center items-center h-32 sticky top-0 w-full bg-white">
        <div className="text-4xl font-bold">{teamSaved ? teamInfo.name : "Create Your Team"}</div>
        {teamSaved && <div className="text-lg italic">{teamSport}</div>}
        {teamSaved && <div className="text-lg italic">{"Court: " + currentCourt}</div>}
      </header>
      <div className="mb-32">
        <div className='mx-4 flex flex-col justify-center items-center text-xl'>
          {!teamSaved &&
            <form>
              <div className='grid grid-cols-2 p-2 w-full'>
                <div>
                  <label for="teamName" className='font-semibold mr-2 w-full'>Team Name:</label><br />
                </div>
                <div>
                  <input type="text" className="w-full" id="teamName" name="teamName" placeholder='Vikings' required /><br />
                </div>
              </div>
              <div className='grid grid-cols-2 p-2 w-full'>
                <div>
                  <label for="sportSelection" className='font-semibold mr-2'>Select sport:</label><br />
                </div>
                <div>
                  <select id="sportSelection" name="sportSelection" required>
                    {sports && sports.map((sport, index) => (
                      <option key={index} value={sport.id}>{sport.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='flex justify-center items-center my-4'>
                <input type='submit' className="py-2 px-4 bg-custom-gray text-white font-semibold tracking-wide rounded" onClick={(e) => createTeam(e)} value="Save Team"/>
              </div>
            </form>
          }
          {teamSaved && 
          <>
            <div className='flex flex-row items-center p-2'>
              <label for="playerUsername" className='font-semibold mr-2'>Add players:</label><br />
              <input className="p-2 border border-slate-500 rounded" type="text" id="playerUsername" name="playerUsername" placeholder='username' required /><br />
            </div>
            <button className="py-2 px-4 bg-custom-green text-white font-semibold tracking-wide rounded my-4" onClick={() => addPlayer(document.getElementById('playerUsername').value)}>Add Player</button>
            <div className='w-full flex flex-col'>
              <div className='text-xl my-4 underline text-center'>Players on the team</div>
              { players && currentPlayers.map((playerId, index) => {
                const player = players.find(p => p.id === playerId)
                if (player) {
                  return (
                    <div key={index} className='w-full lg:w-2/4 p-4 flex flex-col justify-between rounded mb-4 bg-custom-gray'>
                      <div className="text-2xl text-white font-semibold tracking-wide mb-2">{player.name}</div>
                      <div className="flex flex-row justify-between text-lg italic">
                        <div className="">Skill: {player.sportsInfo[sportCategory]?.skillLevel}</div>
                        <div className="">Phone: {player.phone}</div>
                      </div>
                  </div>
                )}
              })}
            </div>
            <button className="py-2 px-4 bg-custom-red text-white font-semibold tracking-wide rounded my-4" onClick={() => leaveTeam()}>Leave Team</button>
          </>
          }
        </div>
      </div>
    </div>
  )
}

export default CreateTeam