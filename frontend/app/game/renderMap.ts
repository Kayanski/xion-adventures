export const treeFrame = 1;
export const terrainFrame = 4;
export const seaFrame = 16;
export const wallFrame = 23 * 6 + 10;

import {
  AreaComp,
  Asset,
  BodyComp,
  GameObj,
  KAPLAYCtx,
  OffScreenComp,
  PosComp,
  ScaleComp,
  SpriteComp,
  Vec2,
  ZComp,
} from "kaplay";
import {
  chunkFactor,
  chunkSize,
  scale,
  spriteSize,
  terrainZ,
  tileScreenSize,
} from "./constants";

type MapObjectType = GameObj<PosComp>;

let coveredChunks: Set<string> = new Set();

export function createMap(
  k: KAPLAYCtx,
  mapData: number[][]
): MapObjectType {
  let mapObject = k.add([k.pos(0, 0), "map"]);

  mapObject.onUpdate(() => {
    // We need to make sure enough chunks are loaded

    let current_pos = k.camPos();

    let topLeftCorner = current_pos.sub(k.center());
    let rightBottomCorner = topLeftCorner.add(k.width(), k.height());
    // First visible Chunk
    let topLeftCornerChunk = [
      Math.floor(topLeftCorner.x / chunkFactor),
      Math.floor(topLeftCorner.y / chunkFactor),
    ];
    // Last visible Chunk
    let rightBottomCornerChunk = [
      Math.floor(rightBottomCorner.x / chunkFactor),
      Math.floor(rightBottomCorner.y / chunkFactor),
    ];

    for (let i = topLeftCornerChunk[0]; i <= rightBottomCornerChunk[0]; i++) {
      for (let j = topLeftCornerChunk[1]; j <= rightBottomCornerChunk[1]; j++) {
        let vector = k.vec2(i, j);
        if (!coveredChunks.has(JSON.stringify(vector))) {
          createMapChunk(mapObject, vector, mapData, k);

          coveredChunks.add(JSON.stringify(vector));
        }
      }
    }

    // If not, we create them (and they destroy themselves)
  });
  return mapObject;
}

export async function createMapChunk(
  mapObject: MapObjectType,
  originCoordinates: Vec2,
  mapData: number[][],
  k: KAPLAYCtx
) {

  let chunkObject = mapObject.add([
    k.pos(originCoordinates.scale(chunkFactor)),
  ]);

  chunkObject.onUpdate(() => {
    let absoluteChunkPos = mapObject.pos.add(chunkObject.pos);
    if (outOfScreen(k, absoluteChunkPos)) {
      chunkObject.removeAll();
      chunkObject.destroy();
      coveredChunks.delete(JSON.stringify(originCoordinates));
    }
  });

  if (originCoordinates.x < 0 || originCoordinates.y < 0 || originCoordinates.x >= mapData.length / chunkSize || originCoordinates.y >= mapData[0].length / chunkSize) {
    // We only print the border for those kind of chunks
    if (originCoordinates.x == -1 || originCoordinates.y == -1 || originCoordinates.x == mapData.length / chunkSize || originCoordinates.y == mapData[0].length / chunkSize) {
      // We print a chunk full of path tiles
      for (let i = 0; i < chunkSize; i++) {
        for (let j = 0; j < chunkSize; j++) {
          let attributes = [
            k.sprite("background", { frame: wallFrame }),
            k.pos(tileScreenSize * i, tileScreenSize * j),
            k.scale(scale),
            k.z(terrainZ),
            k.area(),
            k.body({ isStatic: true }),
            "wall"
          ];
          chunkObject.add(attributes)
        }
      }
      return
    }
  }

  let chunk = mapData
    .slice(
      originCoordinates.x * chunkSize,
      originCoordinates.x * chunkSize + chunkSize
    )
    .map((row) => {
      return row.slice(
        originCoordinates.y * chunkSize,
        originCoordinates.y * chunkSize + chunkSize
      );
    });

  // We render the chunk
  chunk.forEach((row, row_index) => {
    row.forEach((item, columnIndex) => {
      if (item != terrainFrame) {
        chunkObject.add([
          k.sprite("background", { frame: item }),
          k.pos(scale * spriteSize * columnIndex, scale * spriteSize * row_index),
          k.scale(scale),
          k.z(terrainZ),
          k.area(),
          k.body({ isStatic: true })
        ]);
      } else {
        chunkObject.add([
          k.sprite("background", { frame: item }),
          k.pos(scale * spriteSize * columnIndex, scale * spriteSize * row_index),
          k.scale(scale),
          k.z(terrainZ),
          k.area(),
        ]);
      }
    });
  });

}

function outOfScreen(k: KAPLAYCtx, chunkPos: Vec2) {
  let current_pos = k.camPos();
  return chunkPos.x <
    -2 * chunkFactor + current_pos.x - k.width() / 2 ||
    chunkPos.y <
    -2 * chunkFactor + current_pos.y - k.height() / 2 ||
    chunkPos.x >
    current_pos.x + k.width() / 2 + 2 * chunkFactor ||
    chunkPos.y > current_pos.y + k.height() / 2 + 2 * chunkFactor
}