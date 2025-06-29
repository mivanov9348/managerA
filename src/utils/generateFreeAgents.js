import { faker } from "@faker-js/faker";
import leagues from "../data/teams.json"; // или откъдето взимаш отборите

export const generateFreeAgents = () => {
  const agents = [];

  // Изчисляваме броя на всички отбори в лигите
  const totalTeams = leagues.reduce((acc, league) => acc + league.teams.length, 0);

  const positionCounts = {
    Goalkeeper: totalTeams * 1,
    Defender: totalTeams * 4,
    Midfielder: totalTeams * 4,
    Forward: totalTeams * 2,
  };

  const generatePlayer = (position) => {
    const attack = faker.number.int({ min: 1, max: 10 });
    const defense = faker.number.int({ min: 1, max: 10 });
    const overall = Number(((attack + defense) / 2).toFixed(2));

    return {
      id: faker.string.uuid(),
      name: `${faker.person.firstName("male")} ${faker.person.lastName("male")}`,
      position,
      attack,
      defense,
      overall,
      price: overall * 2,
      goals: 0,
      assists: 0,
    };
  };

  for (const position in positionCounts) {
    for (let i = 0; i < positionCounts[position]; i++) {
      agents.push(generatePlayer(position));
    }
  }

  localStorage.setItem("freeAgents", JSON.stringify(agents));
  return agents;
};
