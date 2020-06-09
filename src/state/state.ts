import { GameState } from './types';
import { movePlayers, createPlayerBullets } from './player';
import { createMap } from './map';
import { moveBullets, hitPlayers } from './bullet';
import { updateExplosions } from './explosion';

export function initialGameState(): GameState {
  const map = createMap();
  return {
    time: new Date().getTime(),
    players: [],
    bullets: [],
    explosions: [],
    map
  };
}
export function updateGameState(state: GameState) {
  const newTime = new Date().getTime();
  const delta = (newTime - state.time) / 16.6666;
  state.time = newTime;

  movePlayers(state, delta);
  moveBullets(state, delta);
  hitPlayers(state);
  createPlayerBullets(state, delta);
  updateExplosions(state, delta);
  state.bullets = state.bullets.filter(bullet => bullet.collided !== true);
  state.players = state.players.filter(player => player.hp > 0);
  state.explosions = state.explosions.filter(
    explosion => explosion.progress < 50
  );
}
