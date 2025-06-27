import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserGameStore from "../store/UserGameStore";
import { generateFixtures } from "../utils/generateFixtures";
import teamsData from "../data/teams.json";

const TeamSelectModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");
  const { gameStarted, leagues, currentTeam, setCurrentTeam, startSeason } =
    useUserGameStore();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTeam = localStorage.getItem("selectedTeam");
    if (!savedTeam) {
      setShowModal(true);
    } else {
      setCurrentTeam(savedTeam);
    }
  }, []);

  const handleChooseTeam = () => {
    if (!selectedTeam) return;
    localStorage.setItem("selectedTeam", selectedTeam);
    setCurrentTeam(selectedTeam);
    generateFixtures(teamsData);
    setShowModal(false);
    startSeason();
    navigate("/draft"); // ✅ Пренасочване към драфта
  };

  const handleContinue = () => {
    setShowModal(false);
    startSeason();
    navigate("/draft");
  };

  if (!showModal || gameStarted) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col items-center justify-center px-4 z-[9999] overflow-y-auto">
      <h1 className="text-5xl font-extrabold mb-8 tracking-wide">
        manager<span className="text-blue-400">A</span>
      </h1>

      <div className="bg-white text-black p-6 md:p-10 rounded-2xl shadow-2xl max-w-4xl w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Choose Your Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {leagues.map((league, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase">
                {league.league}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {league.teams.map((team, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => setSelectedTeam(team.name)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedTeam === team.name
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 hover:bg-blue-100 border-gray-300"
                    }`}
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleChooseTeam}
            disabled={!selectedTeam}
            className={`px-6 py-2 font-bold rounded-lg transition ${
              selectedTeam
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          >
            Confirm Team
          </button>

          {currentTeam && (
            <button
              onClick={handleContinue}
              className="px-6 py-2 font-bold bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamSelectModal;
