let img;        // The original image instance from the file input
let effectImg;  // The image instance that will be modified by effects
let sel;        // The dropdown menu for effects

function preload() {
  loadAndDuplicateImage('default.png');  // Load a default image
}

function loadAndDuplicateImage(path_or_data) {
  img = loadImage(path_or_data, function() {
    effectImg = createImage(img.width, img.height);
    effectImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  });
}

function setup() {
  noCanvas();
  let e = createCanvas(windowWidth, windowHeight);
  e.style('display', 'block');
  e.style('margin', '0');
  e.style('padding', '0');
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  // Create file input button
  input = createFileInput(handleFile);
  input.position(0, 0);

  // Create dropdown menu for effects
  sel = createSelect();
  sel.position(0, 30);
  sel.option('None');
  sel.option('Test - Brighten Image');
  sel.option('Effect 2');
  sel.changed(applyEffect);
}

function handleFile(file) {
  if (file.type === 'image') {
    loadAndDuplicateImage(file.data);
  } else {
    img = null;
    effectImg = null;
  }
}

function draw() {
  background(220);
  if (img) {
    displayImagesSmartly();
  }
}

function applyBrightenImage() {
  effectImg.loadPixels();
  for (let i = 0; i < effectImg.pixels.length; i += 4) {
    effectImg.pixels[i] += 50;
    effectImg.pixels[i + 1] += 50;
    effectImg.pixels[i + 2] += 50;
  }
  effectImg.updatePixels();
}

function applyEffect() {
  // Any time the effect is changed, reset the effect image to the original image
  effectImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);

  if (sel.value() === 'Test - Brighten Image') {
    applyBrightenImage()
  } else if (sel.value() === 'Effect 2') {
  }
}

function displayImagesSmartly() {
  let padding = 10; // in pixels
  let windowAspect = windowWidth / windowHeight;
  let imgAspect = img.width / img.height;

  let isWindowLandscape = windowAspect > 1;
  let isImgLandscape = imgAspect > 1;

  if (isWindowLandscape === isImgLandscape) {
    // Both are of the same orientation
    let paddedWidth = (windowWidth - padding) / 2;
    displayImage(img, 0, paddedWidth, windowHeight, 'x');
    displayImage(effectImg, paddedWidth + padding, paddedWidth, windowHeight, 'x');
  } else {
    // Different orientations
    let paddedHeight = (windowHeight - padding) / 2;
    displayImage(img, 0, windowWidth, paddedHeight, 'y');
    displayImage(effectImg, paddedHeight + padding, windowWidth, paddedHeight, 'y');
  }
}

function displayImage(_image, offset, maxWidth, maxHeight, axis) {
  let imgAspect = _image.width / _image.height;
  let windowAspect = maxWidth / maxHeight;

  let newWidth, newHeight;

  if (imgAspect > windowAspect) {
    newWidth = maxWidth;
    newHeight = maxWidth / imgAspect;
  } else {
    newHeight = maxHeight;
    newWidth = maxHeight * imgAspect;
  }

  let xPos = (axis === 'x') ? offset : (maxWidth - newWidth) / 2;
  let yPos = (axis === 'y') ? offset : (maxHeight - newHeight) / 2;

  image(_image, xPos, yPos, newWidth, newHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

