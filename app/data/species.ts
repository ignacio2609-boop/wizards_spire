import * as v from 'valibot';
import { speciesSchema, type Species } from '#shared/schemas/species';
import rawSpecies from './srd/species.json';

export const species: Species[] = v.parse(v.array(speciesSchema), rawSpecies);
