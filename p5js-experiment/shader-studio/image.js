// image.js handles loading/saving image data

// Load an image and duplicate it for editing
function loadAndDuplicateImage(path_or_data) {
  state.img = loadImage(path_or_data, function() {
    state.effectImg = createImage(state.img.width, state.img.height);
    state.effectImg.copy(state.img, 0, 0, state.img.width, state.img.height, 0, 0, state.img.width, state.img.height);
  });
}

// Update the global state when a new image is selected
function handleImageBrowseSelection(file) {
  if (file.type === 'image') {
    loadAndDuplicateImage(file.data);
  } else {
    img = null;
    effectImg = null;
  }
}

// Save the output of our edited image
function saveEditedImage() {
  let format = formatSel.value().toLowerCase();
  save(state.effectImg, `edited_image.${format}`);
}
