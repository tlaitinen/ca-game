import { GameState, tileKey } from "./types";
import { images } from "./images";
import { mapHeight, mapWidth, tileSize } from "./constants";

export function renderScene(ctx: CanvasRenderingContext2D, state: GameState) {
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
    ctx.drawImage(
      images.player,
      player.x * tileSize,
      player.y * tileSize,
      tileSize,
      tileSize
    );

    ctx.font = "20px Georgia";
    ctx.fillText(
      player.hp.toString(),
      player.id ? (mapWidth - 1) * tileSize : 0,
      20
    );
  }
  for (let bullet of state.bullets) {
    ctx.drawImage(
      images.bullet,
      bullet.x * tileSize,
      bullet.y * tileSize,
      tileSize,
      tileSize
    );
  }
}
