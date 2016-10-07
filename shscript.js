var canvas;
var ctx;
var cw;
var ch;
var command = "end";
var score = 0;
var components = [];
var level = 0;
var bossHealth = 0;
var menuText1 = "1 - Single player, 2 - Two-player";
var menuText2 = "Player 1 controls: A, W, D, Spacebar";
var menuText3 = "Player 2 controls: Arrow keys, p";
var player1Name = "Player1";
var player2Name = "Player2";

var startGame = () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  cw = canvas.width;
  ch = canvas.height;
  window.addEventListener('keydown', keyControls, true);
  window.addEventListener('keyup', removeKeyControls, true);
  setInterval(updateArea, 0);
  setInterval(generatePlatform, 2000);
  setInterval(generateZombie, 2300);
}

var clear = () => ctx.clearRect(0,0,cw,ch)

var updateArea = () => {
  if(command == "start")
    newGame();
  if(command == "end")
    endGame();
}

var newGame = () => {
  clear();
  score += 1;
  if(score % 45000 == 0) {
    level++;
  }

  for(var i = 0; i < components.length; i++) {
    if(components[i].elType == "player") {
      for(var j = 0; j < components.length; j++) {
        if(j == i)
          continue;
          if(components[j].elType == "plat") {
            components[j].dirX = -0.5;
            collisionWall(components[i],components[j]);
            collisionFall(components[i],components[j]);
            if(components[i].collidesWith == true)
              break;
           }
        }
      }
    else if(components[i].elType == 'projectile') {
      for(var j = 0; j < components.length; j++) {
        if(components[j].elType == 'zombie')
          projectileHit(components[i], components[j]);
      }
    }
    else if(components[i].elType == "zombie") {
      for(var j = 0; j < components.length; j++) {
        if(j == i)
          continue;
        if(components[j].elType == "player")
          zombieHit(components[i], components[j]);
        else if(components[j].elType == "plat") {
          components[j].dirX = -0.5;
          collisionWall(components[i],components[j]);
          collisionFall(components[i],components[j]);
          if(components[i].collidesWith)
            break;
          }
      }
    }
  }
  var a = player1.exists;
  var b = player2.exists;
  var c = health2.exists;
  if(a)
    new Component(player1.x, player1.y, "#FF0000", player1.width,player1.height, player1.type, player1.elType);
  if(b)
    new Component(player2.x, player2.y, "#cc0099", player2.width, player2.height, player2.type, player2.elType);
  new Component(0,0, "#000000", 1024, 50, "color", "head");
  new HealthBar(health1.x, health1.y, health1.player);
  if(c)
    new HealthBar(health2.x,health2.y,health2.player);
  new ScoreBoard();
  for(var i = 0; i < components.length; i++) {
    components[i].changeState();
    components[i].update();
  }
  if(a && b) {
    components[components.length-1].exists = false;
    components[components.length-2].exists = false;
    components[components.length-3].exists = false;
    components[components.length-4].exists = false;
    components[components.length-5].exists = false;
    if(c)
      components[components.length-6].exists = false;
  }
  else if(a || b) {
    components[components.length-1].exists = false;
    components[components.length-2].exists = false;
    components[components.length-3].exists = false;
    components[components.length-4].exists = false;
    if(c)
      components[components.length-5].exists = false;
  }
  else {
    components[components.length-1].exists = false;
    components[components.length-2].exists = false;
    components[components.length-3].exists = false;
    if(c)
      components[components.length-4].exists = false;
    command = "end";
  }
  for(var i = 0; i < components.length; i++) {
    if(!components[i].exists)
      components.splice(i,1);
  }
}

var endGame = () => {
  clear();
  components.splice(0,components.length-1);
  gameScore.reset();
  player1.exists = true;
  player1.y = 0;
  player1.health = 5;
  player1.y = 0;
  player1.dirY = 0;
  player1.dirX = 0;
  player1.collidesWith = false;
  player1.dirFacing = 1;
  player1.gravity = 0.0005;
  player1.gravitySpeed = 0;
  player2.exists = true;
  player2.health = 5;
  player2.y = 0;
  player2.dirY = 0;
  player2.dirX = 0;
  player2.collidesWith = false;
  player2.dirFacing = 1;
  player2.gravity = 0.0005;
  player2.gravitySpeed = 0;
  plat1.x = 0;
  plat1.exists = true;
  plat2.x = 500;
  plat2.exists = true;
  plat3.x = 740;
  plat3.exists = true;
  health1.exists = true;
  player2.exists = true;
  gameScore.exists = true;
  components.push(gameScore);
  components.push(player1);
  components.push(player2);
  components.push(plat1);
  components.push(plat2);
  components.push(plat3);
  components.push(health1);
  components.push(health2);
  var bgMenu = new Menu("menu.png");
  bgMenu.update();

  score = 0;
  level = 0;
}

