<script setup lang="ts">
import { useDiceBox } from '~/composables/useDiceBox';
import { dropLowest, sumRolls } from '~/utils/dice';

const { isReady, isRolling, roll } = useDiceBox();

// Ability score: 4d6, drop the lowest die
const rollAbilityScore = async () => {
  const rolls = await roll('4d6');
  console.log('Rolls:', rolls);
  console.log('Ability score:', sumRolls(dropLowest(rolls)));
};
</script>

<template>
  <div class="bg-base-100 flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16">
    <DiceTray class="bg-base-200 border-base-300 rounded-box h-96 w-full max-w-2xl border" />
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!isReady || isRolling"
      @click="rollAbilityScore"
    >
      Roll 4d6
    </button>
  </div>
</template>
