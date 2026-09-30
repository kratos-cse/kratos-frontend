"use client";

/**
 * "Sun Breathing" flame cursor — ported from a standalone canvas demo.
 * Two fixed, click-through canvases: a heat-shimmer layer and the main flame layer.
 * Click anywhere for a burst (shockwave, flash, flame jets, sparks, embers).
 */
import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => (a + Math.random() * (b - a)) | 0;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function buildLut(stops) {
  const r = new Uint8Array(256);
  const g = new Uint8Array(256);
  const b = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    for (let s = 0; s < stops.length - 1; s++) {
      const [t0, c0] = stops[s];
      const [t1, c1] = stops[s + 1];
      if (i >= t0 && i <= t1) {
        const f = (i - t0) / (t1 - t0);
        r[i] = (c0[0] + (c1[0] - c0[0]) * f) | 0;
        g[i] = (c0[1] + (c1[1] - c0[1]) * f) | 0;
        b[i] = (c0[2] + (c1[2] - c0[2]) * f) | 0;
        break;
      }
    }
  }
  return { r, g, b };
}

// Deep crimson → scarlet → fiery red → rose-white
const SUN = buildLut([
  [0, [0, 0, 0]],
  [35, [60, 0, 2]],
  [75, [160, 5, 8]],
  [115, [220, 15, 12]],
  [155, [240, 35, 18]],
  [195, [255, 65, 30]],
  [228, [255, 110, 55]],
  [255, [255, 175, 110]],
]);

function sunColor(t, a) {
  const i = clamp(t * 255, 0, 255) | 0;
  return `rgba(${SUN.r[i]},${SUN.g[i]},${SUN.b[i]},${a})`;
}

function makePool(size, extra = {}) {
  return { items: Array.from({ length: size }, () => ({ alive: false, ...extra })), head: 0, size };
}

function take(pool) {
  const item = pool.items[pool.head % pool.size];
  pool.head++;
  return item;
}

