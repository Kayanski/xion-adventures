import { gamePlayScene } from "./gameplay";
import initKaplay from "./gameplay/kaplayCtx";
import { menuScene } from "./menu";

export default async function initGame() {
    const k = initKaplay();

    k.loadSprite("wallet", "./wallet.png", {});
    k.loadSprite("wallet-connected", "./wallet-connected.png", {});

    k.scene("gameplay", (map, initialPosition) => {
        gamePlayScene(k, map, initialPosition)
    })

    k.scene("menu", () => {
        menuScene(k)
    })
    k.go("menu")
}  