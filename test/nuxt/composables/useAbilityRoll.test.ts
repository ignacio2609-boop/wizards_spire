import { afterEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { useAbilityRoll } from '~/composables/useAbilityRoll';
import { useCharacterStore } from '~/stores/character';
import type { DieRoll } from '~/types/dice';

const d6 = (...values: number[]): DieRoll[] => values.map((value) => ({ sides: 6, value }));

const diceBox = vi.hoisted(() => ({ rollGroups: vi.fn() }));
const isReady = ref(true);
const isRolling = ref(false);

vi.mock('~/composables/useDiceBox', () => ({
  useDiceBox: () => ({ isReady, isRolling, rollGroups: diceBox.rollGroups }),
}));

describe('useAbilityRoll', () => {
  afterEach(() => {
    useCharacterStore().$reset();
    diceBox.rollGroups.mockReset();
    isReady.value = true;
    isRolling.value = false;
  });

  it('rolls 4d6 six times and stores each score without its lowest die', async () => {
    diceBox.rollGroups.mockResolvedValue([
      d6(6, 6, 6, 1),
      d6(1, 1, 1, 1),
      d6(3, 4, 5, 6),
      d6(2, 2, 5, 6),
      d6(4, 4, 4, 4),
      d6(1, 2, 3, 4),
    ]);

    await useAbilityRoll().rollAbilityScores();

    expect(diceBox.rollGroups).toHaveBeenCalledWith(['4d6', '4d6', '4d6', '4d6', '4d6', '4d6']);
    expect(useCharacterStore().abilities.rolledScores).toEqual([18, 3, 15, 13, 12, 9]);
  });

  it('keeps the previous scores when the roll fails', async () => {
    const store = useCharacterStore();
    store.setRolledScores([17, 9, 12, 12, 7, 14]);
    diceBox.rollGroups.mockRejectedValue(new Error('no dice'));

    await expect(useAbilityRoll().rollAbilityScores()).rejects.toThrow('no dice');

    expect(store.abilities.rolledScores).toEqual([17, 9, 12, 12, 7, 14]);
  });

  it.each([
    ['the dice are not ready', false, false],
    ['a roll is in progress', true, true],
  ])('cannot roll while %s', (_case, ready, rolling) => {
    isReady.value = ready;
    isRolling.value = rolling;

    expect(useAbilityRoll().canRoll.value).toBe(false);
  });
});
