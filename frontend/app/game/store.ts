import { atom, createStore, PrimitiveAtom } from "jotai";
import { Vec2 } from "kaplay";
import { MapOutput, PlayerLocation, XionAdventuresExtension } from "../_generated/generated-abstract/cosmwasm-codegen/Hub.types";

export const isTextBoxVisibleAtom = atom(false);
export const textBoxContentAtom = atom("");
export const store = createStore();

export const walletOpeningCommand = atom(false);
export const isWalletConnectedAtom = atom(false);

// Position store
// This is the current position in terms of tiles. So it should always be integers
export const currentTilePositionAtom = atom<Vec2>();
export const movementsTrackerAtom = atom<Vec2[]>([]);
export const backupMovementsTrackerAtom = atom<Vec2[]>([]);

// Initial position is needed to load the game
// If not present, the game cannot start
export const initialPositionAtom = atom<XionAdventuresExtension>();
export const gameMapAtom = atom<MapOutput>();
