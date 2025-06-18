import { useEffect, useState } from "react";
import teamsData from "../data/teams.json";
import { generatePlayers } from "../utils/generatePlayers";

const POSITIONS = [
  { type: "Goalkeeper", count: 1 },
  { type: "Defender", count: 4 },
  { type: "Midfielder", count: 4 },
  { type: "Forward", count: 2 },
];

const LOCAL_STORAGE_KEY = "playersByTeam";

const TeamsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [playersByTeam, setPlayersByTeam] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filterPosition, setFilterPosition] = useState("All");

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPlayersByTeam(parsed);
      return;
    }

    const newPlayers = {};
    teamsData.forEach((league) => {
      league.teams.forEach((team) => {
        newPlayers[team.name] = generatePlayers(team.name);
      });
    });

    setPlayersByTeam(newPlayers);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlayers));

}, []);

  const handleSort = (key) => {
    let newDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      newDirection = "desc";
    }
    setSortConfig({ key, direction: newDirection });
  };

  const getSortedPlayers = (players) => {
    if (!sortConfig.key) return players;
    return [...players].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredPlayers = (players) => {
    if (filterPosition === "All") return players;
    return players.filter((player) => player.position === filterPosition);
  };

  const getRowStyle = (position) => {
    const base = {
      Goalkeeper: "bg-yellow-100 hover:bg-yellow-200",
      Defender: "bg-blue-100 hover:bg-blue-200",
      Midfielder: "bg-orange-100 hover:bg-orange-200",
      Forward: "bg-red-100 hover:bg-red-200",
    };
    return base[position] || "";
  };

  return (
    <div className="p-5 max-w-4xl mx-auto font-sans bg-gray-100">
      <h2 className="text-xl font-bold mb-4">Select a Team</h2>
      <select
        onChange={(e) => setSelectedTeam(e.target.value)}
        defaultValue=""
        className="mb-4 p-2 rounded text-base"
      >
        <option value="" disabled>
          -- Choose a team --
        </option>
        {teamsData.flatMap((league) =>
          league.teams.map((team) => (
            <option key={team.name} value={team.name}>
              {league.league} - {team.name}
            </option>
          ))
        )}
      </select>

      {selectedTeam && playersByTeam[selectedTeam] && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{selectedTeam} - Squad</h3>

          <div className="mb-4">
            <label className="mr-2">Filter by position:</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="p-2 rounded text-base"
            >
              <option value="All">All</option>
              {POSITIONS.map(({ type }) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full border-collapse bg-white shadow rounded overflow-hidden animate-fade-in">
            <thead>
              <tr className="bg-green-800 text-white text-center">
                {["position", "name", "attack", "defense", "overall"].map((key) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="p-3 cursor-pointer hover:bg-green-700 transition"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                    {sortConfig.key === key && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getFilteredPlayers(getSortedPlayers(playersByTeam[selectedTeam])).map((player) => (
                <tr
                  key={player.id}
                  className={`text-center transition-transform duration-200 hover:scale-105 ${getRowStyle(
                    player.position
                  )}`}
                >
                  <td className="p-3">{player.position}</td>
                  <td className="p-3">{player.name}</td>
                  <td className="p-3">{player.attack}</td>
                  <td className="p-3">{player.defense}</td>
                  <td className="p-3">{player.overall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
