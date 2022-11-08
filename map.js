export class Map {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.image = new Image();
    this.image.src = "background.jpg";
    this.x = 0;
    this.y = 0;
    this.width = innerWidth;
    this.height = innerHeight;
    this.speed = 10;
  }
  //Draws two images
  backgroundDraw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
  //Updates the background continuesly. Creates illusion of endless running background
  updateBackground() {
    this.x -= this.speed;
    if (this.x < 0 - this.width) {
      this.x = 0;
    }
  }
}
