import { GameState, tileKey } from "./types";

export function isEmptyTile(
  state: GameState,
  x: number,
  y: number,
  options?: { ignorePlayerId: number }
): boolean {
  const tile = state.map.tiles[tileKey(x, y)];
  if (!tile || tile.type !== 0) {
    return false;
  }
  for (let player of state.players) {
    if (options?.ignorePlayerId === player.id) {
      continue;
    }
    if ((player.x | 0) === (x | 0) && (player.y | 0) === (y | 0)) {
      return false;
    }
    if (
      (player.targetX || player.x | 0) === (x | 0) &&
      (player.targetY || player.y | 0) === (y | 0)
    ) {
      return false;
    }
  }
  return true;
}
