/* global createCanvas, createSprite, fill, push, pop, background, drawSprites, ellipse,
keyDown, Group, random, color, sqrt, loadImage
*/

var user;
var marimo;
var pixels;
var wall = {};
var img;
var imgWidth=30;
var imgHeight=30;
var time = 0;

const initSize = 10;
var moveSpeed = 1;
const morimoNum = 10;
const morimoSize = 60;
const pixelNum = 10;
const speedN = 0.3;
const wallThick = 10;



// 滑鼠控制玩家座標用的參數
let x = 1;
let y = 1;
let easing = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = loadImage(
    "https://cdn.glitch.com/c931478e-36db-4e50-99e6-116153893e75%2Fmarimo.png?v=1617334781009"
  );

  addWall();
  addMorimos();
  addUser();
  addPixels();
}

function draw() {
  background(0, 0, 0);
  img.resize(imgWidth, imgHeight);
  time++;
  if (time % 50 == 0) addPixel();

  userMovement();

  user.collide(pixels, function(u, other) {
    other.remove();
    u.width++;
  });
  user.collide(marimo, function(u, other) {
    //if (u.width <= other.width) {
    let w = u.width;
    other.width += 1;
    u.width -= 1;
    if (u.width <= 0) {
      u.remove();
      setTimeout(() => {
        alert("Game Over!");
      }, 1000);
    }
    //}
  });
  marimo.collide(pixels, function(m, other) {
    other.remove();
    m.width++;
    imgWidth++;
    imgHeight++;
    
  });

  marimo.bounce(marimo);
  marimo.bounce(wall.t);
  marimo.bounce(wall.b);
  marimo.bounce(wall.l);
  marimo.bounce(wall.r);
  user.collide(wall.t);
  user.collide(wall.b);
  user.collide(wall.l);
  user.collide(wall.r);

  drawSprites();
}

function addWall() {
  wall.t = createSprite(
    windowWidth / 2,
    -wallThick / 2,
    windowWidth + wallThick * 2,
    wallThick
  );
  wall.t.immovable = true;

  wall.b = createSprite(
    windowWidth / 2,
    windowHeight + wallThick / 2,
    windowWidth + wallThick * 2,
    wallThick
  );
  wall.b.immovable = true;

  wall.l = createSprite(
    -wallThick / 2,
    windowHeight / 2,
    wallThick,
    windowHeight
  );
  wall.l.immovable = true;

  wall.r = createSprite(
    windowWidth + wallThick / 2,
    windowHeight / 2,
    wallThick,
    windowHeight
  );
  wall.r.immovable = true;
}

function addUser() {
  user = createSprite(400, 200, initSize, initSize);
  user.draw = function() {
    fill(255, 255, 255);
    this.setCollider("circle", 0, 0, this.width / 2);
    ellipse(0, 0, this.width, this.width);
  };
}

function addMorimos() {
  imgWidth = 30;
  imgHeight = 30;
  marimo = new Group();
  for (var i = 0; i < morimoNum; i++) {
    var size = morimoSize + random(-5, 10);
    var m = createSprite(
      random(0, windowWidth),
      random(0, windowHeight),
      size,
      size
    );

    m.addImage(img);
    
    randomMSpeed(m);

//     m.draw = function() {
//       // fill(255, 200, 200);
//       ellipse(0, 0, this.width, this.width);

//       this.setCollider("circle", 0, 0, this.width / 2);
//       if (random(1000) < 1) randomMSpeed(this);
//     };
    
    marimo.add(m);
  }
  marimo.collide(marimo);
}

function randomMSpeed(m) {
  m.setSpeed(speedN+moveSpeed, random(0, 360));
  // let randomSign = random(100) < 50 ? -1 : 1;
  // m.velocity.x = random(-speedN, speedN);
  // m.velocity.y = sqrt(speedN ** 2 - m.velocity.x ** 2) * randomSign;
  // console.log(m.velocity.x, m.velocity.y, speedN ** 2 - m.velocity.x * 2);
}

function addPixels() {
  pixels = new Group();
  for (var i = 0; i < pixelNum; i++) {
    addPixel();
  }
}

function addPixel() {
  var size = morimoSize + random(-5, 10);
  var p = createSprite(random(0, windowWidth), random(0, windowHeight), 5, 5);
  //p.color = color(255,255,255);
  pixels.add(p);
}

// 用滑鼠來控制玩家位置
function userMovement() {
  let targetX = mouseX;
  let dx = targetX - x;
  x += dx * easing;

  let targetY = mouseY;
  let dy = targetY - y;
  y += dy * easing;

  user.position.y = y;
  user.position.x = x;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
