import bullet from "./bullet.png";
import player from "./player.png";
import tile0 from "./tile0.png";
import tile1 from "./tile1.png";

function createImage(src: string) {
  const img = new Image(16, 16);
  img.src = src;
  return img;
}
export const images = {
  bullet: createImage(bullet),
  player: createImage(player),
  tiles: [createImage(tile0), createImage(tile1)]
};
