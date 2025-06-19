import React from 'react';
import useUserGameStore from '../store/UserGameStore';

const StandingsTable = () => {
  const standings = useUserGameStore((state) => state.standings);
  const currentLeague = useUserGameStore((state) => state.currentLeague);
  const leagues = useUserGameStore((state) => state.leagues);
  const setLeague = useUserGameStore((state) => state.setLeague);
  const selectedTeam = useUserGameStore((state) => state.selectedTeam);

  return (
    <div className="w-full max-w-[1200px] mx-auto my-10 px-4 font-sans">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        League Standings
      </h2>

      <div className="mb-6 text-center">
        <label htmlFor="league-select" className="mr-2 font-medium text-gray-700">
          Select League:
        </label>
        <select
          id="league-select"
          value={currentLeague}
          onChange={(e) => setLeague(e.target.value)}
          className="p-2 rounded shadow text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {leagues.map((league, idx) => (
            <option key={idx} value={league.league}>
              {league.league}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto animate-fade-in">
        <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-900 text-white text-sm sm:text-base">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3 text-left">Team</th>
              <th className="p-3">M</th>
              <th className="p-3">W</th>
              <th className="p-3">D</th>
              <th className="p-3">L</th>
              <th className="p-3">GF</th>
              <th className="p-3">GA</th>
              <th className="p-3">P</th>
            </tr>
          </thead>

          <tbody>
            {standings.map((team, index) => {
              const isSelected = team.team === selectedTeam;
              const isTop = index < 3;
              const isBottom = index >= standings.length - 2;

              return (
                <tr
                  key={index}
                  className={`
                    text-center text-sm sm:text-base
                    transition-all duration-200 cursor-pointer
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-100
                    ${isSelected ? 'bg-red-100 text-red-700 font-bold' : ''}
                    ${isTop && !isSelected ? 'bg-green-100' : ''}
                    ${isBottom && !isSelected ? 'bg-yellow-100' : ''}
                  `}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-left">{team.team}</td>
                  <td className="p-3">{team.played}</td>
                  <td className="p-3">{team.wins}</td>
                  <td className="p-3">{team.draws}</td>
                  <td className="p-3">{team.losses}</td>
                  <td className="p-3">{team.goalsScored}</td>
                  <td className="p-3">{team.goalsAgainst}</td>
                  <td className="p-3 font-semibold">{team.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
