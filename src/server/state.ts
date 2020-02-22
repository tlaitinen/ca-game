import { ServerState } from 'state/types';
import { updateGameState } from '../state/state';

export const initialServerState: ServerState = {
  connections: {},
  games: {}
};

export const updateServerState = (state: ServerState) => {
  for (let gameId in state.games) {
    const game = state.games[gameId];
    updateGameState(game);

    if (!game.players) {
      console.log('deleting game', gameId);
      delete state.games[gameId];
    }
  }
};
