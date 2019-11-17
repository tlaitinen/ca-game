import { GameState, PressedKeys } from "./types";
import { createPlayer, movePlayers, createPlayerBullets } from "./player";
import { createMap } from "./map";
import { moveBullets, hitPlayers } from "./bullet";
export function createState(): GameState {
  const players = [createPlayer(0), createPlayer(1)];
  const map = createMap();
  return {
    players,
    bullets: [],
    map
  };
}
const escapeKey = 27;
export function updateState(state: GameState, pressed: PressedKeys) {
  if (pressed[escapeKey]) {
    Object.assign(state, createState());
  }
  movePlayers(state, pressed);
  moveBullets(state);
  hitPlayers(state);

  state.bullets.push(...createPlayerBullets(state, pressed));
  state.bullets = state.bullets.filter(bullet => bullet.collided !== true);
  state.players = state.players.filter(player => player.hp > 0);
}
