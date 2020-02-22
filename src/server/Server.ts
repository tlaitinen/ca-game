import {
  ServerState,
  ConnectionId,
  PlayerInputState,
  ServerMessage,
  GameId
} from 'state/types';
import { updateGameState, initialGameState } from '../state/state';
import { createPlayer } from '../state/player';

const defaultGameId: GameId = 'default';

export class Server {
  state: ServerState = {
    connections: {},
    games: {},
    subscribers: {}
  };
  update() {
    const state = this.state;
    for (let gameId in state.games) {
      const game = state.games[gameId];
      if (!game) {
        continue;
      }
      updateGameState(game);

      if (!game.players) {
        console.log('deleting game', gameId);
        delete state.games[gameId];
      }
    }
  }
  broadcastGameState(gameId: GameId) {
    const subscribers = this.state.subscribers[gameId];
    const game = this.state.games[gameId];
    if (!subscribers || !game) {
      return;
    }
    for (let connId of subscribers) {
      const conn = this.state.connections[connId];
      if (!conn) {
        continue;
      }
      console.log('sending state to', connId);
      conn.send({ type: 'state', payload: game });
    }
  }
  addSubscriber(gameId: GameId, connId: ConnectionId) {
    const subscribers = this.state.subscribers[gameId];
    if (!subscribers) {
      this.state.subscribers[gameId] = new Set([connId]);
    } else {
      subscribers.add(connId);
    }
  }
  removeSubscriber(gameId: GameId, connId: ConnectionId) {
    const subscribers = this.state.subscribers[gameId];
    subscribers?.delete(connId);
  }
  addPlayer(gameId: GameId, connId: ConnectionId) {
    const game = this.state.games[gameId];
    if (!game) {
      return;
    }
    game.players.push(createPlayer(game.map, connId));
    const conn = this.state.connections[connId];
    if (conn) {
      conn.gameId = gameId;
    }
    this.addSubscriber(gameId, connId);
  }
  removePlayer(gameId: GameId, connId: ConnectionId) {
    const game = this.state.games[gameId];
    if (!game) {
      return;
    }
    game.players = game.players.filter(p => p.id !== connId);

    this.removeSubscriber(gameId, connId);
  }
  joinGame(id: ConnectionId, gameId: GameId) {
    if (!this.state.games[gameId]) {
      this.state.games[gameId] = initialGameState();
    }
    const game = this.state.games[gameId];
    if (!game) {
      return;
    }
    this.addPlayer(gameId, id);
  }
  addConnection(id: ConnectionId, send: (message: ServerMessage) => void) {
    this.state.connections[id] = { id, send };
    this.joinGame(id, defaultGameId);
    this.broadcastGameState(defaultGameId);
  }
  removeConnection(id: ConnectionId) {
    const { state } = this;
    const conn = state.connections[id];
    if (conn?.gameId) {
      this.removeSubscriber(conn.gameId, id);
      this.removePlayer(conn.gameId, id);
      this.broadcastGameState(conn.gameId);
    }
    delete state.connections[id];
  }
  handleInput(connId: ConnectionId, input: PlayerInputState) {
    const conn = this.state.connections[connId];
    if (!conn || !conn.gameId) {
      return;
    }
    const game = this.state.games[conn.gameId];
    const player = game?.players.find(p => p.id === connId);
    if (player) {
      player.input = input;
      this.broadcastGameState(conn.gameId);
    }
  }
}
