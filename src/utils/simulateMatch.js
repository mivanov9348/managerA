// ✅ simulateMatch.js
import { updatePlayerStats } from "../utils/updatePlayerStats";

export const simulateMatch = (homeTeam, awayTeam, playersByTeam) => {
  const homePlayers = playersByTeam[homeTeam] || [];
  const awayPlayers = playersByTeam[awayTeam] || [];

  const simulateTeamGoals = (teamPlayers, opponentPlayers) => {
    if (!teamPlayers || !opponentPlayers || teamPlayers.length === 0) return [];

    const attackPool = teamPlayers.filter(
      (p) => p && (p.position === "Forward" || p.position === "Midfielder")
    );
    const assistPool = teamPlayers.filter(
      (p) => p && p.position !== "Goalkeeper"
    );
    const defensePlayers = opponentPlayers.filter(
      (p) => p && (p.position === "Goalkeeper" || p.position === "Defender")
    );

    const defenseRating = defensePlayers.reduce(
      (acc, p) => acc + (p.defense || 0),
      0
    );
    const attackRating = attackPool.reduce(
      (acc, p) => acc + (p.attack || 0),
      0
    );

    const goals = [];

    for (let interval = 0; interval < 9; interval++) {
      const minute = interval * 10 + Math.floor(Math.random() * 10) + 1;
      const baseChance = (attackRating - defenseRating) / 150 + Math.random() * 0.2;

      if (Math.random() < Math.max(0, baseChance)) {
        const scorer = attackPool[Math.floor(Math.random() * attackPool.length)];
        if (!scorer || !scorer.name) continue;

        let assistant = assistPool[Math.floor(Math.random() * assistPool.length)];
        if (!assistant || assistant.name === scorer.name) assistant = null;

        goals.push({
          minute,
          scorer: scorer.name,
          assistant: assistant ? assistant.name : null,
          team: scorer.team,
        });
      }
    }

    return goals.sort((a, b) => a.minute - b.minute);
  };

  const homeGoals = simulateTeamGoals(homePlayers, awayPlayers);
  const awayGoals = simulateTeamGoals(awayPlayers, homePlayers);

  // Обнови статистиките на играчите
  playersByTeam = updatePlayerStats(playersByTeam, [...homeGoals, ...awayGoals]);

  // Запази новите статистики в localStorage
  localStorage.setItem("playersByTeam", JSON.stringify(playersByTeam));

  return {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    homeScore: homeGoals.length,
    awayScore: awayGoals.length,
  };
};
