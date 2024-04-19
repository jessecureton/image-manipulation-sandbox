// state.js handles the state of the application. This includes the current image, the current shader, and the current uniforms. This file will also handle the logic for loading and saving images, applying shaders, and updating uniforms. This file will be responsible for managing the state of the application and coordinating the interactions between the UI, shaders, and images.

class GlobalState {
  constructor() {
    // The original for the image that we are editing
    this.img = null;
    // The image after applying the current effect(s)
    this.effectImg = null;

    // The current effect that is being applied
    this.activeEffect = null;
  }
}
