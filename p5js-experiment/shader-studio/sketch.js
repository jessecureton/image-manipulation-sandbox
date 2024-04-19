// sketch.js is the p5.js sketch that handles loading the project and setting up our environment

state = new GlobalState();

function preload() {
  font = loadFont('../assets/Roboto-Regular.ttf');
  loadShaders();
  loadAndDuplicateImage('../sandbox/default2.jpg');
}

function setup() {
  configureUI();
}

function draw() {
  renderEffect();
  drawUI();
}
