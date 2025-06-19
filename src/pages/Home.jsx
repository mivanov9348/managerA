import React, { useEffect, useState } from "react";
import { getSelectedTeamData } from "../utils/getSelectedTeamData";

const Home = () => {
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
    const data = getSelectedTeamData();
    setTeamData(data);
  }, []);

  if (!teamData) {
    return (
      <div className="p-10 text-center text-gray-600">
        <h1 className="text-3xl font-bold mb-4">Welcome to ManagerA</h1>
        <p>Please select a team to get started.</p>
      </div>
    );
  }

  const { teamName, leagueName, players, standing, fixtures } = teamData;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
        {teamName}
      </h1>

      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        League: {leagueName}
      </h2>

      {standing ? (
        <div className="mb-6 bg-white shadow p-4 rounded-md">
          <h3 className="text-lg font-bold mb-2">Standings</h3>
          <p>
            Position: <strong>{standing.position || "-"}</strong> | Played:{" "}
            {standing.played} | Points: {standing.points}
          </p>
        </div>
      ) : (
        <p className="mb-6 italic text-gray-500">No standing data.</p>
      )}

      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Players</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {players.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4 border border-gray-100"
            >
              <h4 className="text-xl font-semibold text-blue-700 mb-1">
                {p.name}
              </h4>
              <p className="text-sm text-gray-500 mb-2">{p.position}</p>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">⚔️ Atk: {p.attack}</span>
                <span className="text-blue-700">🛡️ Def: {p.defense}</span>
                <span className="text-gray-800 font-bold">⭐ {p.overall}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Upcoming Fixtures</h3>
        <ul className="space-y-3">
          {fixtures.slice(0, 5).map((match, idx) => {
            const isHome = match.home === teamName;
            const opponent = isHome ? match.away : match.home;

            return (
              <li
                key={idx}
                className="flex justify-between items-center px-4 py-3 bg-white border border-gray-200 shadow-sm rounded-lg"
              >
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  {isHome ? (
                    <>
                      <span className="text-blue-700 font-bold">🏠 Home</span>
                      <span>vs</span>
                      <span className="text-gray-900">{opponent}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-700">Away @</span>
                      <span className="text-gray-900 font-semibold">
                        {opponent}
                      </span>
                    </>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  Round {match.round}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Home;
