import type { SheetFields } from './fields.ts';
import { GENERIC_SHEET_FIELDS } from './generic.ts';

export const SHEET_TEMPLATES = {
  generic: { fields: GENERIC_SHEET_FIELDS, locales: ['es'] },
} as const satisfies Record<string, { fields: SheetFields; locales: readonly string[] }>;

export type SheetFamily = keyof typeof SHEET_TEMPLATES;

export type SheetLocale<Family extends SheetFamily> =
  (typeof SHEET_TEMPLATES)[Family]['locales'][number];

export function sheetTemplatePath<Family extends SheetFamily>(
  family: Family,
  locale: SheetLocale<Family>
): string {
  return `sheets/${family}-${locale}.pdf`;
}
