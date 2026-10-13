import * as v from 'valibot';
import { backgroundSchema, type Background } from '#shared/schemas/background';
import rawBackgrounds from './srd/backgrounds.json';

export const backgrounds: Background[] = v.parse(v.array(backgroundSchema), rawBackgrounds);
