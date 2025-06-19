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
      setPlayersByTeam(JSON.parse(savedData));
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
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
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

  const selectedLeague = teamsData.find((league) =>
    league.teams.some((team) => team.name === selectedTeam)
  );

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 animate-fade-in-up">
        🏟️ Squad
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <select
          onChange={(e) => setSelectedTeam(e.target.value)}
          defaultValue=""
          className="p-3 rounded border border-gray-300 shadow-sm w-full sm:w-auto"
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

        {selectedTeam && (
          <div className="p-3 bg-white rounded shadow text-sm text-gray-700">
            <span className="font-semibold">League:</span>{" "}
            {selectedLeague?.league} <br />
            <span className="font-semibold">Team:</span> {selectedTeam}
          </div>
        )}
      </div>

      {!selectedTeam && (
        <div className="text-center text-gray-500 italic">
          Please select a team to view its squad.
        </div>
      )}

      {selectedTeam && playersByTeam[selectedTeam] && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-2xl font-semibold">{selectedTeam} </h3>
            <div>
              <label className="mr-2">Filter by position:</label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="p-2 rounded border border-gray-300"
              >
                <option value="All">All</option>
                {POSITIONS.map(({ type }) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded shadow">
            <table className="min-w-full border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-green-700 text-white">
                  {["position", "name", "attack", "defense", "overall"].map(
                    (key) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="p-3 text-left cursor-pointer hover:bg-green-600 transition"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                        {sortConfig.key === key &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {getFilteredPlayers(
                  getSortedPlayers(playersByTeam[selectedTeam])
                ).map((player) => (
                  <tr
                    key={player.id}
                    className={`transition-transform duration-200 hover:scale-[1.02] ${getRowStyle(
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
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