export default function SunCursor() {
  const mainRef = useRef(null);
  const heatRef = useRef(null);

  useEffect(() => {
    const C = mainRef.current;
    const HD = heatRef.current;
    if (!C || !HD) return undefined;
    const ctx = C.getContext("2d");
    const hctx = HD.getContext("2d");
    let W = 0;
    let H = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      for (const [cv, cx] of [
        [C, ctx],
        [HD, hctx],
      ]) {
        cv.width = W * dpr;
        cv.height = H * dpr;
        cv.style.width = `${W}px`;
        cv.style.height = `${H}px`;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }
    resize();

    const P = { x: W / 2, y: H / 2, tx: W / 2, ty: H / 2, px: W / 2, py: H / 2, vx: 0, vy: 0, speed: 0, lastMove: 0 };
    let visible = false; // don't draw until the pointer has actually entered the page

    const embers = makePool(600);
    const smoke = makePool(300);
    const flames = makePool(350);
    const sparks = makePool(400, { px: 0, py: 0 });
    const heat = makePool(200);
    const waves = [];
    const flashes = [];
    const trail = [];
    const TMAX = 60;

    function spawnEmber(x, y, vx, vy, life, sz, hot) {
      Object.assign(take(embers), {
        alive: true, x, y, vx, vy, age: 0, life, sz, hot,
        sway: rand(0.4, 1.4), phase: rand(0, TAU), grav: rand(40, 90),
      });
    }
    function spawnSmoke(x, y, vx, vy, r, life, dark) {
      Object.assign(take(smoke), { alive: true, x, y, vx, vy, age: 0, life, r, dark: !!dark });
    }
    function spawnFlame(x, y, vx, vy, r, life, hot) {
      Object.assign(take(flames), { alive: true, x, y, vx, vy, age: 0, life, r, hot });
    }
    function spawnSpark(x, y, vx, vy, life, bright) {
      Object.assign(take(sparks), { alive: true, x, y, px: x, py: y, vx, vy, age: 0, life, bright });
    }
    function spawnHeat(x, y, str, life) {
      Object.assign(take(heat), { alive: true, x, y, str, age: 0, life });
    }

    // Sun Breathing: First Form — Dance of the Fire God
    function burst(x, y) {
      waves.push({ x, y, maxR: rand(180, 280), age: 0, life: 600 });
      flashes.push({ x, y, maxR: rand(250, 380), age: 0, life: 500 });
      const JETS = 24;
      for (let i = 0; i < JETS; i++) {
        const a = (i / JETS) * TAU + rand(-0.15, 0.15);
        const spd = rand(120, 380);
        const vx = Math.cos(a) * spd;
        const vy = Math.sin(a) * spd;
        spawnFlame(x, y, vx, vy, rand(25, 55), rand(400, 800), rand(0.6, 1.0));
        if (i % 2 === 0) {
          spawnSmoke(x + rand(-8, 8), y + rand(-8, 8), vx * 0.25, vy * 0.25 - rand(30, 60), rand(22, 40), rand(600, 900), true);
        }
      }
      for (let i = 0; i < 120; i++) {
        const a = rand(0, TAU);
        const spd = rand(80, 500);
        spawnSpark(x, y, Math.cos(a) * spd, Math.sin(a) * spd, rand(300, 900), rand(0.7, 1.0));
      }
      for (let i = 0; i < 80; i++) {
        const a = rand(0, TAU) - Math.PI / 2;
        const spd = rand(40, 220);
        spawnEmber(x, y, Math.cos(a) * spd, Math.sin(a) * spd - rand(50, 120), rand(500, 1200), rand(1.5, 3.5), rand(0.5, 1.0));
      }
      spawnHeat(x, y, rand(8, 14), rand(500, 900));
    }

    const onMove = (e) => {
      if (!visible) {
        P.x = P.px = e.clientX;
        P.y = P.py = e.clientY;
        visible = true;
      }
      P.tx = e.clientX;
      P.ty = e.clientY;
      P.lastMove = performance.now();
    };
    const onDown = (e) => {
      onMove(e);
    };
    const onLeave = () => {
      visible = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("pointerleave", onLeave);

    let last = performance.now();
    let ambE = 0;
    let ambF = 0;
    let ambHD = 0;
    let raf = 0;

    function frame(now) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 33);
      last = now;
      const dtS = dt * 0.001;

      P.px = P.x;
      P.py = P.y;
      const ease = 1 - Math.pow(0.001, dtS * 5);
      P.x = lerp(P.x, P.tx, ease);
      P.y = lerp(P.y, P.ty, ease);
      P.vx = (P.x - P.px) / Math.max(dtS, 0.001);
      P.vy = (P.y - P.py) / Math.max(dtS, 0.001);
      P.speed = Math.hypot(P.vx, P.vy);

      if (visible) {
        trail.push({ x: P.x, y: P.y, t: now });
        if (trail.length > TMAX) trail.shift();
      }
      while (trail.length && now - trail[0].t > 320) trail.shift();

      const moving = now - P.lastMove < 120;
      const speedFactor = clamp(P.speed / 300, 0, 1);

      if (visible) {
        ambE -= dt;
        if (ambE <= 0) {
          ambE = moving ? rand(8, 20) : rand(25, 50);
          const n = moving ? randi(2, 5) : 1;
          for (let i = 0; i < n; i++) {
            const a = -Math.PI / 2 + rand(-0.8, 0.8);
            const spd = rand(20, 80) * (1 + speedFactor * 2);
            spawnEmber(P.x + rand(-5, 5), P.y + rand(-5, 5), Math.cos(a) * spd, Math.sin(a) * spd - rand(20, 50), rand(600, 1400), rand(1.2, 3.0), rand(0.3, 0.8));
          }
        }

        ambF -= dt;
        if (ambF <= 0) {
          ambF = moving ? rand(12, 28) : rand(35, 70);
          const n = moving ? randi(2, 6) : randi(1, 3);
          for (let i = 0; i < n; i++) {
            const a = -Math.PI / 2 + rand(-1.0, 1.0);
            const spd = rand(15, 70) * (1 + speedFactor * 1.5);
            spawnFlame(P.x + rand(-6, 6), P.y + rand(-6, 6), Math.cos(a) * spd * 0.5, Math.sin(a) * spd - rand(10, 40), rand(10, 28) * (1 + speedFactor * 0.8), rand(180, 400), rand(0.4, 1.0));
          }
          if (Math.random() < (moving ? 0.4 : 0.1)) {
            spawnSmoke(P.x + rand(-8, 8), P.y - 10, rand(-15, 15), rand(-40, -15), rand(14, 26), rand(400, 700), false);
          }
        }

        ambHD -= dt;
        if (ambHD <= 0) {
          ambHD = rand(80, 150);
          spawnHeat(P.x + rand(-15, 15), P.y + rand(-15, 15), rand(3, 6), rand(200, 400));
        }

        if (moving && P.speed > 20) {
          const n = clamp((P.speed / 100) | 0, 1, 6);
          for (let i = 0; i < n; i++) {
            const t = Math.random();
            const sx = lerp(P.px, P.x, t);
            const sy = lerp(P.py, P.y, t);
            const a = -Math.PI / 2 + rand(-1.1, 1.1);
            const spd = rand(30, 110) + speedFactor * 60;
            spawnFlame(sx + rand(-4, 4), sy + rand(-4, 4), P.vx * 0.1 + Math.cos(a) * spd * 0.4, -Math.abs(Math.sin(a) * spd) - rand(20, 55), rand(8, 22), rand(150, 350), rand(0.6, 1.0));
            if (Math.random() < 0.5) {
              spawnEmber(sx, sy, P.vx * 0.08 + rand(-40, 40), -rand(40, 130), rand(500, 1100), rand(1, 2.5), rand(0.5, 1.0));
            }
            if (P.speed > 150 && Math.random() < 0.2) {
              spawnSpark(sx, sy, P.vx * 0.2 + rand(-80, 80), P.vy * 0.2 + rand(-80, 80), rand(200, 500), 0.8);
            }
          }
        }
      }

      /* ═══════════ DRAW ═══════════ */
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 0.85; // slightly dim the entire cursor glow
      ctx.globalCompositeOperation = "lighter";

      // Flashes — crimson-scarlet bloom
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i];
        f.age += dt;
        if (f.age >= f.life) {
          flashes.splice(i, 1);
          continue;
        }
        const tp = f.age / f.life;
        const r = lerp(0, f.maxR, Math.pow(tp, 0.3));
        const a = (1 - tp) * (1 - tp) * 0.35;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, Math.max(1, r));
        g.addColorStop(0, `rgba(255,120,60,${a})`);
        g.addColorStop(0.22, `rgba(240,40,15,${a * 0.82})`);
        g.addColorStop(0.55, `rgba(180,8,5,${a * 0.48})`);
        g.addColorStop(0.8, `rgba(80,0,2,${a * 0.22})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, Math.max(1, r), 0, TAU);
        ctx.fill();
      }

      // Shockwaves — crimson rings
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        w.age += dt;
        if (w.age >= w.life) {
          waves.splice(i, 1);
          continue;
        }
        const tp = w.age / w.life;
        const r = lerp(0, w.maxR, Math.pow(tp, 0.5));
        const a = (1 - tp) * (1 - tp) * 0.7;
        const lw = lerp(8, 0.5, tp);
        ctx.beginPath();
        ctx.arc(w.x, w.y, r, 0, TAU);
        ctx.lineWidth = lw;
        ctx.strokeStyle = `rgba(240,50,18,${a})`;
        ctx.stroke();
        ctx.lineWidth = lw * 3;
        ctx.strokeStyle = `rgba(160,8,5,${a * 0.35})`;
        ctx.stroke();
        if (tp < 0.5) {
          ctx.beginPath();
          ctx.arc(w.x, w.y, lerp(0, w.maxR * 0.5, tp * 2), 0, TAU);
          ctx.lineWidth = lw * 0.5;
          ctx.strokeStyle = `rgba(255,90,40,${a * 0.5})`;
          ctx.stroke();
        }
      }

      // Smoke (under flame)
      ctx.globalCompositeOperation = "source-over";
      for (const s of smoke.items) {
        if (!s.alive) continue;
        s.age += dt;
        if (s.age >= s.life) {
          s.alive = false;
          continue;
        }
        s.x += s.vx * dtS;
        s.y += s.vy * dtS;
        s.vy -= dtS * 8;
        s.vx += rand(-4, 4) * dtS;
        const tp = s.age / s.life;
        const r = Math.max(1, s.r * (1 + tp * 1.2));
        const a = (1 - tp) * (s.dark ? 0.18 : 0.1) * Math.sin(tp * Math.PI);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        g.addColorStop(0, s.dark ? `rgba(12,2,2,${a})` : `rgba(80,10,5,${a})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, TAU);
        ctx.fill();
      }

      // Flame puffs
      ctx.globalCompositeOperation = "lighter";
      for (const f of flames.items) {
        if (!f.alive) continue;
        f.age += dt;
        if (f.age >= f.life) {
          f.alive = false;
          continue;
        }
        f.x += f.vx * dtS;
        f.y += f.vy * dtS;
        f.vy -= dtS * 55;
        f.vx *= Math.pow(0.95, dtS * 60);
        f.vx += Math.sin(now * 0.007 + f.age * 0.01) * dtS * 40;
        const tp = f.age / f.life;
        const hotness = f.hot * (1 - tp);
        const r = Math.max(1, f.r * (1 + tp * 0.3));
        const a = Math.sin(tp * Math.PI) * 0.7 * f.hot;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        g.addColorStop(0, sunColor(hotness, a));
        g.addColorStop(0.45, sunColor(hotness * 0.6, a * 0.7));
        g.addColorStop(0.8, sunColor(hotness * 0.3, a * 0.3));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, r, 0, TAU);
        ctx.fill();
      }

      // Trail — crimson solar ribbon
      if (trail.length >= 3) {
        for (let i = 1; i < trail.length; i++) {
          const age = (now - trail[i].t) / 320;
          const alpha = clamp(1 - age, 0, 1);
          if (alpha < 0.01) continue;
          const w = lerp(2, 10, 1 - age);
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(trail[i].x, trail[i].y);
          ctx.lineWidth = w * 4;
          ctx.strokeStyle = `rgba(140,5,2,${alpha * 0.15})`;
          ctx.stroke();
          ctx.lineWidth = w * 2.5;
          ctx.strokeStyle = `rgba(230,25,10,${alpha * 0.32})`;
          ctx.stroke();
          ctx.lineWidth = w * 1.4;
          ctx.strokeStyle = `rgba(255,60,20,${alpha * 0.55})`;
          ctx.stroke();
          ctx.lineWidth = w * 0.8;
          ctx.strokeStyle = `rgba(255,105,45,${alpha * 0.72})`;
          ctx.stroke();
          ctx.lineWidth = Math.max(1, w * 0.42);
          ctx.strokeStyle = `rgba(255,175,100,${alpha * 0.9})`;
          ctx.stroke();
        }
      }

      // Sparks
      for (const s of sparks.items) {
        if (!s.alive) continue;
        s.age += dt;
        if (s.age >= s.life) {
          s.alive = false;
          continue;
        }
        s.px = s.x;
        s.py = s.y;
        s.x += s.vx * dtS;
        s.y += s.vy * dtS;
        s.vy += 180 * dtS;
        s.vx *= Math.pow(0.88, dtS * 60);
        const tp = s.age / s.life;
        const a = clamp((1 - tp) * (1 - tp) * s.bright * 1.2, 0, 1);
        const hotness = 1 - tp * 0.6;
        const slen = clamp(Math.hypot(s.x - s.px, s.y - s.py), 2, 18);
        const ang = Math.atan2(s.y - s.py, s.x - s.px);
        const lw = clamp(2 - tp * 1.5, 0.5, 2);
        // Translation is in device pixels, so scale it by dpr
        ctx.setTransform(dpr, 0, 0, dpr, s.x * dpr, s.y * dpr);
        ctx.rotate(ang + Math.PI);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(slen, 0);
        const gc = ctx.createLinearGradient(0, 0, slen, 0);
        gc.addColorStop(0, sunColor(hotness, a));
        gc.addColorStop(1, sunColor(hotness * 0.4, 0));
        ctx.strokeStyle = gc;
        ctx.lineWidth = lw;
        ctx.stroke();
        ctx.strokeStyle = sunColor(hotness, a * 0.25);
        ctx.lineWidth = lw * 2;
        ctx.stroke();
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Embers
      for (const e of embers.items) {
        if (!e.alive) continue;
        e.age += dt;
        if (e.age >= e.life) {
          e.alive = false;
          continue;
        }
        e.x += e.vx * dtS + Math.sin(now * 0.004 + e.phase) * e.sway * dtS;
        e.y += e.vy * dtS;
        e.vy += e.grav * dtS;
        e.vx *= Math.pow(0.97, dtS * 60);
        const tp = e.age / e.life;
        const hotness = e.hot * (1 - tp * 0.7);
        const a = (1 - tp) * (1 - tp) * 0.95;
        const r = e.sz * (1 - tp * 0.3);
        ctx.fillStyle = sunColor(hotness, a);
        ctx.beginPath();
        ctx.arc(e.x, e.y, Math.max(0.5, r), 0, TAU);
        ctx.fill();
        ctx.fillStyle = sunColor(clamp(hotness, 0, 1), a * 0.3);
        ctx.beginPath();
        ctx.arc(e.x, e.y, Math.max(0.5, r * 2.2), 0, TAU);
        ctx.fill();
      }

      // Cursor tip — solar core
      if (visible) {
        const flicker =
          0.88 + 0.08 * Math.sin(now * 0.013) + 0.06 * Math.sin(now * 0.031 + 1.3) + 0.04 * Math.sin(now * 0.05 + 2.7);
        const cx = P.x + Math.sin(now * 0.022) * 1.2;
        const cy = P.y + Math.sin(now * 0.019 + 1.5) * 1.2;

        const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, 58 * flicker);
        og.addColorStop(0, "rgba(220,25,8,0.22)");
        og.addColorStop(0.45, "rgba(160,8,3,0.09)");
        og.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = og;
        ctx.beginPath();
        ctx.arc(cx, cy, 58 * flicker, 0, TAU);
        ctx.fill();

        const cg = ctx.createRadialGradient(cx, cy, 18 * flicker, cx, cy, 42 * flicker);
        cg.addColorStop(0, "rgba(0,0,0,0)");
        cg.addColorStop(0.5, "rgba(200,18,6,0.10)");
        cg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(cx, cy, 42 * flicker, 0, TAU);
        ctx.fill();

        const mg = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy, 28 * flicker);
        mg.addColorStop(0, "rgba(255,90,35,0.82)");
        mg.addColorStop(0.28, "rgba(240,30,10,0.70)");
        mg.addColorStop(0.65, "rgba(160,5,4,0.32)");
        mg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.arc(cx, cy - 2, 28 * flicker, 0, TAU);
        ctx.fill();

        const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 9 * flicker);
        hg.addColorStop(0, "rgba(255,200,100,1)");
        hg.addColorStop(0.28, "rgba(255,80,30,0.95)");
        hg.addColorStop(0.62, "rgba(220,15,8,0.60)");
        hg.addColorStop(1, "rgba(100,0,2,0)");
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(cx, cy, 9 * flicker, 0, TAU);
        ctx.fill();

        ctx.fillStyle = `rgba(255,210,120,${flicker * 0.96})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.4 * flicker, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      // Heat shimmer layer
      hctx.clearRect(0, 0, W, H);
      hctx.globalAlpha = 0.85;
      for (const h of heat.items) {
        if (!h.alive) continue;
        h.age += dt;
        if (h.age >= h.life) {
          h.alive = false;
          continue;
        }
        const tp = h.age / h.life;
        const r = Math.max(1, h.str * 20 * (1 - tp * 0.4));
        const a = (1 - tp) * 0.11;
        const g = hctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, r);
        g.addColorStop(0, `rgba(220,35,10,${a})`);
        g.addColorStop(0.5, `rgba(140,8,3,${a * 0.4})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        hctx.fillStyle = g;
        hctx.beginPath();
        hctx.arc(h.x, h.y, r, 0, TAU);
        hctx.fill();
      }
    }

    raf = requestAnimationFrame(frame);
    document.documentElement.classList.add("sun-cursor");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("sun-cursor");
    };
  }, []);

  const layer = { position: "fixed", inset: 0, pointerEvents: "none" };
  return (
    <>
      <canvas ref={heatRef} aria-hidden="true" style={{ ...layer, zIndex: 9998 }} />
      <canvas ref={mainRef} aria-hidden="true" style={{ ...layer, zIndex: 9999 }} />
    </>
  );
}
