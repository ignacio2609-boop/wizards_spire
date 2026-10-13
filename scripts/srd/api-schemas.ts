import * as v from 'valibot';
import { STAT_KEYS } from '../../shared/types/ability.ts';

// Shapes of the upstream 5e-database JSON, limited to the fields we read. v.object drops
// unknown keys, so upstream additions don't break the import; missing or renamed fields do.

const abilityScoreRefSchema = v.object({ index: v.picklist(STAT_KEYS) });

export const API_SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] as const;

export type ApiSize = (typeof API_SIZES)[number];

const apiSpeciesBaseEntries = {
  index: v.string(),
  name: v.string(),
  speed: v.number(),
};

export const apiSpeciesSchema = v.union([
  v.object({ ...apiSpeciesBaseEntries, size: v.picklist(API_SIZES) }),
  v.object({
    ...apiSpeciesBaseEntries,
    size_options: v.object({
      from: v.object({ options: v.array(v.object({ size: v.picklist(API_SIZES) })) }),
    }),
  }),
]);

export type ApiSpecies = v.InferOutput<typeof apiSpeciesSchema>;

export const apiClassSchema = v.object({
  index: v.string(),
  name: v.string(),
  hit_die: v.number(),
  primary_ability: v.union([
    v.object({ ability_scores: v.array(abilityScoreRefSchema) }),
    v.object({
      ability_score_options: v.object({
        choose: v.number(),
        from: v.object({ options: v.array(v.object({ item: abilityScoreRefSchema })) }),
      }),
    }),
  ]),
  saving_throws: v.array(abilityScoreRefSchema),
});

export type ApiClass = v.InferOutput<typeof apiClassSchema>;
