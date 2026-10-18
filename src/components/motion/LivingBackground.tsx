"use client";

import { useEffect, useRef } from "react";
import { BACKGROUND_STYLES, type BackgroundStyle } from "@/content/schema";
import { RENDER_SCALE, VERTEX_SHADER, fragmentShader } from "./field-shader";

/** How fast the field slides compared with the page. */
const SCROLL_DEPTH = 0.3;

type FieldStyle = Exclude<BackgroundStyle, "none">;
type Uniforms = Record<"resolution" | "pointer" | "scale" | "time" | "scroll" | "intro" | "energy" | "warmth", WebGLUniformLocation | null>;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext, style: FieldStyle) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader(style));
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** Above this average frame time the field switches itself off. */
const SLOW_FRAME_MS = 50;
const ENGAGE_EVENTS = ["pointermove", "pointerdown", "wheel", "scroll", "keydown", "touchstart"] as const;

/**
 * Runs the callback at the first sign of a visitor (a mouse move, scroll, tap or
 * key press), once the browser is idle. Returns a function that cancels it.
 */
function whenEngaged(callback: () => void) {
  let idle = 0;
  const engage = () => {
    remove();
    idle = typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(callback, { timeout: 400 }) : window.setTimeout(callback, 100);
  };
  const remove = () => ENGAGE_EVENTS.forEach((type) => window.removeEventListener(type, engage));
  ENGAGE_EVENTS.forEach((type) => window.addEventListener(type, engage, { passive: true }));
  return () => {
    remove();
    if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
    window.clearTimeout(idle);
  };
}

/** Software WebGL runs the shader on the CPU, which would block the page. */
function isSoftwareRenderer(gl: WebGLRenderingContext) {
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  return /swiftshader|llvmpipe|software|basic render/i.test(renderer);
}

/**
 * Full-page WebGL backdrop. It starts on the visitor's first interaction, so it
 * never competes with page load, renders at a reduced resolution, pauses in
 * background tabs, and switches itself off on software rendering or slow frames.
 * The CSS light beams stay in place whenever the field is not running.
 */
const PREVIEW_KEY = "background-preview";

/**
 * `?background=dots` previews another style without changing the site setting.
 * The choice is kept for the rest of the tab session, so it survives navigation.
 */
function previewStyle(): BackgroundStyle | null {
  const isStyle = (value: string | null) => BACKGROUND_STYLES.find((style) => style === value) ?? null;
  const fromUrl = isStyle(new URLSearchParams(window.location.search).get("background"));
  try {
    if (fromUrl) sessionStorage.setItem(PREVIEW_KEY, fromUrl);
    return fromUrl ?? isStyle(sessionStorage.getItem(PREVIEW_KEY));
  } catch {
    return fromUrl;
  }
}

export function LivingBackground({ style: configured }: { style: BackgroundStyle }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const style = previewStyle() ?? configured;
    if (!canvas || style === "none") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const scale = Math.min(RENDER_SCALE[style][finePointer ? "desktop" : "mobile"], window.devicePixelRatio || 1);
    const frameInterval = finePointer ? 0 : 1000 / 30;

    let frame = 0;
    let disposed = false;
    let stop = () => {};

    const start = () => {
      if (disposed) return;
      const gl = canvas.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: true,
      });
      if (!gl || isSoftwareRenderer(gl) || !gl.getExtension("OES_standard_derivatives")) return;
      const program = createProgram(gl, style);
      if (!program) return;

      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      const uniform = (name: string) => gl.getUniformLocation(program, name);
      const u: Uniforms = {
        resolution: uniform("uResolution"),
        pointer: uniform("uPointer"),
        scale: uniform("uScale"),
        time: uniform("uTime"),
        scroll: uniform("uScroll"),
        intro: uniform("uIntro"),
        energy: uniform("uEnergy"),
        warmth: uniform("uWarmth"),
      };

      const size = { width: 0, height: 0 };
      const resize = () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        canvas.width = Math.max(1, Math.round(size.width * scale));
        canvas.height = Math.max(1, Math.round(size.height * scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(u.resolution, canvas.width, canvas.height);
        gl.uniform1f(u.scale, scale);
      };
      resize();

      const pointer = { x: size.width * 0.62, y: size.height * 0.35, targetX: size.width * 0.62, targetY: size.height * 0.35 };
      let energy = 0;
      let hasPointer = false;
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        hasPointer = true;
        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;
      };

      const began = performance.now();
      let last = 0;
      const draw = (now: number) => {
        const delta = Math.min(64, now - (last || now));
        last = now;
        const seconds = (now - began) / 1000;

        if (!hasPointer) {
          // Without a mouse, the light wanders slowly on its own.
          pointer.targetX = size.width * (0.5 + 0.32 * Math.sin(seconds * 0.11));
          pointer.targetY = size.height * (0.42 + 0.22 * Math.cos(seconds * 0.07));
        }
        const ease = 1 - Math.pow(0.001, delta / 1000);
        const dx = pointer.targetX - pointer.x;
        const dy = pointer.targetY - pointer.y;
        pointer.x += dx * ease;
        pointer.y += dy * ease;
        const speed = Math.hypot(dx, dy) / Math.max(size.width, 1);
        energy += (Math.min(speed * 4, 1) - energy) * Math.min(1, delta / 400);

        const maxScroll = Math.max(1, document.documentElement.scrollHeight - size.height);

        gl.uniform1f(u.time, reduce ? 12 : seconds);
        gl.uniform2f(u.pointer, pointer.x * scale, (size.height - pointer.y) * scale);
        gl.uniform1f(u.scroll, -window.scrollY * SCROLL_DEPTH);
        gl.uniform1f(u.intro, reduce ? 1 : Math.min(1, seconds / 1.6));
        gl.uniform1f(u.energy, energy);
        gl.uniform1f(u.warmth, window.scrollY / maxScroll);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      };

      const timing = { frames: 0, total: 0 };
      const loop = (now: number) => {
        frame = window.requestAnimationFrame(loop);
        if (frameInterval && now - last < frameInterval) return;
        if (last && timing.frames < 90) {
          timing.frames++;
          timing.total += now - last;
          if (timing.frames === 90 && timing.total / timing.frames > SLOW_FRAME_MS) {
            stop();
            return;
          }
        }
        draw(now);
      };

      // With reduced motion the map is drawn as a still image, redrawn only when the page moves.
      const redraw = () => draw(performance.now());
      const onVisibility = () => {
        window.cancelAnimationFrame(frame);
        if (!document.hidden) frame = window.requestAnimationFrame(loop);
      };

      const onResize = () => {
        resize();
        if (reduce) redraw();
      };

      window.addEventListener("resize", onResize);
      document.documentElement.dataset.field = "on";
      if (reduce) {
        window.addEventListener("scroll", redraw, { passive: true });
        redraw();
      } else {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);
        frame = window.requestAnimationFrame(loop);
      }

      stop = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", redraw);
        document.removeEventListener("visibilitychange", onVisibility);
        delete document.documentElement.dataset.field;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    const cancelStart = whenEngaged(start);
    return () => {
      disposed = true;
      cancelStart();
      stop();
    };
  }, [configured]);

  return <canvas ref={canvasRef} aria-hidden className="field" />;
}
