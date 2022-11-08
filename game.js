import {
  Player,
  Bullet,
  Position,
  Speed,
  Undead,
  Boss,
  BossAbilities,
  Mini,
} from "./entity.js";
import { Map } from "./Map.js";

class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.lastTime = Date.now();
    this.deltaTime = 0;
    this.map = new Map(canvas.width, canvas.height);
    this.entities = [
      new Player(
        new Position(canvas.width / 4, canvas.height - 70),
        40,
        50,
        "lightblue",
        new Speed(100, 0)
      ),
      new Boss(new Position(500, 300), 150, 150),
    ];
    this.player = this.entities[0];
    this.bosses = this.entities[1];

    this.bullets = [];
    this.undeads = [];
    this.bossAbilities = [];
  }

  start() {
    animate();
  }
  playerFunctions() {
    if (this.player.life > 0) {
      this.player.draw(this);
      this.player.movement(this);
      this.player.collision(this);
    }
  }

  bossFunctions() {
    if (this.player.points < 15) {
      this.bosses.draw(this);
      this.bosses.movement(this);
      this.bosses.flight(this);
    }
  }

  viewInstructions() {
    context.font = "15px Arial";
    context.strokeText('Press "o" to shoot', 5, 20);
    context.strokeText('Press "a" to go left. Press "d" to go right.', 5, 40);
    context.strokeText('Press "g" to reload game.', 5, 60);
  }
  calculatePoints() {
    context.font = "30px Arial";
    context.strokeText("Points: " + this.player.points, 600, 40);

    //Handles if game is won
    if (game.player.points >= 15) {
      context.font = "40px Arial";
      context.fillStyle = "Gold";
      context.fillText(
        "Holy Moly, you saved the world",
        game.player.position.x,
        canvas.height / 2
      );
    }

    //Handles if the game is lost
    if (game.player.life <= 0) {
      context.font = "60px Arial";
      context.fillStyle = "red";
      context.fillText("GAME OVER", canvas.width / 4, canvas.height / 2);
      context.strokeText(
        "Try again? Press G",
        game.bosses.position.x,
        game.bosses.position.y
      );
    }
  }
}

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
export let game = new Game(canvas, context);

//Sets framecount so we can have different spawnrates
let frameCount = 0;

let bulletSpawnRate = 15;
let undeadSpawnRate = 200;
let bossAbilitySpawnRate = 80;

function animate() {
  let currentTime = Date.now();
  game.deltaTime = (currentTime - game.lastTime) / 1000;
  game.lastTime = currentTime;
  frameCount++;

  context.clearRect(0, 0, canvas.width, canvas.height);

  //Calling map functions
  game.map.backgroundDraw(context);
  game.map.updateBackground();

  //Calling player functions
  game.playerFunctions(game);
  game.bossFunctions(game);

  //Calling bullet functions
  for (let i = 0; i < game.bullets.length; i++) {
    let bullet = game.bullets[i];
    bullet.draw(game);
    bullet.movement(game);
    bullet.collision(game);
    if (bullet.position.x > canvas.width) {
      game.bullets.splice(i, 1);
    }
  }

  //Calling Enemy functions
  for (let i = 0; i < game.undeads.length; i++) {
    let undead = game.undeads[i];
    undead.draw(game);
    undead.movement(game);
  }
  //Bossability functions
  for (let i = 0; i < game.bossAbilities.length; i++) {
    let abilities = game.bossAbilities[i];
    abilities.draw(game);
    abilities.movement(game);
    abilities.checkabilityCollision(game, game.player);

    if (abilities.position.y + abilities.height > canvas.height) {
      game.bossAbilities.splice(i, 1);
    }
  }
  //Draws out bullets, undeads, minis and bossabilites. Stops drawing if player is dead.
  if (game.player.life > 0) {
    if (frameCount % bulletSpawnRate == 0) {
      if (game.bullets.shoot) {
        game.bullets.push(
          new Bullet(
            new Position(
              game.player.position.x + game.player.width + 25,
              game.player.position.y + game.player.height - 14
            ),

            3,
            5
          )
        );
      }
    }
  }

  if (game.player.points < 15) {
    //spawn enemies
    if (frameCount % undeadSpawnRate == 0) {
      game.undeads.push(
        new Undead(new Position(canvas.width, canvas.height - 80), 50, 60)
      );
      game.undeads.push(
        new Mini(new Position(canvas.width, canvas.height - 70), 40, 40)
      );
    }
    if (frameCount % bossAbilitySpawnRate == 0) {
      game.bossAbilities.push(
        new BossAbilities(
          new Position(
            game.bosses.position.x + game.bosses.width,
            game.bosses.position.y + game.bosses.height - 30
          ),
          5,
          15
        )
      );
    }
  }

  //restart the game
  if (game.player.reload) {
    location.reload();
  }
  game.viewInstructions(game);
  game.calculatePoints(game);
  requestAnimationFrame(animate);
}
