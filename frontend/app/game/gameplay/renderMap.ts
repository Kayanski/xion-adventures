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
  seaCutoff,
  spriteSize,
  terrainCutoff,
  terrainZ,
  tileScreenSize,

} from "../constants";
import { MapOutput } from "../../_generated/generated-abstract/cosmwasm-codegen/Hub.types";
import { gameMapAtom, store } from "../store";
import { setEngine } from "crypto";

type MapObjectType = GameObj<PosComp>;

const coveredChunks: Set<string> = new Set();

export let map: number[][] = [[]]

export function createMap(
  k: KAPLAYCtx,
  mapData: number[][]
): MapObjectType {
  const mapObject = k.add([k.pos(0, 0), "map"]);
  map = mapData

  mapObject.onUpdate(() => {
    // We need to make sure enough chunks are loaded

    const current_pos = k.camPos();

    const topLeftCorner = current_pos.sub(k.center());
    const rightBottomCorner = topLeftCorner.add(k.width(), k.height());
    // First visible Chunk
    const topLeftCornerChunk = [
      Math.floor(topLeftCorner.x / chunkFactor),
      Math.floor(topLeftCorner.y / chunkFactor),
    ];
    // Last visible Chunk
    const rightBottomCornerChunk = [
      Math.floor(rightBottomCorner.x / chunkFactor),
      Math.floor(rightBottomCorner.y / chunkFactor),
    ];

    for (let i = topLeftCornerChunk[0]; i <= rightBottomCornerChunk[0]; i++) {
      for (let j = topLeftCornerChunk[1]; j <= rightBottomCornerChunk[1]; j++) {
        const vector = k.vec2(i, j);
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

export function destroyMap(
  k: KAPLAYCtx) {
  // Destroy the map object
  const maps = k.get("map");
  maps[0]?.destroy()
  // Restore the global map Rendering state
  coveredChunks.clear()
}

export async function createMapChunk(
  mapObject: MapObjectType,
  originCoordinates: Vec2,
  mapData: number[][],
  k: KAPLAYCtx
) {

  const chunkObject = mapObject.add([
    k.pos(originCoordinates.scale(chunkFactor)),
  ]);

  chunkObject.onUpdate(() => {
    const absoluteChunkPos = mapObject.pos.add(chunkObject.pos);
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
          const attributes = [
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

  const chunk = mapData
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
  const current_pos = k.camPos();
  return chunkPos.x <
    -2 * chunkFactor + current_pos.x - k.width() / 2 ||
    chunkPos.y <
    -2 * chunkFactor + current_pos.y - k.height() / 2 ||
    chunkPos.x >
    current_pos.x + k.width() / 2 + 2 * chunkFactor ||
    chunkPos.y > current_pos.y + k.height() / 2 + 2 * chunkFactor
}

function stringToBytes(val: string) {
  const result = [];
  for (let i = 0; i < val.length; i++) {
    result.push(val.charCodeAt(i));
  }
  return result;
}


// We want first index to be width and second index to be height
export function formatMap(mapJson: MapOutput) {

  const dataArray = stringToBytes(atob(mapJson.data));
  const mapArr = Array.from({ length: mapJson.width }, () => Array(mapJson.height).fill(undefined));

  console.log(dataArray)
  dataArray.forEach((el, index) => {

    const row_index = index % mapJson.width;
    const line_index = Math.trunc(index / mapJson.height);

    // Each element is compared to an enum and stored separately
    if (el < seaCutoff) {
      mapArr[row_index][line_index] = seaFrame
    } else if (el < terrainCutoff) {
      mapArr[row_index][line_index] = terrainFrame
    } else {
      mapArr[row_index][line_index] = treeFrame
    }
    console.log(row_index, line_index, el, mapArr[row_index][line_index])
    if (el > 50) {
      return;
    }
  })
  return mapArr;

}

