let img;          // The original image instance from the file input
let effectImg;    // The image instance that will be modified by effects
let effectSel;    // The dropdown menu for effects
let formatSel;    // The dropdown menu for image format
let invertShader; // The shader for the inversion filter

function preload() {
  loadAndDuplicateImage('default2.jpg');  // Load a default image
  invertShader = loadShader('shaders/noop-vert.glsl', 'shaders/invert.glsl');
}

function loadAndDuplicateImage(path_or_data) {
  img = loadImage(path_or_data, function() {
    effectImg = createImage(img.width, img.height);
    effectImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  });
}

function setup() {
  noCanvas();
  let e = createCanvas(windowWidth, windowHeight, WEBGL);
  e.style('display', 'block');
  e.style('margin', '0');
  e.style('padding', '0');
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  // Create file input button
  input = createFileInput(handleFile);
  input.position(0, 0);

  // Create dropdown menu for effects
  effectSel = createSelect();
  effectSel.position(0, 30);
  effectSel.option('None');
  effectSel.option('Test - Brighten Image');
  effectSel.option('Test - Invert Shader');
  effectSel.changed(applyEffect);

  // Create a save button
  saveButton = createButton('Save');
  saveButton.position(0, 90);
  saveButton.mousePressed(saveEditedImage);

  // Create a dropdown menu for image format
  formatSel = createSelect();
  formatSel.position(0, 120);
  formatSel.option('PNG');
  formatSel.option('JPG');
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

function applyShaderTest() {
  // max texture size is 8192 
  console.log('applying shader test');
  let gfx = createGraphics(img.width, img.height, WEBGL);
  gfx.shader(invertShader);
  invertShader.setUniform('tex0', img); // Setting the texture uniform
  gfx.rect(0,0,img.width,img.height)
  let captured = gfx.get();
  effectImg = captured;

  // This really shouldn't be necessary but without it a second call
  // to applyShaderTest() will fail to executed the shader, and the console
  // will print:
  // WebGL warning: drawElementsInstanced: The current program is not linked.
  invertShader = loadShader('shaders/noop-vert.glsl', 'shaders/invert.glsl');
}

function applyEffect() {
  // Any time the effect is changed, reset the effect image to the original image
  let _img = createImage(img.width, img.height);
  _img.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  effectImg = _img;

  if (effectSel.value() === 'Test - Brighten Image') {
    applyBrightenImage()
  } else if (effectSel.value() === 'Test - Invert Shader') {
    applyShaderTest();
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

    displayImage(img, -paddedWidth / 2, paddedWidth, windowHeight, 'x');
    displayImage(effectImg, paddedWidth / 2 + padding, paddedWidth, windowHeight, 'x');

  } else {
    // Different orientations
    let paddedHeight = (windowHeight - padding) / 2;

    displayImage(img, -paddedHeight / 2, windowWidth, paddedHeight, 'y');
    displayImage(effectImg, paddedHeight / 2 + padding, windowWidth, paddedHeight, 'y');
  }
}

function displayImage(_image, offset, maxWidth, maxHeight, axis) {
  let imgAspect = _image.width / _image.height;
  let newWidth, newHeight;

  if (imgAspect > (maxWidth / maxHeight)) {
    newWidth = maxWidth;
    newHeight = maxWidth / imgAspect;
  } else {
    newHeight = maxHeight;
    newWidth = maxHeight * imgAspect;
  }

  // Adjust for WebGL's center-origin coordinate system
  let xPos = (axis === 'x') ? offset - windowWidth / 2 + newWidth / 2 : -windowWidth / 2 + (maxWidth - newWidth) / 2;
  let yPos = (axis === 'y') ? offset - windowHeight / 2 + newHeight / 2 : -windowHeight / 2 + (maxHeight - newHeight) / 2;

  image(_image, xPos, yPos, newWidth, newHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function saveEditedImage() {
  let format = formatSel.value().toLowerCase();
  save(effectImg, `edited_image.${format}`);
}
