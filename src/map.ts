import { GameMap, tileKey } from "./types";
import { mapWidth, mapHeight } from "./constants";

export function createMap(): GameMap {
  const tiles: GameMap["tiles"] = {};
  const isPlayerTile = (x: number, y: number) =>
    (x === 0 || x === mapWidth - 1) && y === mapHeight / 2;
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      tiles[tileKey(x, y)] = {
        type: Math.random() > 0.85 && !isPlayerTile(x, y) ? 1 : 0
      };
    }
  }
  return {
    tiles
  };
}
