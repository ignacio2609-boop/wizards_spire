export const DIE_SIDES = [4, 6, 8, 10, 12, 20, 100] as const;

export type DieSides = (typeof DIE_SIDES)[number];

// Plain dice only: modifiers are applied by the rules, not by the dice engine
export type DiceNotation = `${number}d${DieSides}`;

export interface DieRoll {
  sides: DieSides;
  value: number;
}
