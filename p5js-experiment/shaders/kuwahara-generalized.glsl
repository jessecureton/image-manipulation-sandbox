#version 300 es
precision mediump float;

// This is the texture coordinate from our vertex shader
in vec2 vTexCoord;

// This is the output color of our fragment shader
out vec4 fragColor;

// tex0 is the input texture containing our image data from p5
uniform sampler2D tex0;

// This is a default provided by unity in the acerola shader, but we provide it via p5 as a uniform of
// vec4(1.0 / width, 1.0 / height, width, height)
uniform vec4 uTexelSize;

// 2-20
int kernelSize = 10;
// 1.0-18.0 - also called _Q in the upstream
float sharpness = 8.0;
// 1.0-100.0
float hardness = 8.0;
// 0.01f-2.0f
float zeroCross = 0.58;

// TODO - what does this do?
#define useZeta 0
#if useZeta
// 0.01-3.0
float zeta = 1.0f;
#else
float zeta = 2.04 / (kernelSize / 2.0f);
#endif



void main() {
  vec2 uv = vTexCoord;

  fragColor = vec4(0.0);
  fragColor.a = 1.0;

  vec4 q1 = sampleQuadrant(uv, -kernelSize, 0, -kernelSize, 0);
  vec4 q2 = sampleQuadrant(uv, 0, kernelSize, -kernelSize, 0);
  vec4 q3 = sampleQuadrant(uv, 0, kernelSize, 0, kernelSize);
  vec4 q4 = sampleQuadrant(uv, -kernelSize, 0, 0, kernelSize);

  float minstd = min(q1.a, min(q2.a, min(q3.a, q4.a)));
  bvec4 q = equal(vec4(q1.a, q2.a, q3.a, q4.a), vec4(minstd));

  if (dot(vec4(q), vec4(1.0)) > 1.0) {
    fragColor = saturate(vec4((q1.rgb + q2.rgb + q3.rgb + q4.rgb) / 4.0, 1.0));
  } else {
    fragColor = saturate(vec4(q1.rgb * float(q.x) + q2.rgb * float(q.y) + q3.rgb * float(q.z) + q4.rgb * float(q.w), 1.0));
  }
}
