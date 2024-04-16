import React, { useState, useEffect } from 'react';
import { get, getDatabase,ref, onValue, set } from "firebase/database";
import CourtPage from './CourtPage'

const SportPage = ({ sport, onBack, createTeam }) => {

    const [courts, setCourts] = useState();
    const [teams, setTeams] = useState();

    const db = getDatabase();

    const courtsRef = ref(db, 'courts');
    useEffect(() => {
        get(courtsRef).then((response) => {
            setCourts(response.val());
        })
        onValue(courtsRef, (response) => {
            setCourts(response.val());
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


    const [freeAgentList, setFreeAgentList] = useState([])
    const sportsRef = ref(db, 'sports/' + (sport.id - 1) + '/freeAgents');
    
    const joinAsFreeAgent = () => {
        // add user to the freeAgents list in the sport
        get(sportsRef).then((response) => {
            const tempArray = response.val()
            tempArray.push(60)
            setFreeAgentList(tempArray)
            alert("You have been added to the free agent list! Teams may add you to their team now, you'll see if you are part of a team on the team page!")
        })
    }

    useEffect(() => {
        if (freeAgentList?.length > 0) {
            set(sportsRef, freeAgentList)
        }
    }, [freeAgentList])


    useEffect(() => {
        if (courts) {
            setSportCourts(sport?.courts.map(courtId => courts.find(court => court.id === courtId)));
        }
    }, [courts])


    const calculateAverageSkill = (courtId) => {
        const court = courts.find(court => court.id === courtId);
        if (!court) return 0; // If the court is not found, return 0

        const teamSkillLevels = court.waitlist.map(teamId => {
            const team = teams.find(team => team.id === teamId);
            return team ? team.avgSkillLevel : 0; // If team is not found, consider its skill level as 0
        });

        const totalSkill = teamSkillLevels.reduce((acc, curr) => acc + curr, 0);
        return teamSkillLevels.length > 0 ? (totalSkill / teamSkillLevels.length).toFixed(1) : 0; // Calculate average skill level
    }; 

    const [sportCourts, setSportCourts] = useState();
    const [selectedCourt, setSelectedCourt] = useState(null);

    return (
        <div className='w-full'>
            {selectedCourt === null ? (
            <>
                <header className="flex justify-center items-center h-32">
                    <button className="absolute text-md text-blue-500 top-4 left-4 font-semibold" onClick={onBack}>&larr; Back to Sports List</button>
                    <div className="text-4xl font-bold">{sport.name} Courts</div>
                </header>
                <div className='mx-4 flex flex-col items-center'>
                    {courts && teams && sportCourts && sportCourts?.map((court, index) => (
                    <div key={index} className='w-full lg:w-2/4 p-4 rounded mb-4 bg-custom-yellow bg-opacity-85 hover:bg-opacity-100' onClick={() => setSelectedCourt(court)}>
                        <div className="text-2xl font-semibold tracking-wide">Court {court.id}</div>
                        <div className="flex flex-row justify-between text-lg italic">
                            <div className="">Average Skill: {calculateAverageSkill(court.id)}</div>
                            {sport?.courts && <div className="text-md">Teams Waiting: {court.waitlist.length}</div>}
                        </div>
                    </div>
                    ))}
                </div>
                <div className='p-4'>
                    <div className='w-full lg:w-2/4 p-2 mb-4 rounded border-custom-yellow border-4 hover:text-white text-center font-semibold hover:bg-custom-yellow' onClick={() => joinAsFreeAgent()}>
                        <div className="text-xl">Join as a Free Agent</div>
                    </div>
                </div>
                
                </>
            ) : 
            (
                <>
            <CourtPage 
                court={selectedCourt}
                sport={sport}
                onBack={() => setSelectedCourt(null)}
                createTeam={createTeam}/>
                </>
                )
            }
        </div>
    );
}

export default SportPage