import type { DieRoll } from '~/types/dice';

export const sumRolls = (rolls: DieRoll[]): number =>
  rolls.reduce((total, { value }) => total + value, 0);

export const dropLowest = (rolls: DieRoll[], count = 1): DieRoll[] => {
  // slice() would quietly accept these (-1 keeps only the highest roll), giving a wrong score
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(`Cannot drop ${count} rolls`);
  }
  return [...rolls].sort((a, b) => a.value - b.value).slice(count);
};
