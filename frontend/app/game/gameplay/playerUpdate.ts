import { KAPLAYCtx } from "kaplay";
import { maxMovementLength, tileScreenSize } from "../constants";
import { backupMovementsTrackerAtom, currentPositionAtom, movementsTrackerAtom, store } from "../store";
import { Player } from "./index";
import { saveBackupMovements, saveMovements } from "../localStorage";

export function movementTrackerUpdate(k: KAPLAYCtx, player: Player) {
  ////// *** Computing the movement changes for the blockchain *** //////

  let currentPosition = store.get(currentPositionAtom);

  if (currentPosition == undefined) {
    currentPosition = player.pos.scale(1 / tileScreenSize);
    store.set(currentPositionAtom, currentPosition);
  }
  const new_tile = player.pos.scale(1 / tileScreenSize);

  const movement = new_tile.sub(currentPosition);
  if (Math.abs(movement.x) >= 1 || Math.abs(movement.y) >= 1) {
    const intMovement = k.vec2(Math.trunc(movement.x), Math.trunc(movement.y));
    // We move the backup to the actual array of it was reset
    {
      let movementsTrackerVec = store.get(movementsTrackerAtom);
      const backupMovementsTrackerVec = store.get(backupMovementsTrackerAtom);
      if (movementsTrackerVec.length == 0 && backupMovementsTrackerVec.length > 0) {
        movementsTrackerVec = backupMovementsTrackerVec
        store.set(movementsTrackerAtom, movementsTrackerVec);
        store.set(backupMovementsTrackerAtom, []);
      }
    }
    const movementsTrackerVec = store.get(movementsTrackerAtom);

    /// If we have not enough data, we save it
    if (movementsTrackerVec.length < maxMovementLength) {
      store.set(movementsTrackerAtom, [...movementsTrackerVec, intMovement]);
      saveMovements([...movementsTrackerVec, intMovement])
    } else {
      // In the other case, we update the backupMovementsTracker
      const movementsTrackerVec = store.get(backupMovementsTrackerAtom);
      store.set(backupMovementsTrackerAtom, [...movementsTrackerVec, intMovement]);
      saveBackupMovements([...movementsTrackerVec, intMovement])
    }

    store.set(currentPositionAtom, currentPosition.add(intMovement));

  }
  // Test, we try to see iof the positions match
  // let playerPosition = player.pos.scale(1 / tileScreenSize);
  // let movemensTrackerTotal = store.get(movementsTrackerAtom).reduce(
  //   (pr, c) => c.add(pr),
  //   k.center().scale(1 / tileScreenSize) // this is the starting position
  // );
}
