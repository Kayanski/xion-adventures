import { KAPLAYCtx } from "kaplay";
import { frontZ } from "./constants";
import { isWalletConnectedAtom, store, walletOpeningCommand } from "./store";
import { setCursorDefault, setCursorPointer } from "./utils";

export function walletIcon(k: KAPLAYCtx) {
    const walletArea = k.add([
        k.rect(walletRectSize, walletRectSize, {
            radius: [walletRadius, walletRadius, walletRadius, walletRadius],
        }),
        k.fixed(),
        k.pos(12, 12),
        k.outline(1, k.Color.BLACK),
        k.z(frontZ),
        k.area(),
        "wallet",
    ]);
    const walletImage = k.add([
        k.sprite("wallet"),
        k.scale(1),
        k.pos(
            k.vec2(
                12 + (walletRectSize - walletSize) / 2,
                12 + (walletRectSize - walletSize) / 2
            )
        ),
        k.fixed(),
        k.z(frontZ),
    ]);

    walletImage.onUpdate(() => {
        // We change the wallet image on change
        if (store.get(isWalletConnectedAtom)) {
            walletImage.use(k.sprite("wallet-connected"))
        } else {
            walletImage.use(k.sprite("wallet"))
        }
    })
    walletArea.onHover(() => {
        setCursorPointer()
    });
    walletArea.onHoverEnd(() => {
        setCursorDefault()
    })

    k.onClick("wallet", () => {
        store.set(walletOpeningCommand, true);
    });
}
const walletSize = 50;
const walletRectSize = 60;
const walletRadius = 20;
