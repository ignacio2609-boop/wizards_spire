import { srdTranslations, type SrdCollection } from '~/data/srd-translations';

// Display name of an SRD entry in the active locale, falling back to the English source
export const useSrdName = () => {
  const { locale } = useI18n();

  return (collection: SrdCollection, entry: { id: string; name: string }) =>
    srdTranslations[locale.value]?.[collection][entry.id]?.name ?? entry.name;
};
