"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import { Suspense, createContext, useContext, useMemo, useRef } from "react";
import * as THREE from "three";

import { ACTS, easeInOut, easeOut, lerp, pulse, seg } from "./progress";

const ASSETS = {
  lion: "/assets/img/lion.png",
  laptop: "/assets/img/laptop.png",
  chip: "/assets/img/chip.png",
  brain: "/assets/img/brain.png",
  robot: "/assets/img/robot.png",
  vr: "/assets/img/vr.png",
  satellite: "/assets/img/satellite.png",
  controller: "/assets/img/controller.png",
  books: "/assets/img/books.png",
};

const ProgressCtx = createContext({ current: 0 });
const useProgress = () => useContext(ProgressCtx);

const LAYERS = 12;

function Slab({ tex, w, h, depth, matRef }) {
  const shells = useMemo(() => Array.from({ length: LAYERS }, (_, i) => i), []);
  return (
    <group>
      {shells.map((i) => {
        const t = i / (LAYERS - 1);
        const front = i === 0;
        return (
          <mesh key={i} position={[0, 0, -t * depth]} scale={1 - t * 0.02} castShadow={front}>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial
              ref={front ? matRef : null}
              map={tex}
              alphaTest={0.45}
              transparent={false}
              color={front ? "#ffffff" : new THREE.Color().setScalar(0.18 - t * 0.12)}
              metalness={front ? 0.65 : 0.35}
              roughness={front ? 0.28 : 0.75}
              envMapIntensity={front ? 1.25 : 0.35}
              emissive={front ? new THREE.Color("#20090a") : new THREE.Color("#000000")}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Floater({
  url,
  window: win,
  from,
  to,
  height,
  spin = 0.6,
  tilt = -0.25,
  floatSpeed = 1,
  glow = "#ff3b12",
}) {
  const tex = useTexture(url);
  const group = useRef(null);
  const mat = useRef(null);
  const light = useRef(null);
  const progress = useProgress();

  const aspect = useMemo(() => {
    const img = tex.image;
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
    return img && img.width && img.height ? img.width / img.height : 1;
  }, [tex]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = seg(progress.current, win[0], win[1]);
    const live = t > 0.001 && t < 0.999;
    g.visible = live;
    if (!live) return;

    const e = easeInOut(t);
    const time = state.clock.elapsedTime;

    g.position.set(
      lerp(from[0], to[0], e),
      lerp(from[1], to[1], e) + Math.sin(time * floatSpeed + from[0]) * 0.22,
      lerp(from[2], to[2], e),
    );
    g.rotation.z = tilt + Math.sin(time * 0.5 * floatSpeed) * 0.06 + (e - 0.5) * spin;
    g.rotation.y = Math.sin(time * 0.35 * floatSpeed + 1.2) * 0.32 + (e - 0.5) * spin * 0.9;
    g.rotation.x = Math.sin(time * 0.3 * floatSpeed) * 0.1;

    const p = pulse(t, 0.22, 0.72);
    const s = 0.72 + easeOut(p) * 0.28;
    g.scale.setScalar(s);

    const slab = g.children[0];
    if (slab) {
      slab.children.forEach((child, i) => {
        const m = child.material;
        const lt = i / (LAYERS - 1);
        const base = i === 0 ? 1 : Math.max(0, 0.18 - lt * 0.12);
        m.color.setScalar(base * p);
      });
    }
    if (mat.current) mat.current.envMapIntensity = 0.8 + p * 0.8;
    if (light.current) light.current.intensity = p * 12;
  });

  return (
    <group ref={group}>
      <Slab tex={tex} w={height * aspect} h={height} depth={height * 0.09} matRef={mat} />
      <pointLight
        ref={light}
        color={glow}
        distance={height * 2.4}
        intensity={0}
        position={[0, 0, height * 0.35]}
      />
    </group>
  );
}

/** Lion settles centered above the landing wordmark; publishes live screen rect. */
function Lion({ lionScreenRef }) {
  const tex = useTexture(ASSETS.lion);
  const group = useRef(null);
  const mat = useRef(null);
  const rim = useRef(null);
  const shells = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);
  const progress = useProgress();
  const { viewport, camera, size } = useThree();
  const box = useMemo(() => new THREE.Box3(), []);
  const corners = useMemo(() => Array.from({ length: 8 }, () => new THREE.Vector3()), []);

  useMemo(() => {
    tex.anisotropy = 8;
    tex.colorSpace = THREE.SRGBColorSpace;
  }, [tex]);

  const aspect = useMemo(() => {
    const img = tex.image;
    return img && img.width && img.height ? img.width / img.height : 1;
  }, [tex]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progress.current;
    const time = state.clock.elapsedTime;

    const wake = seg(p, ACTS.awaken[0], ACTS.awaken[1]);
    const mid = seg(p, ACTS.awaken[1], ACTS.hero[0]);
    // Drive toward landing hero slot (centered above wordmark).
    const home = easeInOut(seg(p, ACTS.hero[0], 0.97));

    const halfW = viewport.width / 2;
    const finalX = 0;
    const finalY = Math.min(viewport.height * 0.12, 1.1);
    const finalScale = Math.min(viewport.height * 0.42, 4.2);

    const prowlX = Math.sin(mid * Math.PI * 2.2) * halfW * 0.72;
    const prowlY = Math.sin(mid * Math.PI * 3.1) * 1.1 - 0.2;
    const prowlZ = -6 + Math.sin(mid * Math.PI * 1.6) * 3.5;
    const prowlScale = 3.4 + Math.sin(mid * Math.PI) * 1.4;

    const wakeE = easeOut(wake);
    const x = lerp(lerp(0, prowlX, wake), finalX, home);
    const y = lerp(lerp(0.1, prowlY, wake), finalY, home);
    const z = lerp(lerp(-9, prowlZ, wake), 1.2, home);
    const scale = lerp(lerp(2.2, prowlScale, wake), finalScale, home);

    g.position.set(x, y + Math.sin(time * 0.7) * 0.12 * (1 - home), z);
    g.scale.setScalar(scale);

    const swing = Math.sin(mid * Math.PI * 4) * 0.22 * (1 - home);
    g.rotation.z = swing + Math.sin(time * 0.6) * 0.02 * (1 - home);
    g.rotation.y = lerp(Math.sin(mid * Math.PI * 2) * 0.4, 0, home) + Math.sin(time * 0.4) * 0.04 * (1 - home);

    const reveal = Math.min(1, wakeE * 1.2);
    if (mat.current) mat.current.color.setScalar(reveal);
    if (rim.current) rim.current.intensity = reveal * (14 + Math.sin(time * 1.6) * 3) * (1 - home * 0.35);

    // Publish projected screen AABB once the lion is settling home.
    if (lionScreenRef && home > 0.15) {
      g.updateWorldMatrix(true, true);
      box.setFromObject(g);
      const { min, max } = box;
      corners[0].set(min.x, min.y, min.z);
      corners[1].set(min.x, min.y, max.z);
      corners[2].set(min.x, max.y, min.z);
      corners[3].set(min.x, max.y, max.z);
      corners[4].set(max.x, min.y, min.z);
      corners[5].set(max.x, min.y, max.z);
      corners[6].set(max.x, max.y, min.z);
      corners[7].set(max.x, max.y, max.z);

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const c of corners) {
        c.project(camera);
        const sx = (c.x * 0.5 + 0.5) * size.width;
        const sy = (-c.y * 0.5 + 0.5) * size.height;
        if (sx < minX) minX = sx;
        if (sy < minY) minY = sy;
        if (sx > maxX) maxX = sx;
        if (sy > maxY) maxY = sy;
      }
      lionScreenRef.current = {
        left: minX,
        top: minY,
        width: Math.max(1, maxX - minX),
        height: Math.max(1, maxY - minY),
      };
    }
  });

  return (
    <group ref={group}>
      {shells.map((i) => (
        <mesh key={i} position={[0, 0, -0.006 * (i + 1)]} scale={1 - i * 0.008}>
          <planeGeometry args={[aspect, 1]} />
          <meshBasicMaterial
            map={tex}
            alphaTest={0.5}
            transparent={false}
            color={new THREE.Color().setScalar(Math.max(0.03, 0.12 - i * 0.02))}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh>
        <planeGeometry args={[aspect, 1]} />
        <meshBasicMaterial
          ref={mat}
          map={tex}
          alphaTest={0.5}
          transparent={false}
          color="#000000"
          toneMapped={false}
        />
      </mesh>
      <pointLight ref={rim} color="#ff6a1e" distance={4} intensity={0} position={[0, 0, 0.6]} />
    </group>
  );
}

function emberTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d");
  const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,196,72,0.9)");
  grd.addColorStop(0.6, "rgba(226,58,17,0.35)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function Embers({ count = 260 }) {
  const points = useRef(null);
  const tex = useMemo(emberTexture, []);
  const { positions, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    const gold = new THREE.Color("#ffc23c");
    const red = new THREE.Color("#e0290f");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -12 + Math.random() * 16;
      seeds[i * 3] = 0.25 + Math.random() * 0.8;
      seeds[i * 3 + 1] = Math.random() * Math.PI * 2;
      seeds[i * 3 + 2] = 0.4 + Math.random() * 1.6;
      const c = Math.random() > 0.45 ? gold : red;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, seeds, colors };
  }, [count]);

  useFrame((state) => {
    const pts = points.current;
    if (!pts) return;
    const attr = pts.geometry.getAttribute("position");
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const rise = seeds[i * 3] ?? 1;
      const phase = seeds[i * 3 + 1] ?? 0;
      const baseX = positions[i * 3] ?? 0;
      const baseY = positions[i * 3 + 1] ?? 0;
      const baseZ = positions[i * 3 + 2] ?? 0;
      let y = baseY + ((t * rise) % 24);
      if (y > 9.5) y -= 20;
      attr.setXYZ(i, baseX + Math.sin(t * 0.35 * rise + phase) * 0.9, y, baseZ);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={0.22}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const progress = useProgress();
  const mouse = useRef({ x: 0, y: 0 });
  useFrame((state, delta) => {
    const p = progress.current;
    const cam = state.camera;
    mouse.current.x = state.pointer.x;
    mouse.current.y = state.pointer.y;

    const push = Math.sin(p * Math.PI * 6) * 0.9;
    const targetZ = lerp(15.5, 12.2, easeInOut(Math.min(1, p * 1.6))) + push;
    const targetX = mouse.current.x * 0.55 + Math.sin(p * Math.PI * 3) * 0.5;
    const targetY = -mouse.current.y * 0.35 + Math.cos(p * Math.PI * 2) * 0.25;

    const k = 1 - Math.exp(-3.5 * delta);
    cam.position.x += (targetX - cam.position.x) * k;
    cam.position.y += (targetY - cam.position.y) * k;
    cam.position.z += (targetZ - cam.position.z) * k;
    cam.rotation.z = lerp(cam.rotation.z, Math.sin(p * Math.PI * 4) * 0.02, k);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

const OBJECTS = [
  { url: ASSETS.laptop, window: [0.15, 0.33], from: [-16, -5, -10], to: [7.5, 3.4, 2], height: 8.5, spin: 1.1, tilt: 0.22 },
  { url: ASSETS.chip, window: [0.19, 0.35], from: [13, 6, -12], to: [-8.5, -3.6, 1], height: 7, spin: -1.4, tilt: -0.3, glow: "#ffb02e", floatSpeed: 1.3 },
  { url: ASSETS.brain, window: [0.32, 0.49], from: [0, -14, -14], to: [-6.8, 4.2, 2.4], height: 9, spin: 0.9, tilt: -0.18, glow: "#ffcf4d" },
  { url: ASSETS.robot, window: [0.35, 0.5], from: [15, -8, -9], to: [6.6, -3.2, 1.5], height: 8.6, spin: -0.7, tilt: 0.16, floatSpeed: 0.8 },
  { url: ASSETS.vr, window: [0.47, 0.63], from: [-15, 7, -12], to: [5.8, 3.2, 2.2], height: 8, spin: 1.3, tilt: 0.25, glow: "#ff4b1a" },
  { url: ASSETS.satellite, window: [0.5, 0.64], from: [12, -9, -13], to: [-7.4, -3.4, 1.2], height: 8.4, spin: -1, tilt: -0.22, glow: "#ffc23c", floatSpeed: 1.2 },
  { url: ASSETS.controller, window: [0.61, 0.76], from: [-4, -16, -12], to: [4.4, 1.4, 3], height: 9.5, spin: 1.6, tilt: 0.3, glow: "#ff2e0f" },
  { url: ASSETS.chip, window: [0.63, 0.75], from: [14, 8, -14], to: [-7.8, -2.6, -1], height: 6, spin: -1.2, tilt: -0.4, glow: "#ffb02e", floatSpeed: 1.4 },
  { url: ASSETS.laptop, window: [0.74, 0.88], from: [-15, 6, -11], to: [-6.2, 2.6, 1.8], height: 7.6, spin: 0.8, tilt: -0.2 },
  { url: ASSETS.books, window: [0.76, 0.88], from: [13, -10, -12], to: [6.4, -3, 1.6], height: 7.4, spin: -0.9, tilt: 0.18, glow: "#ffc23c" },
  { url: ASSETS.brain, window: [0.78, 0.88], from: [2, 15, -16], to: [0.6, 4.6, -3], height: 6.4, spin: 1.1, tilt: 0.1, glow: "#ffcf4d", floatSpeed: 1.1 },
];

function SceneContents({ lionScreenRef }) {
  return (
    <>
      <CameraRig />
      <Embers />
      <ambientLight intensity={1.05} />
      <directionalLight position={[-7, 9, 8]} intensity={1.35} color="#fff0cc" />
      <directionalLight position={[8, -4, 5]} intensity={0.5} color="#ff5a2a" />
      <pointLight position={[0, 0, 10]} intensity={22} distance={34} color="#ffe6b8" />
      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer intensity={3} color="#ffc23c" position={[0, 6, -6]} scale={[12, 6, 1]} />
          <Lightformer
            intensity={2}
            color="#e0290f"
            position={[-7, -2, -3]}
            rotation-y={Math.PI / 2}
            scale={[14, 5, 1]}
          />
          <Lightformer
            intensity={1.4}
            color="#ffe9b0"
            position={[7, 3, 2]}
            rotation-y={-Math.PI / 2}
            scale={[10, 4, 1]}
          />
        </Environment>
        {OBJECTS.map((o, i) => (
          <Floater key={i} {...o} />
        ))}
        <Lion lionScreenRef={lionScreenRef} />
      </Suspense>
    </>
  );
}

export function Scene3D({ progress, lionScreenRef }) {
  return (
    <ProgressCtx.Provider value={progress}>
      <Canvas
        camera={{ fov: 45, position: [0, 0, 15.5] }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContents lionScreenRef={lionScreenRef} />
      </Canvas>
    </ProgressCtx.Provider>
  );
}
