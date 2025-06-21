import { simulateMatch } from "../simulation/simulateMatch"; // пътят зависи от структурата ти

export const simulateRoundAllLeagues = (roundNumber) => {
  const fixturesByLeague = JSON.parse(localStorage.getItem("fixturesByLeague")) || {};
  const playersByTeam = JSON.parse(localStorage.getItem("playersByTeam")) || {};
  const standingsByLeague = JSON.parse(localStorage.getItem("standingsByLeague")) || {};

  const allResultsByLeague = {};

  for (const [leagueName, fixtures] of Object.entries(fixturesByLeague)) {
    const roundMatches = fixtures.filter(match => match.round === roundNumber);

    const roundResults = roundMatches.map(match =>
      simulateMatch(match.home, match.away, playersByTeam)
    );

    // Запиши резултати за тази лига
    localStorage.setItem(`matchResults_${roundNumber}_${leagueName}`, JSON.stringify(roundResults));
    allResultsByLeague[leagueName] = roundResults;

    // Обнови самите fixtures с резултата
    const updatedFixtures = fixtures.map((f) => {
      const res = roundResults.find(
        (r) => r.homeTeam === f.home && r.awayTeam === f.away && r.round === f.round
      );
      return res ? {
        ...f,
        homeScore: res.homeScore,
        awayScore: res.awayScore
      } : f;
    });

    fixturesByLeague[leagueName] = updatedFixtures;
  }

  // Записваме променените стойности
  localStorage.setItem("fixturesByLeague", JSON.stringify(fixturesByLeague));
  localStorage.setItem("playersByTeam", JSON.stringify(playersByTeam)); // вече обновено вътре в simulateMatch

  window.dispatchEvent(new Event("fixturesUpdated"));
};
