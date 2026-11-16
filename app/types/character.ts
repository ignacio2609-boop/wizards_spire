import type { StatKey } from '#shared/types/ability';

export const ALIGNMENTS = [
  'lawfulGood',
  'neutralGood',
  'chaoticGood',
  'lawfulNeutral',
  'trueNeutral',
  'chaoticNeutral',
  'lawfulEvil',
  'neutralEvil',
  'chaoticEvil',
] as const;

export type Alignment = (typeof ALIGNMENTS)[number];

export interface CharacterConcept {
  characterName: string;
  playerName: string;
  classes: string[];
  background: string;
  species: string;
  alignment: Alignment | '';
}

export const ABILITY_METHODS = ['standardArray', 'rolled'] as const;

export type AbilityMethod = (typeof ABILITY_METHODS)[number];

export type AbilityValues = Partial<Record<StatKey, number>>;

// Where each ability's score sits in the method's pool of six scores; null until assigned
export type AbilityAssignment = Record<StatKey, number | null>;

export interface CharacterAbilities {
  method: AbilityMethod;
  // Empty until the player rolls; kept when the method changes
  rolledScores: number[];
  assignment: AbilityAssignment;
  // May hold a choice made for another background: it only counts while it fits the current one
  backgroundBonus: AbilityValues;
}
