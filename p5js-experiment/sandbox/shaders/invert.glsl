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

  // lets invert the colors just for kicks
  tex.rgb = 1.0 - tex.rgb;

  gl_FragColor = tex;
}
