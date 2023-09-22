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

// 1-20? at least on acerola's shader
// 1 is almost imperceptible, 10 seems to be a good starting point
int kernelSize = 10;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

// Emulates HLSL's saturate function
vec4 saturate(vec4 x) {
    return clamp(x, vec4(0.0), vec4(1.0));
}

// Returns avg color in .rgb, std in .a for a rect of size (x1, y1) to (x2, y2)
vec4 sampleQuadrant(vec2 uv, const int x1, const int x2, const int y1, const int y2, float numSamples) {
  // TODO: numSamples appears to only be used for variance calculation,
  // so we could probably just use the actual count of iterations instead of passing it in
  float luminance_sum = 0.0;
  float luminance_sum2 = 0.0;
  vec3 color_sum = vec3(0.0);

  for (int x = x1; x <= x2; ++x) {
    for (int y = y1; y <= y2; ++y) {
      vec3 _sample = texture(tex0, uv + (vec2(x, y) * uTexelSize.xy)).rgb;
      float l = luma(_sample);
      luminance_sum += l;
      luminance_sum2 += l * l;
      // this clamp seems unnecessary, but it's in the original shader?
      // afaict this would only be necessary if the input texture was not normalized or was HDR
      //color_sum += clamp(_sample, 0.0, 1.0);
      color_sum += _sample;
    }
  }

  float mean = luminance_sum / numSamples;
  float variance = abs(luminance_sum2 / numSamples - mean * mean);

  //return vec4(mean, mean, mean, 1.0);

  return vec4(color_sum/numSamples, variance);
}

void main() {
  vec2 uv = vTexCoord;

  float windowSize = 2.0 * float(kernelSize) + 1.0;
  int quadrantSize = int(ceil(windowSize / 2.0));
  int numSamples = quadrantSize * quadrantSize;

  fragColor = vec4(0.0);
  fragColor.a = 1.0;

  vec4 q1 = sampleQuadrant(uv, -kernelSize, 0, -kernelSize, 0, float(numSamples));
  vec4 q2 = sampleQuadrant(uv, 0, kernelSize, -kernelSize, 0, float(numSamples));
  vec4 q3 = sampleQuadrant(uv, 0, kernelSize, 0, kernelSize, float(numSamples));
  vec4 q4 = sampleQuadrant(uv, -kernelSize, 0, 0, kernelSize, float(numSamples));

  float minstd = min(q1.a, min(q2.a, min(q3.a, q4.a)));
  bvec4 q = equal(vec4(q1.a, q2.a, q3.a, q4.a), vec4(minstd));

  if (dot(vec4(q), vec4(1.0)) > 1.0) {
    fragColor = saturate(vec4((q1.rgb + q2.rgb + q3.rgb + q4.rgb) / 4.0, 1.0));
  } else {
    fragColor = saturate(vec4(q1.rgb * float(q.x) + q2.rgb * float(q.y) + q3.rgb * float(q.z) + q4.rgb * float(q.w), 1.0));
  }
}
