import type { GenericSheetValues } from '#shared/sheets/generic';
import type { SrdCollection } from '~/data/srd-translations';
import type { Alignment, CharacterConcept } from '~/types/character';

export interface SheetLabels {
  srdName: (collection: SrdCollection, id: string) => string;
  alignmentName: (alignment: Alignment) => string;
}

const CLASS_SEPARATOR = ' / ';

export function conceptToGenericSheetValues(
  concept: CharacterConcept,
  labels: SheetLabels
): GenericSheetValues {
  const { characterName, playerName, classes, species, background, alignment } = concept;

  return {
    characterName: characterName || undefined,
    playerName: playerName || undefined,
    classes: classes.map((id) => labels.srdName('classes', id)).join(CLASS_SEPARATOR) || undefined,
    species: species ? labels.srdName('species', species) : undefined,
    background: background ? labels.srdName('backgrounds', background) : undefined,
    alignment: alignment ? labels.alignmentName(alignment) : undefined,
  };
}
