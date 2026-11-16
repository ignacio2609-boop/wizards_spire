import { describe, expect, it } from 'vitest';
import type { CharacterConcept } from '~/types/character.ts';
import { conceptToGenericSheetValues } from '~/utils/genericSheet.ts';
import type { SheetLabels } from '~/utils/genericSheet.ts';

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

describe('conceptToGenericSheetValues', () => {
  it('copies the names and labels every id', () => {
    const values = conceptToGenericSheetValues(
      {
        characterName: 'Íñigo',
        playerName: 'Ignacio',
        classes: ['fighter'],
        background: 'soldier',
        species: 'elf',
        alignment: 'lawfulGood',
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
    const values = conceptToGenericSheetValues(
      { ...emptyConcept, classes: ['fighter', 'wizard'] },
      labels
    );

    expect(values.classes).toBe('classes:fighter / classes:wizard');
  });

  it('leaves out every field the concept has not filled in', () => {
    const values = conceptToGenericSheetValues(emptyConcept, labels);

    expect(Object.values(values).filter((value) => value !== undefined)).toEqual([]);
  });
});
