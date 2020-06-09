import { mapHeight, initialHitpoints, mapWidth } from './constants';
import { GameState, Player, GameMap, playerTypes } from './types';
import { isEmptyTile } from './isEmptyTile';
import { getTile } from './map';
import { createBullet } from './bullet';
let nextPlayerType = 0;

export const createPlayer = (map: GameMap, id: string): Player => {
  for (let attempts = 0; attempts < 100; attempts++) {
    const x = (Math.random() * mapWidth) | 0;
    const y = (Math.random() * mapHeight) | 0;
    const tile = getTile(map, x, y);
    if (tile.type) {
      continue;
    }
    return {
      id,
      type: nextPlayerType++ % playerTypes,
      x,
      y,
      hp: initialHitpoints,
      input: {}
    };
  }
  return {
    id,
    type: nextPlayerType++ % playerTypes,
    x: 0,
    y: 0,
    hp: initialHitpoints,
    input: {}
  };
};

export const movePlayers = (state: GameState, delta: number) => {
  for (const player of state.players) {
    const { x, y } = player;
    if (player.targetX === undefined && player.targetY === undefined) {
      if (player.input.left && isEmptyTile(state, x - 1, y)) {
        player.targetX = x - 1;
      } else if (player.input.up && isEmptyTile(state, x, y - 1)) {
        player.targetY = y - 1;
      } else if (player.input.right && isEmptyTile(state, x + 1, y)) {
        player.targetX = x + 1;
      } else if (player.input.down && isEmptyTile(state, x, y + 1)) {
        player.targetY = y + 1;
      }
    } else {
      if (
        player.targetX !== undefined &&
        Math.abs(player.targetX - x) <= 0.01
      ) {
        player.targetX = undefined;
        player.x = Math.round(player.x);
      }
      if (
        player.targetY !== undefined &&
        Math.abs(player.targetY - y) <= 0.01
      ) {
        player.targetY = undefined;
        player.y = Math.round(player.y);
      }
      const deltaX =
        player.targetX !== undefined &&
        Math.min(0.1 * delta, Math.abs(player.targetX - player.x));
      const dx =
        player.targetX !== undefined
          ? player.targetX > player.x
            ? +deltaX
            : -deltaX
          : 0;
      const deltaY =
        player.targetY !== undefined &&
        Math.min(0.1 * delta, Math.abs(player.targetY - player.y));

      const dy =
        player.targetY !== undefined
          ? player.targetY > player.y
            ? +deltaY
            : -deltaY
          : 0;

      player.x += dx;
      player.y += dy;
      if (dx !== 0) {
        player.lastDx = Math.sign(dx);
        player.lastDy = 0;
      }
      if (dy !== 0) {
        player.lastDx = 0;
        player.lastDy = Math.sign(dy);
      }
    }
  }
};

export const createPlayerBullets = (state: GameState, delta: number) => {
  for (const player of state.players) {
    if (player.shootCooldown !== undefined && player.shootCooldown >= 0) {
      player.shootCooldown -= delta;
      continue;
    }
    if (player.input.shoot) {
      player.shootCooldown = 50;
      const { x, y, lastDx, lastDy } = player;
      if (lastDx !== undefined && lastDy !== undefined) {
        createBullet(state, {
          x,
          y,
          dx: lastDx / 2,
          dy: lastDy / 2,
          playerId: player.id
        });
      }
    }
  }
};
