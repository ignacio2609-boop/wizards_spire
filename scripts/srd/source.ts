// The import reads the JSON files the 5e-bits API is built from, not the API itself:
// one request per collection and no rate limit.
// Pinned to a commit so re-running the import is reproducible. Bump it deliberately to
// pull upstream fixes, then review the diff of app/data/srd/.
export const SRD_SOURCE = {
  repo: '5e-bits/5e-database',
  ref: 'a6212beb4b278917c2cff41c2b04c4ef4f3e0d6f',
  ruleset: '2024',
  lang: 'en',
} as const;

export const fetchCollection = async (collection: string): Promise<unknown> => {
  const { repo, ref, ruleset, lang } = SRD_SOURCE;
  const url = `https://raw.githubusercontent.com/${repo}/${ref}/src/${ruleset}/${lang}/5e-SRD-${collection}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
};
