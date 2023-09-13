precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

void main() {
  vec2 uv = vTexCoord;

  // get the image texture we provided as a uniform
  vec4 tex = texture2D(tex0, uv);

  // lets invert the colors just for kicks
  tex.rgb = 1.0 - tex.rgb;

  gl_FragColor = tex;
}
