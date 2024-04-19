// ui.js handles setting up UI elements and handling events

let ActiveEffectSelector;
let font;
let fpsCounter;

function configureUI() {
  console.log("Configuring UI...");

  noCanvas();
  let e = createCanvas(windowWidth, windowHeight, WEBGL);
  e.style('display', 'block');
  e.style('margin', '0');
  e.style('padding', '0');
  document.body.style.margin = '0';
  document.body.style.padding = '0';

  // Create file input button
  let input = createFileInput(handleImageBrowseSelection);
  input.position(0, 0);

  // Create dropdown menu for effects
  ActiveEffectSelector = createSelect();
  ActiveEffectSelector.position(0, 30);
  for (let effectName in Effects) {
    ActiveEffectSelector.option(effectName);
  }
  ActiveEffectSelector.changed(applyEffect);

  // Create a save button
  let saveButton = createButton('Save');
  saveButton.position(0, 90);
  saveButton.mousePressed(saveEditedImage);

  // Create a dropdown menu for image format
  let formatSel = createSelect();
  formatSel.position(0, 120);
  formatSel.option('PNG');
  formatSel.option('JPG');

  // An FPS counter
  fpsCounter = createP();
  fpsCounter.position(windowWidth - 80, windowHeight - 40);

  background(220);

  frameRate(30);
  textFont(font);
  fill(0);

  console.log("Done configuring UI.");
}

// TODO: Need to have a view for editing all the uniforms for all the shaders in an effect

// Event handler for when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  fpsCounter.position(windowWidth - 80, windowHeight - 40);
}

function alignImagesByOrientation() {
  let padding = 10; // in pixels
  let windowAspect = windowWidth / windowHeight;
  let imgAspect = state.img.width / state.img.height;

  let isWindowLandscape = windowAspect > 1;
  let isImgLandscape = imgAspect > 1;

  if (isWindowLandscape === isImgLandscape) {
    // Both are of the same orientation
    let paddedWidth = (windowWidth - padding) / 2;

    drawScaledImage(state.img, -paddedWidth / 2, paddedWidth, windowHeight, 'x');
    drawScaledImage(state.effectImg, paddedWidth / 2 + padding, paddedWidth, windowHeight, 'x');

  } else {
    // Different orientations
    let paddedHeight = (windowHeight - padding) / 2;

    drawScaledImage(state.img, -paddedHeight / 2, windowWidth, paddedHeight, 'y');
    drawScaledImage(state.effectImg, paddedHeight / 2 + padding, windowWidth, paddedHeight, 'y');
  }
}

/**
 * Scales and positions an image on the canvas, maintaining the image's aspect ratio within
 * given maximum dimensions.
 *
 * Parameters:
 *   _image (p5.Image): The image to be displayed.
 *   offset (number): The x/y position of the image's center along the specified axis.
 *   maxWidth (number): The maximum allowable width for the image after scaling.
 *   maxHeight (number): The maximum allowable height for the image after scaling.
 *   axis (string): The axis along which the image should be centered. Use 'x' for horizontal
 *                  centering (useful when the window is wider than it is tall) and 'y' for vertical
 *                  centering (useful when the window is taller than it is wide).
 *
 * This function adjusts the image position based on the axis specified and ensures the image
 * is centered properly within its segment of the layout, either horizontally or vertically.
 */
function drawScaledImage(_image, offset, maxWidth, maxHeight, axis) {
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

// Draw the UI elements
function drawUI() {
  background(220);
  fpsCounter.html("FPS: " + frameRate().toFixed(2));
  alignImagesByOrientation();
}
