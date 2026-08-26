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
  race: string;
  alignment: Alignment | '';
}