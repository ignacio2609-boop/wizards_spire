import { describe, expect, it } from 'vitest';
import type { DieRoll } from '~/types/dice';
import { dropLowest, sumRolls } from '~/utils/dice';

const d6 = (...values: number[]): DieRoll[] => values.map((value) => ({ sides: 6, value }));

describe('sumRolls', () => {
  it('adds up the value of every roll', () => {
    expect(sumRolls(d6(3, 1, 6, 4))).toBe(14);
  });

  it('ignores the number of sides of each die', () => {
    const rolls: DieRoll[] = [
      { sides: 20, value: 20 },
      { sides: 4, value: 3 },
    ];

    expect(sumRolls(rolls)).toBe(23);
  });

  it('returns 0 for no rolls', () => {
    expect(sumRolls([])).toBe(0);
  });
});

describe('dropLowest', () => {
  it('drops the lowest roll by default', () => {
    const kept = dropLowest(d6(3, 1, 6, 4));

    expect(kept).toHaveLength(3);
    expect(kept).toEqual(expect.arrayContaining(d6(3, 6, 4)));
  });

  it('drops only one of several tied lowest rolls', () => {
    const kept = dropLowest(d6(2, 5, 2, 4));

    expect(kept).toHaveLength(3);
    expect(kept).toEqual(expect.arrayContaining(d6(2, 5, 4)));
  });

  it('drops as many lowest rolls as requested', () => {
    const kept = dropLowest(d6(3, 1, 6, 4), 2);

    expect(kept).toHaveLength(2);
    expect(kept).toEqual(expect.arrayContaining(d6(6, 4)));
  });

  it('keeps every roll when dropping none', () => {
    const kept = dropLowest(d6(3, 1, 6, 4), 0);

    expect(kept).toHaveLength(4);
    expect(kept).toEqual(expect.arrayContaining(d6(3, 1, 6, 4)));
  });

  it('returns no rolls when dropping more than there are', () => {
    expect(dropLowest(d6(3, 1), 5)).toEqual([]);
  });

  it.each([-1, 1.5])('rejects %s as the number of rolls to drop', (count) => {
    expect(() => dropLowest(d6(3, 1, 6, 4), count)).toThrow(RangeError);
  });

  it('does not modify the original rolls', () => {
    const rolls = d6(3, 1, 6, 4);

    dropLowest(rolls);

    expect(rolls).toEqual(d6(3, 1, 6, 4));
  });

  it('scores an ability as 4d6 dropping the lowest', () => {
    expect(sumRolls(dropLowest(d6(3, 1, 6, 4)))).toBe(13);
  });
});
