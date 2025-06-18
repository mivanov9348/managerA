import { faker } from "@faker-js/faker";

const POSITIONS = [
  { type: "Goalkeeper", count: 1 },
  { type: "Defender", count: 4 },
  { type: "Midfielder", count: 4 },
  { type: "Forward", count: 2 },
];

export const generatePlayers = (teamName, addMessage) => {
  const players = [];
  for (const { type, count } of POSITIONS) {
    for (let i = 0; i < count; i++) {
      const attack = faker.number.int({ min: 1, max: 10 });
      const defense = faker.number.int({ min: 1, max: 10 });
      const overall = ((attack + defense) / 2).toFixed(2);
      players.push({
        id: faker.string.uuid(),
        name: `${faker.person.firstName('male')} ${faker.person.lastName('male')}`,
        position: type,
        attack,
        defense,
        overall,
      });
    }
  }

  if (addMessage && teamName) {
    addMessage(`Players generated for ${teamName}`);
  }

  return players;
};
