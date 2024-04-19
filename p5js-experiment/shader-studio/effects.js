// effects.js handles defining combinations of shaders to make up effects

// Effect is a wrapper that represents a combination of shaders to be applied
// in sequence to an image.
class Effect {
  constructor(name, shadersWithUniforms) {
    this.name = name;
    this.shadersWithUniforms = shadersWithUniforms;
  }
}

// ShaderWithUniforms provides a mechanism to link a shader with a set of
// predefined uniform values. This is useful for effects that require multiple
// shaders to be applied in sequence, where the output of one shader is used as
// the input to the next shader.
//
// It also allows the effect to override the default values of the uniforms set
// in the shader.
// TODO: Do we really need this? This is really just a way to set a uniform by name/val
// without requiring the Uniform class constructor, I think? Unclear how we update the
// underlying shader's uniform from the UI in the case here where we only setValue at
// construction time.
class ShaderWithUniforms {
  constructor(shader, uniformValues) {
    this.shader = shader;
    this.uniformValues = uniformValues;

    // Ensure that all uniforms in the uniform list are present in the shader
    for (let uniform of Object.keys(uniformValues)) {
      if (!(uniform in shader.uniforms)) {
        throw new Error(`Uniform ${uniform} in effect is not present in shader ${shader.name}`);
      }
      shader.uniforms[uniform].setValue(uniformValues[uniform]);
    }
  }
}

// Effects is a map of effect names to Effect objects, and is the source of
// truth for the list of effects that can be applied to an image.
var Effects = [
  new Effect('None', []),
  new Effect('Kuwahara',
    [
      new ShaderWithUniforms(Shaders.Kuwahara, {uKernelSize: 20}),
    ]
  ),
].reduce((acc, effect) => {acc[effect.name] = effect; return acc;}, {});

// Mark an effect as active
function applyEffect() {
  let effect = Effects[ActiveEffectSelector.value()];
  console.log("Applying effect: " + effect.name);
  state.activeEffect = effect;
}

// Render the current effect to the screen
function renderEffect() {

}
