<script setup lang="ts">
import { Check, Languages } from '@lucide/vue';
import type { Locale } from 'vue-i18n';

const { locale, locales, setLocale } = useI18n();

const currentName = computed(
  () => locales.value.find(({ code }) => code === locale.value)?.name ?? locale.value
);

// daisyUI's dropdown stays open while it holds focus
const chooseLocale = async (code: Locale) => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  await setLocale(code);
};
</script>

<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-sm gap-2"
      :aria-label="$t('common.language.label')"
    >
      <Languages class="size-4" />
      {{ currentName }}
    </div>
    <ul
      tabindex="-1"
      class="dropdown-content menu bg-base-200 rounded-box z-1 mt-2 w-40 p-2 shadow-sm"
    >
      <li
        v-for="{ code, name } in locales"
        :key="code"
      >
        <button
          type="button"
          :lang="code"
          :aria-current="code === locale ? 'true' : undefined"
          class="justify-between"
          @click="chooseLocale(code)"
        >
          {{ name }}
          <Check
            v-if="code === locale"
            class="size-4"
          />
        </button>
      </li>
    </ul>
  </div>
</template>
