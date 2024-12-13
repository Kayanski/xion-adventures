import { KAPLAYCtx } from "kaplay";
import { Player } from "./initGame";
import { tileScreenSize } from "./constants";


export function setCamPos(k: KAPLAYCtx, player: Player, map: number[][]) {
    // We update the camera position and block if we reach the limit
    let camPosLowerLimit = k.center().sub(k.vec2(tileScreenSize, tileScreenSize));
    let camPosHigherLimit = k.vec2(map.length + 1, map[0].length + 1).scale(tileScreenSize).sub(k.center());
    k.camPos(player.pos);
    if (k.camPos().x < camPosLowerLimit.x) {
        k.camPos(camPosLowerLimit.x, k.camPos().y)
    }
    if (k.camPos().y < camPosLowerLimit.y) {
        k.camPos(k.camPos().x, camPosLowerLimit.y)
    }
    if (k.camPos().x > camPosHigherLimit.x) {
        k.camPos(camPosHigherLimit.x, k.camPos().y)
    }
    if (k.camPos().y > camPosHigherLimit.y) {
        k.camPos(k.camPos().x, camPosHigherLimit.y)
    }
}