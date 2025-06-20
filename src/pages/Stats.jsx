import React, { useEffect, useState } from "react";

const Stats = () => {
  const [players, setPlayers] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const playersByTeam = JSON.parse(localStorage.getItem("playersByTeam")) || {};
    const allPlayers = Object.entries(playersByTeam).flatMap(([teamName, teamPlayers]) =>
      teamPlayers.map((p) => ({ ...p, team: teamName }))
    );
    setPlayers(allPlayers);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === "string") {
      return sortDirection === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortDirection === "asc" ? valA - valB : valB - valA;
  });

  const renderSortArrow = (field) =>
    sortField === field ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        All Player Stats
      </h1>

      {players.length === 0 ? (
        <p className="text-center text-gray-600">No players found in the league.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-blue-900 text-white text-sm">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("name")}>
                  Name{renderSortArrow("name")}
                </th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("position")}>
                  Position{renderSortArrow("position")}
                </th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort("team")}>
                  Team{renderSortArrow("team")}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("attack")}>
                  Attack{renderSortArrow("attack")}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("defense")}>
                  Defense{renderSortArrow("defense")}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("overall")}>
                  Overall{renderSortArrow("overall")}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("goals")}>
                  Goals{renderSortArrow("goals")}
                </th>
                <th className="p-3 cursor-pointer" onClick={() => handleSort("assists")}>
                  Assists{renderSortArrow("assists")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player, idx) => (
                <tr
                  key={player.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{player.name}</td>
                  <td className="p-3">{player.position}</td>
                  <td className="p-3">{player.team}</td>
                  <td className="p-3 text-center">{player.attack}</td>
                  <td className="p-3 text-center">{player.defense}</td>
                  <td className="p-3 text-center font-semibold">{player.overall}</td>
                  <td className="p-3 text-center">{player.goals ?? 0}</td>
                  <td className="p-3 text-center">{player.assists ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stats;
