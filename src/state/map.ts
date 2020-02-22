import { GameMap, Tile } from './types';
import { mapWidth, mapHeight } from './constants';

const tileIndex = (x: number, y: number) => y * mapWidth + x;
export const getTile = (map: GameMap, x: number, y: number) =>
  map.tiles[tileIndex(x, y)];
export const setTile = (map: GameMap, x: number, y: number, tile: Tile) =>
  (map.tiles[tileIndex(x, y)] = tile);

export const createMap = (): GameMap => {
  const map: GameMap = { tiles: new Array(mapHeight * mapWidth) };
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      setTile(map, x, y, {
        type: Math.random() > 0.85 ? 1 : 0
      });
    }
  }
  return map;
};
