import { describe, expect, it } from 'vitest';
import { backgrounds } from '~/data/backgrounds';
import { classes } from '~/data/classes';
import { species } from '~/data/species';
import { srdNameById, srdTranslations, type SrdCollection } from '~/data/srd-translations';

const collections: [SrdCollection, { id: string }[]][] = [
  ['species', species],
  ['classes', classes],
  ['backgrounds', backgrounds],
];

describe('srdTranslations', () => {
  it.each(collections)('names every entry of %s in Spanish', (collection, entries) => {
    const translated = Object.keys(srdTranslations.es?.[collection] ?? {});

    expect(translated.sort()).toEqual(entries.map(({ id }) => id).sort());
  });
});

describe('srdNameById', () => {
  it('gives the name in the locale asked for', () => {
    expect(srdNameById('es', 'classes', 'wizard')).toBe('Mago');
  });

  it('falls back to the English name for a locale without translations', () => {
    expect(srdNameById('fr', 'classes', 'wizard')).toBe('Wizard');
  });

  it('falls back to the id for an entry the SRD does not have', () => {
    expect(srdNameById('es', 'classes', 'artificer')).toBe('artificer');
  });
});
