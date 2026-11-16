import type { GenericSheetValues } from '#shared/sheets/generic';
import { STAT_KEYS, type StatKey } from '#shared/types/ability';
import type { SrdCollection } from '~/data/srd-translations';
import type { AbilityValues, Alignment, CharacterConcept } from '~/types/character';
import { abilityModifier, formatModifier, savingThrowBonus } from '~/utils/abilityScores';

export interface SheetCharacter {
  concept: CharacterConcept;
  level: number;
  abilityScores: AbilityValues;
  savingThrowProficiencies: readonly StatKey[];
}

export interface SheetLabels {
  srdName: (collection: SrdCollection, id: string) => string;
  alignmentName: (alignment: Alignment) => string;
}

const CLASS_SEPARATOR = ' / ';

function abilitySheetValues({
  concept,
  level,
  abilityScores,
  savingThrowProficiencies,
}: SheetCharacter): GenericSheetValues {
  const values: GenericSheetValues = {};
  // Saving throws depend on the class: without one they are left for the player to fill in
  const hasClass = concept.classes.length > 0;

  for (const stat of STAT_KEYS) {
    const score = abilityScores[stat];
    const proficient = savingThrowProficiencies.includes(stat);
    if (proficient) values[`${stat}SaveProf`] = true;
    if (score === undefined) continue;

    values[stat] = String(score);
    values[`${stat}Mod`] = formatModifier(abilityModifier(score));
    if (hasClass) {
      values[`${stat}Save`] = formatModifier(savingThrowBonus(score, proficient, level));
    }
  }
  return values;
}

export function characterToGenericSheetValues(
  character: SheetCharacter,
  labels: SheetLabels
): GenericSheetValues {
  const { characterName, playerName, classes, species, background, alignment } = character.concept;

  return {
    characterName: characterName || undefined,
    playerName: playerName || undefined,
    classes: classes.map((id) => labels.srdName('classes', id)).join(CLASS_SEPARATOR) || undefined,
    species: species ? labels.srdName('species', species) : undefined,
    background: background ? labels.srdName('backgrounds', background) : undefined,
    alignment: alignment ? labels.alignmentName(alignment) : undefined,
    ...abilitySheetValues(character),
  };
}
