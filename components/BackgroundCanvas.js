"use client";

import { useEffect, useRef } from "react";

export default function BackgroundCanvas({ introActive = false }) {
  const canvasRef = useRef(null);
  const introActiveRef = useRef(introActive);

  useEffect(() => {
    introActiveRef.current = introActive;
  }, [introActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, DPR;
    let raf;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const noM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function mk(fromBottom) {
      return {
        x: Math.random() * W,
        y: fromBottom === false ? Math.random() * H : H + Math.random() * 80,
        r: 1 + Math.random() * 2,
        sp: 0.25 + Math.random() * 0.5,
        dr: (Math.random() - 0.5) * 0.45,
        hue: 16 + Math.random() * 22,
        a: 0.2 + Math.random() * 0.45,
        f: Math.random() * 6.28,
      };
    }
    const embers = Array.from({ length: noM ? 0 : 36 }, () => mk(false));

    const GS = 48;
    let nodes = [];
    function buildNodes() {
      nodes = [];
      for (let x = 0; x <= Math.ceil(W / GS) + 1; x++) {
        for (let y = 0; y <= Math.ceil(H / GS) + 1; y++) {
          if (Math.random() < 0.045) {
            nodes.push({ x: x * GS, y: y * GS, ph: Math.random() * 6.28, sp: 0.5 + Math.random() * 1, ma: 0.25 + Math.random() * 0.4 });
          }
        }
      }
    }
    buildNodes();
    window.addEventListener("resize", buildNodes);

    let bolts = [];
    let bt = 160;

    function draw(t) {
      if (introActiveRef.current) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, W, H);

      if (!noM) {
        for (const n of nodes) {
          const a = n.ma * (0.5 + 0.5 * Math.sin((t / 1000) * n.sp + n.ph));
          ctx.beginPath();
          ctx.fillStyle = `rgba(255,205,120,${a})`;
          ctx.shadowColor = "rgba(255,190,90,.9)";
          ctx.shadowBlur = 4;
          ctx.arc(n.x, n.y, 1.2, 0, 6.28);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      for (const e of embers) {
        e.y -= e.sp;
        e.x += e.dr + Math.sin(t / 1000 + e.f) * 0.14;
        e.f += 0.01;
        if (e.y < -10) Object.assign(e, mk(true));
        const a = e.a * (0.6 + 0.4 * Math.sin(t / 600 + e.f));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${e.hue},90%,58%,${a})`;
        ctx.shadowColor = `hsla(${e.hue},100%,55%,${a})`;
        ctx.shadowBlur = 5;
        ctx.arc(e.x, e.y, e.r, 0, 6.28);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!noM) {
        bt--;
        if (bt <= 0) {
          const sx = Math.random() * W;
          const sg = 5 + Math.floor(Math.random() * 4);
          const pts = [{ x: sx, y: -10 }];
          let x = sx;
          for (let i = 1; i <= sg; i++) {
            x += (Math.random() - 0.5) * 65;
            pts.push({ x, y: ((H + 20) * i) / sg });
          }
          bolts.push({ pts, life: 1 });
          bt = 280 + Math.random() * 360;
        }
      }
      bolts.forEach((b) => {
        ctx.beginPath();
        ctx.moveTo(b.pts[0].x, b.pts[0].y);
        for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i].x, b.pts[i].y);
        ctx.strokeStyle = `rgba(255,190,120,${0.45 * b.life})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = "rgba(255,140,60,.7)";
        ctx.shadowBlur = 8;
        ctx.stroke();
        b.life -= 0.018;
      });
      ctx.shadowBlur = 0;
      bolts = bolts.filter((b) => b.life > 0);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", buildNodes);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
