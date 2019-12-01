import explosion from "./explosion.png";
import fireball from "./fireball.png";
import player0 from "./player0.png";
import player1 from "./player1.png";
import player2 from "./player2.png";
import tile0 from "./tile0.png";
import tile1 from "./tile1.png";
import heart0 from "./heart0.png";
import heart1 from "./heart1.png";

function createImage(src: string) {
  const img = new Image(64, 64);
  img.src = src;
  return img;
}
export const images = {
  explosion: createImage(explosion),
  fireball: createImage(fireball),
  players: [createImage(player0), createImage(player1), createImage(player2)],
  hearts: [createImage(heart0), createImage(heart1)],
  tiles: [createImage(tile0), createImage(tile1)]
};
