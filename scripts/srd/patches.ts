import type { ApiBackground } from './api-schemas.ts';

// Fixes for upstream data errors, each checked against the SRD 5.2.1 PDF and keyed by entry
// index. They run after upstream validation and before mapping. When a patch stops changing
// anything, upstream has fixed it: the import warns so the patch can be deleted.

export type Patches<T> = Partial<Record<string, (dto: T) => T>>;

export const backgroundPatches: Patches<ApiBackground> = {
  // SRD 5.2.1 p. 83, Sage: "Feat: Magic Initiate (Wizard)". Upstream omits the spell list.
  sage: (dto) => ({ ...dto, feat: { ...dto.feat, note: 'Wizard' } }),
};
