import type { SheetFields } from './fields.ts';
import { GENERIC_SHEET_FIELDS } from './generic.ts';

export const DEFAULT_SHEET_LOCALE = 'en';

interface SheetTemplates {
  fields: SheetFields;
  locales: readonly [typeof DEFAULT_SHEET_LOCALE, ...string[]];
}

export const SHEET_TEMPLATES = {
  generic: { fields: GENERIC_SHEET_FIELDS, locales: ['en', 'es'] },
} as const satisfies Record<string, SheetTemplates>;

export type SheetFamily = keyof typeof SHEET_TEMPLATES;

export type SheetLocale<Family extends SheetFamily> =
  (typeof SHEET_TEMPLATES)[Family]['locales'][number];

export function sheetTemplatePath<Family extends SheetFamily>(
  family: Family,
  locale: SheetLocale<Family>
): string {
  return `sheets/${family}-${locale}.pdf`;
}

export function resolveSheetLocale<Family extends SheetFamily>(
  family: Family,
  locale: string
): SheetLocale<Family> {
  const locales: readonly string[] = SHEET_TEMPLATES[family].locales;
  return locales.includes(locale) ? (locale as SheetLocale<Family>) : DEFAULT_SHEET_LOCALE;
}
