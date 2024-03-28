import React from 'react';
import players from '../data/players.json';
import teams from '../data/teams.json';

const TeamPage = ({ team, onBack, sport, createTeam }) => {

    const teamPlayers = team?.players.map(playerId => players.find(player => player.id === playerId));

    return (
        <div className='w-full'>
            <header className="flex justify-center items-center h-32">
                <button className="absolute text-md text-blue-500 top-4 left-4 font-semibold" onClick={onBack}>&larr; Back to Teams List</button>
                <div className="text-4xl font-bold">Team {team.name}</div>
            </header>
            <div className='mx-4 flex flex-col items-center'>
                {teamPlayers?.map((player, index) => (
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