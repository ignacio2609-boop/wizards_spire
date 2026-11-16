import { describe, expect, it } from 'vitest';
import type { CharacterConcept } from '~/types/character.ts';
import { characterToGenericSheetValues } from '~/utils/genericSheet.ts';
import type { SheetCharacter, SheetLabels } from '~/utils/genericSheet.ts';

const labels: SheetLabels = {
  srdName: (collection, id) => `${collection}:${id}`,
  alignmentName: (alignment) => `alignment:${alignment}`,
};

const emptyConcept: CharacterConcept = {
  characterName: '',
  playerName: '',
  classes: [],
  background: '',
  species: '',
  alignment: '',
};

const emptyCharacter: SheetCharacter = {
  concept: emptyConcept,
  level: 1,
  abilityScores: {},
  savingThrowProficiencies: [],
};

const wizard: SheetCharacter = {
  concept: { ...emptyConcept, classes: ['wizard'] },
  level: 1,
  abilityScores: {},
  savingThrowProficiencies: ['int', 'wis'],
};

describe('characterToGenericSheetValues', () => {
  it('copies the names and labels every id', () => {
    const values = characterToGenericSheetValues(
      {
        ...emptyCharacter,
        concept: {
          characterName: 'Íñigo',
          playerName: 'Ignacio',
          classes: ['fighter'],
          background: 'soldier',
          species: 'elf',
          alignment: 'lawfulGood',
        },
      },
      labels
    );

    expect(values).toEqual({
      characterName: 'Íñigo',
      playerName: 'Ignacio',
      classes: 'classes:fighter',
      background: 'backgrounds:soldier',
      species: 'species:elf',
      alignment: 'alignment:lawfulGood',
    });
  });

  it('joins several classes in one value', () => {
    const values = characterToGenericSheetValues(
      { ...emptyCharacter, concept: { ...emptyConcept, classes: ['fighter', 'wizard'] } },
      labels
    );

    expect(values.classes).toBe('classes:fighter / classes:wizard');
  });

  it('leaves out every field the character has not filled in', () => {
    const values = characterToGenericSheetValues(emptyCharacter, labels);

    expect(Object.values(values).filter((value) => value !== undefined)).toEqual([]);
  });

  it('writes each score with its signed modifier', () => {
    const values = characterToGenericSheetValues(
      { ...emptyCharacter, abilityScores: { str: 15, dex: 10, con: 8 } },
      labels
    );

    expect(values).toMatchObject({
      str: '15',
      strMod: '+2',
      dex: '10',
      dexMod: '+0',
      con: '8',
      conMod: '-1',
    });
  });

  it('leaves the abilities without a score empty', () => {
    const values = characterToGenericSheetValues(
      { ...emptyCharacter, abilityScores: { str: 15 } },
      labels
    );

    expect(values.dex).toBeUndefined();
    expect(values.dexMod).toBeUndefined();
  });

  it('adds the proficiency bonus to the saving throws of the class', () => {
    const values = characterToGenericSheetValues(
      { ...wizard, abilityScores: { int: 16, wis: 9, str: 12 } },
      labels
    );

    expect(values).toMatchObject({ intSave: '+5', wisSave: '+1', strSave: '+1' });
  });

  it('uses the proficiency bonus of the level', () => {
    const values = characterToGenericSheetValues(
      { ...wizard, level: 5, abilityScores: { int: 16 } },
      labels
    );

    expect(values.intSave).toBe('+6');
  });

  it('checks only the saving throws the class is proficient in', () => {
    const values = characterToGenericSheetValues(wizard, labels);

    expect(values.intSaveProf).toBe(true);
    expect(values.wisSaveProf).toBe(true);
    expect(values.strSaveProf).toBeUndefined();
  });

  it('leaves the saving throws empty without a class', () => {
    const values = characterToGenericSheetValues(
      { ...emptyCharacter, abilityScores: { str: 15 } },
      labels
    );

    expect(values.strSave).toBeUndefined();
  });

  it('leaves the saving throw of an ability without a score empty', () => {
    const values = characterToGenericSheetValues(wizard, labels);

    expect(values.intSave).toBeUndefined();
  });
});
