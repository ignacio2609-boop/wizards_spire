// Downloads the SRD collections we use, maps them to our domain schemas and writes them
// to app/data/srd/ as JSON. The app only ever reads those committed files.
// Run with: pnpm srd:import
import { mkdir, writeFile } from 'node:fs/promises';
import * as v from 'valibot';
import { characterClassSchema } from '../../shared/schemas/character-class.ts';
import { speciesSchema } from '../../shared/schemas/species.ts';
import { apiClassSchema, apiSpeciesSchema } from './api-schemas.ts';
import { toCharacterClass, toSpecies } from './mappers.ts';
import { SRD_SOURCE, fetchCollection } from './source.ts';

const OUTPUT_DIR = new URL('../../app/data/srd/', import.meta.url);

interface CollectionImport<TApi, TDomain> {
  collection: string;
  output: string;
  apiSchema: v.GenericSchema<unknown, TApi>;
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

const importCollection = async <TApi, TDomain>({
  collection,
  output,
  apiSchema,
  domainSchema,
  map,
}: CollectionImport<TApi, TDomain>) => {
  const raw = await fetchCollection(collection);
  const entries = parseOrExplain(v.array(apiSchema), raw, `${collection} (upstream)`).map(map);
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
