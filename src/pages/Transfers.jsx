import React, { useEffect, useState } from "react";
import useUserGameStore from "../store/UserGameStore";

const Transfers = () => {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [transferPoints, setTransferPoints] = useState(100);
  const [myTeam, setMyTeam] = useState([]);

  useEffect(() => {
    const selectedTeam = localStorage.getItem("selectedTeam");
    const playersByTeam = JSON.parse(localStorage.getItem("playersByTeam")) || {};
    const freeAgents = JSON.parse(localStorage.getItem("freeAgents")) || [];

    setAvailablePlayers(freeAgents);
    const myPlayers = playersByTeam[selectedTeam] || [];
    setMyTeam(myPlayers);
  }, []);

  const handleBuy = (player) => {
    if (transferPoints < player.price) return;

    const selectedTeam = localStorage.getItem("selectedTeam");
    const playersByTeam = JSON.parse(localStorage.getItem("playersByTeam")) || {};
    const freeAgents = JSON.parse(localStorage.getItem("freeAgents")) || [];

    // Добавяме играча към отбора
    const updatedMyTeam = [...myTeam, { ...player, team: selectedTeam }];
    const updatedPlayersByTeam = {
      ...playersByTeam,
      [selectedTeam]: updatedMyTeam,
    };

    // Премахваме играча от пазара
    const updatedFreeAgents = freeAgents.filter((p) => p.id !== player.id);

    // Запазваме всичко
    localStorage.setItem("playersByTeam", JSON.stringify(updatedPlayersByTeam));
    localStorage.setItem("freeAgents", JSON.stringify(updatedFreeAgents));

    setMyTeam(updatedMyTeam);
    setTransferPoints(transferPoints - player.price);
    setAvailablePlayers(updatedFreeAgents);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-blue-800">Transfer Market</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Transfer Points</p>
          <span className="text-2xl font-bold text-green-600">{transferPoints} TP</span>
        </div>
      </div>

      {availablePlayers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No free agents available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {availablePlayers.map((player) => (
            <div
              key={player.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-blue-700">{player.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{player.position}</p>
              <div className="flex justify-between text-sm mb-2">
                <span>⚔️ {player.attack}</span>
                <span>🛡️ {player.defense}</span>
                <span>⭐ {player.overall}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700 font-semibold">{player.price} TP</span>
                <button
                  className={`px-4 py-1 rounded-xl text-white text-sm font-semibold ${
                    transferPoints >= player.price
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={transferPoints < player.price}
                  onClick={() => handleBuy(player)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transfers;
