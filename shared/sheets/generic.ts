import type { SheetFields, SheetValues } from './fields.ts';

// First sheet family: a basic one-page sheet.
export const GENERIC_SHEET_FIELDS = {
  // Concept
  characterName: 'text',
  playerName: 'text',
  classes: 'text',
  species: 'text',
  background: 'text',
  alignment: 'text',

  // Abilities: score, modifier, saving throw bonus and saving throw proficiency.
  // The app hands over the score and the modifier separately.
  str: 'text',
  strMod: 'text',
  strSave: 'text',
  strSaveProf: 'checkbox',
  dex: 'text',
  dexMod: 'text',
  dexSave: 'text',
  dexSaveProf: 'checkbox',
  con: 'text',
  conMod: 'text',
  conSave: 'text',
  conSaveProf: 'checkbox',
  int: 'text',
  intMod: 'text',
  intSave: 'text',
  intSaveProf: 'checkbox',
  wis: 'text',
  wisMod: 'text',
  wisSave: 'text',
  wisSaveProf: 'checkbox',
  cha: 'text',
  chaMod: 'text',
  chaSave: 'text',
  chaSaveProf: 'checkbox',
  features: 'multiline',
} as const satisfies SheetFields;

export type GenericSheetField = keyof typeof GENERIC_SHEET_FIELDS;

export type GenericSheetValues = SheetValues<typeof GENERIC_SHEET_FIELDS>;
