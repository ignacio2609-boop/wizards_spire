<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ALIGNMENTS } from '~/types/character';
import { useCharacterStore } from '~/stores/character';
import { classes } from '~/data/classes';
import { races } from '~/data/races';

const characterStore = useCharacterStore();
const { concept } = storeToRefs(characterStore);

const characterClass = computed({
  get: () => concept.value.classes[0] ?? '',
  set: (value: string) => {
    concept.value.classes = value ? [value] : [];
  },
});

const onSubmit = () => {
  console.log('Character concept:', structuredClone(toRaw(concept.value)));
  console.log('SRD data:', { races, classes });
};
</script>

<template>
  <div class="bg-base-100 flex min-h-screen items-center justify-center px-6 py-16">
    <form class="w-full max-w-md" @submit.prevent="onSubmit">
      <fieldset class="fieldset bg-base-200 border-base-300 w-full rounded-box border p-6">
        <legend class="fieldset-legend text-lg">{{ $t('create.title') }}</legend>

        <label class="label" for="character-name">{{ $t('create.form.characterName') }}</label>
        <input id="character-name" v-model="concept.characterName" type="text" class="input w-full" />

        <label class="label" for="player-name">{{ $t('create.form.playerName') }}</label>
        <input id="player-name" v-model="concept.playerName" type="text" class="input w-full" />

        <label class="label" for="character-class">{{ $t('create.form.classes') }}</label>
        <input id="character-class" v-model="characterClass" type="text" class="input w-full" />

        <label class="label" for="race">{{ $t('create.form.race') }}</label>
        <input id="race" v-model="concept.race" type="text" class="input w-full" />

        <label class="label" for="background">{{ $t('create.form.background') }}</label>
        <input id="background" v-model="concept.background" type="text" class="input w-full" />

        <label class="label" for="alignment">{{ $t('create.form.alignment') }}</label>
        <select id="alignment" v-model="concept.alignment" class="select w-full">
          <option value="" disabled>{{ $t('create.form.alignmentPlaceholder') }}</option>
          <option v-for="alignment in ALIGNMENTS" :key="alignment" :value="alignment">
            {{ $t(`common.alignments.${alignment}`) }}
          </option>
        </select>

        <button type="submit" class="btn btn-primary mt-4">{{ $t('create.form.submit') }}</button>
      </fieldset>
    </form>
  </div>
</template>
