import { mapWidth } from './constants';

export type PlayerInputKey = 'up' | 'down' | 'left' | 'right' | 'shoot';
export type PlayerInputState = Partial<Record<PlayerInputKey, boolean>>;
export type PlayerInputHandler = (state: PlayerInputState) => void;

export type Player = {
  id: number;
  x: number;
  y: number;
  hp: number;
  targetX?: number;
  targetY?: number;
  shootCooldown?: number;
  lastDx?: number;
  lastDy?: number;
  input: PlayerInputState;
};
export type Bullet = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  playerId: number;
  collided?: boolean;
};
export type Explosion = {
  x: number;
  y: number;
  progress: number;
  scale?: number;
};
export type Tile = {
  type: number;
};
export type GameMap = {
  tiles: Array<Tile>;
};

export type GameState = {
  players: Array<Player>;
  bullets: Array<Bullet>;
  explosions: Array<Explosion>;
  map: GameMap;
};

export type ConnectionId = string;
export type GameId = string;
export type Connection = {
  id: ConnectionId;
  games: GameId;
};
export type ServerState = {
  connections: Record<ConnectionId, Connection>;
  games: Record<GameId, GameState>;
};
export type ServerMessage = { type: 'state'; payload: Partial<GameState> };
export type ClientMessage = { type: 'input'; payload: PlayerInputState };
