import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime';
import { PDFDocument } from 'pdf-lib';
import { afterEach, describe, expect, it } from 'vitest';
import type { Locale } from 'vue-i18n';
import { defineComponent, h } from 'vue';
import { useCharacterStore } from '~/stores/character';

for (const locale of ['en', 'es']) {
  const path = `/sheets/generic-${locale}.pdf`;
  registerEndpoint(path, () => readFile(join(process.cwd(), 'public', path)));
}

const setLocale = (locale: Locale) => {
  useNuxtApp().$i18n.locale.value = locale;
};

const useSheet = async () => {
  let sheet!: ReturnType<typeof useCharacterSheet>;
  await mountSuspended(
    defineComponent({
      setup() {
        sheet = useCharacterSheet();
        return () => h('span');
      },
    })
  );
  return sheet;
};

describe('useCharacterSheet', () => {
  afterEach(() => {
    setLocale('en');
    useCharacterStore().$reset();
  });

  it('points the empty sheet to the template of the active locale', async () => {
    const { emptySheetUrl } = await useSheet();
    expect(emptySheetUrl.value).toBe('/sheets/generic-en.pdf');

    setLocale('es');

    expect(emptySheetUrl.value).toBe('/sheets/generic-es.pdf');
  });

  it('fills the sheet with the character, naming its choices in the sheet language', async () => {
    setLocale('es');
    Object.assign(useCharacterStore().concept, {
      characterName: 'Íñigo',
      classes: ['wizard'],
      background: 'soldier',
      alignment: 'lawfulGood',
    });

    const filled = await (await useSheet()).buildFilledSheet();

    const form = (await PDFDocument.load(filled)).getForm();
    expect(form.getTextField('characterName').getText()).toBe('Íñigo');
    expect(form.getTextField('classes').getText()).toBe('Mago');
    expect(form.getTextField('background').getText()).toBe('Soldado');
    expect(form.getTextField('alignment').getText()).toBe('Legal Bueno');
  });
});
