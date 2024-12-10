import { createMap, seaFrame, terrainFrame, treeFrame } from "./renderMap";
import {
  backgroundSpritesX,
  backgroundSpritesY,
  frontZ,
  maxMovementLength,
  playerZ,
  tileScreenSize,
} from "./constants";
import {
  AnchorComp,
  AreaComp,
  BodyComp,
  GameObj,
  PosComp,
  ScaleComp,
  SpriteComp,
  Vec2,
  ZComp,
} from "kaplay";
import initKaplay from "./kaplayCtx";
import {
  store,
  textBoxContentAtom,
  walletOpeningCommand,
} from "./store";
import { movementTrackerUpdate } from "./playerUpdate";

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

type MapType = {
  width: number;
  height: number;
  data: string;
};
function stringToBytes(val: string) {
  const result = [];
  for (let i = 0; i < val.length; i++) {
    result.push(val.charCodeAt(i));
  }
  return result;
}

export default async function initGame() {
  const DIAGONAL_FACTOR = 1 / Math.sqrt(2);
  const k = initKaplay();

  let map = k.load(
    fetch("/mapTest.json")
      .then((res) => res.json())
      .then((json: MapType) => {
        const mapArr = [];
        let dataArray = stringToBytes(atob(json.data));
        while (dataArray.length) mapArr.push(dataArray.splice(0, json.width));
        let maxRow = mapArr.map(function (row) {
          return Math.max.apply(Math, row);
        });
        let max = Math.max.apply(null, maxRow);
        let minRow = mapArr.map(function (row) {
          return Math.min.apply(Math, row);
        });
        let min = Math.min.apply(null, minRow);

        let third = (max - min) / 3;

        for (let i = 0; i < mapArr.length; i++) {
          for (let j = 0; j < mapArr[i].length; j++) {
            let item_byte = mapArr[i][j];
            if (item_byte < min + third) {
              mapArr[i][j] = seaFrame;
            } else if (item_byte < min + 2 * third) {
              mapArr[i][j] = terrainFrame;
            } else {
              mapArr[i][j] = treeFrame;
            }
          }
        }

        return mapArr;
      })
  );

  k.loadSprite("background", "./background.png", {
    sliceY: backgroundSpritesY,
    sliceX: backgroundSpritesX,
  });
  k.loadSprite("wallet", "./wallet.png", {});
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

  let mapAwaited = await map;
  createMap(k, mapAwaited);

  const player: Player = k.add([
    k.sprite("characters", { anim: "down-idle" }),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.pos(k.center()),
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

    if (k.isKeyDown("left")) player.direction.x = -1;
    if (k.isKeyDown("right")) player.direction.x = 1;
    if (k.isKeyDown("up")) player.direction.y = -1;
    if (k.isKeyDown("down")) player.direction.y = 1;

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
      player.direction.eq(k.vec2(0, 0)) &&
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

    // We update the camera position and block if we reach the limit
    let camPosLowerLimit = k.center().sub(k.vec2(tileScreenSize, tileScreenSize));
    let camPosHigherLimit = k.vec2(mapAwaited.length + 1, mapAwaited[0].length + 1).scale(tileScreenSize).sub(k.center());
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

    player.move(playerMovement);

    movementTrackerUpdate(k, player);
  });

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

  k.add([
    k.rect(walletRectSize, walletRectSize, {
      radius: [walletRadius, walletRadius, walletRadius, walletRadius],
    }),
    k.fixed(),
    k.pos(12, 12),
    k.outline(1, k.Color.BLACK),
    k.z(frontZ),
  ]);
  k.add([
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
    k.area(),
    "wallet",
  ]);

  k.onClick("wallet", () => {
    store.set(walletOpeningCommand, true);
  });

  k.onClick(() => {
    console.log("How many entities at the ground level", k.get("*")[0]?.children.length);
  })

}

const walletSize = 50;
const walletRectSize = 60;
const walletRadius = 20;
