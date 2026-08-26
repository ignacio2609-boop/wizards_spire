import * as v from 'valibot';
import { STAT_KEYS } from '~/types/ability';

export const characterClassSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  hitDie: v.pipe(v.number(), v.integer(), v.minValue(1)),
  primaryAbility: v.picklist(STAT_KEYS),
  savingThrowProficiencies: v.pipe(v.array(v.picklist(STAT_KEYS)), v.minLength(1)),
});

export type CharacterClass = v.InferOutput<typeof characterClassSchema>;