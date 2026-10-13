// Downloads the SRD collections we use, maps them to our domain schemas and writes them
// to app/data/srd/ as JSON. The app only ever reads those committed files.
// Run with: pnpm srd:import
import { mkdir, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import * as v from 'valibot';
import { backgroundSchema } from '../../shared/schemas/background.ts';
import { characterClassSchema } from '../../shared/schemas/character-class.ts';
import { speciesSchema } from '../../shared/schemas/species.ts';
import { apiBackgroundSchema, apiClassSchema, apiSpeciesSchema } from './api-schemas.ts';
import { toBackground, toCharacterClass, toSpecies } from './mappers.ts';
import { backgroundPatches, type Patches } from './patches.ts';
import { SRD_SOURCE, fetchCollection } from './source.ts';

const OUTPUT_DIR = new URL('../../app/data/srd/', import.meta.url);

interface CollectionImport<TApi extends { index: string }, TDomain> {
  collection: string;
  output: string;
  apiSchema: v.GenericSchema<unknown, TApi>;
  patches?: Patches<TApi>;
  domainSchema: v.GenericSchema<TDomain>;
  map: (dto: TApi) => TDomain;
}

const parseOrExplain = <T>(schema: v.GenericSchema<unknown, T>, input: unknown, label: string) => {
  const result = v.safeParse(schema, input);
  if (!result.success) {
    throw new Error(`${label} failed validation:\n${v.summarize(result.issues)}`);
  }
  return result.output;
};

// Warns, rather than fails, on stale patches: the data is still right, the patch is just dead code
const applyPatches = <T extends { index: string }>(
  collection: string,
  entries: T[],
  patches: Patches<T>
) => {
  const unused = new Set(Object.keys(patches));
  const patched = entries.map((entry) => {
    const patch = patches[entry.index];
    if (!patch) return entry;
    unused.delete(entry.index);
    const result = patch(entry);
    if (isDeepStrictEqual(result, entry)) {
      console.warn(`⚠ ${collection}/${entry.index}: patch changes nothing, upstream fixed it?`);
    }
    return result;
  });
  for (const index of unused) {
    console.warn(`⚠ ${collection}/${index}: patched entry no longer exists upstream`);
  }
  return patched;
};

const importCollection = async <TApi extends { index: string }, TDomain>({
  collection,
  output,
  apiSchema,
  patches = {},
  domainSchema,
  map,
}: CollectionImport<TApi, TDomain>) => {
  const raw = await fetchCollection(collection);
  const upstream = parseOrExplain(v.array(apiSchema), raw, `${collection} (upstream)`);
  const entries = applyPatches(collection, upstream, patches).map(map);
  // The mappers are typed, but only the schema enforces constraints like minLength
  parseOrExplain(v.array(domainSchema), entries, `${collection} (mapped)`);

  await writeFile(new URL(output, OUTPUT_DIR), `${JSON.stringify(entries, null, 2)}\n`);
  console.log(`✓ ${collection}: ${entries.length} → app/data/srd/${output}`);
};

console.log(
  `SRD ${SRD_SOURCE.ruleset} (${SRD_SOURCE.lang}) from ${SRD_SOURCE.repo}@${SRD_SOURCE.ref}`
);
await mkdir(OUTPUT_DIR, { recursive: true });
await importCollection({
  collection: 'Species',
  output: 'species.json',
  apiSchema: apiSpeciesSchema,
  domainSchema: speciesSchema,
  map: toSpecies,
});
await importCollection({
  collection: 'Classes',
  output: 'classes.json',
  apiSchema: apiClassSchema,
  domainSchema: characterClassSchema,
  map: toCharacterClass,
});
await importCollection({
  collection: 'Backgrounds',
  output: 'backgrounds.json',
  apiSchema: apiBackgroundSchema,
  patches: backgroundPatches,
  domainSchema: backgroundSchema,
  map: toBackground,
});
