import { describe, expect, it } from 'vitest';
import type { ApiBackground, ApiClass } from '../../../scripts/srd/api-schemas.ts';
import { toBackground, toCharacterClass, toSpecies } from '../../../scripts/srd/mappers.ts';

describe('toSpecies', () => {
  it('maps a species with a single size', () => {
    const species = toSpecies({ index: 'dwarf', name: 'Dwarf', size: 'Medium', speed: 30 });

    expect(species).toEqual({ id: 'dwarf', name: 'Dwarf', sizes: ['medium'], speed: 30 });
  });

  it('maps every size of a species with size options', () => {
    const species = toSpecies({
      index: 'tiefling',
      name: 'Tiefling',
      size_options: { from: { options: [{ size: 'Small' }, { size: 'Medium' }] } },
      speed: 30,
    });

    expect(species.sizes).toEqual(['small', 'medium']);
  });
});

describe('toCharacterClass', () => {
  const fighter: ApiClass = {
    index: 'fighter',
    name: 'Fighter',
    hit_die: 10,
    primary_ability: {
      ability_score_options: {
        choose: 1,
        from: { options: [{ item: { index: 'str' } }, { item: { index: 'dex' } }] },
      },
    },
    saving_throws: [{ index: 'str' }, { index: 'con' }],
  };

  it('maps a class', () => {
    expect(toCharacterClass(fighter)).toEqual({
      id: 'fighter',
      name: 'Fighter',
      hitDie: 10,
      primaryAbility: { abilities: ['str', 'dex'], choose: 1 },
      savingThrowProficiencies: ['str', 'con'],
    });
  });

  it('requires every primary ability when the class has no choice', () => {
    const monk = toCharacterClass({
      ...fighter,
      primary_ability: { ability_scores: [{ index: 'dex' }, { index: 'wis' }] },
    });

    expect(monk.primaryAbility).toEqual({ abilities: ['dex', 'wis'], choose: 2 });
  });
});

describe('toBackground', () => {
  const soldier: ApiBackground = {
    index: 'soldier',
    name: 'Soldier',
    ability_scores: [{ index: 'str' }, { index: 'dex' }, { index: 'con' }],
    feat: { index: 'savage-attacker' },
    proficiencies: [{ index: 'skill-athletics' }, { index: 'skill-intimidation' }],
    proficiency_choices: [
      {
        choose: 1,
        from: {
          options: [{ item: { index: 'tool-dice' } }, { item: { index: 'tool-dragonchess' } }],
        },
      },
    ],
  };

  it('maps a background', () => {
    expect(toBackground(soldier)).toEqual({
      id: 'soldier',
      name: 'Soldier',
      abilityScores: ['str', 'dex', 'con'],
      feat: { id: 'savage-attacker' },
      proficiencies: ['skill-athletics', 'skill-intimidation'],
      proficiencyChoices: [{ choose: 1, options: ['tool-dice', 'tool-dragonchess'] }],
    });
  });

  it('maps missing proficiency choices to none', () => {
    const background = toBackground({ ...soldier, proficiency_choices: undefined });

    expect(background.proficiencyChoices).toEqual([]);
  });

  it('reads the Magic Initiate spell list from the feat note', () => {
    const background = toBackground({
      ...soldier,
      feat: { index: 'magic-initiate', note: 'Cleric' },
    });

    expect(background.feat).toEqual({ id: 'magic-initiate', spellList: 'cleric' });
  });

  it('rejects a note on any other feat', () => {
    const withNote = { ...soldier, feat: { index: 'savage-attacker', note: 'Unexpected' } };

    expect(() => toBackground(withNote)).toThrow('Unexpected note "Unexpected"');
  });
});
