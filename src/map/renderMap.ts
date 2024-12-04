export const treeFrame = 1;
export const terrainFrame = 4;
export const seaFrame = 16;

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
} from "../constants";

type MapObjectType = GameObj<PosComp>;

let coveredChunks: Set<string> = new Set();

export async function createMap(
  k: KAPLAYCtx,
  mapData: Asset<number[][]>
): Promise<MapObjectType> {
  let mapObject = k.add([k.pos(0, 0), "map"]);

  mapObject.onUpdate(async () => {
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

    for (var i = topLeftCornerChunk[0]; i <= rightBottomCornerChunk[0]; i++) {
      for (var j = topLeftCornerChunk[1]; j <= rightBottomCornerChunk[1]; j++) {
        if (!coveredChunks.has(JSON.stringify([i, j]))) {
          createMapChunk(mapObject, [i, j], await mapData, k);

          coveredChunks.add(JSON.stringify([i, j]));
        }
      }
    }

    // If not, we create them (and they destroy themselves)
  });
  return mapObject;
}

export async function createMapChunk(
  mapObject: MapObjectType,
  originCoordinates: [number, number],
  mapData: number[][],
  k: KAPLAYCtx
) {
  if (originCoordinates[0] < 0 || originCoordinates[1] < 0) {
    return;
  }

  let chunk = mapData
    .slice(
      originCoordinates[0] * chunkSize,
      originCoordinates[0] * chunkSize + chunkSize
    )
    .map((row) => {
      return row.slice(
        originCoordinates[1] * chunkSize,
        originCoordinates[1] * chunkSize + chunkSize
      );
    });

  let chunkObject = mapObject.add([
    k.pos(
      originCoordinates[0] * chunkFactor,
      originCoordinates[1] * chunkFactor
    ),
  ]);
  // We render the chunk
  chunk.forEach((row, row_index) => {
    row.forEach((item, columnIndex) => {
      if (item == terrainFrame) {
        k.onDraw(() => {
          k.drawSprite({
            sprite: "background",
            frame: terrainFrame,
            pos: chunkObject.pos.add(
              scale * spriteSize * columnIndex,
              scale * spriteSize * row_index
            ),
            scale,
          });
        });
        return;
      }
      let attributes: (
        | PosComp
        | SpriteComp
        | ScaleComp
        | ZComp
        | AreaComp
        | OffScreenComp
        | BodyComp
      )[] = [
        k.sprite("background", { frame: item }),
        k.pos(scale * spriteSize * columnIndex, scale * spriteSize * row_index),
        k.scale(scale),
        k.z(terrainZ),
        k.area(),
      ];
      if (item == treeFrame || item == seaFrame) {
        attributes.push(k.body({ isStatic: true }));
      }

      chunkObject.add(attributes);

      chunkObject.onUpdate(() => {
        let absoluteChunkPos = mapObject.pos.add(chunkObject.pos);
        let current_pos = k.camPos();
        if (
          absoluteChunkPos.x <
            -2 * chunkFactor + current_pos.x - k.width() / 2 ||
          absoluteChunkPos.y <
            -2 * chunkFactor + current_pos.y - k.height() / 2 ||
          absoluteChunkPos.x >
            current_pos.x + k.width() / 2 + 2 * chunkFactor ||
          absoluteChunkPos.y > current_pos.y + k.height() / 2 + 2 * chunkFactor
        ) {
          chunkObject.destroy();
          coveredChunks.delete(JSON.stringify(originCoordinates));
        }
      });
    });
  });
}
