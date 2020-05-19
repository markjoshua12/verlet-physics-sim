
const NUM_PARTICLES = 0;
const SIZE = 5;
const STEPS = 4;

const GRID_SIZE = 40;

var grid_w, grid_h;
var grid = [];

var particles = [];
var constraints = [];

var initGravityX = 0;
var initGravityY = 0.1;
var gravity = null;

var mouseType = 'DRAG';

var dragDist = 60;
var currP = null;
var delta = null;

var drawCircle = false;

function setup() {
  let canvas = createCanvas(600, 600);
  // let x = (windowWidth - width) / 2;
  // let y = (windowHeight - height) / 2;
  // canvas.position(x, y);
  canvas.parent("sketch");
  
  gravity = createVector(0, 0);
  
  clothXMargin = (width - (clothWidth * clothSpacing)) / 2;
  
  // createSpiderWebSim();
  createClothSim();
  
  // Random particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    let p = new Particle(random() * width, random() * height);
    p.px += random() * 2 - 1;
    p.py += random() * 2 - 1;
    particles.push(p);
  }
  
  constrainPoints();
  
  grid_w = floor(width / GRID_SIZE);
  grid_h = floor(height / GRID_SIZE);
  
  for (let i = 0; i < grid_w * grid_h; i++)
    grid.push([]);
  
  for (let i = 0; i < particles.length; i++) {
    let cx = floor(particles[i].x / GRID_SIZE);
    let cy = floor(particles[i].y / GRID_SIZE);
    grid[cx + cy * grid_w].push(particles[i]);
  }
  
  // mouseUseBtn = createButton(mouseType);
  // mouseUseBtn.mousePressed(function() {
  //   if (mouseType == 'DRAG')
  //     mouseType = 'CREATE';
  //   else if (mouseType == 'CREATE')
  //     mouseType = 'DRAG';
  // });
  
  createDiv('Wind');
  gravityXSlider = createSlider(-1, 1, initGravityX, 0.01);
  createDiv('Gravity');
  gravityYSlider = createSlider(-1, 1, initGravityY, 0.01);
}

function draw() {
  
  background(125);
  
  gravity.x = gravityXSlider.value();
  gravity.y = gravityYSlider.value();
  
  updateParticles();
  for (let i = 0; i < STEPS; i++) {
    
    updateConstraints();
    constrainPoints();
  }
  
  for (let i = 0; i < grid.length; i++)
    grid[i] = [];
  
  for (let i = 0; i < particles.length; i++) {
    let cx = floor(particles[i].x / GRID_SIZE);
    let cy = floor(particles[i].y / GRID_SIZE);
    grid[cx + cy * grid_w].push(particles[i]);
  }
  
  if (mouseIsPressed) {
    if (currP) {
      currP.x = mouseX;
      currP.y = mouseY;
    } else {
      currP = getParticleAt(mouseX, mouseY);
    }
  } else {
    currP = null;
  }
  
  stroke(100);
  for (let x = 0; x < grid_w; x++) {
    line(x * GRID_SIZE, 0, x * GRID_SIZE, height);
  }
  for (let y = 0; y < grid_h; y++) {
    line(0, y * GRID_SIZE, width, y * GRID_SIZE);
  }
  
  if (drawCircle) {
    noStroke();
    for (let i = 0; i < particles.length; i++) {
      let c = ((webRings - i % webRings) / webRings) * 255;
      fill(c, 0, 255 - c);
      circle(particles[i].x, particles[i].y, SIZE);
    }
  }
  
  // noStroke();
  // fill(255, 255, 0);
  // for (let i = 0; i < clothWidth; i++) {
  //   circle(particles[i].x, particles[i].y, SIZE);
  // }
  
  // Draw the constraints
  stroke(0);
  for (let i = 0; i < constraints.length; i++) {
    let c = constraints[i];
    line(c.p1.x, c.p1.y, c.p2.x, c.p2.y);
  }
  
  fill(255);
  text('Particles: ' + particles.length + ' | Constraints: ' + constraints.length, 12, 12);
  text('Gravity: ' + gravity.x + ', ' + gravity.y, 12, 24);
  text('FPS: ' + frameRate(), 12, 38);
  text('Delta: ' + deltaTime, 12, 50);
  
}

function mousePressed() {
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
    return;
  if (mouseButton == RIGHT)
    createTriangle(mouseX, mouseY, 100);
  
  // let p = new Particle(mouseX, mouseY);
  // p.px += random() * 2 - 1;
  // p.py += random() * 2 - 1;
  // constraints.push(new Constraint(particles[particles.length - 1], p, random() * 10 + 10));
  // particles.push(p);
}

