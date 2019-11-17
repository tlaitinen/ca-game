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

export function updateState(state: GameState, pressed: PressedKeys) {
  movePlayers(state, pressed);
  moveBullets(state);
  hitPlayers(state);

  state.bullets.push(...createPlayerBullets(state, pressed));
  state.bullets = state.bullets.filter(bullet => bullet.collided !== true);
  state.players = state.players.filter(player => player.hp > 0);
}
