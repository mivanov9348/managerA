import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useUserGameStore from "../store/UserGameStore";

const DraftPage = () => {
  const { teams, setDraftCompleted, currentTeam } = useUserGameStore();
  const [freeAgents, setFreeAgents] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [playersByTeam, setPlayersByTeam] = useState({});
  const [sortBy, setSortBy] = useState("overall");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  const intervalRef = useRef(null);

  useEffect(() => {
    const agents = JSON.parse(localStorage.getItem("freeAgents")) || [];
    setFreeAgents(agents);

    const storedPlayers = JSON.parse(localStorage.getItem("playersByTeam")) || {};
    setPlayersByTeam(storedPlayers);
  }, []);

  useEffect(() => {
    const teamName = teams[currentTeamIndex]?.name;
    if (!teamName || teamName === currentTeam) return;

    intervalRef.current = setTimeout(() => {
      autoPickForTeam(teamName);
    }, 2000);

    return () => clearTimeout(intervalRef.current);
  }, [currentTeamIndex]);

  const sortedPlayers = [...freeAgents].sort((a, b) => {
    const aVal = parseFloat(a[sortBy]);
    const bVal = parseFloat(b[sortBy]);
    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
  });

  const autoPickForTeam = (teamName) => {
    const player = sortedPlayers[0];
    if (!player) return;

    const updatedFreeAgents = freeAgents.filter((p) => p.id !== player.id);
    const updatedPlayersByTeam = {
      ...playersByTeam,
      [teamName]: [...(playersByTeam[teamName] || []), { ...player, team: teamName }],
    };

    localStorage.setItem("freeAgents", JSON.stringify(updatedFreeAgents));
    localStorage.setItem("playersByTeam", JSON.stringify(updatedPlayersByTeam));

    setFreeAgents(updatedFreeAgents);
    setPlayersByTeam(updatedPlayersByTeam);
    setCurrentTeamIndex((prev) => (prev + 1) % teams.length);
  };

  const handlePick = (player) => {
    if (teams[currentTeamIndex]?.name !== currentTeam) return;

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

  const handleFinishDraft = () => {
    setDraftCompleted(true);
    navigate("/");
  };

  const isYourTurn = teams[currentTeamIndex]?.name === currentTeam;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex gap-6">
        <div className="w-1/4">
          <h2 className="text-xl font-bold mb-4">Teams</h2>
          <ul className="space-y-2">
            {teams.map((team, idx) => (
              <li
                key={team.name}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  currentTeamIndex === idx
                    ? "bg-blue-600 text-white animate-pulse"
                    : "bg-gray-100"
                }`}
              >
                {team.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4">
          <h2 className="text-xl font-bold mb-4">
            {isYourTurn ? "Your Turn to Pick" : `Waiting for ${teams[currentTeamIndex]?.name}...`}
          </h2>
          <div className="overflow-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Position</th>
                  <th
                    className="p-2 text-left cursor-pointer"
                    onClick={() => {
                      setSortBy("attack");
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    }}
                  >
                    ⚔️
                  </th>
                  <th
                    className="p-2 text-left cursor-pointer"
                    onClick={() => {
                      setSortBy("defense");
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    }}
                  >
                    🛡️
                  </th>
                  <th
                    className="p-2 text-left cursor-pointer"
                    onClick={() => {
                      setSortBy("overall");
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                    }}
                  >
                    ⭐
                  </th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {isYourTurn
                  ? sortedPlayers.map((player) => (
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
                    ))
                  : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500 text-sm italic">
                        Waiting for other teams to pick...
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isYourTurn && (
        <div className="self-end">
          <button
            onClick={handleFinishDraft}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Finish Draft
          </button>
        </div>
      )}
    </div>
  );
};

export default DraftPage;