function getParticleAt(x, y) {
  let cx = floor(x / GRID_SIZE);
  let cy = floor(y / GRID_SIZE);
    
  for (let x0 = cx - 1; x0 < cx + 1; x0++) {
    for (let y0 = cy - 1; y0 < cy + 1; y0++) {
      if (x0 < 0 || x0 >= grid_w || y0 < 0 || y0 >= grid_h)
        continue;
      let cell = grid[x0 + y0 * grid_w];
      for (let i = 0; i < cell.length; i++) {
        let pDistX = (cell[i].x - x);
        let pDistY = (cell[i].y - y);
        if (pDistX * pDistX + pDistY * pDistY < dragDist)
          return cell[i];
      }
    }
  }
  return null;
}

function updateParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let old_x = p.x;
    let old_y = p.y;
    
    if (p.invmass > 0) {
      p.x += gravity.x;
      p.y += gravity.y;
    
      p.x += (p.x - p.px);
      p.y += (p.y - p.py);
    }
    
    p.px = old_x;
    p.py = old_y;
    
  }
}

function updateConstraints() {
  for (let i = 0; i < constraints.length; i++) {
    let c = constraints[i];
    let dx = c.p1.x - c.p2.x;
    let dy = c.p1.y - c.p2.y;
    if (dx == 0 && dy == 0) {
      dx += Math.random() * 0.1;
      dy += Math.random() * 0.1;
    }
    
    // let d = Math.sqrt((dx * dx) + (dy * dy));
    // if (!c.pushing && d < c.l)
    //   continue;
    // let percent = ((d - c.l) *
    //                (c.p1.invmass + c.p2.invmass)) /
    //                d;
    
    // Squared dist for optimization
    let dSq = (dx * dx) + (dy * dy);
    if (!c.pushing && dSq < c.lSq)
      continue;
    let percent = ((dSq - c.lSq) *
                   (c.p1.invmass + c.p2.invmass)) /
                   dSq;
    
    let offx1 = dx * percent * c.p1.invmass;
    let offy1 = dy * percent * c.p1.invmass;
    let offx2 = dx * percent * c.p2.invmass;
    let offy2 = dy * percent * c.p2.invmass;
    
    c.p1.x -= offx1;
    c.p1.y -= offy1;
    c.p2.x += offx2;
    c.p2.y += offy2;
    
  }
}

function constrainPoints() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    if (p.x < SIZE) {
      p.x = SIZE;
    } else if (p.x >= width - SIZE) {
      p.x = width - SIZE;
    }
    
    if (p.y < SIZE) {
      p.y = SIZE;
    } else if (p.y >= height - SIZE) {
      p.y = height - SIZE;
    }
  }
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.px = x;
  this.py = y;
  this.invmass = 0.3;
}

function Constraint(p1, p2, l, pushing = true) {
  this.p1 = p1;
  this.p2 = p2;
  this.l = l;
  this.lSq = l * l;
  this.pushing = pushing;
}

function createTriangle(x, y, size) {
  for (let i = 0; i < 3; i++) {
    p = new Particle(x + random() * size - size/2,
                     y + random() * size - size/2);
    if (i > 0) {
      c = new Constraint(
        particles[particles.length - 1], p, size);
      constraints.push(c);
      if (i == 2)
        constraints.push(new Constraint(
          particles[particles.length - 2], p, size));
    }
    particles.push(p);
  }
}

let clothWidth = 25;
let clothHeight = 15;
let clothSpacing = 16;
let clothConstraintLength = 20;
let clothAttachPoints = 6;

let clothXMargin = null;

function createClothSim() {
  for (let y = 0; y < clothHeight; y += 1) {
    for (let x = 0; x < clothWidth; x += 1) {
      let p = new Particle(x * clothSpacing + clothXMargin,
                           y + 50);
      p.px += random() * 5 - 2.5;
      
      if (x > 0) {
        constraints.push(new Constraint(
          particles[x - 1 + y * clothWidth],
          p,
          clothConstraintLength, false));
      }
      if (y > 0) {
        constraints.push(new Constraint(
          particles[x + (y - 1) * clothWidth],
          p,
          clothConstraintLength, false));
      } else {
        if (y == 0 && x % clothAttachPoints == 0)
          p.invmass = 0;
      }
      particles.push(p);
    }
  }
}


let webPoints = 40;
let webRings = 12;
let webSize = 200;
let webSpacing = 12;
let angleStep = 0.5;

function createSpiderWebSim() {
  let angleStep = TWO_PI / webPoints;
  for (let i = 0; i < webPoints; i++) {
    for (let j = 0; j < webRings; j++) {
      let a = i * angleStep;
      let s = ((webRings - j) / webRings) * webSize;
      let p = new Particle(width/2 + s * sin(a),
                             height/2 + s * cos(a));
      let spacing = webSpacing;

      if (particles.length > 0) {
        if (j > 0) {
        constraints.push(new Constraint(
          particles[particles.length - 1],
          p,
          spacing));
        }
        if (i > 0) {
          constraints.push(new Constraint(
            particles[particles.length - webRings],
            p,
            spacing));
        }
        if (i == webPoints - 1) {
          constraints.push(new Constraint(
            particles[j],
            p,
            spacing));
        }
      }
      if (j == 0)
        p.invmass = 0;

      particles.push(p);
    }
  }
}