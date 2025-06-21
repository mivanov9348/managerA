export const generateFixtures = (leagues) => {
  const fixturesByLeague = {};

  leagues.forEach((league) => {
    const { league: leagueName, teams } = league;
    const teamNames = teams.map((team) => team.name);
    let allTeams = [...teamNames];

    // Добавяме "почиващ" отбор ако броят е нечетен
    const hasBye = allTeams.length % 2 !== 0;
    if (hasBye) allTeams.push("BYE");

    const numTeams = allTeams.length;
    const numRounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;

    const rounds = [];

    for (let round = 0; round < numRounds; round++) {
      const matches = [];

      for (let i = 0; i < matchesPerRound; i++) {
        const home = allTeams[i];
        const away = allTeams[numTeams - 1 - i];

        if (home !== "BYE" && away !== "BYE") {
          matches.push({
            round: round + 1,
            home,
            away,
            homeScore: null,
            awayScore: null
          });
        }
      }

      rounds.push(matches);

      // Въртене на отборите (без първия)
      const fixed = allTeams[0];
      const rotated = [fixed, ...allTeams.slice(1).rotateRight(1)];
      allTeams = rotated;
    }

    const reverseRounds = rounds.map((matches, i) =>
      matches.map((m) => ({
        round: i + 1 + numRounds,
        home: m.away,
        away: m.home,
        homeScore: null,
        awayScore: null
      }))
    );

    const fullSeason = [...rounds.flat(), ...reverseRounds.flat()];
    fixturesByLeague[leagueName] = fullSeason;
  });

  localStorage.setItem("fixturesByLeague", JSON.stringify(fixturesByLeague));
};

Array.prototype.rotateRight = function (n = 1) {
  const len = this.length;
  return this.slice(len - n).concat(this.slice(0, len - n));
};
