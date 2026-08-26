import * as v from 'valibot';
import { characterClassSchema, type CharacterClass } from '~/schemas/character-class';

const rawClasses = [
  {
    id: 'fighter',
    name: 'Fighter',
    hitDie: 10,
    primaryAbility: 'str',
    savingThrowProficiencies: ['str', 'con'],
  },
];

export const classes: CharacterClass[] = rawClasses.map((characterClass) =>
  v.parse(characterClassSchema, characterClass),
);