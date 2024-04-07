import React, { useState, useEffect } from 'react';
import { get, getDatabase,ref, onValue, set } from "firebase/database";

const TeamPage = ({ team, onBack, sport, createTeam }) => {

    const [players, setPlayers] = useState();
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


    function joinTeam(team, playerId) {
       const teamPlayersRef = ref(db, 'teams/' + (team.id - 1) + '/' + "players")
        get(teamPlayersRef).then((response) => {
            const teamPlayers = response.val();
            teamPlayers.push(playerId)
            set(teamPlayersRef, teamPlayers);
        })
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
                <div key={index} className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800'>
                    <div className="text-xl">{player.name}</div>
                    <div className="flex flex-row justify-between">
                    <div className="text-md">Skill: {player.sportsInfo[sport.type].skillLevel}</div>
                    <div className="text-md">Phone Number: {player.phone}</div>
                    </div>
                </div>
                ))}
                <div className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800'>
                    <div className="text-xl" onClick={() => {
                        if (sport.maxPlayers - team.players.length > 0) {
                            // Fix later, 60 is temporary personal id, needs to be real user's id
                            joinTeam(team, 60)
                            createTeam()
                            alert("add team to backend")
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