import { mountSuspended } from '@nuxt/test-utils/runtime';
import { afterEach, describe, expect, it } from 'vitest';
import AbilityAssignment from '~/components/ability/AbilityAssignment.vue';
import { useCharacterStore } from '~/stores/character';

describe('AbilityAssignment', () => {
  afterEach(() => useCharacterStore().$reset());

  it('offers every pool score to each ability', async () => {
    const wrapper = await mountSuspended(AbilityAssignment);

    const options = wrapper.findAll('#ability-str option').map((option) => option.text());

    expect(options).toEqual(['—', '15', '14', '13', '12', '10', '8']);
  });

  it('assigns the chosen score to the ability', async () => {
    const wrapper = await mountSuspended(AbilityAssignment);

    await wrapper.find('#ability-dex').setValue('1');

    expect(useCharacterStore().abilityScores).toEqual({ dex: 14 });
  });

  it('clears the ability when the empty option is chosen', async () => {
    const store = useCharacterStore();
    store.assignAbilityScore('dex', 1);
    const wrapper = await mountSuspended(AbilityAssignment);

    await wrapper.find('#ability-dex').setValue('');

    expect(store.abilityScores).toEqual({});
  });

  it('shows the swap when an ability takes a score that is in use', async () => {
    const store = useCharacterStore();
    store.assignAbilityScore('str', 0);
    store.assignAbilityScore('dex', 1);
    const wrapper = await mountSuspended(AbilityAssignment);

    await wrapper.find('#ability-dex').setValue('0');

    expect(wrapper.find<HTMLSelectElement>('#ability-str').element.value).toBe('1');
    expect(wrapper.find<HTMLSelectElement>('#ability-dex').element.value).toBe('0');
  });

  it('shows the background bonus, the total and the modifier of an ability', async () => {
    const store = useCharacterStore();
    store.concept.background = 'acolyte';
    store.assignAbilityScore('wis', 0);
    store.abilities.backgroundBonus = { wis: 2, int: 1 };

    const wrapper = await mountSuspended(AbilityAssignment);

    const cells = wrapper.findAll('tbody tr')[4]?.findAll('td');
    expect(cells?.slice(1).map((cell) => cell.text())).toEqual(['+2', '17', '+3']);
  });

  it('lists the scores still to assign', async () => {
    const store = useCharacterStore();
    store.assignAbilityScore('str', 0);
    store.assignAbilityScore('dex', 1);

    const wrapper = await mountSuspended(AbilityAssignment);

    expect(wrapper.text()).toContain('Unassigned: 13, 12, 10, 8');
  });

  it('asks to roll first while the rolled method has no scores', async () => {
    useCharacterStore().abilities.method = 'rolled';

    const wrapper = await mountSuspended(AbilityAssignment);

    expect(wrapper.find('#ability-str').attributes('disabled')).toBeDefined();
    expect(wrapper.text()).toContain('Roll the dice to get the scores to assign.');
  });
});
