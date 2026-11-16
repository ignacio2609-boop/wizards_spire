import { describe, expect, it } from 'vitest';
import type { DieRoll } from '~/types/dice';
import {
  abilityModifier,
  abilityScoreFromRolls,
  applyAbilityBonus,
  assignedScores,
  assignScore,
  createEmptyAssignment,
  isValidBackgroundBonus,
  proficiencyBonus,
  savingThrowBonus,
  scorePool,
  STANDARD_ARRAY,
} from '~/utils/abilityScores';

const d6 = (...values: number[]): DieRoll[] => values.map((value) => ({ sides: 6, value }));

describe('abilityModifier', () => {
  it.each([
    [1, -5],
    [8, -1],
    [9, -1],
    [10, 0],
    [11, 0],
    [15, 2],
    [20, 5],
  ])('gives a score of %i a modifier of %i', (score, modifier) => {
    expect(abilityModifier(score)).toBe(modifier);
  });
});

describe('proficiencyBonus', () => {
  it.each([
    [1, 2],
    [4, 2],
    [5, 3],
    [17, 6],
    [20, 6],
  ])('gives level %i a bonus of %i', (level, bonus) => {
    expect(proficiencyBonus(level)).toBe(bonus);
  });

  it.each([0, 21, 1.5])('rejects level %s', (level) => {
    expect(() => proficiencyBonus(level)).toThrow(RangeError);
  });
});

describe('savingThrowBonus', () => {
  it('is the ability modifier without proficiency', () => {
    expect(savingThrowBonus(8, false, 1)).toBe(-1);
  });

  it('adds the proficiency bonus with proficiency', () => {
    expect(savingThrowBonus(16, true, 1)).toBe(5);
  });
});

describe('abilityScoreFromRolls', () => {
  it('adds the three highest of four dice', () => {
    expect(abilityScoreFromRolls(d6(3, 1, 6, 4))).toBe(13);
  });

  it('drops only one die when the lowest value is tied', () => {
    expect(abilityScoreFromRolls(d6(2, 2, 5, 6))).toBe(13);
  });
});

describe('scorePool', () => {
  it('is the standard array for that method, whatever was rolled', () => {
    expect(scorePool('standardArray', [18, 17, 16, 15, 14, 13])).toEqual(STANDARD_ARRAY);
  });

  it('is the rolled scores for the rolled method', () => {
    expect(scorePool('rolled', [16, 9, 12, 12, 7, 14])).toEqual([16, 9, 12, 12, 7, 14]);
  });

  it('is empty for the rolled method before rolling', () => {
    expect(scorePool('rolled', [])).toEqual([]);
  });
});

describe('assignScore', () => {
  it('gives a free pool score to the ability', () => {
    const assignment = assignScore(createEmptyAssignment(), 'dex', 0);

    expect(assignment).toEqual({ ...createEmptyAssignment(), dex: 0 });
  });

  it('swaps with the ability that already had the pool score', () => {
    const assignment = assignScore({ ...createEmptyAssignment(), str: 0, dex: 3 }, 'dex', 0);

    expect(assignment).toEqual({ ...createEmptyAssignment(), str: 3, dex: 0 });
  });

  it('leaves the previous owner empty when the taker had no score', () => {
    const assignment = assignScore({ ...createEmptyAssignment(), str: 0 }, 'dex', 0);

    expect(assignment).toEqual({ ...createEmptyAssignment(), dex: 0 });
  });

  it('clears the ability without touching the others', () => {
    const assignment = assignScore({ ...createEmptyAssignment(), str: 0, dex: 3 }, 'dex', null);

    expect(assignment).toEqual({ ...createEmptyAssignment(), str: 0 });
  });

  it('does not change the assignment it receives', () => {
    const original = { ...createEmptyAssignment(), str: 0 };

    assignScore(original, 'dex', 0);

    expect(original).toEqual({ ...createEmptyAssignment(), str: 0 });
  });
});

describe('assignedScores', () => {
  it('reads each assigned ability from the pool', () => {
    const scores = assignedScores(STANDARD_ARRAY, { ...createEmptyAssignment(), str: 5, wis: 0 });

    expect(scores).toEqual({ str: 8, wis: 15 });
  });

  it('keeps equal scores at different positions apart', () => {
    const scores = assignedScores([12, 12], { ...createEmptyAssignment(), str: 0, dex: 1 });

    expect(scores).toEqual({ str: 12, dex: 12 });
  });

  it('skips positions the pool does not have', () => {
    const scores = assignedScores([], { ...createEmptyAssignment(), str: 0 });

    expect(scores).toEqual({});
  });
});

describe('isValidBackgroundBonus', () => {
  const abilities = ['int', 'wis', 'cha'] as const;

  it('accepts +2 to one ability and +1 to another', () => {
    expect(isValidBackgroundBonus({ wis: 2, int: 1 }, abilities)).toBe(true);
  });

  it('accepts +1 to all three abilities', () => {
    expect(isValidBackgroundBonus({ int: 1, wis: 1, cha: 1 }, abilities)).toBe(true);
  });

  it.each([
    ['nothing chosen', {}],
    ['only the +2', { wis: 2 }],
    ['+1 to two abilities', { int: 1, wis: 1 }],
    ['+2 to two abilities', { int: 2, wis: 2 }],
    ['+3 to one ability', { wis: 3 }],
    ['an ability the background does not raise', { wis: 2, str: 1 }],
  ])('rejects %s', (_case, bonus) => {
    expect(isValidBackgroundBonus(bonus, abilities)).toBe(false);
  });
});

describe('applyAbilityBonus', () => {
  it('adds the bonus to the abilities that have one', () => {
    expect(applyAbilityBonus({ str: 15, dex: 10, con: 8 }, { str: 2, con: 1 })).toEqual({
      str: 17,
      dex: 10,
      con: 9,
    });
  });

  it('never raises a score above 20', () => {
    expect(applyAbilityBonus({ str: 19 }, { str: 2 })).toEqual({ str: 20 });
  });

  it('gives no score to an ability that has none yet', () => {
    expect(applyAbilityBonus({}, { str: 2 })).toEqual({});
  });
});
