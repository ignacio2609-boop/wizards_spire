import * as v from 'valibot';
import { STAT_KEYS } from '../types/ability.ts';

export const backgroundSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  // The abilities the player raises: +2 to one and +1 to another, or +1 to all three
  abilityScores: v.pipe(v.array(v.picklist(STAT_KEYS)), v.length(3)),
  // Origin feat. Magic Initiate also fixes whose spell list it draws from (a class id)
  feat: v.object({
    id: v.pipe(v.string(), v.minLength(1)),
    spellList: v.optional(v.pipe(v.string(), v.minLength(1))),
  }),
  // SRD proficiency ids (skill-insight, tool-thieves-tools...)
  proficiencies: v.array(v.pipe(v.string(), v.minLength(1))),
  proficiencyChoices: v.array(
    v.object({
      choose: v.pipe(v.number(), v.integer(), v.minValue(1)),
      options: v.pipe(v.array(v.pipe(v.string(), v.minLength(1))), v.minLength(1)),
    })
  ),
});

export type Background = v.InferOutput<typeof backgroundSchema>;
