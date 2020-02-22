import { GameState, Bullet } from './types';
import { isEmptyTile } from './isEmptyTile';
import { createExplosion } from './explosion';
export const createBullet = (state: GameState, bullet: Bullet) => {
  state.bullets.push(bullet);
};
export const moveBullets = (state: GameState) => {
  for (const bullet of state.bullets) {
    if (
      !isEmptyTile(state, bullet.x, bullet.y, {
        ignorePlayerId: bullet.playerId
      })
    ) {
      bullet.collided = true;
      createExplosion(state, {
        x: bullet.x | 0,
        y: bullet.y | 0,
        progress: 0
      });
    }

    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
  }
};

export const hitPlayers = (state: GameState) => {
  for (const bullet of state.bullets) {
    for (const player of state.players) {
      if (bullet.playerId === player.id) {
        continue;
      }
      if (
        (bullet.x | 0) === (player.x | 0) &&
        (bullet.y | 0) === (player.y | 0)
      ) {
        bullet.collided = true;
        player.hp--;

        createExplosion(state, {
          x: bullet.x | 0,
          y: bullet.y | 0,
          progress: 0,
          scale: player.hp === 0 ? 3 : 1
        });
      }
    }
  }
};
