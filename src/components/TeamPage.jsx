import React, { useState, useEffect } from 'react';
import { get, getDatabase,ref, onValue, set } from "firebase/database";

const TeamPage = ({ team, onBack, sport, createTeam }) => {

    const [players, setPlayers] = useState();
    const [teams, setTeams] = useState()
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

    const teamsRef = ref(db, 'teams');
    useEffect(() => {
        get(teamsRef).then((response) => {
            setTeams(response.val());
        })
        onValue(teamsRef, (response) => {
            setTeams(response.val());
        })
    }, [])


    function joinTeam(team, playerId) {
        let onTeam = false;
        if (teams) {
            for (const teamId in teams) {
            const team = teams[teamId]
            if (team.players.includes(60)) {
                onTeam = true;
            }
        }
        if (onTeam) {
            alert("You cannot join multiple teams!")
        } else {
            const teamPlayersRef = ref(db, 'teams/' + (team.id - 1) + '/' + "players")
             get(teamPlayersRef).then((response) => {
                 const teamPlayers = response.val();
                 teamPlayers.push(playerId)
                 set(teamPlayersRef, teamPlayers);
             })
        }
      }
    }

    const [teamPlayers, setTeamPlayers] = useState();

    useEffect(() => {
        if (players) {
            setTeamPlayers(team?.players.map(playerId => players.find(player => player.id === playerId)));
        }
    }, [players])


    return (
        <div className='w-full'>
            <header className="flex justify-center items-center h-32">
                <button className="absolute text-md text-blue-500 top-4 left-4 font-semibold" onClick={onBack}>&larr; Back to Teams List</button>
                <div className="text-4xl font-bold">Team {team.name}</div>
            </header>
            <div className='mx-4 flex flex-col items-center'>
                {players && teamPlayers?.map((player, index) => (
                <div key={index} className='w-full lg:w-2/4 p-4 rounded mb-4 bg-custom-yellow hover:bg-yellow-600'>
                    <img src={player.profilePhoto} alt={player.name} className="player-picture w-24 h-24 mr-4 rounded-l" />
                    <div className="text-2xl font-semibold mb-1 tracking-wide">{player.name}</div>
                    <div className="flex flex-row justify-between italic text-lg">
                        <div className="">Skill: {player.sportsInfo[sport.type].skillLevel}</div>
                        <div className="">Phone Number: {player.phone}</div>
                    </div>
                </div>
                ))}
                <div className='w-full lg:w-2/4 p-2 rounded border-custom-yellow border-4 mb-4 hover:text-white hover:bg-slate-800'>
                    <div className="text-xl" onClick={() => {
                        if (sport.maxPlayers - team.players.length > 0) {
                            // Fix later, 60 is temporary personal id, needs to be real user's id
                            joinTeam(team, 60)
                            createTeam()
                        } else {
                            alert("Team full, cannot join!")
                        }
                    }}>Join Team</div>
                </div>
            </div>
        </div>
    );
}

export default TeamPage