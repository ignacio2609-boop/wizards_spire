import { describe, expect, it } from 'vitest';
import { GENERIC_SHEET_FIELDS } from '~~/shared/sheets/generic.ts';

describe('GENERIC_SHEET_FIELDS', () => {
  it('uses field names a PDF form keeps flat (ASCII letters and digits, no dots)', () => {
    const invalid = Object.keys(GENERIC_SHEET_FIELDS).filter(
      (name) => !/^[A-Za-z][A-Za-z0-9]*$/.test(name)
    );

    expect(invalid).toEqual([]);
  });
});
