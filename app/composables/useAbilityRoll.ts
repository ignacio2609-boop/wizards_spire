import { useDiceBox } from '~/composables/useDiceBox';
import { useCharacterStore } from '~/stores/character';
import type { DiceNotation } from '~/types/dice';
import { ABILITY_SCORE_COUNT, abilityScoreFromRolls } from '~/utils/abilityScores';

const ABILITY_SCORE_DICE: DiceNotation = '4d6';

// Needs a mounted <DiceTray>
export const useAbilityRoll = () => {
  const { isReady, isRolling, rollGroups } = useDiceBox();
  const characterStore = useCharacterStore();

  const canRoll = computed(() => isReady.value && !isRolling.value);

  const rollAbilityScores = async () => {
    const notations = Array.from({ length: ABILITY_SCORE_COUNT }, () => ABILITY_SCORE_DICE);
    const groups = await rollGroups(notations);
    characterStore.setRolledScores(groups.map(abilityScoreFromRolls));
  };

  return { canRoll, isRolling, rollAbilityScores };
};
