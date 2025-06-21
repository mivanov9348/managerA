import teamsData from "../data/teams.json";

export const getSelectedTeamData = () => {
  const selectedTeam = localStorage.getItem("selectedTeam");
  if (!selectedTeam) return null;

  const playersByTeam = JSON.parse(localStorage.getItem("playersByTeam")) || {};
  const fixturesByLeague =
    JSON.parse(localStorage.getItem("fixturesByLeague")) || {};
  const standingsByLeague =
    JSON.parse(localStorage.getItem("standingsByLeague")) || {};

  let leagueName = null;

  for (const league of teamsData) {
    if (league.teams.some((t) => t.name === selectedTeam)) {
      leagueName = league.league;
      break;
    }
  }

  if (!leagueName) return null;

  const standings = standingsByLeague[leagueName] || [];
  const teamStanding = standings.find((t) => t.team === selectedTeam);
  const fixtures = (fixturesByLeague[leagueName] || []).filter(
    (match) => match.home === selectedTeam || match.away === selectedTeam
  );

  // Изчисли позицията в класирането
  let position = null;
  if (standings.length > 0) {
    const sorted = [...standings].sort((a, b) => b.points - a.points);
    position = sorted.findIndex((t) => t.team === selectedTeam) + 1;
  }

  const enrichedStanding = {
    ...teamStanding,
    position,
  };

  return {
    teamName: selectedTeam,
    leagueName,
    players: playersByTeam[selectedTeam] || [],
    standing: enrichedStanding,
    fixtures,
  };
};