class Component {
  constructor(x, y, color, width, height, type, elType,name) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.elType = elType;
    this.type = type;
    if(this.type == "img") {
      this.image = new Image();
      this.image.src = color;
    }
    else {
      this.color = color;
    }
    this.exists = true;
    this.collidesWith = false;
    this.dirX = 0;
    this.dirY = 0;
    this.dirFacing = 1;
    this.exists = true;
    this.health = 5;
    this.name = name;
    if(this.elType == "player" || this.elType == "zombie") {
      this.gravity = 0.0005;
    }
    else {
      this.gravity = 0;
    }
    this.gravitySpeed = 0;
    components.push(this);
  }
  jump() {
    if(this.collidesWith == true) {
      this.collidesWith = false;
      this.dirY = -3.5;
    }
  }
  shoot() {
    if(this.exists) {
      new Component((this.x + this.width/2),(this.y + this.height/2 - 12), "#F0F32F",35,20,"color","projectile");
      if(this.dirFacing > 0)
        components[components.length-1].dirX = 3;
      else {
        components[components.length-1].dirX = -3;
        components[components.length-1].x = this.x -this.width/2;
      }
    }
  }
  changeState(e) {
    this.gravitySpeed += this.gravity;
    this.dirY += this.gravitySpeed;

    if( this.y <= -150 && this.dirY < 0 && this.elType == "player")
      this.dirY = 0;
    if(this.y >= ch && (this.elType == "player" || this.elType == "zombie")) {
      if(this.elType == "player") {
        this.health -= 1;
        if(this.health <= 0)
          this.exists = false;
        else {
          this.x = Math.floor(Math.random()*(1024-90)) + 1;
          this.y = 0;
          this.dirX = 0;
          this.dirY = 0;
          this.gravitySpeed = 0;
        }
      }
      else
        this.exists = false;
    }
    if(this.x <= 0 && (this.elType == "player" || this.elType == "zombie") && this.dirX < 0) {
      if(this.elType == "zombie")
        this.dirX = 2;
      else
        this.dirX = 0;
      this.x = 0;
    }
    if(this.x + this.width >= cw && (this.elType == "player" || this.elType == "zombie") && this.dirX > 0) {
      if(this.elType == "zombie")
        this.dirX = -2;
      else
        this.dirX = 0;
      this.x = cw - this.width;
    }
    if(this.x + this.width < 0 || this.x > cw)
      this.exists = false;

    this.x += this.dirX;
    this.y += this.dirY;
  }
  clearMove() {
    this.dirX = 0;
    this.isMoving = false;
  }
  update() {
    if(this.type == "img") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

class Menu {
  constructor(source) {
    this.image = new Image();
    this.image.src = source;
    this.text1 = menuText1;
    this.text2 = menuText2;
    this.text3 = menuText3;
  }
  update() {
    ctx.drawImage(this.image, 0, 0, 1024, 768);
    ctx.font = "50px Consolas";
    ctx.fillStyle = "#000000";
    ctx.fillText(this.text1,0.1*1024,0.2*768);
    ctx.font = "40px Consolas";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(this.text2,0.1*1024,0.7*768);
    ctx.fillText(this.text3,0.1*1024,0.7*768 + 70);
  }
  changeState() {
    this.text1 = menuText1;
    this.text2 = menuText2;
    this.text3 = menuText3;
  }
}

class HealthBar {
  constructor(x,y,player) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.currHealth = player.health;
    this.exists = true;
    components.push(this);
  }
  update() {
    ctx.font = "30px Consolas";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(this.player.name,this.x,this.y+25);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(this.x+140,this.y,150,30);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x+140,this.y,(this.player.health * 2 / 10 * 150),30);
  }
  changeState() {
    this.currHealth = this.player.health;
  }
}

class ScoreBoard {
  constructor() {
    this.text = "| Score : 0 |";
    components.push(this);
    this.exists = true;
  }
  update() {
    ctx.font = "30px Consolas";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(this.text,400,30);
  }
  changeState() {
    this.text = "| Score: " + score + " |";
  }
  reset() {
    this.text = "| Score : 0 |";
  }
}

var projectileHit = (projectile, zombie) => {
  if((projectile.x <= zombie.x + zombie.width && projectile.x + projectile.width >= zombie.x) &&
    ((((projectile.y >= zombie.y) && (projectile.y + projectile.height <= zombie.y + zombie.height))) ||
      ((projectile.y <= zombie.y) && (projectile.y + projectile.height >= zombie.y)) ||
        ((projectile.y <= zombie.y + zombie.height) && (projectile.y + projectile.height >= zombie.y + zombie.height)))) {
    projectile.exists = false;
    zombie.exists = false;
  }
}

var zombieHit = (zombie, player) => {
  if((zombie.x <= player.x + player.width && zombie.x + zombie.width >= player.x-5) &&
    ((((zombie.y >= player.y) && (zombie.y + zombie.height <= player.y + player.height))) ||
      ((zombie.y <= player.y) && (zombie.y + zombie.height >= player.y)) ||
        ((zombie.y <= player.y + player.height) && (zombie.y + zombie.height >= player.y + player.height)))) {
    player.health -= 1;
    if(player.health <= 0) {
      player.exists = false;
    }
    else {
    player.x = Math.floor(Math.random()*(1024-90)) + 1;
    player.y = 0;
    player.dirX = 0;
    player.dirY = 0;
    player.gravitySpeed = 0;
    }
  }
}

