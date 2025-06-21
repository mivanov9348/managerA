
export const updatePlayerStats = (playersByTeam, goals) => {
  const updatedPlayersByTeam = { ...playersByTeam };

  goals.forEach(({ scorer, assistant }) => {
    for (const team in updatedPlayersByTeam) {
      const teamPlayers = updatedPlayersByTeam[team];

      const scorerPlayer = teamPlayers.find((p) => p.name === scorer);
      if (scorerPlayer) {
        scorerPlayer.goals = (scorerPlayer.goals || 0) + 1;
      }

      if (assistant) {
        const assistPlayer = teamPlayers.find((p) => p.name === assistant);
        if (assistPlayer) {
          assistPlayer.assists = (assistPlayer.assists || 0) + 1;
        }
      }
    }
  });

  return updatedPlayersByTeam;
};
