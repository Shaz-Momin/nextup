import React, { useState, useEffect } from 'react';
import { get, getDatabase,ref, onValue } from "firebase/database";
import TeamPage from './TeamPage';

const CourtPage = ({ court, onBack, sport, createTeam }) => {

    const [teams, setTeams] = useState();
    const db = getDatabase();

    const teamsRef = ref(db, 'teams');
    useEffect(() => {
        get(teamsRef).then((response) => {
            setTeams(response.val());
        })
        onValue(teamsRef, (response) => {
            setTeams(response.val());
        })
    }, [])

    const [courtTeams, setCourtTeams] = useState();

    useEffect(() => {
        if (teams) {
            setCourtTeams(court?.waitlist.map(teamId => teams.find(team => team.id === teamId)));
        }
    }, [teams])

    const [selectedTeam, setSelectedTeam] = useState(null);

    return (
        <div className='w-full'>
            {selectedTeam === null ? 
            (
                <>
                <header className="flex justify-center items-center h-32 sticky top-0 w-full bg-white">
                    <button className="absolute text-md text-blue-500 top-4 left-4 font-semibold" onClick={onBack}>&larr; Back to Courts List</button>
                    <div className="text-4xl font-bold">Court {court.id} Waitlist</div>
                </header>
                <div className='mx-4 flex flex-col items-center'>
                    {teams && courtTeams?.map((team, index) => (
                    <div key={index} className='w-full lg:w-2/4 p-4 rounded mb-4 bg-custom-yellow hover:bg-yellow-600' onClick={() => setSelectedTeam(team)}>
                        <div className="text-2xl font-semibold tracking-wide">{team.name}</div>
                        <div className="flex flex-row justify-between text-lg italic">
                            <div className="text-md">Average Skill: {team.avgSkillLevel}</div>
                            {court?.id && <div className="text-md">Players Needed: {sport.maxPlayers - team.players.length}</div>}
                        </div>
                    </div>
                    ))}
                    <div className='w-full lg:w-2/4 p-2 rounded border-custom-yellow border-4 mb-4 hover:text-white hover:bg-slate-800' onClick={createTeam}>
                        <div className="text-xl ">Create Your Own Team</div>
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