/*var playerChangeSides = () => {
  if(player1.x + player1.width > player2.x) {
    player1.dirFacing = -1;
    player2.dirFacing = 1;
  }
  if(player2.x + player2.width > player1.x) {
    player1.dirFacing = 1;
    player2.dirFacing = -1;
  }
}*/

var collisionWall = (player,platform) => {
  if(((player.x + player.width >= platform.x) &&
      (player.x + player.width <= platform.x + 5))  &&
    ((player.y < platform.y && (player.y + player.height > platform.y + platform.height) && (player.y + player.height > platform.y)) ||
      (player.y > platform.y && player.y < platform.y + platform.height) ||
        player.y < platform.y && (player.y + player.height < platform.y + platform.height) && player.y + player.height > platform.y)) {
        player.x = platform.x - player.width;
        if(player.elType == "zombie")
          player.dirX = - Math.abs(player.dirX);
        else {
          player.dirX = platform.dirX;
        }
      }
  else if(((player.x <= platform.x + platform.width && player.x >= platform.x + platform.width -1) &&
          (player.x + player.width >= platform.x + platform.width)) &&
          ((player.y < platform.y && (player.y + player.height > platform.y + platform.height) && (player.y + player.height > platform.y)) ||
            (player.y > platform.y && player.y < platform.y + platform.height) ||
              player.y < platform.y && (player.y + player.height < platform.y + platform.height) && player.y + player.height > platform.y)) {
            player.x = platform.x + platform.width;
            if(player.elType == "zombie")
              player.dirX = - player.dirX;
            else
              player.dirX = 0;
          }
}

var collisionFall = (player,platform) => {
  if(((player.x < platform.x && player.x + player.width > platform.x) ||
      (player.x >= platform.x && player.x + player.width <= platform.x + platform.width) ||
        (player.x <= platform.x + platform.width && player.x + player.width >= platform.x + platform.width)) &&
      ((player.y + player.height +5 >= platform.y) && (player.y + player.height <= platform.y + platform.height) &&
        (player.y < platform.y + platform.height))
              && player.dirY >= 0) {
        player.dirY = 0;
        player.gravitySpeed = 0;
        player.y = platform.y - player.height;
        player.collidesWith = true;
        player.gravity = 0;
        if(!player.isMoving && player.elType == "player")
          player.dirX = platform.dirX;
      }
  else {
    player.gravity = 0.0005;
    player.collidesWith = false;
  }
}
var background = new Component(0,0,"#FFFFFF", 1024, 768, "color", "bg");
var topBlock = new Component(0,0, "#000000", 1024, 50, "color", "head");
var plat1 = new Component(0,300,"rampTexture.jpg", 500, 30, "img", "plat");
var plat2 = new Component(500 , 600, "rampTexture.jpg", 600,30,"img", "plat");
var plat3 = new Component(740, 450, "rampTexture.jpg", 400, 30, "img", "plat");
var player1 = new Component(100,0, "#FF0000", 50, 75, "color", "player", "Player1");
var player2 = new Component(924,0, "#cc0099", 50, 75, "color", "player", "Player2");
var health1 = new HealthBar(20,7,player1);
var health2 = new HealthBar(710,7,player2);
var gameScore = new ScoreBoard();

var generatePlatform = () => {
  new Component(cw,Math.floor(Math.random()*(700+1)+120), "rampTexture.jpg", Math.random()*(300+1)+100, 30, "img", "plat");
}

var generateZombie = () => {
  var num = Math.floor(Math.random()*(3)+1);
  new Component(Math.floor(Math.random()*(980+1)+35),0, "#00ff00", 50, 75, "color", "zombie");
  if(Math.floor()*100 > 50)
    components[components.length-1].dirX = 2;
  else
    components[components.length-1].dirX = -2;
}

var keyControls = (e) => {
  if(e.keyCode == 38) {
    player2.jump();
    player2.isMoving = true;
  }
  if(e.keyCode == 37) {
    player2.dirX = -2;
    player2.dirFacing = -1;
    player2.isMoving = true;
  }
  if(e.keyCode == 39) {
    player2.dirX = 2;
    player2.dirFacing = 1;
    player2.isMoving = true;
  }
  if(e.keyCode == 80) {
    player2.shoot();
    player2.isMoving = true;
  }
  if(e.keyCode == 87) {
    player1.jump();
    player1.isMoving = true;
  }
  if(e.keyCode == 65) {
    player1.dirX = -2;
    player1.dirFacing = -1;
    player1.isMoving = true;
  }
  if(e.keyCode == 68) {
    player1.dirX = 2;
    player1.dirFacing = 1;
    player1.isMoving = true;
  }
  if(e.keyCode == 32) {
      player1.shoot();
      player1.isMoving = true;
  }
  if(e.keyCode == 49 && command == "end") {
    player2.exists = false;
    health2.exists = false;
    command = "start";
  }
  if(e.keyCode == 50 && command == "end") {
    command = "start";
  }
}

var removeKeyControls = () => {player1.clearMove(); player2.clearMove();}
