import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserGameStore from "../store/UserGameStore";

const DraftPage = () => {
  const { teams } = useUserGameStore();
  const [freeAgents, setFreeAgents] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [playersByTeam, setPlayersByTeam] = useState({});
  const [sortBy, setSortBy] = useState("overall");
  const [sortDirection, setSortDirection] = useState("desc");

  const navigate = useNavigate();

  useEffect(() => {
    const agents = JSON.parse(localStorage.getItem("freeAgents")) || [];
    setFreeAgents(agents);

    const storedPlayers = JSON.parse(localStorage.getItem("playersByTeam")) || {};
    setPlayersByTeam(storedPlayers);
  }, []);

  const currentTeam = teams[currentTeamIndex]?.name;

  const sortedPlayers = [...freeAgents].sort((a, b) => {
    const aVal = parseFloat(a[sortBy]);
    const bVal = parseFloat(b[sortBy]);
    if (sortDirection === "asc") return aVal - bVal;
    else return bVal - aVal;
  });

  const handlePick = (player) => {
    const updatedFreeAgents = freeAgents.filter((p) => p.id !== player.id);
    const updatedPlayersByTeam = {
      ...playersByTeam,
      [currentTeam]: [...(playersByTeam[currentTeam] || []), { ...player, team: currentTeam }],
    };

    localStorage.setItem("freeAgents", JSON.stringify(updatedFreeAgents));
    localStorage.setItem("playersByTeam", JSON.stringify(updatedPlayersByTeam));

    setFreeAgents(updatedFreeAgents);
    setPlayersByTeam(updatedPlayersByTeam);
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
  };

  return (
    <div className="flex p-6 max-w-7xl mx-auto gap-6">
      <div className="w-1/4">
        <h2 className="text-xl font-bold mb-4">Teams</h2>
        <ul className="space-y-2">
          {teams.map((team, idx) => (
            <li
              key={team.name}
              className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium ${
                currentTeamIndex === idx ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {team.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4">
        <h2 className="text-xl font-bold mb-4">Available Players</h2>
        <div className="overflow-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Position</th>
                <th className="p-2 text-left cursor-pointer" onClick={() => {
                  setSortBy("attack");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>⚔️</th>
                <th className="p-2 text-left cursor-pointer" onClick={() => {
                  setSortBy("defense");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>🛡️</th>
                <th className="p-2 text-left cursor-pointer" onClick={() => {
                  setSortBy("overall");
                  setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                }}>⭐</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-sm font-medium">{player.name}</td>
                  <td className="p-2 text-sm">{player.position}</td>
                  <td className="p-2 text-sm">{player.attack}</td>
                  <td className="p-2 text-sm">{player.defense}</td>
                  <td className="p-2 text-sm">{player.overall}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handlePick(player)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full"
                    >
                      Pick
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DraftPage;
