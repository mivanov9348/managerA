// ✅ NextMatch.jsx
import React, { useEffect, useState } from 'react';
import useUserGameStore from '../store/UserGameStore';
import { getSelectedTeamData } from '../utils/getSelectedTeamData';

const NextMatch = () => {
  const { currentLeague, currentRound, simulateRound } = useUserGameStore();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fixturesByLeague = JSON.parse(localStorage.getItem('fixturesByLeague')) || {};
    const fixtures = fixturesByLeague[currentLeague] || [];
    const roundMatches = fixtures.filter(match => match.round === currentRound);
    setMatches(roundMatches);

    const selected = getSelectedTeamData();
    if (selected?.teamName) setSelectedTeam(selected.teamName);

    const matchResults = JSON.parse(
      localStorage.getItem(`matchResults_${currentRound}_${currentLeague}`)
    ) || [];
    setResults(matchResults);

    setLoading(false);
  }, [currentLeague, currentRound]);

  const handleSimulate = () => {
    simulateRound();
    const matchResults = JSON.parse(
      localStorage.getItem(`matchResults_${currentRound}_${currentLeague}`)
    ) || [];
    setResults(matchResults);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-lg">
        Loading matches...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500 text-lg">
        <p>No matches found for round {currentRound}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Round {currentRound}
        </h2>
        <button
          onClick={handleSimulate}
          disabled={results.length > 0}
          className={`px-5 py-2 rounded transition ${
            results.length > 0
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          ▶️ Play!
        </button>
      </div>

      <ul className="space-y-4">
        {matches.map((match, index) => {
          const result = results.find(
            (res) => res.homeTeam === match.home && res.awayTeam === match.away
          );

          return (
            <li
              key={index}
              className="border border-gray-200 rounded p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-medium ${
                    match.home === selectedTeam ? 'text-blue-600 font-bold' : 'text-gray-700'
                  }`}
                >
                  {match.home}
                </span>
                {result ? (
                  <span className="font-semibold text-lg">
                    {result.homeScore} : {result.awayScore}
                  </span>
                ) : (
                  <span className="text-gray-500">vs</span>
                )}
                <span
                  className={`font-medium ${
                    match.away === selectedTeam ? 'text-blue-600 font-bold' : 'text-gray-700'
                  }`}
                >
                  {match.away}
                </span>
              </div>

              {result && (
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  {result.homeGoals.map((g, i) => (
                    <li key={`h-${i}`}>
                      ⚽ {g.minute}' {g.scorer}
                      {g.assistant ? ` (assist: ${g.assistant})` : ''}
                    </li>
                  ))}
                  {result.awayGoals.map((g, i) => (
                    <li key={`a-${i}`}>
                      ⚽ {g.minute}' {g.scorer}
                      {g.assistant ? ` (assist: ${g.assistant})` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NextMatch;