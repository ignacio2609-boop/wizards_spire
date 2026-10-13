import * as v from 'valibot';
import { STAT_KEYS } from '../types/ability.ts';

// Wizard: INT (choose 1 of 1). Monk: DEX and WIS (choose 2 of 2). Fighter: STR or DEX
// (choose 1 of 2).
const primaryAbilitySchema = v.pipe(
  v.object({
    abilities: v.pipe(v.array(v.picklist(STAT_KEYS)), v.minLength(1)),
    choose: v.pipe(v.number(), v.integer(), v.minValue(1)),
  }),
  v.check(
    ({ abilities, choose }) => choose <= abilities.length,
    'Cannot choose more primary abilities than there are options'
  )
);

export const characterClassSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  hitDie: v.pipe(v.number(), v.integer(), v.minValue(1)),
  primaryAbility: primaryAbilitySchema,
  savingThrowProficiencies: v.pipe(v.array(v.picklist(STAT_KEYS)), v.minLength(1)),
});

export type CharacterClass = v.InferOutput<typeof characterClassSchema>;
