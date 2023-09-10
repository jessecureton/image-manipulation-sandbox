precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

void main() {
  vec2 uv = vTexCoord;
  // the texture is loaded upside down by default so lets flip it
  uv.y = 1.0 - uv.y;

  // get the webcam as a vec4 using texture2D
  vec4 tex = texture2D(tex0, uv);

  // Convert the colors to grayscale
  float luminance = 0.299 * tex.r + 0.587 * tex.g + 0.114 * tex.b;
  vec4 gray = vec4(luminance, luminance, luminance, tex.a);

  gl_FragColor = gray;
}
