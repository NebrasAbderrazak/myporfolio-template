import type { BackgroundStyle } from "@/content/schema";

/**
 * Shaders for the living background. Every style shares the same inputs:
 * the pointer (lerped, in canvas pixels), time, a scroll offset that moves the
 * layer slower than the page, and an intro value that fades the field in.
 */

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const HEADER = /* glsl */ `
#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uScale;
uniform float uTime;
uniform float uScroll;
uniform float uIntro;
uniform float uEnergy;
uniform float uWarmth;

const vec3 INK = vec3(0.071, 0.078, 0.067);
const vec3 MOSS = vec3(0.27, 0.443, 0.165);
const vec3 LIGHT = vec3(1.0, 0.996, 0.984);
const vec3 SAGE = vec3(0.486, 0.722, 0.247);
const vec3 SUN = vec3(0.98, 0.86, 0.62);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = rotate * p * 2.03 + 11.7;
    amplitude *= 0.5;
  }
  return value;
}

vec4 over(vec4 top, vec4 bottom) {
  return top + bottom * (1.0 - top.a);
}

vec4 paint(vec3 color, float alpha) {
  return vec4(color, 1.0) * alpha;
}
`;

/** Shared coordinates: uv scaled to the short side, the pointer, and the scroll offset in uv units. */
const SPACE = /* glsl */ `
  float unit = min(uResolution.x, uResolution.y);
  vec2 uv = gl_FragCoord.xy / unit;
  vec2 pointer = uPointer / unit;
  vec2 scroll = vec2(0.0, uScroll * uScale / unit);
  float t = uTime * 0.035;
  vec2 toPointer = uv - pointer;
  float distance2 = dot(toPointer, toPointer);
`;

const BODIES: Record<Exclude<BackgroundStyle, "none">, string> = {
  // Sunlit paper: warm light pools drifting slowly, gathering around the cursor.
  light: /* glsl */ `
  vec2 p = (uv + scroll) * 0.9;
  vec2 warp = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  float halo = exp(-distance2 * 3.0);
  warp += toPointer * exp(-distance2 * 8.0) * (0.5 + uEnergy * 1.5);
  float field = fbm(p + 1.6 * warp);

  float light = smoothstep(0.35, 0.8, field) * 0.6 + halo * 0.3;
  float sun = smoothstep(0.45, 0.85, fbm(p * 0.7 + warp.yx - t)) * (0.16 + 0.1 * uWarmth) + halo * 0.08;
  float sage = smoothstep(0.5, 0.9, fbm(p * 0.6 - warp + t)) * 0.16;
  float depth = (1.0 - smoothstep(0.15, 0.55, field)) * 0.07;

  vec4 color = paint(INK, depth);
  color = over(paint(LIGHT, light), color);
  color = over(paint(SAGE, sage), color);
  color = over(paint(SUN, sun), color);
  gl_FragColor = color * uIntro;
`,

  // Leaf shade: soft, swaying shadows like sun through palm leaves. The cursor is a patch of sun.
  shade: /* glsl */ `
  vec2 p = (uv + scroll) * 1.15;
  vec2 sway = vec2(sin(uTime * 0.32 + p.y * 1.7), cos(uTime * 0.26 + p.x * 1.3)) * 0.04;
  float halo = exp(-distance2 * 4.0);
  vec2 lean = toPointer * halo * 0.08;
  float canopy = fbm(p * 1.1 + sway + lean + vec2(t * 0.3, 0.0));
  float leaves = fbm(p * 3.2 + sway * 2.5 + lean * 2.0 + 7.0 - vec2(0.0, t * 0.5));
  float shade = smoothstep(0.5, 0.56, canopy * 0.62 + leaves * 0.46);

  float shadow = shade * 0.09 * (1.0 - halo * 0.65);
  float light = (1.0 - shade) * 0.28 + halo * 0.18;
  float sun = (1.0 - shade) * (0.05 + 0.05 * uWarmth) + halo * 0.06;

  vec4 color = paint(LIGHT, light);
  color = over(paint(SUN, sun), color);
  color = over(paint(INK, shadow), color);
  gl_FragColor = color * uIntro;
`,

  // Dot grid: engineering paper whose dots swell and lean apart under the cursor.
  dots: /* glsl */ `
  const float SPACING = 24.0;
  vec2 px = gl_FragCoord.xy / uScale + vec2(0.0, uScroll);
  vec2 pointerPx = uPointer / uScale + vec2(0.0, uScroll);
  vec2 fromPointer = px - pointerPx;
  float lens = exp(-dot(fromPointer, fromPointer) / (2.0 * 150.0 * 150.0));
  vec2 q = px - fromPointer * lens * (0.32 + uEnergy * 0.25);

  vec2 cell = q / SPACING;
  float r = length(fract(cell) - 0.5) * SPACING;
  float wave = smoothstep(0.55, 0.8, fbm(floor(cell) * 0.07 + vec2(t * 2.0, -t * 1.4)));
  float radius = 0.85 + 1.5 * lens + 0.5 * wave;
  float mark = 1.0 - smoothstep(radius - 0.35, radius + 0.65, r);

  float alpha = mark * (0.14 + 0.24 * lens + 0.06 * wave);
  vec4 color = paint(LIGHT, exp(-distance2 * 4.0) * 0.25);
  color = over(paint(mix(INK, MOSS, lens * 0.7), alpha), color);
  gl_FragColor = color * uIntro;
`,

  // Contour map: a drifting topographic map that bends around the cursor like a lens.
  contours: /* glsl */ `
  vec2 p = (uv + scroll) * 1.5;
  vec2 warp = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  float lens = exp(-distance2 * 16.0);
  float halo = exp(-distance2 * 5.0);
  warp += toPointer * lens * (0.9 + uEnergy * 2.5);
  float height = fbm(p + 1.35 * warp + vec2(t * 0.6, -t * 0.4));

  float bands = height * 15.0;
  float distanceToLine = abs(fract(bands - 0.5) - 0.5);
  float width = max(fwidth(bands), 0.0001);
  float line = 1.0 - smoothstep(0.0, width * 1.25, distanceToLine);
  float major = 1.0 - step(0.5, abs(mod(floor(bands + 0.5), 5.0)));
  float lineAlpha = line * (0.042 + 0.11 * halo) * (1.0 + 0.7 * major);

  float light = smoothstep(0.38, 0.82, height) * 0.38 + halo * 0.22;
  float sage = smoothstep(0.58, 0.95, fbm(p * 0.6 - warp + t)) * 0.07;
  float sun = smoothstep(0.55, 0.95, fbm(p * 0.5 + warp.yx - t)) * 0.08 * uWarmth;

  vec4 color = paint(LIGHT, light);
  color = over(paint(SAGE, sage), color);
  color = over(paint(SUN, sun), color);
  color = over(paint(INK, lineAlpha), color);
  gl_FragColor = color * uIntro;
`,
};

/** Share of a CSS pixel each style renders. Soft styles need far less than sharp dots. */
export const RENDER_SCALE: Record<Exclude<BackgroundStyle, "none">, { desktop: number; mobile: number }> = {
  light: { desktop: 0.35, mobile: 0.3 },
  shade: { desktop: 0.65, mobile: 0.5 },
  dots: { desktop: 1, mobile: 1 },
  contours: { desktop: 0.6, mobile: 0.45 },
};

export function fragmentShader(style: Exclude<BackgroundStyle, "none">) {
  return `${HEADER}\nvoid main() {\n${SPACE}\n${BODIES[style]}\n}\n`;
}
