import { GameState, tileKey } from "./types";
import { images } from "./images";
import { mapHeight, mapWidth, tileSize } from "./constants";

function drawImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  scale: number,
  rotation: number
) {
  ctx.setTransform(scale, 0, 0, scale, x + tileSize / 2, y + tileSize / 2);
  ctx.rotate(rotation);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
}
function getAngle(dx: number, dy: number) {
  if (dx > 0 && dy === 0) {
    return Math.PI / 2;
  } else if (dx === 0 && dy > 0) {
    return Math.PI;
  } else if (dx < 0 && dy === 0) {
    return 1.5 * Math.PI;
  } else {
    return 0;
  }
}
export function renderScene(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.globalAlpha = 1.0;
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const tile = state.map.tiles[tileKey(x, y)];
      ctx.drawImage(
        images.tiles[tile.type],
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
  }
  for (let player of state.players) {
    for (let hp = 0; hp < player.hp; hp++) {
      ctx.drawImage(
        images.hearts[player.id],
        (mapWidth - 0.5) * tileSize * player.id +
          hp * (tileSize / 2) * (1 - 2 * player.id),
        0,
        tileSize / 2,
        tileSize / 2
      );
    }
  }

  for (let player of state.players) {
    drawImage(
      ctx,
      images.players[player.id],
      player.x * tileSize,
      player.y * tileSize,
      1.0,
      getAngle(player.lastDx ?? 0, player.lastDy ?? 0)
    );
  }
  for (let bullet of state.bullets) {
    drawImage(
      ctx,
      images.fireball,
      bullet.x * tileSize,
      bullet.y * tileSize,
      1.0,
      getAngle(bullet.dx ?? 0, bullet.dy ?? 0)
    );
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let explosion of state.explosions) {
    const { x, y } = explosion;
    const progress = explosion.progress / 50.0;
    const scale = Math.sqrt(progress);
    ctx.globalAlpha = 1 - progress;
    const size = tileSize * scale * (explosion.scale ?? 1);
    ctx.drawImage(
      images.explosion,
      (x + 0.5) * tileSize - size / 2,
      (y + 0.5) * tileSize - size / 2,
      size,
      size
    );
  }
}
