import { GameState } from "./types";
import { isEmptyTile } from "./isEmptyTile";
export function moveBullets(state: GameState) {
  for (let bullet of state.bullets) {
    if (
      !isEmptyTile(state, bullet.x, bullet.y, {
        ignorePlayerId: bullet.playerId
      })
    ) {
      bullet.collided = true;
      state.explosions.push({
        x: bullet.x | 0,
        y: bullet.y | 0,
        progress: 0
      });
    }

    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
  }
}

export function hitPlayers(state: GameState) {
  for (let bullet of state.bullets) {
    for (let player of state.players) {
      if (bullet.playerId === player.id) {
        continue;
      }
      if (
        (bullet.x | 0) === (player.x | 0) &&
        (bullet.y | 0) === (player.y | 0)
      ) {
        bullet.collided = true;
        player.hp--;

        state.explosions.push({
          x: bullet.x | 0,
          y: bullet.y | 0,
          progress: 0,
          scale: player.hp === 0 ? 3 : 1
        });
      }
    }
  }
}
