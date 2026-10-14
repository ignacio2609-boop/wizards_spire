import { describe, expect, it } from 'vitest';
import type { ApiBackground } from '~~/scripts/srd/api-schemas.ts';
import { backgroundPatches } from '~~/scripts/srd/patches.ts';

describe('backgroundPatches', () => {
  it('adds the Wizard spell list to the Sage feat', () => {
    const sage: ApiBackground = {
      index: 'sage',
      name: 'Sage',
      ability_scores: [{ index: 'con' }, { index: 'int' }, { index: 'wis' }],
      feat: { index: 'magic-initiate' },
      proficiencies: [],
    };

    const patched = backgroundPatches.sage?.(sage);

    expect(patched?.feat).toEqual({ index: 'magic-initiate', note: 'Wizard' });
    expect(sage.feat.note).toBeUndefined();
  });
});
