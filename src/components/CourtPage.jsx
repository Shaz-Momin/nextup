// import React from 'react';
// import courts from '../data/courts.json';
// import teams from '../data/teams.json';

// const CourtPage = ({ court, onBack }) => {


//     const courtTeams = court?.waitlist.map(teamId => teams.find(teamId => team.id === teamId));

    

//     return (
//         <div className='w-full'>
//             <header className="flex justify-center items-center h-32">
//                 <button className="absolute text-md text-blue-500 top-4 left-4 font-semibold" onClick={onBack}>&larr; Back to Courts List</button>
//                 <div className="text-4xl font-bold">Court {court.id}</div>
//             </header>
//             <div className='mx-4 flex flex-col items-center'>
//                 {sportCourts?.map((court, index) => (
//                 <div key={index} className='w-full lg:w-2/4 p-2 rounded border-slate-900 border mb-4 hover:text-white hover:bg-slate-800'>
//                     <div className="text-xl">Court {court.id}</div>
//                     <div className="flex flex-row justify-between">
//                     <div className="text-md">Average Skill: 3</div>
//                     {sport?.courts && <div className="text-md">Teams Waiting: {court.waitlist.length}</div>}
//                     </div>
//                 </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default SportPage