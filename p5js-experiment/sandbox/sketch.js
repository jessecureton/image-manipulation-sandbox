let img;          // The original image instance from the file input
let effectImg;    // The image instance that will be modified by effects
let effectSel;    // The dropdown menu for effects
let formatSel;    // The dropdown menu for image format

let invertShader; // The shader for the inversion filter
let greyscaleShader; // The shader for the greyscale filter
let pixelSortShader;   // The shader for the ChatGPT filter
let kuwaharaShader;   // The shader for the kuwahara filter
let generalizedKuwaharaShader;   // The shader for the generalized kuwahara filter

function getEffects() {
  return {
    'None': null,
    'Kuwahara Filter': applyKuwaharaFilter,
    'Generalized Kuwahara Filter': applyGeneralizedKuwaharaFilter,
    'Pixel Sort': applyPixelSort,
    'Test - Brighten Image': applyBrightenImage,
    'Test - Invert Shader': applyShaderTest,
    'Test - Greyscale Shader': applyGreyscaleShader,
    'Test - Stacked Shaders': applyStackedShaders,
  }
}

function loadShaders() {
  invertShader = loadShader('shaders/noop-vert.glsl', 'shaders/invert.glsl');
  greyscaleShader = loadShader('shaders/noop-vert.glsl', 'shaders/greyscale.glsl');
  pixelSortShader = loadShader('shaders/noop-vert.glsl', 'shaders/pixel-sort.glsl');
  kuwaharaShader = loadShader('shaders/noop-vert-gles3.glsl', 'shaders/kuwahara.glsl');
  generalizedKuwaharaShader = loadShader('shaders/noop-vert-gles3.glsl', 'shaders/kuwahara-generalized.glsl');
}

function preload() {
  loadAndDuplicateImage('default2.jpg');  // Load a default image
  loadShaders();
}

function loadAndDuplicateImage(path_or_data) {
  img = loadImage(path_or_data, function() {
    effectImg = createImage(img.width, img.height);
    effectImg.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    applyKuwaharaFilter();
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
  for (let effectName in getEffects()) {
    effectSel.option(effectName);
  }
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

function applyShaders(shaders) {
  let currentImg = img; // Start with the original image
  let gfx;
  
  gfx = createGraphics(currentImg.width, currentImg.height, WEBGL);
  for (let shader of shaders) {
    // max texture size is 8192 - we should check for this
    gfx.shader(shader);
    shader.setUniform('tex0', currentImg);
    let texelSize = [1.0 / currentImg.width, 1.0 / currentImg.height, currentImg.width, currentImg.height];
    shader.setUniform('uTexelSize', texelSize);
    gfx.rect(0, 0, currentImg.width, currentImg.height);
    
    // Capture the output into a p5.Image
    currentImg = gfx.get();
  }

  effectImg = currentImg; // Final output after all shaders

  // This really shouldn't be necessary but without it a second call to apply
  // a given shader will fail to execute the shader, and the console will print:
  //    WebGL warning: drawElementsInstanced: The current program is not linked.
  // ChatGPT and I are both confused by why this is required, but it's something
  // related to the creation of the graphics context. After calling
  // `gfx.Shader(shader)` for a given context/shader pair, reusing the same shader
  // on a different context will get this error.
  loadShaders();
}

function applyStackedShaders() {
  applyShaders([invertShader, greyscaleShader]);
}

function applyShaderTest() {
  applyShaders([invertShader]);
}

function applyGreyscaleShader() {
  applyShaders([greyscaleShader]);
}

function applyPixelSort() {
  applyShaders([pixelSortShader]);
}

function applyKuwaharaFilter() {
  applyShaders([kuwaharaShader]);
}

function applyGeneralizedKuwaharaFilter() {
  applyShaders([generalizedKuwaharaShader]);
}

function applyEffect() {
  // Any time the effect is changed, reset the effect image to the original image
  let _img = createImage(img.width, img.height);
  _img.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  effectImg = _img;

  // Apply the effect
  effects = getEffects();
  if (effectSel.value() in effects) {
    effects[effectSel.value()]();
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
