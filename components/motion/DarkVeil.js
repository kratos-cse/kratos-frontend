'use client';

import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

import './DarkVeil.css';

const MAX_DPR = 1.5;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 auroraColor = intensity * rampColor;
  
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

function hexStopsToRgb(stops) {
  return stops.map((hex) => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  });
}

function scheduleIdle(cb) {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(cb, { timeout: 1200 });
  }
  return setTimeout(cb, 1);
}

function cancelIdle(id) {
  if (typeof cancelIdleCallback !== 'undefined' && typeof id === 'number' && id > 0) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

export function DarkVeil(props) {
  const {
    colorStops = ['#0a1128', '#101833', '#162040'],
    amplitude = 1.0,
    blend = 0.5,
    lightMode = false,
    speed = 1.0,
    observeRootRef,
  } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn || reduceMotion) return;

    let disposed = false;
    let animateId = 0;
    let idleId = null;
    let renderer;
    let program;
    let mesh;
    let gl;
    let running = false;
    let tabVisible = true;
    let inView = true;

    const colorStopsKey = JSON.stringify(colorStops);
    let cachedStopsKey = colorStopsKey;
    let cachedStopsArray = hexStopsToRgb(colorStops);

    function syncUniformsFromProps() {
      if (!program) return;
      const p = propsRef.current;
      program.uniforms.uAmplitude.value = p.amplitude ?? amplitude;
      program.uniforms.uBlend.value = p.blend ?? blend;
      program.uniforms.uLightMode.value = (p.lightMode ?? lightMode) ? 1 : 0;
      const stops = p.colorStops ?? colorStops;
      const key = JSON.stringify(stops);
      if (key !== cachedStopsKey) {
        cachedStopsKey = key;
        cachedStopsArray = hexStopsToRgb(stops);
        program.uniforms.uColorStops.value = cachedStopsArray;
      }
    }

    function resize() {
      if (!ctn || !renderer) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }

    function renderFrame(t) {
      if (!program || !renderer || !mesh) return;
      const { time = t * 0.01, speed: currentSpeed = 1.0 } = propsRef.current;
      program.uniforms.uTime.value = time * (currentSpeed ?? speed) * 0.1;
      syncUniformsFromProps();
      renderer.render({ scene: mesh });
    }

    function loop(t) {
      animateId = requestAnimationFrame(loop);
      if (!running) return;
      renderFrame(t);
    }

    function startLoop() {
      if (running) return;
      running = true;
      if (!animateId) animateId = requestAnimationFrame(loop);
    }

    function stopLoop() {
      running = false;
    }

    function updateShouldRun() {
      if (tabVisible && inView) startLoop();
      else stopLoop();
    }

    function onVisibilityChange() {
      tabVisible = document.visibilityState === 'visible';
      updateShouldRun();
      if (tabVisible && inView) renderFrame(performance.now());
    }

    function initWebGL() {
      if (disposed) return;

      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR),
      });
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.canvas.style.backgroundColor = 'transparent';
      gl.canvas.className = 'darkveil-canvas';

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) {
        delete geometry.attributes.uv;
      }

      cachedStopsArray = hexStopsToRgb(propsRef.current.colorStops ?? colorStops);
      cachedStopsKey = JSON.stringify(propsRef.current.colorStops ?? colorStops);

      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: amplitude },
          uColorStops: { value: cachedStopsArray },
          uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
          uBlend: { value: blend },
          uLightMode: { value: lightMode ? 1 : 0 },
        },
      });

      mesh = new Mesh(gl, { geometry, program });
      ctn.appendChild(gl.canvas);

      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', onVisibilityChange);

      resize();
      animateId = requestAnimationFrame(loop);
      updateShouldRun();
    }

    idleId = scheduleIdle(initWebGL);

    const ioTarget = observeRootRef?.current ?? ctn;
    let observer;
    if (typeof IntersectionObserver !== 'undefined' && ioTarget) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          inView = entry?.isIntersecting && (entry.intersectionRatio ?? 0) > 0.05;
          updateShouldRun();
        },
        { threshold: [0, 0.05, 0.1] }
      );
      observer.observe(ioTarget);
    }

    return () => {
      disposed = true;
      cancelIdle(idleId);
      stopLoop();
      cancelAnimationFrame(animateId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', resize);
      observer?.disconnect();
      if (ctn && gl?.canvas?.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, lightMode, reduceMotion, colorStops, observeRootRef]);

  if (reduceMotion) {
    const fallback = colorStops[1] ?? colorStops[0] ?? '#0a1128';
    return (
      <div
        ref={ctnDom}
        className="darkveil-canvas"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, ${colorStops[0]}, ${fallback}, ${colorStops[2] ?? colorStops[0]})`,
        }}
      />
    );
  }

  return <div ref={ctnDom} className="darkveil-canvas" aria-hidden="true" />;
}
