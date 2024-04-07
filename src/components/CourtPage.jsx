import React, {useState} from 'react';
import teams from '../data/teams.json';
import TeamPage from './TeamPage';

const CourtPage = ({ court, onBack, sport, createTeam }) => {

    const courtTeams = court?.waitlist.map(teamId => teams.find(team => team.id === teamId));
    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
        <div className='w-full'>
            {selectedTeam === null ? 
            (
                <>
                <header className="flex justify-center items-center h-32">
                    <button className="absolute text-md text-blue-500 top-4 left-4 font-semibold" onClick={onBack}>&larr; Back to Courts List</button>
                    <div className="text-4xl font-bold">Court {court.id} Waitlist</div>
                </header>
                <div className='mx-4 flex flex-col items-center'>
                    {courtTeams?.map((team, index) => (
                    <div key={index} className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800' onClick={() => setSelectedTeam(team)}>
                        <div className="text-xl">{team.name}</div>
                        <div className="flex flex-row justify-between">
                        <div className="text-md">Average Skill: {team.avgSkillLevel}</div>
                        {court?.id && <div className="text-md">Players Needed: {sport.maxPlayers - team.players.length}</div>}
                        </div>
                    </div>
                    ))}
                    <div className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800' onClick={createTeam}>
                        <div className="text-xl">Create Your Own Team</div>
                    </div>
                </div>
                </>
            )    
            : 
            (
                <>
                <TeamPage 
                    team={selectedTeam}
                    sport={sport}
                    onBack={() => setSelectedTeam(null)}
                    createTeam={createTeam}/>
                </>
            )}
        </div>
    );
}

export default CourtPage