//Main file to import to and start game from
import { game } from "./game.js";
import { keyPressed, keyPressShoot, keyUp, keyUpShoot } from "./event.js";

game.start();

window.addEventListener("keypress", keyPressed);
window.addEventListener("keyup", keyUp);
window.addEventListener("keypress", keyPressShoot);
window.addEventListener("keyup", keyUpShoot);
