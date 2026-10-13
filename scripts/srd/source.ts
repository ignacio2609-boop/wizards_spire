// The import reads the JSON files the 5e-bits API is built from, not the API itself.
// Pinned to a commit so re-running the import is reproducible.
export const SRD_SOURCE = {
  repo: '5e-bits/5e-srd-api',
  ref: 'ecfddae2f1738d7f917154a81fbce04aca56cdd1',
  dataDir: 'packages/5e-database/src',
  ruleset: '2024',
  lang: 'en',
} as const;

export const fetchCollection = async (collection: string): Promise<unknown> => {
  const { repo, ref, dataDir, ruleset, lang } = SRD_SOURCE;
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/${dataDir}/${ruleset}/${lang}/5e-SRD-${collection}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};
