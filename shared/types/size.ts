export const SIZES = ['tiny', 'small', 'medium', 'large', 'huge', 'gargantuan'] as const;

export type Size = (typeof SIZES)[number];
