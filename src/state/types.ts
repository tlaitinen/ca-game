export type PlayerInputKey = 'up' | 'down' | 'left' | 'right' | 'shoot';
export type PlayerInputState = Partial<Record<PlayerInputKey, boolean>>;
export type PlayerInputHandler = (state: PlayerInputState) => void;

export type ConnectionId = string;

export const playerTypes = 2;

export type Player = {
  id: ConnectionId;
  type: number;
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
  playerId: ConnectionId;
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
export type ServerMessage = { type: 'state'; payload: Partial<GameState> };
export type ClientMessage = { type: 'input'; payload: PlayerInputState };

export type GameId = string;
export type Connection = {
  id: ConnectionId;
  gameId?: GameId;
  send: (message: ServerMessage) => void;
};
export type ServerState = {
  connections: Record<ConnectionId, Connection | undefined>;
  games: Record<GameId, GameState | undefined>;
  subscribers: Record<GameId, Set<ConnectionId> | undefined>;
};
