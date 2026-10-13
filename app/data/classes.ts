import * as v from 'valibot';
import { characterClassSchema, type CharacterClass } from '#shared/schemas/character-class';
import rawClasses from './srd/classes.json';

export const classes: CharacterClass[] = v.parse(v.array(characterClassSchema), rawClasses);
