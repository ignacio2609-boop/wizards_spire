import * as v from 'valibot';
import { SIZES } from '../types/size.ts';

export const speciesSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  // Usually a single size; with more than one (Tiefling) the player picks
  sizes: v.pipe(v.array(v.picklist(SIZES)), v.minLength(1)),
  speed: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export type Species = v.InferOutput<typeof speciesSchema>;
