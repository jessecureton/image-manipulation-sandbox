precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform float uTime;

void main() {
    vec2 uv = vTexCoord;

    // We'll sort pixels in the same row, so keep y fixed.
    float y = uv.y;

    vec4 currentColor = texture2D(tex0, vec2(uv.x, y));
    float currentBrightness = currentColor.r + currentColor.g + currentColor.b;

    vec4 minColor = currentColor;
    float minBrightness = currentBrightness;
    vec4 maxColor = currentColor;
    float maxBrightness = currentBrightness;

    // Iterate through the row to find min and max brightness.
    for(float x = 0.0; x < 1.0; x += 0.01) {
        vec4 color = texture2D(tex0, vec2(x, y));
        float brightness = color.r + color.g + color.b;
        
        if (brightness < minBrightness) {
            minBrightness = brightness;
            minColor = color;
        }
        if (brightness > maxBrightness) {
            maxBrightness = brightness;
            maxColor = color;
        }
    }

    // Assign a sorted color.
    if(currentBrightness < (minBrightness + maxBrightness) / 2.0) {
        gl_FragColor = minColor;
    } else {
        gl_FragColor = maxColor;
    }
}

