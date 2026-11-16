<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCharacterStore } from '~/stores/character';
import type { AbilityValues } from '~/types/character';
import { backgroundBonusOptions, isSameAbilityBonus } from '~/utils/abilityScores';

const { abilities, backgroundAbilities } = storeToRefs(useCharacterStore());
const { t } = useI18n();

const NO_OPTION = '';

const options = computed(() => backgroundBonusOptions(backgroundAbilities.value));

const selectedOption = computed({
  get: () => {
    const index = options.value.findIndex((option) =>
      isSameAbilityBonus(option, abilities.value.backgroundBonus)
    );
    return index === -1 ? NO_OPTION : index;
  },
  set: (index: number | typeof NO_OPTION) => {
    const option = index === NO_OPTION ? undefined : options.value[index];
    if (option) abilities.value.backgroundBonus = { ...option };
  },
});

// Highest bonus first: "+2 Wisdom, +1 Intelligence"
const optionLabel = (bonus: AbilityValues) =>
  backgroundAbilities.value
    .filter((stat) => bonus[stat])
    .sort((a, b) => (bonus[b] ?? 0) - (bonus[a] ?? 0))
    .map((stat) => `+${bonus[stat]} ${t(`common.abilities.${stat}`)}`)
    .join(', ');
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      class="label"
      for="background-bonus"
    >
      {{ $t('create.abilities.backgroundBonus.label') }}
    </label>
    <select
      id="background-bonus"
      v-model="selectedOption"
      class="select w-full"
      :disabled="options.length === 0"
    >
      <option
        :value="NO_OPTION"
        disabled
      >
        {{ $t('create.abilities.backgroundBonus.placeholder') }}
      </option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="index"
      >
        {{ optionLabel(option) }}
      </option>
    </select>
    <p
      v-if="options.length === 0"
      class="label whitespace-normal"
    >
      {{ $t('create.abilities.backgroundBonus.noBackground') }}
    </p>
  </div>
</template>
