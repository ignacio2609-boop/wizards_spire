<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAbilityRoll } from '~/composables/useAbilityRoll';
import { useCharacterStore } from '~/stores/character';

const { abilities } = storeToRefs(useCharacterStore());
const { canRoll, isRolling, rollAbilityScores } = useAbilityRoll();

const hasRolled = computed(() => abilities.value.rolledScores.length > 0);
const rollFailed = ref(false);

const onRoll = async () => {
  rollFailed.value = false;
  try {
    await rollAbilityScores();
  } catch (error) {
    console.error(error);
    rollFailed.value = true;
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="label whitespace-normal">{{ $t('create.abilities.roll.hint') }}</p>
    <DiceTray class="bg-base-100 border-base-300 rounded-box h-64 w-full border" />
    <button
      type="button"
      class="btn btn-secondary"
      :disabled="!canRoll"
      @click="onRoll"
    >
      <span
        v-if="isRolling"
        class="loading loading-spinner"
      />
      {{ $t(hasRolled ? 'create.abilities.roll.again' : 'create.abilities.roll.button') }}
    </button>
    <div
      v-if="rollFailed"
      role="alert"
      class="alert alert-error"
    >
      {{ $t('create.abilities.roll.error') }}
    </div>
  </div>
</template>
