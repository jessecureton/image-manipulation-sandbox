// ui.js handles setting up UI elements and handling events

let ActiveEffectSelector;

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
  let input = createFileInput(handleFile);
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

  background(220);

  console.log("Done configuring UI.");
}

// TODO: Move this into a file for image handling
function handleFile(file) {
  if (file.type === 'image') {
    loadAndDuplicateImage(file.data);
  } else {
    img = null;
    effectImg = null;
  }
}

// TODO: Move this into a file for image handling
function saveEditedImage() {
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
