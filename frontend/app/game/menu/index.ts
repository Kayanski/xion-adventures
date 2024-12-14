
// IN this file, we define the kaplay menu which is the first scene players will land o

import { Color, KAPLAYCtx } from "kaplay";
import { gameMapAtom, initialPositionAtom, store } from "../store";
import { setCursorDefault, setCursorPointer } from "../utils"
import { formatMap } from "../gameplay/renderMap";

export async function menuScene(k: KAPLAYCtx) {

    const sprite = await k.loadSprite("menu_background", "./menu_background.webp",);
    k.add([
        k.rect(k.width(), k.height()), // Full-screen rectangle
        k.pos(0, 0),               // Positioned at the top-left
        k.color(0, 0, 0),          // black color
    ]);

    k.onDraw(() => {
        k.drawSprite({
            sprite: "menu_background",
            pos: k.vec2((k.width() - sprite.width) / 2, (k.height() - sprite.height) / 2)
        })
    })

    // Some rectangles with text for New Game and Login
    const width = sprite.width / 2
    const height = sprite.height / 8
    const RADIUS = 30;
    const OUTLINE = 4
    const color = new k.Color(235, 113, 52);
    const moreColor = new k.Color(245, 85, 5)
    const disabledColor = new k.Color(105, 95, 91);
    const DEFAULT_WHITE_OPACITY = 0.5;
    const ACTIVE_WHITE_OPACITY = 0.7;
    const newGameBackground = k.add([
        k.rect(width, height, { radius: RADIUS }),
        k.color(k.Color.WHITE),
        k.pos((k.width() - width) / 2, 4 * (k.height() - height) / 6),
        k.opacity(DEFAULT_WHITE_OPACITY),
        k.area(),
        "new_game_button"
    ])
    const newGameOutline = k.add([
        k.rect(width, height, { radius: RADIUS, fill: false }),
        //k.color(0),
        k.pos((k.width() - width) / 2, 4 * (k.height() - height) / 6),
        k.outline(OUTLINE, disabledColor),
    ])
    newGameBackground.onHover(() => {
        if (newGameText.color.eq(color)) {
            newGameBackground.opacity = ACTIVE_WHITE_OPACITY
            setCursorPointer()
        }
    })
    newGameBackground.onHoverEnd(() => {
        if (newGameText.color.eq(color)) {
            newGameBackground.opacity = DEFAULT_WHITE_OPACITY
            setCursorDefault()
        }
    })

    // Add text
    const newGameText = k.add([
        k.text("New Game", { align: "center", size: 5 * height / 8, font: "gameboy", }),
        k.pos((k.width()) / 2, 4 * (k.height() - height) / 6 + height / 2 + 5),
        k.color(disabledColor),
        k.anchor("center"),
    ])

    const resume = k.add([
        k.rect(width, height, { radius: RADIUS }),
        k.color(disabledColor),
        k.pos((k.width() - width) / 2, 5 * (k.height() - height) / 6),
        k.area()
    ])

    resume.onHover(() => {
        if (resume.color.eq(color)) {
            resume.color = moreColor
            setCursorPointer()
        }
    })
    resume.onHoverEnd(() => {
        if (resume.color.eq(moreColor)) {
            resume.color = color
            setCursorDefault()
        }
    })

    k.add([
        k.text("Resume Game", { align: "center", size: 5 * height / 8, font: "gameboy", }),
        k.pos((k.width()) / 2, 5 * (k.height() - height) / 6 + height / 2 + 5),
        k.color(k.Color.WHITE),
        k.anchor("center"),
    ])


    // We update the game map once it's fetched from chain
    store.sub(gameMapAtom, () => {
        const newMap = store.get(gameMapAtom);
        if (!newMap) {
            return
        }
        // We set the local new Map, we're ready to play
        newGameText.color = color
        newGameOutline.outline.color = color
    })

    // We update the player map once it's fetched from chain
    store.sub(initialPositionAtom, () => {
        const position = store.get(initialPositionAtom)
        if (!position) {
            return
        }
        // We set the initial Position, we're ready to resume game
        // TODO
    })
    k.onClick("new_game_button", () => {
        const newMap = store.get(gameMapAtom);
        if (!newMap) {
            return
        }
        k.go("gameplay", formatMap(newMap), store.get(initialPositionAtom))
    });
}