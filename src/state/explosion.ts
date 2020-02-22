import { GameState } from './types';

export function updateExplosions(state: GameState) {
  for (let explosion of state.explosions) {
    explosion.progress++;
  }
}
