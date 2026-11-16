<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCharacterStore } from '~/stores/character';
import { ABILITY_METHODS } from '~/types/character';

const { abilities } = storeToRefs(useCharacterStore());
</script>

<template>
  <fieldset class="fieldset bg-base-200 border-base-300 w-full rounded-box border p-6">
    <legend class="fieldset-legend text-lg">{{ $t('create.abilities.title') }}</legend>

    <span
      id="ability-method-label"
      class="label"
    >
      {{ $t('create.abilities.method.label') }}
    </span>
    <div
      class="join"
      role="radiogroup"
      aria-labelledby="ability-method-label"
    >
      <input
        v-for="method in ABILITY_METHODS"
        :key="method"
        v-model="abilities.method"
        type="radio"
        name="ability-method"
        class="join-item btn flex-1"
        :value="method"
        :aria-label="$t(`create.abilities.method.${method}`)"
      />
    </div>

    <AbilityRoller v-if="abilities.method === 'rolled'" />
    <AbilityAssignment />
    <AbilityBackgroundBonus />
  </fieldset>
</template>
