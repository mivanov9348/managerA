import React from 'react';
import useUserGameStore from '../store/UserGameStore';

const StandingsTable = () => {
  const standings = useUserGameStore((state) => state.standings);
  const currentLeague = useUserGameStore((state) => state.currentLeague);
  const leagues = useUserGameStore((state) => state.leagues);
  const setLeague = useUserGameStore((state) => state.setLeague);
  const selectedTeam = useUserGameStore((state) => state.selectedTeam);

  return (
    <div className="w-full max-w-[1200px] mx-auto my-8 p-4 font-sans">
      <select
        id="league-select"
        value={currentLeague}
        onChange={(e) => setLeague(e.target.value)}
        className="block mx-auto mb-8 p-2 text-base"
      >
        {leagues.map((league, idx) => (
          <option key={idx} value={league.league}>
            {league.league}
          </option>
        ))}
      </select>

      <table className="w-full border-collapse bg-white shadow-md">
        <thead className="bg-blue-900 text-white">
          <tr>
            <th className="p-3 border-b border-gray-300 text-center">#</th>
            <th className="p-3 border-b border-gray-300 text-center">Team</th>
            <th className="p-3 border-b border-gray-300 text-center">M</th>
            <th className="p-3 border-b border-gray-300 text-center">W</th>
            <th className="p-3 border-b border-gray-300 text-center">D</th>
            <th className="p-3 border-b border-gray-300 text-center">L</th>
            <th className="p-3 border-b border-gray-300 text-center">GF</th>
            <th className="p-3 border-b border-gray-300 text-center">GA</th>
            <th className="p-3 border-b border-gray-300 text-center">P</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((team, index) => (
            <tr
              key={index}
              className={`
                text-center border-b border-gray-300
                ${index % 2 === 1 ? 'bg-gray-100' : ''}
                hover:bg-gray-200 transition-colors duration-300
                ${team.team === selectedTeam ? 'bg-red-100 text-red-700 font-bold' : ''}
              `}
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{team.team}</td>
              <td className="p-3">{team.played}</td>
              <td className="p-3">{team.wins}</td>
              <td className="p-3">{team.draws}</td>
              <td className="p-3">{team.losses}</td>
              <td className="p-3">{team.goalsScored}</td>
              <td className="p-3">{team.goalsAgainst}</td>
              <td className="p-3">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
