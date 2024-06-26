import React, { useState, useEffect } from 'react'
import { getDatabase, get, ref, onValue, set, push } from 'firebase/database'

const CreateTeam = ({sportId, setCreateTeam}) => {

  const [sports, setSports] = useState()
  const [players, setPlayers] = useState()
  const [teams, setTeams] = useState()
  const [courts, setCourts] = useState()
  const db = getDatabase()
  const [allSports, setAllSports] = useState([]);

  useEffect(() => {
    const fetchSports = async () => {
      const sportsRef = ref(db, 'sports');
      const snapshot = await get(sportsRef);
      if (snapshot.exists()) {
        const sportsData = snapshot.val();
        // Convert object to array if needed or directly set it
        setAllSports(Object.values(sportsData)); // Assuming sportsData is an object
      }
    };

    fetchSports();
  }, []); // Empty dependency array means this runs once on component mount

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
  const [freeAgents, setFreeAgents] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);


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
          console.log(team.id)
          get(teamRef).then((response) => {
            setTeamInfo(response.val())
            setCurrentPlayers(response.val().players)
          })
          break
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

  const findSportIdByName = (sports, teamSportName) => {
    const sport = sports.find(sport => sport.name === teamSportName);
    return sport ? sport.id : null;
  };

  const addPlayerToTeam = async (playerId) => {
    // Update the team's player list in the state
    setCurrentPlayers(currentPlayers => [...currentPlayers, playerId]);
  
    // Remove the player from the free agents list in the state
    setFreeAgents(freeAgents => freeAgents.filter(agent => agent.id !== playerId));
  
    // Update the team's player list in Firebase
    const teamPlayersRef = ref(db, `teams/${teamInfo.id-1}/players`);
    await set(teamPlayersRef, [...currentPlayers, playerId]); // Make sure this logic matches your data structure
  
    // Find the sportId from the teamSport name to update the free agent list in Firebase
    const sportId = findSportIdByName(allSports, teamSport);
    if (sportId) {
      const freeAgentRef = ref(db, `sports/${sportId-1}/freeAgents`);
      // Assuming you have the current list of free agent IDs in a state or can fetch it
      const updatedFreeAgents = freeAgents.filter(agent => agent.id !== playerId).map(agent => agent.id);
      await set(freeAgentRef, updatedFreeAgents);
    }
  };

  const autoAdd = async () => {
    const sportId = findSportIdByName(allSports, teamSport);
    const sportRef = ref(db, `sports/${sportId-1}`);
    const snapshot = await get(sportRef);

    let freeAgentIds = [];
    if (snapshot.exists()) {
      const sportData = snapshot.val();
      freeAgentIds = sportData.freeAgents || [];
    }
    for (let i = 0; i < freeAgentIds.length; i++) {
      freeAgentIds[i] += 1;
    }
    const x = sportMax - currentPlayers.length;
    const xFreeAgents = freeAgentIds.slice(0, x);
    setCurrentPlayers(currentPlayers => [...currentPlayers, ...xFreeAgents]);
    const updatedFreeAgents = freeAgentIds.slice(x);
    await set(ref(db, `sports/${sportId-1}/freeAgents`), updatedFreeAgents);

    // remove added free agents from list of free agents on screen
    setFreeAgents(freeAgents => freeAgents.filter(agent => !xFreeAgents.includes(agent.id)));


  }

  useEffect(() => {
    const fetchFreeAgents = async () => {
      if (!teamSport) return;

      const sId = findSportIdByName(allSports, teamSport);
      const sportRef = ref(db, `sports/${sId-1}`);
      const snapshot = await get(sportRef);
      if (snapshot.exists()) {
        const sportData = snapshot.val();
        const freeAgentIds = sportData.freeAgents || [];

        const agentsDetails = await Promise.all(freeAgentIds.map(async (id) => {
          const playerSnapshot = await get(ref(db, `players/${id}`));
          return playerSnapshot.exists() ? playerSnapshot.val() : null;
        }));

        setFreeAgents(agentsDetails.filter(Boolean));
      }
    };

    fetchFreeAgents();
  }, [teamSport, db]);

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
            <div className='w-full flex flex-col items-center'>
              <div className='text-xl my-4 underline text-center'>Players on the team</div>
              { players && currentPlayers.map((playerId, index) => {
                const player = players.find(p => p.id === playerId)
                if (player) {
                  return (
                    <div key={index} className='w-full lg:w-2/4 p-4 grid grid-cols-3 justify-between rounded mb-4 bg-custom-gray'>
                      <div>
                        <img src={player.profilePhoto} alt={player.name} className="player-picture w-24 h-24 mr-4 rounded-lg" />
                      </div>
                      <div className="flex flex-col col-span-2 justify-between text-lg italic">
                        <div className="text-2xl text-white font-semibold tracking-wide mb-2">{player.name}</div>
                        <div className="">Skill: {player.sportsInfo[sportCategory]?.skillLevel}</div>
                        <div className="">Phone: {player.phone}</div>
                      </div>
                  </div>
                )}
              })}
            </div>
            <button className="py-2 px-4 bg-custom-red text-white font-semibold tracking-wide rounded my-4" onClick={() => leaveTeam()}>Leave Team</button>
            <div className='w-full flex flex-col'>
              <div className='text-xl my-4 underline text-center'>Available Free Agents</div>
              <button className="py-2 px-4 bg-custom-green text-white font-semibold tracking-wide rounded my-4" onClick={() => autoAdd()}>Auto-Add Free Agents</button>
              {freeAgents.map((agent) => {
                  const fa = players.find(p => p.id === agent.id)
                  if (fa) {
                    return (
                      <div key={agent.id} className='w-full lg:w-2/4 p-4 grid grid-cols-3 justify-between rounded mb-4 bg-custom-yellow'>
                        <div>
                          <img src={fa.profilePhoto} alt={fa.name} className="player-picture w-24 h-24 mr-4 rounded-lg" />
                        </div>
                        <div className="flex flex-col col-span-2 justify-between text-lg italic">
                          <div className="text-2xl text-white font-semibold tracking-wide mb-2">{fa.name}</div>
                          <div>Skill: {fa.sportsInfo[sportCategory]?.skillLevel}</div>
                          <div className="">Phone: {fa.phone}</div>
                          <button onClick={() => addPlayerToTeam(fa.id)} className="mt-2 py-1 px-3 w-32 bg-custom-blue bg-white text-slate font-semibold rounded">
                            Add
                          </button>
                        </div>
                      </div>
                    )
                  }
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