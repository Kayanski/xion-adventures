import { createMap } from "./renderMap";
import {
  backgroundSpritesX,
  backgroundSpritesY,
  defaultPosition,
  DIAGONAL_FACTOR,
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
  AccountDescription,
  store,
  textBoxContentAtom,
} from "../store";
import { movementTrackerUpdate } from "./playerUpdate";
import { setCamPos } from "./camera";
import { walletIcon } from "../wallet";

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

export function gamePlayScene(k: KAPLAYCtx, map: number[][], account: AccountDescription | undefined) {

  k.loadSprite("background", "./background.png", {
    sliceY: backgroundSpritesY,
    sliceX: backgroundSpritesX,
  });
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

  let initialPosition;
  // We compute the initial position
  if (account && account.nft && "general_map" in account.nft.location) {
    const generalMapPosition = account.nft.location["general_map"];
    initialPosition = k.vec2(generalMapPosition.x, generalMapPosition.y).scale(tileScreenSize);
  } else {
    initialPosition = k.vec2(defaultPosition[0], defaultPosition[1])
  }
  // The player anchor is at the center, whereas the tile anchors are at the topleft. 
  // This is on purpose (for position detection and saving on-chain)
  // We need to add half of the tile to the initialPosition
  initialPosition = initialPosition.add(tileScreenSize / 2, tileScreenSize / 2)

  const player: Player = k.add([
    k.sprite("characters", { anim: "down-idle" }),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.pos(initialPosition),
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

    movementTrackerUpdate(k, player, account?.tokenId);
  });
  setCamPos(k, player, map);

  k.onClick("player", () => {
    // store.set(isTextBoxVisibleAtom, true);
    store.set(
      textBoxContentAtom,
      `This text box is made with React.js!${player.pos}`
    );
  });

  walletIcon(k)

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

}

export function startGamePlayScene(k: KAPLAYCtx, map: number[][], account: AccountDescription | undefined) {
  k.go("gameplay", map, account)
}