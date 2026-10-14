import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';
import type { Locale } from 'vue-i18n';
import { defineComponent, h, nextTick } from 'vue';
import type { SrdCollection } from '~/data/srd-translations';

// useI18n() only works inside a component's setup, so the composable is used from a minimal one
const mountSrdName = (collection: SrdCollection, entry: { id: string; name: string }) =>
  mountSuspended(
    defineComponent({
      setup() {
        const srdName = useSrdName();
        return () => h('span', srdName(collection, entry));
      },
    })
  );

// setLocale() doesn't stick through mountSuspended, so the locale is set directly
const setLocale = (locale: Locale) => {
  useNuxtApp().$i18n.locale.value = locale;
};

describe('useSrdName', () => {
  afterEach(() => setLocale('en'));

  it('shows the English source name in English', async () => {
    const wrapper = await mountSrdName('species', { id: 'elf', name: 'Elf' });

    expect(wrapper.text()).toBe('Elf');
  });

  it('shows the translated name in Spanish', async () => {
    setLocale('es');

    const wrapper = await mountSrdName('classes', { id: 'wizard', name: 'Wizard' });

    expect(wrapper.text()).toBe('Mago');
  });

  it('falls back to the English name when an entry has no translation', async () => {
    setLocale('es');

    const wrapper = await mountSrdName('species', { id: 'homebrew-species', name: 'Homebrew' });

    expect(wrapper.text()).toBe('Homebrew');
  });

  it('updates the name when the locale changes', async () => {
    const wrapper = await mountSrdName('backgrounds', { id: 'soldier', name: 'Soldier' });

    setLocale('es');
    await nextTick();

    expect(wrapper.text()).toBe('Soldado');
  });
});
