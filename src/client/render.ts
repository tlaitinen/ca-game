import { GameState, ConnectionId } from '../state/types';
import { images } from '../images';
import { mapHeight, mapWidth, tileSize } from '../state/constants';
import { getTile } from 'state/map';

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
export function renderScene(
  canvas: HTMLCanvasElement,
  state: GameState,
  connId: ConnectionId
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  const { width, height } = canvas;

  ctx.imageSmoothingEnabled = false;

  const myPlayer = state.players.find(p => p.id === connId);

  const offsetX = width / 2 - (myPlayer?.x ?? 0) * tileSize;
  const offsetY = height / 2 - (myPlayer?.y ?? 0) * tileSize;

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.globalAlpha = 1.0;
  ctx.clearRect(0, 0, width, height);
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fill();
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      ctx.drawImage(
        images.tiles[0],
        offsetX + x * tileSize,
        offsetY + y * tileSize,
        tileSize,
        tileSize
      );
      const tile = getTile(state.map, x, y);
      if (tile.type > 0) {
        ctx.drawImage(
          images.tiles[tile.type],
          offsetX + x * tileSize,
          offsetY + y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
  if (myPlayer) {
    for (let hp = 0; hp < myPlayer.hp; hp++) {
      ctx.drawImage(
        images.hearts[0],
        hp * (tileSize / 2),
        0,
        tileSize / 2,
        tileSize / 2
      );
    }
  }

  for (const player of state.players) {
    drawImage(
      ctx,
      images.players[player.type],
      offsetX + player.x * tileSize,
      offsetY + player.y * tileSize,
      1.0,
      getAngle(player.lastDx ?? 0, player.lastDy ?? 0)
    );
  }
  for (const bullet of state.bullets) {
    drawImage(
      ctx,
      images.fireball,
      offsetX + bullet.x * tileSize,
      offsetY + bullet.y * tileSize,
      1.0,
      getAngle(bullet.dx ?? 0, bullet.dy ?? 0)
    );
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const player of state.players) {
    const shootCooldown = player.shootCooldown ?? 0;
    if (shootCooldown > 0) {
      ctx.beginPath();
      ctx.moveTo(
        offsetX + player.x * tileSize,
        offsetY + player.y * tileSize - 5
      );
      ctx.lineTo(
        offsetX + player.x * tileSize + shootCooldown,
        offsetY + player.y * tileSize - 5
      );
      ctx.strokeStyle = player.type % 2 === 0 ? '#ff8888' : '#8888ff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  for (let explosion of state.explosions) {
    const { x, y } = explosion;
    const progress = explosion.progress / 50.0;

    const scale = Math.sqrt(progress);
    ctx.globalAlpha = progress < 0.5 ? 1 : 1 - 2 * (progress - 0.5);
    const size = tileSize * scale * (explosion.scale ?? 1);
    ctx.drawImage(
      images.explosion,
      offsetX + (x + 0.5) * tileSize - size / 2,
      offsetY + (y + 0.5) * tileSize - size / 2,
      size,
      size
    );
  }
}
