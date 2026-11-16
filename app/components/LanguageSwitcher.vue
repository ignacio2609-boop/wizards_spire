<script setup lang="ts">
import { Check, Languages } from '@lucide/vue';

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentName = computed(
  () => locales.value.find(({ code }) => code === locale.value)?.name ?? locale.value
);

// daisyUI's dropdown stays open while it holds focus, and the layout survives the navigation
const closeMenu = () => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
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
        <NuxtLink
          :to="switchLocalePath(code)"
          :lang="code"
          :hreflang="code"
          :aria-current="code === locale ? 'true' : undefined"
          class="justify-between"
          @click="closeMenu"
        >
          {{ name }}
          <Check
            v-if="code === locale"
            class="size-4"
          />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
