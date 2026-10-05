// @3d-dice/dice-box ships without type definitions; this covers only the API we use.
declare module '@3d-dice/dice-box' {
  export interface DieResult {
    groupId: number;
    rollId: number;
    sides: number | string;
    dieType: string;
    theme: string;
    themeColor: string;
    value: number;
  }

  export interface DiceBoxConfig {
    container?: string;
    assetPath?: string;
    theme?: string;
    themeColor?: string;
    scale?: number;
    offscreen?: boolean;
  }

  export default class DiceBox {
    constructor(config?: DiceBoxConfig);
    // Undefined when the browser has no WebGL: dice-box then falls back to random numbers
    canvas?: HTMLCanvasElement;
    init(): Promise<DiceBox>;
    roll(notation: string | string[]): Promise<DieResult[]>;
    clear(): DiceBox;
  }
}
