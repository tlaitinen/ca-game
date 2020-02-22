import { GameState } from './types';
import { createPlayer, movePlayers, createPlayerBullets } from './player';
import { createMap } from './map';
import { moveBullets, hitPlayers } from './bullet';
import { updateExplosions } from './explosion';
export function initialGameState(): GameState {
  const players = [createPlayer(0), createPlayer(1)];
  const map = createMap();
  return {
    players,
    bullets: [],
    explosions: [],
    map
  };
}
export function updateGameState(state: GameState) {
  movePlayers(state);
  moveBullets(state);
  hitPlayers(state);
  createPlayerBullets(state);
  updateExplosions(state);
  state.bullets = state.bullets.filter(bullet => bullet.collided !== true);
  state.players = state.players.filter(player => player.hp > 0);
  state.explosions = state.explosions.filter(
    explosion => explosion.progress < 50
  );
}
