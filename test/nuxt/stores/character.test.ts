import { afterEach, describe, expect, it } from 'vitest';
import { useCharacterStore } from '~/stores/character';

describe('useCharacterStore', () => {
  afterEach(() => useCharacterStore().$reset());

  describe('ability scores', () => {
    it('starts on the standard array with nothing assigned', () => {
      const store = useCharacterStore();

      expect(store.abilityScorePool).toEqual([15, 14, 13, 12, 10, 8]);
      expect(store.abilityScores).toEqual({});
    });

    it('gives each ability the pool score assigned to it', () => {
      const store = useCharacterStore();

      store.assignAbilityScore('str', 0);
      store.assignAbilityScore('cha', 5);

      expect(store.abilityScores).toEqual({ str: 15, cha: 8 });
    });

    it('swaps the scores when an ability takes one that is in use', () => {
      const store = useCharacterStore();
      store.assignAbilityScore('str', 0);
      store.assignAbilityScore('dex', 1);

      store.assignAbilityScore('dex', 0);

      expect(store.abilityScores).toEqual({ str: 14, dex: 15 });
    });

    it('has no scores on the rolled method until the player rolls', () => {
      const store = useCharacterStore();
      store.assignAbilityScore('str', 0);

      store.abilities.method = 'rolled';

      expect(store.abilityScorePool).toEqual([]);
      expect(store.abilityScores).toEqual({});
    });

    it('uses the rolled scores on the rolled method', () => {
      const store = useCharacterStore();
      store.abilities.method = 'rolled';
      store.setRolledScores([17, 9, 12, 12, 7, 14]);

      store.assignAbilityScore('str', 0);

      expect(store.abilityScores).toEqual({ str: 17 });
    });

    it('clears the assignment when the player rolls again', () => {
      const store = useCharacterStore();
      store.abilities.method = 'rolled';
      store.setRolledScores([17, 9, 12, 12, 7, 14]);
      store.assignAbilityScore('str', 0);

      store.setRolledScores([10, 11, 12, 13, 14, 15]);

      expect(store.abilityScores).toEqual({});
    });

    it('keeps the rolled scores and the assignment when the method changes', () => {
      const store = useCharacterStore();
      store.abilities.method = 'rolled';
      store.setRolledScores([17, 9, 12, 12, 7, 14]);
      store.assignAbilityScore('str', 0);

      store.abilities.method = 'standardArray';
      expect(store.abilityScores).toEqual({ str: 15 });

      store.abilities.method = 'rolled';
      expect(store.abilityScores).toEqual({ str: 17 });
    });

    it.each([[[]], [[15, 14, 13, 12, 10]]])('rejects rolled scores that are not six', (scores) => {
      expect(() => useCharacterStore().setRolledScores(scores)).toThrow(RangeError);
    });
  });

  describe('background bonus', () => {
    it('takes the abilities to raise from the background', () => {
      const store = useCharacterStore();

      store.concept.background = 'acolyte';

      expect(store.backgroundAbilities).toEqual(['int', 'wis', 'cha']);
    });

    it('has no abilities to raise without a background', () => {
      expect(useCharacterStore().backgroundAbilities).toEqual([]);
    });

    it('adds a complete bonus to the assigned scores', () => {
      const store = useCharacterStore();
      store.concept.background = 'acolyte';
      store.assignAbilityScore('wis', 0);
      store.assignAbilityScore('int', 1);
      store.assignAbilityScore('str', 5);

      store.abilities.backgroundBonus = { wis: 2, int: 1 };

      expect(store.abilityScores).toEqual({ str: 8, int: 15, wis: 17 });
    });

    it('ignores a bonus that is not complete yet', () => {
      const store = useCharacterStore();
      store.concept.background = 'acolyte';
      store.assignAbilityScore('wis', 0);

      store.abilities.backgroundBonus = { wis: 2 };

      expect(store.abilityScores).toEqual({ wis: 15 });
    });

    it('ignores a bonus chosen for another background and recovers it on going back', () => {
      const store = useCharacterStore();
      store.concept.background = 'acolyte';
      store.assignAbilityScore('wis', 0);
      store.abilities.backgroundBonus = { wis: 2, int: 1 };

      store.concept.background = 'soldier';
      expect(store.abilityScores).toEqual({ wis: 15 });

      store.concept.background = 'acolyte';
      expect(store.abilityScores).toEqual({ wis: 17 });
    });
  });

  describe('saving throw proficiencies', () => {
    it('come from the first class', () => {
      const store = useCharacterStore();

      store.concept.classes = ['wizard', 'fighter'];

      expect(store.savingThrowProficiencies).toEqual(['int', 'wis']);
    });

    it('are none without a class', () => {
      expect(useCharacterStore().savingThrowProficiencies).toEqual([]);
    });
  });
});
