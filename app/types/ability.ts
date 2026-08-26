export const STAT_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export type StatKey = (typeof STAT_KEYS)[number];
