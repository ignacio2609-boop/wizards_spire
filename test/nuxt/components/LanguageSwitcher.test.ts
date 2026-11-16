import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

    expect(wrapper.findAll('li button').map((option) => option.text())).toEqual([
      'English',
      'Español',
    ]);
  });

  it('changes the locale to the one chosen', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher);

    await wrapper.find('li button[lang="es"]').trigger('click');

    await vi.waitFor(() => expect(wrapper.find('[role="button"]').text()).toBe('Español'));
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
