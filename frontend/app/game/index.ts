import { gamePlayScene } from "./gameplay";
import initKaplay from "./gameplay/kaplayCtx";
import { menuScene } from "./menu";

export default async function initGame() {
    const k = initKaplay();

    k.scene("gameplay", (map, initialPosition) => {
        gamePlayScene(k, map, initialPosition)
    })

    k.scene("menu", () => {
        menuScene(k)
    })
    k.go("menu")
}  