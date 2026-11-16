import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';
import type { Locale } from 'vue-i18n';
import LanguageSwitcher from '~/components/LanguageSwitcher.vue';

// setLocale() doesn't stick through mountSuspended, so the locale is set directly
const setLocale = (locale: Locale) => {
  useNuxtApp().$i18n.locale.value = locale;
};

describe('LanguageSwitcher', () => {
  afterEach(() => setLocale('en'));

  it('lists every locale under its own name', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    expect(wrapper.findAll('a').map((link) => link.text())).toEqual(['English', 'Español']);
  });

  it('links each locale to its version of the current page', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual(['/', '/es']);
  });

  it('marks the active locale', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    expect(wrapper.find('[aria-current="true"]').text()).toBe('English');
    expect(wrapper.find('[role="button"]').text()).toBe('English');
    expect(wrapper.find('[role="button"]').attributes('aria-label')).toBe('Language');
  });

  it('follows the locale when it changes', async () => {
    setLocale('es');

    const wrapper = await mountSuspended(LanguageSwitcher);

    expect(wrapper.find('[aria-current="true"]').text()).toBe('Español');
    expect(wrapper.find('[role="button"]').text()).toBe('Español');
  });
});
