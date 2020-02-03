var scoreMap = new Array(256), n, m, maze, mazeAux;
var cellSize, cellSized2, colorMap = new Array(256), rotationMap = new Array(256);
var pause = false, nextStep = false, finished = true, movementDelay = 100, pauseDelay = 1000, maxDelay = 2000, minDelay = 100;
var currentI, currentJ, currentScore, bestScore;
let di = [0, 1, 0, -1], dj = [1, 0, -1, 0];
let dir = ['>', 'v', '<', '^'];
let startButton;
let bestPath = '';

function preload() {
  n = localStorage.getItem('lines');
  m = localStorage.getItem('cols');
  mazeAux = localStorage.getItem('maze');
  bestScore = 0;
  currentScore = 0;
}

function initMaze() {
  maze = new Array(n);
  let cont = 0;
  for(let i = 0; i < n; i++) {
    maze[i] = new Array(m); 
    let lineT = '';
    for(let j = 0; j < m; j++){
      maze[i][j] = mazeAux[cont];
      cont++;
    }
    cont++;
  }
}

function setup() {
  createCanvas(900, 600).parent('visualization');
  angleMode(DEGREES);
  textSize(22);

  initMaze();

  for (var i = 0; i < 256; i ++) {
    scoreMap[i] = 0;
  }
  scoreMap['\n'] = 0;
  scoreMap['.'] = 0; 
  scoreMap['b'] = 1;
  scoreMap['p'] = 5;
  scoreMap['o'] = 10;
  scoreMap['d'] = 50;

  colorMap['b'] = color(205, 127, 50);
  colorMap['p'] = color(192, 192, 192);
  colorMap['o'] = color(255, 215, 0);
  colorMap['d'] = color(0, 255, 255);
  colorMap['y'] = color(0, 0, 255);
  
  rotationMap['^'] = 180;
  rotationMap['v'] = 0;
  rotationMap['>'] = 270;
  rotationMap['<'] = 90;

  cellSize = min(width, height) / max(n, m);
  cellSized2 = cellSize / 2.0;
}

function drawArrow(i, j) {
  push();
  translate(j * cellSize + cellSized2, i * cellSize + cellSized2);
  rotate(rotationMap[maze[i][j]]);
  rect(-cellSized2 / 8.0, -cellSized2 / 2.0, cellSized2 / 4.0, cellSized2 / 2.0);
  triangle(-cellSized2 / 4.0, 0, cellSized2 / 4.0, 0, 0, cellSized2 / 2.0);
  pop();
}

function drawCell(i, j) {
  fill(255, 255, 255);
  if (maze[i][j] == '#')
    fill(50, 50, 50);
  rect(j * cellSize, i * cellSize, cellSize, cellSize);

  if (maze[i][j] == '^' || maze[i][j] == 'v' || maze[i][j] == '>' || maze[i][j] == '<') {
    fill(255, 0, 255);
    drawArrow(i, j);
  } else if (maze[i][j] >= 'a' && maze[i][j] <= 'z') {
    fill(colorMap[maze[i][j]])
    ellipse(j * cellSize + cellSized2, i * cellSize + cellSized2, cellSized2);
  }
}

function drawMaze() {
  for (var i = 0; i < n; i ++) {
    for (var j = 0; j < m; j ++) {
      drawCell(i, j);
    }
  }
}

function draw() {
  background(255 * pause, 255 * !pause, 0);

  drawMaze();

  fill(0, 0, 0);
  text("current: (" + str(currentI) + ", " + str(currentJ) + ") " + str(currentScore), width - 290, 50);
  var x = width - 290;
  var y = [400, 450, 500];
  text("best: " + str(bestScore), width - 290, 100);
  text("s - start", width - 290, 400, width - 190, 450);
  if(mouseIsPressed) {
    if(finished && mouseX >= width - 290 && mouseX < width - 200 && mouseY >= y[0] && mouseY < 420) {
      bestScore = 0;
      finished = false;
      if(!invalid(0,0))
        go();
    }
  }
  text("p - pause", width - 290, 460);
  text("n - next step", width - 290, 500);
}

function keyReleased() {
  if (key == 'p' || key == 'P')
    pause = !pause, nextStep = false;
  if (key == 'n' || key == 'N')
    pause = false, nextStep = true;
  if ((key == 's' || key == 'S') && finished && !invalid(0, 0)) {
    bestScore = 0, finished = false;
    go();
  }
}

function checkNextStep() {
  if (nextStep == true)
    pause = true, nextStep = false;
}

async function sleep(ms) {
  if (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(function() { resolve(); }, ms);
    });
  }
}

async function drawDelay() {
  while (pause) await sleep(pauseDelay);
  await sleep(movementDelay);
}

function invalid(ni, nj) {
  return ni < 0 || nj < 0 || ni >= n || nj >= m ||
  maze[ni][nj] == '#' || maze[ni][nj] == 'y' ||
  maze[ni][nj] == '<' || maze[ni][nj] == '>' ||
  maze[ni][nj] == 'v' || maze[ni][nj] == '^';
}


async function go(i = 0, j = 0, score = 0) { 
  checkNextStep();
  let prv = maze[i][j];
  if(!maze[i][j]) scoreMap[maze[i][j]] = 0;
  score += scoreMap[maze[i][j]];
  currentI = i, currentJ = j, currentScore = score;
  bestScore = max(bestScore, score);
  maze[i][j] = 'y';
  await drawDelay();

  for (var k = 0; k < 4; k ++) {
    let ni = i + di[k], nj = j + dj[k];
    if (invalid(ni, nj)) continue;

    maze[i][j] = dir[k]
    await go(ni, nj, score);

    maze[i][j] = 'y';
    await drawDelay();
  }
  
  maze[i][j] = prv;
  currentI = i, currentJ = j, currentScore = score;
  checkNextStep();
  if (i == 0 && j == 0) {
    finished = true;
  }
}
