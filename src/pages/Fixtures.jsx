import React, { useEffect, useState } from "react";

export default function Fixtures() {
  const [fixturesByLeague, setFixturesByLeague] = useState({});
  const [selectedLeague, setSelectedLeague] = useState("");
  const [groupedFixtures, setGroupedFixtures] = useState({});
  const [availableRounds, setAvailableRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState("all");

  useEffect(() => {
    const data = localStorage.getItem("fixturesByLeague");
    if (data) {
      const parsed = JSON.parse(data);
      setFixturesByLeague(parsed);

      const leagues = Object.keys(parsed);
      if (leagues.length > 0) {
        setSelectedLeague(leagues[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedLeague && fixturesByLeague[selectedLeague]) {
      const leagueFixtures = fixturesByLeague[selectedLeague];

      const grouped = leagueFixtures.reduce((acc, fixture) => {
        const round = fixture.round;
        if (!acc[round]) acc[round] = [];
        acc[round].push(fixture);
        return acc;
      }, {});

      const rounds = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));
      setGroupedFixtures(grouped);
      setAvailableRounds(rounds);
      setSelectedRound("all");
    }
  }, [selectedLeague, fixturesByLeague]);

  const handlePreviousRound = () => {
    const currentIndex = availableRounds.indexOf(selectedRound);
    if (currentIndex > 0) {
      setSelectedRound(availableRounds[currentIndex - 1]);
    }
  };

  const handleNextRound = () => {
    const currentIndex = availableRounds.indexOf(selectedRound);
    if (currentIndex < availableRounds.length - 1) {
      setSelectedRound(availableRounds[currentIndex + 1]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Fixtures</h2>

      {Object.keys(fixturesByLeague).length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="league" className="font-medium text-lg">
                League:
              </label>
              <select
                id="league"
                value={selectedLeague}
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(fixturesByLeague).map((league) => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="round" className="font-medium text-lg">
                Round:
              </label>
              <select
                id="round"
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All</option>
                {availableRounds.map((round) => (
                  <option key={round} value={round}>
                    Round {round}
                  </option>
                ))}
              </select>

              {/* Навигационни стрелки */}
              {selectedRound !== "all" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePreviousRound}
                    disabled={availableRounds.indexOf(selectedRound) === 0}
                    className="px-3 py-1 text-lg font-bold rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNextRound}
                    disabled={availableRounds.indexOf(selectedRound) === availableRounds.length - 1}
                    className="px-3 py-1 text-lg font-bold rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {(selectedRound === "all" ? availableRounds : [selectedRound]).map((round) => (
              <div
                key={round}
                className="bg-white border border-gray-200 shadow-md rounded-lg p-5 transition-transform hover:scale-[1.01]"
              >
                <h3 className="text-xl font-semibold mb-4 text-blue-700">
                  Round {round}
                </h3>
                <ul className="space-y-2">
                  {groupedFixtures[round].map((match, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-dashed border-gray-200 rounded transition-colors"
                    >
                      <span className="font-medium text-gray-800">{match.home}</span>
                      <span className="text-gray-500">vs</span>
                      <span className="font-medium text-gray-800">{match.away}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 italic">
          No fixtures available. Start a game first.
        </p>
      )}
    </div>
  );
}
