import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';
import AbilityBackgroundBonus from '~/components/ability/AbilityBackgroundBonus.vue';
import { useCharacterStore } from '~/stores/character';

describe('AbilityBackgroundBonus', () => {
  afterEach(() => useCharacterStore().$reset());

  it('is disabled until a background is chosen', async () => {
    const wrapper = await mountSuspended(AbilityBackgroundBonus);

    expect(wrapper.find('select').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('Choose a background to spread its increase.');
  });

  it('names every way to spread the bonus of the background', async () => {
    useCharacterStore().concept.background = 'acolyte';

    const wrapper = await mountSuspended(AbilityBackgroundBonus);

    const labels = wrapper.findAll('option:not([disabled])').map((option) => option.text());
    expect(labels).toEqual([
      '+2 Intelligence, +1 Wisdom',
      '+2 Intelligence, +1 Charisma',
      '+2 Wisdom, +1 Intelligence',
      '+2 Wisdom, +1 Charisma',
      '+2 Charisma, +1 Intelligence',
      '+2 Charisma, +1 Wisdom',
      '+1 Intelligence, +1 Wisdom, +1 Charisma',
    ]);
  });

  it('stores the chosen bonus', async () => {
    const store = useCharacterStore();
    store.concept.background = 'acolyte';
    const wrapper = await mountSuspended(AbilityBackgroundBonus);

    await wrapper.find('select').setValue('2');

    expect(store.abilities.backgroundBonus).toEqual({ wis: 2, int: 1 });
  });

  it('shows the bonus already chosen', async () => {
    const store = useCharacterStore();
    store.concept.background = 'acolyte';
    store.abilities.backgroundBonus = { int: 1, wis: 1, cha: 1 };

    const wrapper = await mountSuspended(AbilityBackgroundBonus);

    expect(wrapper.find('select').element.value).toBe('6');
  });

  it('shows no choice for a bonus that belongs to another background', async () => {
    const store = useCharacterStore();
    store.concept.background = 'soldier';
    store.abilities.backgroundBonus = { wis: 2, int: 1 };

    const wrapper = await mountSuspended(AbilityBackgroundBonus);

    expect(wrapper.find('select').element.value).toBe('');
  });
});
