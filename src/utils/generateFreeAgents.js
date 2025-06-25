import { faker } from "@faker-js/faker";

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Forward"];

export const generateFreeAgents = (count = 100) => {
  const agents = [];

  for (let i = 0; i < count; i++) {
    const position = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
    const attack = faker.number.int({ min: 1, max: 10 });
    const defense = faker.number.int({ min: 1, max: 10 });
    const overall = Number(((attack + defense) / 2).toFixed(2));
    agents.push({
      id: faker.string.uuid(),
      name: `${faker.person.firstName("male")} ${faker.person.lastName("male")}`,
      position,
      attack,
      defense,
      overall,
      price: overall * 2,
      goals: 0,
      assists: 0,
    });
  }

  localStorage.setItem("freeAgents", JSON.stringify(agents));
  return agents;
};
