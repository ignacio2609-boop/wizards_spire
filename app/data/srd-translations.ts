import * as v from 'valibot';
import type { Locale } from 'vue-i18n';
import {
  srdEntryTranslationSchema,
  type SrdEntryTranslation,
} from '#shared/schemas/srd-translation';
import { classes } from '~/data/classes';
import { species } from '~/data/species';
import esClasses from '~~/i18n/srd/es/classes.json';
import esSpecies from '~~/i18n/srd/es/species.json';

// Hand-curated from the official Spanish SRD 5.2.1. English is the SRD source language,
// so it has no translation files: a missing locale, entry or field falls back to it.

const SRD_COLLECTIONS = { species, classes };

export type SrdCollection = keyof typeof SRD_COLLECTIONS;

type SrdTranslations = Record<SrdCollection, Partial<Record<string, SrdEntryTranslation>>>;

// Keys must be ids of the SRD data: a typo or an entry renamed upstream fails on load
// instead of silently showing the English name.
const parseTranslations = (collection: SrdCollection, raw: unknown) =>
  v.parse(
    v.record(
      v.picklist(SRD_COLLECTIONS[collection].map(({ id }) => id)),
      srdEntryTranslationSchema
    ),
    raw
  );

export const srdTranslations: Partial<Record<Locale, SrdTranslations>> = {
  es: {
    species: parseTranslations('species', esSpecies),
    classes: parseTranslations('classes', esClasses),
  },
};
