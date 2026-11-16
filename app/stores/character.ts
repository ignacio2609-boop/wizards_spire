import { defineStore } from 'pinia';
import type { StatKey } from '#shared/types/ability';
import { backgrounds } from '~/data/backgrounds';
import { classes } from '~/data/classes';
import type { AbilityValues, CharacterAbilities, CharacterConcept } from '~/types/character';
import {
  ABILITY_SCORE_COUNT,
  applyAbilityBonus,
  assignedScores,
  assignScore,
  createEmptyAssignment,
  isValidBackgroundBonus,
  scorePool,
} from '~/utils/abilityScores';

const createEmptyConcept = (): CharacterConcept => ({
  characterName: '',
  playerName: '',
  classes: [],
  background: '',
  species: '',
  alignment: '',
});

const createEmptyAbilities = (): CharacterAbilities => ({
  method: 'standardArray',
  rolledScores: [],
  assignment: createEmptyAssignment(),
  backgroundBonus: {},
});

export const useCharacterStore = defineStore('character', {
  state: () => ({
    concept: createEmptyConcept(),
    abilities: createEmptyAbilities(),
  }),
  getters: {
    abilityScorePool: ({ abilities }): readonly number[] =>
      scorePool(abilities.method, abilities.rolledScores),
    backgroundAbilities: ({ concept }): readonly StatKey[] =>
      backgrounds.find(({ id }) => id === concept.background)?.abilityScores ?? [],
    // Only the first class grants saving throw proficiencies
    savingThrowProficiencies: ({ concept }): readonly StatKey[] =>
      classes.find(({ id }) => id === concept.classes[0])?.savingThrowProficiencies ?? [],
    baseAbilityScores(): AbilityValues {
      return assignedScores(this.abilityScorePool, this.abilities.assignment);
    },
    appliedBackgroundBonus(): AbilityValues {
      const { backgroundBonus } = this.abilities;
      return isValidBackgroundBonus(backgroundBonus, this.backgroundAbilities)
        ? backgroundBonus
        : {};
    },
    abilityScores(): AbilityValues {
      return applyAbilityBonus(this.baseAbilityScores, this.appliedBackgroundBonus);
    },
  },
  actions: {
    assignAbilityScore(stat: StatKey, poolIndex: number | null) {
      this.abilities.assignment = assignScore(this.abilities.assignment, stat, poolIndex);
    },
    setRolledScores(scores: number[]) {
      if (scores.length !== ABILITY_SCORE_COUNT) {
        throw new RangeError(`Expected ${ABILITY_SCORE_COUNT} rolled scores, got ${scores.length}`);
      }
      this.abilities.rolledScores = scores;
    },
  },
});
