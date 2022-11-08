export class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
export class Speed {
  constructor(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }
}

export class Entity {
  constructor(position, height, width, color, speed, id) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.life = 5;
    this.points = 0;
    this.color = color;
    this.id = id;
  }

  //Creates imagedraw method for all classes
  draw(game) {
    game.context.drawImage(
      this.enemyImage,
      this.position.x,
      this.position.y + 2,
      this.width + 30,
      this.height + 30
    );
  }
  movement() {}
}

export class Player extends Entity {
  constructor(position, height, width, color, speed, id) {
    super(position, height, width, color, speed, id);

    this.up = false;
    this.left = false;
    this.right = false;
    this.shoot = false;
    this.reload = false;
    this.enemyImage = new Image();
    this.enemyImage.src = "Hero.png";
  }

  movement(game) {
    if (this.left) {
      this.position.x -= 400 * game.deltaTime;
    } else if (this.right) {
      this.position.x += 400 * game.deltaTime;
    }
    //Hinders movement outside map on -x axis, not +x axis (goes outside of map)
    if (this.position.x + this.width <= 0) {
      this.position.x = 0;
    } else if (this.position.x + this.width >= game.canvas.width) {
      this.position.x = this.width + game.canvas.width - 100;
    }
  }

  collision(game) {
    // Loops through undeads to collide with player
    for (let i = 0; i < game.undeads.length; i++) {
      let undead = game.undeads[i];
      if (
        undead.position.x < this.position.x + this.width &&
        undead.position.x + undead.width > this.position.x &&
        undead.position.y < this.position.y + this.height &&
        undead.height + undead.position.y > this.position.y
      ) {
        game.undeads.splice(i, 1);
        this.life -= 1;
      }
    }
  }
}

export class Bullet extends Player {
  constructor(position, speed, width, height, color) {
    super(position, speed, width, height, color);
    this.color = "yellow";
    this.speed = new Speed(800, 0);
  }
  //Draws rectangle instead of picture
  draw(game) {
    game.context.fillStyle = this.color;
    game.context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  movement(game) {
    this.position.x += this.speed.dx * game.deltaTime;
    this.position.y += this.speed.dy * game.deltaTime;
  }
  //Handles collision of bullets
  collision(game) {
    for (let i = 0; i < game.undeads.length; i++) {
      let undead = game.undeads[i];

      if (
        undead.position.x + 40 < this.position.x + this.width ||
        undead.position.y > this.position.y + this.height
      ) {
        game.bullets.splice(i, 1);
        undead.life -= 1;

        if (undead.life === 0) {
          game.undeads.splice(i, 1);
          game.player.points += 1;
        }
      }
    }
  }
}

export class Undead extends Entity {
  constructor(position, speed, height, width, life, color) {
    super(position, speed, height, width, life, color);
    this.color = "darkgreen";
    this.speed = new Speed(100, 0);
    this.life = 6;
    this.enemyImage = new Image();
    this.enemyImage.src = "Zombie.png";
  }

  movement(game) {
    this.position.x -= this.speed.dx * game.deltaTime;
  }
}

export class Mini extends Undead {
  constructor(position, speed, height, width, life, color) {
    super(position, speed, height, width, life, color);
    this.color = "purple";
    this.speed = new Speed(800, 0);
    this.life = 2;
    this.enemyImage = new Image();
    this.enemyImage.src = "Mini.png";
  }
}

export class Boss extends Undead {
  constructor(position, speed, height, width, life, color) {
    super(position, speed, height, width, life, color);
    this.color = "darkslategrey";
    this.speed = new Speed(300, 200);
    this.life = 12;
    this.enemyImage = new Image();
    this.enemyImage.src = "Boss.png";
  }

  movement(game) {
    this.position.x += this.speed.dx * game.deltaTime;
    this.position.y += this.speed.dy * game.deltaTime;
  }
  //Makes boss fly around irreguraly inside of map
  flight(game) {
    if (this.position.x + this.width <= 0) {
      this.speed.dx *= -1;
    } else if (this.position.x + this.width >= game.canvas.width - 100) {
      this.speed.dx *= -1;
    } else if (
      this.position.y >= game.canvas.height - this.height - 50 ||
      this.position.y <= 0
    ) {
      this.speed.dy *= -1;
    }
  }
}

export class BossAbilities extends Boss {
  constructor(position, speed, height, width, life, color, radius) {
    super(position, speed, height, width, life, color);
    this.color = "darkblue";
    this.speed = new Speed(0, 100);
    this.radius = 25;
    this.stroke = "aqua";
  }
  //Draws circle
  draw(game) {
    game.context.beginPath();
    game.context.fillStyle = this.color;
    game.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    game.context.fill();
    game.context.strokeStyle = this.stroke;
    game.context.stroke();
    game.context.closePath();
  }
  //Handles rectangles > circle collision
  checkabilityCollision(game, player) {
    if (this.abilityCollision(player)) {
      //Low damage so player can get away and ball does not instantly kill
      game.player.life -= 0.09;
    }
  }
  abilityCollision(player) {
    let cdx = Math.abs(this.position.x - player.position.x - player.width / 2);
    let cdy = Math.abs(this.position.y - player.position.y - player.width / 2);

    if (cdx > player.width / 2 + this.radius) {
      return false;
    }
    if (cdy > player.height / 2 + this.radius) {
      return false;
    }

    if (cdx <= player.width / 2) {
      return true;
    }
    if (cdy <= player.height / 2) {
      return true;
    }

    let distSquared =
      (cdx - player.width / 2) ** 2 + (cdy - player.height / 2) ** 2;
    return distSquared <= this.radius ** 2;
  }
}
