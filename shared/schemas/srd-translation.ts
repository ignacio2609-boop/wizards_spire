import * as v from 'valibot';

// Only the text fields of an SRD entry: everything else (dice, abilities, speed...) is
// language-independent and stays in the English source data.
export const srdEntryTranslationSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
});

export type SrdEntryTranslation = v.InferOutput<typeof srdEntryTranslationSchema>;
