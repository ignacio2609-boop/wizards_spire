import * as v from 'valibot';
import { STAT_KEYS } from '~/types/ability';

export const raceSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  abilityScoreIncrease: v.record(v.picklist(STAT_KEYS), v.pipe(v.number(), v.integer())),
  speed: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export type Race = v.InferOutput<typeof raceSchema>;