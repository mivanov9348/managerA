// ✅ UserGameStore.js
import { create } from "zustand";
import leagues from "../data/teams.json";
import { simulateMatch } from "../utils/simulateMatch";

const useUserGameStore = create((set, get) => {
  const defaultLeague = leagues[0];

  return {
    // Данни
    leagues,
    currentLeague: defaultLeague.league,
    teams: defaultLeague.teams,
    selectedTeam: null,

    // Статистика
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

    // Текущ рунд
    currentRound: 1,

    // Методи
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
        currentRound: 1,
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
        JSON.parse(localStorage.getItem("standingsByLeague")) || {};

      const updatedMatchResults = {};
      const updatedStandingsByLeague = { ...standingsByLeague };

      // Симулирай всички лиги
      for (const leagueName in fixturesByLeague) {
        const leagueFixtures = fixturesByLeague[leagueName] || [];
        const matchesThisRound = leagueFixtures.filter(
          (f) => f.round === state.currentRound
        );

        const leagueStandings = [
          ...(updatedStandingsByLeague[leagueName] || []),
        ];
        const results = [];

        matchesThisRound.forEach((match) => {
          const result = simulateMatch(match.home, match.away, playersByTeam);
          results.push(result);

          const home = leagueStandings.find((t) => t.team === match.home);
          const away = leagueStandings.find((t) => t.team === match.away);

          if (!home || !away) return;

          home.played += 1;
          away.played += 1;
          home.goalsScored += result.homeScore;
          home.goalsAgainst += result.awayScore;
          away.goalsScored += result.awayScore;
          away.goalsAgainst += result.homeScore;

          if (result.homeScore > result.awayScore) {
            home.wins += 1;
            away.losses += 1;
            home.points += 3;
          } else if (result.awayScore > result.homeScore) {
            away.wins += 1;
            home.losses += 1;
            away.points += 3;
          } else {
            home.draws += 1;
            away.draws += 1;
            home.points += 1;
            away.points += 1;
          }
        });

        updatedMatchResults[leagueName] = results;
        updatedStandingsByLeague[leagueName] = leagueStandings;
      }

      // Запази всичко обратно в localStorage
      localStorage.setItem("playersByTeam", JSON.stringify(playersByTeam));
      localStorage.setItem(
        "standingsByLeague",
        JSON.stringify(updatedStandingsByLeague)
      );

      for (const league in updatedMatchResults) {
        localStorage.setItem(
          `matchResults_${state.currentRound}_${league}`,
          JSON.stringify(updatedMatchResults[league])
        );
      }

      // Обнови standings само за текущата лига (визуално)
      set({ standings: updatedStandingsByLeague[state.currentLeague] });
    },

    goToNextRound: () =>
      set((state) => ({
        currentRound: state.currentRound + 1,
      })),
  };
});

export default useUserGameStore;
