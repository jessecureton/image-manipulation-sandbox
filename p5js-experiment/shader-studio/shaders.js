// shaders.js handles defining the data model for our shaders and the helpers to load/manipulate them

const VERT_SHADER = '../shaders/noop-vert-gles3.glsl';

class Uniform {
  constructor(name, type, defaultValue, min, max) {
    this.name = name;
    this.type = type;
    this.defaultValue = defaultValue;
    this.min = min;
    this.max = max;
    this.value = defaultValue;

    validTypes = ['int']; //, 'float', 'vec2', 'vec3', 'vec4'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid uniform type ${type}`);
    }
  }

  setValue(value) {
    // Bounds check for numeric types
    if (this.type === 'int') {
      if (value < this.min || value > this.max) {
        throw new Error(`Value ${value} is out of range for uniform ${this.name}`);
      }
    }
    this.value = value;
  }
}

class Shader {
  constructor(name, fragPath, uniforms) {
    this.name = name;
    this.fragPath = fragPath;
    this.uniforms = uniforms;
  }

  load() {
    this.p5Shader = loadShader(VERT_SHADER, '../shaders/' + this.fragPath);
  }
}

const Shaders = [
  new Shader('Kuwahara', 'kuwahara.glsl',
    [
      new Uniform('uKernelSize', 'int', 10, 1, 20),
    ].reduce((acc, uniform) => {acc[uniform.name] = uniform; return acc;}, {})
  ),
].reduce((acc, shader) => {acc[shader.name] = shader; return acc;}, {});

function loadShaders() {
  console.log("Loading shaders...");
  for (let shaderName in Shaders) {
    Shaders[shaderName].load();
  }
  console.log("Done loading shaders.");
}

