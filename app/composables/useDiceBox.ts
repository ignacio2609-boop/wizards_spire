import type DiceBox from '@3d-dice/dice-box';
import { DICE_BOX_ASSET_PATH } from '#shared/dice-box';
import type { DiceNotation, DieRoll, DieSides } from '~/types/dice';

// dice-box has no destroy(): every instance leaks a canvas, a WebGL worker and a window
// resize listener. A single instance lives for the whole app and its canvas is moved into
// whichever <DiceTray> is mounted. State is only mutated client-side (mount hooks, events).
let diceBoxPromise: Promise<DiceBox> | null = null;
let tray: HTMLElement | null = null;

const isReady = ref(false);
const isRolling = ref(false);

const createDiceBox = async () => {
  const { default: DiceBoxClass } = await import('@3d-dice/dice-box');
  // Without a container dice-box appends its canvas to <body>; it is moved to the tray
  // before init() so the 3D world starts with the tray's size
  const diceBox = new DiceBoxClass({ assetPath: DICE_BOX_ASSET_PATH });
  if (diceBox.canvas) tray?.appendChild(diceBox.canvas);

  try {
    await diceBox.init();
  } catch (error) {
    diceBox.canvas?.remove();
    throw error;
  }

  isReady.value = true;
  return diceBox;
};

const getDiceBox = () => {
  diceBoxPromise ??= createDiceBox().catch((error: unknown) => {
    diceBoxPromise = null;
    throw error;
  });
  return diceBoxPromise;
};

// dice-box only listens to window resize (debounced) and reads the size from the canvas
const resize = () => {
  window.dispatchEvent(new Event('resize'));
};

const attach = async (element: HTMLElement) => {
  tray = element;
  const diceBox = await getDiceBox();
  if (tray !== element || !diceBox.canvas) return;

  if (!isRolling.value) diceBox.clear();
  element.appendChild(diceBox.canvas);
  resize();
};

// The current roll is not cleared: its promise would never settle
const detach = (element: HTMLElement) => {
  if (tray !== element) return;
  tray = null;
  void diceBoxPromise?.then((diceBox) => diceBox.canvas?.remove());
};

const roll = async (notation: DiceNotation | DiceNotation[]): Promise<DieRoll[]> => {
  if (!tray) throw new Error('useDiceBox: mount a <DiceTray> before rolling');
  // Each roll() clears the previous one, whose promise then never settles
  if (isRolling.value) throw new Error('useDiceBox: a roll is already in progress');

  isRolling.value = true;
  try {
    const diceBox = await getDiceBox();
    const results = await diceBox.roll(notation);
    return results.map(({ sides, value }) => ({ sides: Number(sides) as DieSides, value }));
  } finally {
    isRolling.value = false;
  }
};

const clear = async () => {
  if (isRolling.value || !diceBoxPromise) return;
  const diceBox = await diceBoxPromise;
  diceBox.clear();
};

export const useDiceBox = () => ({
  isReady: readonly(isReady),
  isRolling: readonly(isRolling),
  attach,
  detach,
  resize,
  roll,
  clear,
});
