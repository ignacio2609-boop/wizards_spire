import { STAT_KEYS, type StatKey } from '#shared/types/ability';
import type { AbilityAssignment, AbilityMethod, AbilityValues } from '~/types/character';
import type { DieRoll } from '~/types/dice';
import { dropLowest, sumRolls } from '~/utils/dice';

export const STANDARD_ARRAY: readonly number[] = [15, 14, 13, 12, 10, 8];

export const ABILITY_SCORE_COUNT = STAT_KEYS.length;

export const MAX_ABILITY_SCORE = 20;

// A background raises one ability by 2 and another by 1, or all three by 1
const BACKGROUND_BONUS_SPREADS = ['1,2', '1,1,1'];

export const abilityModifier = (score: number): number => Math.floor((score - 10) / 2);

export const proficiencyBonus = (level: number): number => {
  if (!Number.isInteger(level) || level < 1 || level > 20) {
    throw new RangeError(`Invalid character level: ${level}`);
  }
  return 2 + Math.floor((level - 1) / 4);
};

export const savingThrowBonus = (score: number, proficient: boolean, level: number): number =>
  abilityModifier(score) + (proficient ? proficiencyBonus(level) : 0);

// 4d6, drop the lowest die
export const abilityScoreFromRolls = (rolls: DieRoll[]): number => sumRolls(dropLowest(rolls));

export const scorePool = (method: AbilityMethod, rolledScores: readonly number[]) =>
  method === 'standardArray' ? STANDARD_ARRAY : rolledScores;

export const createEmptyAssignment = (): AbilityAssignment => ({
  str: null,
  dex: null,
  con: null,
  int: null,
  wis: null,
  cha: null,
});

// Each pool score goes to one ability: taking one that is in use swaps it with the taker's
export function assignScore(
  assignment: AbilityAssignment,
  stat: StatKey,
  poolIndex: number | null
): AbilityAssignment {
  const next = { ...assignment, [stat]: poolIndex };
  if (poolIndex === null) return next;

  const previousOwner = STAT_KEYS.find((key) => key !== stat && assignment[key] === poolIndex);
  if (previousOwner) next[previousOwner] = assignment[stat];
  return next;
}

export function assignedScores(
  pool: readonly number[],
  assignment: AbilityAssignment
): AbilityValues {
  const scores: AbilityValues = {};
  for (const stat of STAT_KEYS) {
    const poolIndex = assignment[stat];
    const score = poolIndex === null ? undefined : pool[poolIndex];
    if (score !== undefined) scores[stat] = score;
  }
  return scores;
}

export function isValidBackgroundBonus(
  bonus: AbilityValues,
  backgroundAbilities: readonly StatKey[]
): boolean {
  const raised = STAT_KEYS.filter((stat) => bonus[stat]);
  if (!raised.every((stat) => backgroundAbilities.includes(stat))) return false;

  const spread = raised
    .map((stat) => bonus[stat])
    .sort()
    .join(',');
  return BACKGROUND_BONUS_SPREADS.includes(spread);
}

// Every valid way to spread a background's bonus over the abilities it raises
export function backgroundBonusOptions(backgroundAbilities: readonly StatKey[]): AbilityValues[] {
  if (backgroundAbilities.length === 0) return [];

  const options: AbilityValues[] = [];
  for (const raisedByTwo of backgroundAbilities) {
    for (const raisedByOne of backgroundAbilities) {
      if (raisedByOne === raisedByTwo) continue;
      const option: AbilityValues = {};
      option[raisedByTwo] = 2;
      option[raisedByOne] = 1;
      options.push(option);
    }
  }

  const oneEach: AbilityValues = {};
  for (const stat of backgroundAbilities) oneEach[stat] = 1;
  return [...options, oneEach];
}

export const isSameAbilityBonus = (a: AbilityValues, b: AbilityValues): boolean =>
  STAT_KEYS.every((stat) => (a[stat] ?? 0) === (b[stat] ?? 0));

export function applyAbilityBonus(scores: AbilityValues, bonus: AbilityValues): AbilityValues {
  const raised: AbilityValues = {};
  for (const stat of STAT_KEYS) {
    const score = scores[stat];
    if (score === undefined) continue;
    raised[stat] = Math.min(score + (bonus[stat] ?? 0), MAX_ABILITY_SCORE);
  }
  return raised;
}

// Plain hyphen: the sheet fonts have no glyph for the minus sign (U+2212)
export const formatModifier = (modifier: number): string =>
  modifier < 0 ? String(modifier) : `+${modifier}`;
