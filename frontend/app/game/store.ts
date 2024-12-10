import { atom, createStore, PrimitiveAtom } from "jotai";
import { Vec2 } from "kaplay";

export const isTextBoxVisibleAtom = atom(false);
export const textBoxContentAtom = atom("");
export const store = createStore();

export const walletOpeningCommand = atom(false);

// Position store
export const currentPositionAtom = atom<Vec2>();
export const movementsTrackerAtom = atom<Vec2[]>([]);
export const backupMovementsTrackerAtom = atom<Vec2[]>([]);
