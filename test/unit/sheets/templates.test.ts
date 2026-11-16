import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFCheckBox, PDFDocument, PDFTextField } from 'pdf-lib';
import type { PDFField } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { SHEET_TEMPLATES, sheetTemplatePath } from '~~/shared/sheets/templates.ts';
import type { SheetFamily } from '~~/shared/sheets/templates.ts';

const PUBLIC_DIR = join(process.cwd(), 'public');

const declaredTemplates = Object.entries(SHEET_TEMPLATES).flatMap(([family, { fields, locales }]) =>
  locales.map((locale) => ({
    path: sheetTemplatePath(family as SheetFamily, locale),
    fields,
  }))
);

function fieldKind(field: PDFField): string {
  if (field instanceof PDFCheckBox) return 'checkbox';
  if (field instanceof PDFTextField) return field.isMultiline() ? 'multiline' : 'text';
  return field.constructor.name;
}

describe('SHEET_TEMPLATES', () => {
  it.each(declaredTemplates)(
    '$path defines exactly the fields of its contract',
    async ({ path, fields }) => {
      const pdf = await PDFDocument.load(await readFile(join(PUBLIC_DIR, path)));

      const kinds = Object.fromEntries(
        pdf
          .getForm()
          .getFields()
          .map((field) => [field.getName(), fieldKind(field)])
      );

      expect(kinds).toEqual(fields);
    }
  );

  it('declares every template in public/sheets', async () => {
    const files = await readdir(join(PUBLIC_DIR, 'sheets'));

    const undeclared = files
      .map((file) => `sheets/${file}`)
      .filter((path) => !declaredTemplates.some((template) => template.path === path));

    expect(undeclared).toEqual([]);
  });
});
