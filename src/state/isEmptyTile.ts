import { GameState } from './types';
import { getTile } from './map';

export const isEmptyTile = (
  state: GameState,
  x_: number,
  y_: number,
  options?: { ignorePlayerId: string }
): boolean => {
  const x = x_ | 0;
  const y = y_ | 0;
  const tile = getTile(state.map, x, y);
  if (!tile || tile.type !== 0) {
    return false;
  }
  for (const player of state.players) {
    const px = player.x | 0,
      py = player.y | 0;

    if (options?.ignorePlayerId === player.id) {
      continue;
    }
    if (px === x && py === y) {
      return false;
    }
    if ((player.targetX || px) === x && (player.targetY || py) === y) {
      return false;
    }
  }
  return true;
};
