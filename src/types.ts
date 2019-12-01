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
  tiles: {
    [tileKey: string]: Tile;
  };
};
export function tileKey(x: number, y: number) {
  return (x | 0).toString() + "," + (y | 0).toString();
}
export type GameState = {
  players: Array<Player>;
  bullets: Array<Bullet>;
  explosions: Array<Explosion>;
  map: GameMap;
};

export type PressedKeys = Array<boolean>;
