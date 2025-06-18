import { create } from "zustand";
import leagues from "../data/teams.json";

const useUserGameStore = create((set, get) => {
  const defaultLeague = leagues[0];

  return {
    leagues,
    currentLeague: defaultLeague.league,
    teams: defaultLeague.teams,
    selectedTeam: null,

    standings: defaultLeague.teams.map((team) => ({
      team: team.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsAgainst: 0,
      points: 0,
    })),

    setCurrentTeam: (team) => set({ selectedTeam: team, currentTeam: team }),

    setSelectedTeam: (teamName) => set({ selectedTeam: teamName }),

    setLeague: (leagueName) => {
      const league = leagues.find((l) => l.league === leagueName);
      if (!league) return;

    

      set({
        currentLeague: leagueName,
        teams: league.teams,
        standings: league.teams.map((team) => ({
          team: team.name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsScored: 0,
          goalsAgainst: 0,
          points: 0,
        })),
        selectedTeam: null,
      });
    },
  };
});

export default useUserGameStore;
