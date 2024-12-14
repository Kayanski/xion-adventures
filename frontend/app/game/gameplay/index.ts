import { createMap, destroyMap, formatMap, map, seaFrame, terrainFrame, treeFrame } from "./renderMap";
import {
  backgroundSpritesX,
  backgroundSpritesY,
  defaultPosition,
  DIAGONAL_FACTOR,
  frontZ,
  maxMovementLength,
  playerZ,
  tileScreenSize,
} from "../constants";
import {
  AnchorComp,
  AreaComp,
  BodyComp,
  GameObj,
  KAPLAYCtx,
  PosComp,
  ScaleComp,
  SpriteComp,
  Vec2,
  ZComp,
} from "kaplay";
import {
  gameMapAtom,
  initialPositionAtom,
  isWalletConnectedAtom,
  store,
  textBoxContentAtom,
  walletOpeningCommand,
} from "../store";
import { movementTrackerUpdate } from "./playerUpdate";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { MapOutput } from "../../_generated/generated-abstract/cosmwasm-codegen/Hub.types";
import { setCamPos } from "./camera";
import { setCursorDefault, setCursorPointer } from "../utils";

export type Player = GameObj<
  | PosComp
  | SpriteComp
  | ScaleComp
  | ZComp
  | AreaComp
  | BodyComp
  | AnchorComp
  | {
    speed: number;
    direction: Vec2;
  }
>;

export function gamePlayScene(k: KAPLAYCtx, map: number[][], initialPosition: number[][] | undefined) {

  k.loadSprite("background", "./background.png", {
    sliceY: backgroundSpritesY,
    sliceX: backgroundSpritesX,
  });
  k.loadSprite("wallet", "./wallet.png", {});
  k.loadSprite("wallet-connected", "./wallet-connected.png", {});
  k.loadSprite("characters", "./characters.png", {
    sliceY: 2,
    sliceX: 8,
    anims: {
      "down-idle": 0,
      "up-idle": 1,
      "right-idle": 2,
      "left-idle": 3,
      right: { from: 4, to: 5, loop: true },
      left: { from: 6, to: 7, loop: true },
      down: { from: 8, to: 9, loop: true },
      up: { from: 10, to: 11, loop: true },
      "npc-down": 12,
      "npc-up": 13,
      "npc-right": 14,
      "npc-left": 15,
    },
  });

  // we create the map
  createMap(k, map)

  const player: Player = k.add([
    k.sprite("characters", { anim: "down-idle" }),
    k.area(),
    k.body(),
    k.anchor("topleft"),
    k.pos(defaultPosition[0], defaultPosition[1]),
    k.scale(8),
    k.z(playerZ),
    "player",
    {
      speed: 800,
      direction: k.vec2(0, 0),
    },
  ]);


  player.onUpdate(() => {
    player.direction.x = 0;
    player.direction.y = 0;

    if (document.hasFocus()) {
      if (k.isKeyDown("left")) player.direction.x = -1;
      if (k.isKeyDown("right")) player.direction.x = 1;
      if (k.isKeyDown("up")) player.direction.y = -1;
      if (k.isKeyDown("down")) player.direction.y = 1;
    }

    if (
      player.direction.eq(k.vec2(-1, 0)) &&
      player.getCurAnim()?.name !== "left"
    ) {
      player.play("left");
    }

    if (
      player.direction.eq(k.vec2(1, 0)) &&
      player.getCurAnim()?.name !== "right"
    ) {
      player.play("right");
    }

    if (
      player.direction.eq(k.vec2(0, -1)) &&
      player.getCurAnim()?.name !== "up"
    ) {
      player.play("up");
    }

    if (
      player.direction.eq(k.vec2(0, 1)) &&
      player.getCurAnim()?.name !== "down"
    ) {
      player.play("down");
    }

    if (
      player.direction.eq(k.vec2(0, 0)) && player.getCurAnim() &&
      !player.getCurAnim()?.name.includes("idle")
    ) {
      player.play(`${player.getCurAnim()?.name}-idle`);
    }

    if (player.direction.eq(k.vec2(0, 0))) {
      return;
    }

    let playerMovement: Vec2;

    if (player.direction.x && player.direction.y) {
      playerMovement = player.direction.scale(DIAGONAL_FACTOR * player.speed);
    } else {
      playerMovement = player.direction.scale(player.speed);
    }

    player.move(playerMovement);

    setCamPos(k, player, map);

    movementTrackerUpdate(k, player);
  });
  setCamPos(k, player, map);

  k.onClick("player", () => {
    // store.set(isTextBoxVisibleAtom, true);
    store.set(
      textBoxContentAtom,
      `This text box is made with React.js!${player.pos}`
    );
  });

  // const npc = mapObject.add([
  //   k.sprite("characters", { anim: "npc-left" }),
  //   k.area(),
  //   k.body({ isStatic: true }),
  //   k.anchor("center"),
  //   k.scale(8),
  //   k.pos(1480, 500),
  // ]);

  // npc.onCollide("player", (player) => {
  //   if (player.direction.eq(k.vec2(0, -1))) {
  //     store.set(textBoxContentAtom, "Beautiful day, isn't it?");
  //     npc.play("npc-down");
  //   }

  //   if (player.direction.eq(k.vec2(0, 1))) {
  //     npc.play("npc-up");
  //     store.set(textBoxContentAtom, "Those rocks are heavy!");
  //   }

  //   if (player.direction.eq(k.vec2(1, 0))) {
  //     npc.play("npc-left");
  //     store.set(textBoxContentAtom, "This text box is made with React.js!");
  //   }

  //   if (player.direction.eq(k.vec2(-1, 0))) {
  //     store.set(textBoxContentAtom, "Is the water too cold?");
  //     npc.play("npc-right");
  //   }

  //   store.set(isTextBoxVisibleAtom, true);
  // });

  /// Drawing the wallet button (menu) in the future

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
