import { JSONFileSyncPreset } from 'lowdb/node';
import { resolve } from 'node:path';

import { ROOT_DIR } from './constants.js';

interface Astronaut {
  id: number;
  name: string;
  planetId: number;
}

interface Planet {
  id: number;
  name: string;
}

interface Rank {
  id: number;
  name: string;
  points: number;
}

interface RewardHistory {
  id: number;
  astronautId: number;
  points: number;
  reason?: string;
}

interface Data {
  astronauts: Astronaut[];
  planets: Planet[];
  ranks: Rank[];
  rewardsHistory: RewardHistory[];
}

type AstronautWithRewardsHistory = Astronaut & {
  points: number;
  rank: Rank;
  rewardsHistory: RewardHistory[];
};

type PlanetWithAstronauts = Planet & {
  points: number;
  astronauts: AstronautWithRewardsHistory[];
};

type PlanetWithAstronautsAndRanking = PlanetWithAstronauts & {
  position: number;
};

type AstronautWithRewardsHistoryAndPlanet = AstronautWithRewardsHistory & {
  planet: Planet & { points: number };
};

const db = JSONFileSyncPreset<Data>(resolve(ROOT_DIR, 'db.json'), {
  astronauts: [],
  planets: [],
  ranks: [],
  rewardsHistory: [],
});

const calculateRank = (points: number): Rank => {
  const sortedRanks = db.data.ranks.sort((a, b) => b.points - a.points);
  return sortedRanks.find((r) => points >= r.points) ?? sortedRanks[0]!;
};

const calculatePoints = (items: { points: number }[]) => items.reduce((sum, a) => sum + a.points, 0);

function getAstronautsWithRewardsHistory(): AstronautWithRewardsHistory[] {
  return db.data.astronauts.map((astronaut) => {
    const rewardsHistory = db.data.rewardsHistory.filter((r) => r.astronautId === astronaut.id);
    const points = calculatePoints(rewardsHistory);
    return {
      ...astronaut,
      rank: calculateRank(points),
      points,
      rewardsHistory,
    };
  });
}

export function getAstronauts(): AstronautWithRewardsHistoryAndPlanet[] {
  const astronautsWithRewardsHistory = getAstronautsWithRewardsHistory();

  return astronautsWithRewardsHistory.map((astronaut) => {
    const planet = db.data.planets.find((p) => p.id === astronaut.planetId)!;

    return {
      ...astronaut,
      planet: {
        ...planet,
        points: calculatePoints(astronautsWithRewardsHistory.filter((a) => a.planetId === planet.id)),
      },
    };
  });
}

export function getPlanets(): PlanetWithAstronauts[] {
  return db.data.planets.map((planet) => {
    const astronauts = getAstronautsWithRewardsHistory().filter((a) => a.planetId === planet.id);
    return {
      ...planet,
      points: calculatePoints(astronauts),
      astronauts,
    };
  });
}

export const getPlanetsWithRanking = (): PlanetWithAstronautsAndRanking[] =>
  getPlanets()
    .sort((a, b) => b.points - a.points)
    .map((planet, index) => ({
      ...planet,
      position: index + 1,
    }));

export const searchAstronaut = (options: { astronautName: string }): AstronautWithRewardsHistoryAndPlanet | undefined =>
  getAstronauts().find((a) => a.name.toLowerCase().includes(options.astronautName.toLowerCase()));

export const getAstronautById = (id: number): AstronautWithRewardsHistoryAndPlanet => {
  const astronaut = getAstronauts().find((a) => a.id === id);
  if (!astronaut) throw new Error(`Astronaut "${id}" not found`);

  return astronaut;
};

export const addRewardToAstronaut = (payload: Omit<RewardHistory, 'id'>) => {
  const astronaut = getAstronautById(payload.astronautId);
  if (!astronaut) throw new Error(`Astronaut "${payload.astronautId}" not found`);

  const newReward: RewardHistory = {
    id: (db.data.rewardsHistory.at(-1)?.id || 0) + 1,
    ...payload,
  };

  db.data.rewardsHistory.push(newReward);
  astronaut.points += payload.points;

  db.write();

  return getAstronautById(payload.astronautId);
};
