<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { STAT_KEYS, type StatKey } from '#shared/types/ability';
import { useCharacterStore } from '~/stores/character';
import { abilityModifier, formatModifier } from '~/utils/abilityScores';

const characterStore = useCharacterStore();
const { abilities, abilityScorePool, abilityScores, appliedBackgroundBonus } =
  storeToRefs(characterStore);

const UNASSIGNED = '';

// A position kept from the other method may not exist in this pool
const selectedOption = (stat: StatKey) => {
  const poolIndex = abilities.value.assignment[stat];
  return poolIndex !== null && poolIndex < abilityScorePool.value.length
    ? String(poolIndex)
    : UNASSIGNED;
};

const onAssign = (stat: StatKey, event: Event) => {
  const { value } = event.target as HTMLSelectElement;
  characterStore.assignAbilityScore(stat, value === UNASSIGNED ? null : Number(value));
};

const unassignedScores = computed(() => {
  const assigned = new Set(Object.values(abilities.value.assignment));
  return abilityScorePool.value.filter((_, poolIndex) => !assigned.has(poolIndex));
});

const modifierOf = (stat: StatKey) => {
  const score = abilityScores.value[stat];
  return score === undefined ? '' : formatModifier(abilityModifier(score));
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <table class="table table-sm">
      <thead>
        <tr>
          <th scope="col">{{ $t('create.abilities.assignment.ability') }}</th>
          <th scope="col">{{ $t('create.abilities.assignment.score') }}</th>
          <th scope="col">{{ $t('create.abilities.assignment.background') }}</th>
          <th scope="col">{{ $t('create.abilities.assignment.total') }}</th>
          <th scope="col">{{ $t('create.abilities.assignment.modifier') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="stat in STAT_KEYS"
          :key="stat"
        >
          <th scope="row">
            <label :for="`ability-${stat}`">{{ $t(`common.abilities.${stat}`) }}</label>
          </th>
          <td>
            <select
              :id="`ability-${stat}`"
              class="select select-sm w-20"
              :value="selectedOption(stat)"
              :disabled="abilityScorePool.length === 0"
              @change="onAssign(stat, $event)"
            >
              <option :value="UNASSIGNED">—</option>
              <option
                v-for="(score, poolIndex) in abilityScorePool"
                :key="poolIndex"
                :value="String(poolIndex)"
              >
                {{ score }}
              </option>
            </select>
          </td>
          <td>{{ appliedBackgroundBonus[stat] ? `+${appliedBackgroundBonus[stat]}` : '' }}</td>
          <td class="font-semibold">{{ abilityScores[stat] }}</td>
          <td>{{ modifierOf(stat) }}</td>
        </tr>
      </tbody>
    </table>
    <p
      v-if="abilityScorePool.length === 0"
      class="label whitespace-normal"
    >
      {{ $t('create.abilities.assignment.rollFirst') }}
    </p>
    <template v-else>
      <p
        v-if="unassignedScores.length > 0"
        class="label whitespace-normal"
      >
        {{ $t('create.abilities.assignment.unassigned', { scores: unassignedScores.join(', ') }) }}
      </p>
      <p class="label whitespace-normal">{{ $t('create.abilities.assignment.swapHint') }}</p>
    </template>
  </div>
</template>
