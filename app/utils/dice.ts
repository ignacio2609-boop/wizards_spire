import type { DieRoll } from '~/types/dice';

export const sumRolls = (rolls: DieRoll[]): number =>
  rolls.reduce((total, { value }) => total + value, 0);

export const dropLowest = (rolls: DieRoll[], count = 1): DieRoll[] =>
  [...rolls].sort((a, b) => a.value - b.value).slice(count);
