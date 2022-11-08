//Add player movement.
import { game } from "./game.js";
export function keyPressed(event) {
  if (event.repeat) return;

  if (event.key === "d") {
    game.player.right = true;
  } else if (event.key === "a") {
    game.player.left = true;
  } else if (event.key === "g") {
    game.player.reload = true;
  }
}

export function keyUp(event) {
  if (event.repeat) return;

  if (event.key === "d") {
    game.player.right = false;
  } else if (event.key === "a") {
    game.player.left = false;
  } else if (event.key === "g") {
    game.player.reload = false;
  }
}
//Add ammunition to be fired when pressed
export function keyPressShoot(event) {
  if (event.repeat) return;

  if (event.key === "o") {
    game.bullets.shoot = true;
  }
}

export function keyUpShoot(event) {
  if (event.repeat) return;

  if (event.key === "o") {
    game.bullets.shoot = false;
  }
}
