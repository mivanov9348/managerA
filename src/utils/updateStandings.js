export const updateStandings = (standings, result) => {
  const home = standings.find((t) => t.team === result.homeTeam);
  const away = standings.find((t) => t.team === result.awayTeam);

  if (!home || !away) return standings;

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

  return standings;
};
