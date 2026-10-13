import type { Background } from '../../shared/schemas/background.ts';
import type { CharacterClass } from '../../shared/schemas/character-class.ts';
import type { Species } from '../../shared/schemas/species.ts';
import type { Size } from '../../shared/types/size.ts';
import type { ApiBackground, ApiClass, ApiSize, ApiSpecies } from './api-schemas.ts';

// The only place that knows both shapes: upstream naming (index, snake_case, nested refs)
// stops here and never reaches the app.

const SIZE_BY_API_SIZE: Record<ApiSize, Size> = {
  Tiny: 'tiny',
  Small: 'small',
  Medium: 'medium',
  Large: 'large',
  Huge: 'huge',
  Gargantuan: 'gargantuan',
};

export const toSpecies = (dto: ApiSpecies): Species => ({
  id: dto.index,
  name: dto.name,
  sizes:
    'size' in dto
      ? [SIZE_BY_API_SIZE[dto.size]]
      : dto.size_options.from.options.map(({ size }) => SIZE_BY_API_SIZE[size]),
  speed: dto.speed,
});

const toPrimaryAbility = (dto: ApiClass['primary_ability']): CharacterClass['primaryAbility'] => {
  if ('ability_scores' in dto) {
    return {
      abilities: dto.ability_scores.map(({ index }) => index),
      choose: dto.ability_scores.length,
    };
  }
  const { choose, from } = dto.ability_score_options;
  return { abilities: from.options.map(({ item }) => item.index), choose };
};

export const toCharacterClass = (dto: ApiClass): CharacterClass => ({
  id: dto.index,
  name: dto.name,
  hitDie: dto.hit_die,
  primaryAbility: toPrimaryAbility(dto.primary_ability),
  savingThrowProficiencies: dto.saving_throws.map(({ index }) => index),
});

// Upstream puts the Magic Initiate spell list in a free-text note ("Cleric"). A note on any
// other feat would mean something we don't model yet, so it fails instead of being dropped.
const toBackgroundFeat = ({ index, note }: ApiBackground['feat']): Background['feat'] => {
  if (note === undefined) return { id: index };
  if (index !== 'magic-initiate') {
    throw new Error(`Unexpected note "${note}" on background feat ${index}`);
  }
  return { id: index, spellList: note.toLowerCase() };
};

export const toBackground = (dto: ApiBackground): Background => ({
  id: dto.index,
  name: dto.name,
  abilityScores: dto.ability_scores.map(({ index }) => index),
  feat: toBackgroundFeat(dto.feat),
  proficiencies: dto.proficiencies.map(({ index }) => index),
  proficiencyChoices: (dto.proficiency_choices ?? []).map(({ choose, from }) => ({
    choose,
    options: from.options.map(({ item }) => item.index),
  })),
});
