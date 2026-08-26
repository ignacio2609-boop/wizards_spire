import * as v from 'valibot';
import { raceSchema, type Race } from '~/schemas/race';

const rawRaces = [
  {
    id: 'human',
    name: 'Human',
    abilityScoreIncrease: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    speed: 30,
  },
];

export const races: Race[] = rawRaces.map((race) => v.parse(raceSchema, race));