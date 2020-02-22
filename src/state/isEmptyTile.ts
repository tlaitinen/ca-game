import { GameState } from './types';
import { getTile } from './map';

export const isEmptyTile = (
  state: GameState,
  x: number,
  y: number,
  options?: { ignorePlayerId: string }
): boolean => {
  const tile = getTile(state.map, x, y);
  if (!tile || tile.type !== 0) {
    return false;
  }
  for (const player of state.players) {
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
};
