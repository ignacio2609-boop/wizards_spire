import { defineStore } from 'pinia';
import type { CharacterConcept } from '~/types/character';

const createEmptyConcept = (): CharacterConcept => ({
  characterName: '',
  playerName: '',
  classes: [],
  background: '',
  species: '',
  alignment: '',
});

export const useCharacterStore = defineStore('character', {
  state: () => ({
    concept: createEmptyConcept(),
  }),
  persist: true,
});
