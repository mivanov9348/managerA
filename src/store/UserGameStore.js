import { create } from "zustand";
import leagues from "../data/teams.json";
import { simulateMatch } from "../utils/simulateMatch";
import { updateStandings } from "../utils/updateStandings";
import { generateFreeAgents } from "../utils/generateFreeAgents";

const useUserGameStore = create((set, get) => {
  const defaultLeague = leagues[0];

  const initialStandingsByLeague = {};
  leagues.forEach((league) => {
    initialStandingsByLeague[league.league] = league.teams.map((team) => ({
      team: team.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsScored: 0,
      goalsAgainst: 0,
      points: 0,
    }));
  });

  if (!localStorage.getItem("freeAgents")) {
    generateFreeAgents(100);
  }

  if (!localStorage.getItem("playersByTeam")) {
    const emptyPlayers = {};
    leagues.forEach((league) => {
      league.teams.forEach((team) => {
        emptyPlayers[team.name] = [];
      });
    });
    localStorage.setItem("playersByTeam", JSON.stringify(emptyPlayers));
  }

  return {
    leagues,
    currentLeague: defaultLeague.league,
    teams: defaultLeague.teams,
    selectedTeam: null,
    currentTeam: null,

    standings: initialStandingsByLeague[defaultLeague.league],
    standingsByLeague: initialStandingsByLeague,

    currentRound: 1,
    draftCompleted: false, // ✅ добавено
    setDraftCompleted: (val) => set({ draftCompleted: val }), // ✅ добавено

    setCurrentTeam: (team) => set({ selectedTeam: team, currentTeam: team }),
    setSelectedTeam: (teamName) => set({ selectedTeam: teamName }),

    setLeague: (leagueName) => {
      const league = leagues.find((l) => l.league === leagueName);
      if (!league) return;

      const standingsByLeague =
        JSON.parse(localStorage.getItem("standingsByLeague")) || initialStandingsByLeague;

      set({
        currentLeague: leagueName,
        teams: league.teams,
        standings: standingsByLeague[leagueName],
        selectedTeam: null,
        currentRound: 1,
        standingsByLeague,
      });
    },

    setCurrentRound: (round) => set({ currentRound: round }),
    nextRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),

    simulateRound: () => {
      const state = get();

      const fixturesByLeague =
        JSON.parse(localStorage.getItem("fixturesByLeague")) || {};
      const playersByTeam =
        JSON.parse(localStorage.getItem("playersByTeam")) || {};
      const standingsByLeague =
        JSON.parse(localStorage.getItem("standingsByLeague")) || {
          ...state.standingsByLeague,
        };

      const updatedFixturesByLeague = { ...fixturesByLeague };
      const updatedStandingsByLeague = { ...standingsByLeague };

      for (const leagueName in fixturesByLeague) {
        const leagueFixtures = fixturesByLeague[leagueName] || [];
        const matchesThisRound = leagueFixtures.filter(
          (f) =>
            f.round === state.currentRound &&
            f.homeScore === null &&
            f.awayScore === null
        );

        let leagueStandings = [...(updatedStandingsByLeague[leagueName] || [])];
        const updatedFixtures = [...leagueFixtures];

        matchesThisRound.forEach((match) => {
          const result = simulateMatch(match.home, match.away, playersByTeam);

          const matchIndex = updatedFixtures.findIndex(
            (m) =>
              m.round === match.round &&
              m.home === match.home &&
              m.away === match.away
          );

          if (matchIndex !== -1) {
            updatedFixtures[matchIndex] = {
              ...match,
              homeScore: result.homeScore,
              awayScore: result.awayScore,
              homeGoals: result.homeGoals,
              awayGoals: result.awayGoals,
            };
          }

          leagueStandings = updateStandings(leagueStandings, result);
        });

        updatedFixturesByLeague[leagueName] = updatedFixtures;
        updatedStandingsByLeague[leagueName] = leagueStandings;
      }

      localStorage.setItem("fixturesByLeague", JSON.stringify(updatedFixturesByLeague));
      localStorage.setItem("standingsByLeague", JSON.stringify(updatedStandingsByLeague));
      localStorage.setItem("playersByTeam", JSON.stringify(playersByTeam));

      set({
        standings: updatedStandingsByLeague[state.currentLeague],
        standingsByLeague: updatedStandingsByLeague,
      });
    },
  };
});

export default useUserGameStore;
