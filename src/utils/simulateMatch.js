export const simulateMatch = (homeTeam, awayTeam, playersByTeam) => {
  const homePlayers = playersByTeam[homeTeam] || [];
  const awayPlayers = playersByTeam[awayTeam] || [];

  const simulateTeamGoals = (teamPlayers, opponentPlayers) => {
    if (!teamPlayers || !opponentPlayers) return [];

    const attackPool = teamPlayers.filter(p => p && (p.position === "FW" || p.position === "MF"));
    const assistPool = teamPlayers.filter(p => p && p.position !== "GK");
    const defensePlayers = opponentPlayers.filter(p => p && (p.position === "GK" || p.position === "DF"));

    const defenseRating = defensePlayers.reduce((acc, p) => acc + (p.defense || 0), 0);
    const attackRating = attackPool.reduce((acc, p) => acc + (p.attack || 0), 0);

    // Нов шанс, по-реалистичен, с малко noise
    const rawChance = (attackRating - defenseRating) / 150 + Math.random() * 0.5;
    const goalChance = Math.max(0.1, rawChance); // никога по-малко от 10%

    // Симулация на максимум 5 гола
    const possibleGoals = 5;
    const goals = [];

    for (let i = 0; i < possibleGoals; i++) {
      if (Math.random() < goalChance) {
        const scorer = attackPool[Math.floor(Math.random() * attackPool.length)];
        if (!scorer || !scorer.name) continue;

        let assistant = assistPool[Math.floor(Math.random() * assistPool.length)];
        if (!assistant || assistant.name === scorer.name) assistant = null;

        const minute = Math.floor(Math.random() * 90) + 1;

        goals.push({
          minute,
          scorer: scorer.name,
          assistant: assistant ? assistant.name : null,
        });
      }
    }

    return goals.sort((a, b) => a.minute - b.minute);
  };

  const homeGoals = simulateTeamGoals(homePlayers, awayPlayers);
  const awayGoals = simulateTeamGoals(awayPlayers, homePlayers);

  return {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    homeScore: homeGoals.length,
    awayScore: awayGoals.length,
  };
};
