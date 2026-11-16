import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { GENERIC_SHEET_FIELDS } from '~~/shared/sheets/generic.ts';
import { sheetTemplatePath } from '~~/shared/sheets/templates.ts';
import { fillSheet, sheetFileName } from '~/utils/sheet.ts';

const loadTemplate = () =>
  readFile(join(process.cwd(), 'public', sheetTemplatePath('generic', 'es')));

describe('fillSheet', () => {
  it('writes text and checkbox values into the fields with their names', async () => {
    const filled = await fillSheet(await loadTemplate(), GENERIC_SHEET_FIELDS, {
      characterName: 'Íñigo Martín, ¿el Pequeño?',
      strSaveProf: true,
      features: 'Visión en la oscuridad\nSegundo aliento',
    });

    const form = (await PDFDocument.load(filled)).getForm();
    expect(form.getTextField('characterName').getText()).toBe('Íñigo Martín, ¿el Pequeño?');
    expect(form.getCheckBox('strSaveProf').isChecked()).toBe(true);
    expect(form.getTextField('features').getText()).toBe('Visión en la oscuridad\nSegundo aliento');
  });

  it('leaves the fields without a value empty and editable', async () => {
    const filled = await fillSheet(await loadTemplate(), GENERIC_SHEET_FIELDS, {
      characterName: 'Íñigo',
    });

    const form = (await PDFDocument.load(filled)).getForm();
    expect(form.getTextField('playerName').getText()).toBeUndefined();
    expect(form.getCheckBox('dexSaveProf').isChecked()).toBe(false);
    expect(form.getTextField('playerName').isReadOnly()).toBe(false);
  });

  it('fails when the template lacks a field of the contract', async () => {
    const fields = { ...GENERIC_SHEET_FIELDS, missing: 'text' } as const;

    await expect(fillSheet(await loadTemplate(), fields, { missing: 'x' })).rejects.toThrow(
      /missing/
    );
  });
});

describe('sheetFileName', () => {
  it('names the file after the character', () => {
    expect(sheetFileName('Íñigo Martín')).toBe('Íñigo Martín.pdf');
  });

  it('drops the characters a file name cannot have', () => {
    expect(sheetFileName('¿Quién? "El Rojo" <3/4>')).toBe('¿Quién El Rojo 34.pdf');
  });

  it('uses a generic name when the character has none', () => {
    expect(sheetFileName('  ')).toBe('character-sheet.pdf');
  });
});
