import { GameState, Explosion } from './types';

export const createExplosion = (state: GameState, explosion: Explosion) => {
  state.explosions.push(explosion);
};
export function updateExplosions(state: GameState, delta: number) {
  for (let explosion of state.explosions) {
    explosion.progress += delta;
  }
}
