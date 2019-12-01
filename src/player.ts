import { mapHeight, initialHitpoints, mapWidth } from "./constants";
import { GameState, PressedKeys, Player } from "./types";
import { isEmptyTile } from "./isEmptyTile";

export function createPlayer(id: 0 | 1): Player {
  const y = mapHeight / 2;
  if (id === 0) {
    return {
      id,
      x: 0,
      y,
      hp: initialHitpoints
    };
  } else {
    return {
      id,
      x: mapWidth - 1,
      y,
      hp: initialHitpoints
    };
  }
}
const playerKeys = [
  {
    left: 65,
    up: 87,
    right: 68,
    down: 83,
    shoot: 16
  },
  {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    shoot: 18
  }
];

export function movePlayers(state: GameState, pressed: PressedKeys) {
  for (let player of state.players) {
    const keys = playerKeys[player.id];
    const { x, y } = player;
    if (player.targetX === undefined && player.targetY === undefined) {
      if (pressed[keys.left] && isEmptyTile(state, x - 1, y)) {
        player.targetX = x - 1;
      } else if (pressed[keys.up] && isEmptyTile(state, x, y - 1)) {
        player.targetY = y - 1;
      } else if (pressed[keys.right] && isEmptyTile(state, x + 1, y)) {
        player.targetX = x + 1;
      } else if (pressed[keys.down] && isEmptyTile(state, x, y + 1)) {
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
      const dx =
        player.targetX !== undefined
          ? player.targetX > player.x
            ? +0.1
            : -0.1
          : 0;
      const dy =
        player.targetY !== undefined
          ? player.targetY > player.y
            ? +0.1
            : -0.1
          : 0;

      player.x += dx;
      player.y += dy;
      if (dx !== 0) {
        player.lastDx = dx;
        player.lastDy = 0;
      }
      if (dy !== 0) {
        player.lastDx = 0;
        player.lastDy = dy;
      }
    }
  }
}

export function createPlayerBullets(state: GameState, pressed: PressedKeys) {
  for (let player of state.players) {
    const keys = playerKeys[player.id];
    if (player.shootCooldown !== undefined && player.shootCooldown >= 0) {
      player.shootCooldown -= 1;
      continue;
    }
    if (pressed[keys.shoot]) {
      player.shootCooldown = 50;
      const { x, y, lastDx, lastDy } = player;
      if (lastDx !== undefined && lastDy !== undefined) {
        state.bullets.push({
          x,
          y,
          dx: lastDx * 7,
          dy: lastDy * 7,
          playerId: player.id
        });
      }
    }
  }
}
