import { storeToRefs } from 'pinia';
import { GENERIC_SHEET_FIELDS } from '#shared/sheets/generic';
import { resolveSheetLocale, sheetTemplatePath } from '#shared/sheets/templates';
import { srdNameById } from '~/data/srd-translations';
import { useCharacterStore } from '~/stores/character';
import { STARTING_LEVEL } from '~/types/character';
import type { SheetLabels } from '~/utils/genericSheet';

export const useCharacterSheet = () => {
  const { locale, t, loadLocaleMessages } = useI18n();
  const { concept, abilityScores, savingThrowProficiencies } = storeToRefs(useCharacterStore());
  const { baseURL } = useRuntimeConfig().app;

  const sheetLocale = computed(() => resolveSheetLocale('generic', locale.value));

  const emptySheetUrl = computed(
    () => `${baseURL}${sheetTemplatePath('generic', sheetLocale.value)}`
  );

  const buildFilledSheet = async (): Promise<Uint8Array<ArrayBuffer>> => {
    const labelLocale = sheetLocale.value;
    await loadLocaleMessages(labelLocale);

    const labels: SheetLabels = {
      srdName: (collection, id) => srdNameById(labelLocale, collection, id),
      alignmentName: (alignment) =>
        t(`common.alignments.${alignment}`, {}, { locale: labelLocale }),
    };
    const template = await $fetch<ArrayBuffer>(emptySheetUrl.value, {
      responseType: 'arrayBuffer',
    });

    return fillSheet(
      template,
      GENERIC_SHEET_FIELDS,
      characterToGenericSheetValues(
        {
          concept: concept.value,
          level: STARTING_LEVEL,
          abilityScores: abilityScores.value,
          savingThrowProficiencies: savingThrowProficiencies.value,
        },
        labels
      )
    );
  };

  const downloadFilledSheet = async (): Promise<void> => {
    const bytes = await buildFilledSheet();
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = sheetFileName(concept.value.characterName);
    link.click();
    URL.revokeObjectURL(url);
  };

  return { sheetLocale, emptySheetUrl, buildFilledSheet, downloadFilledSheet };
};
