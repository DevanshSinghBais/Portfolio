"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────────────────
   Fracture — a refractive glass-shatter hero.

   A calm frosted ice-glass pane (a frosted headline read through it, faint
   crack lines etched in) BURSTS into refractive shards wherever the cursor
   passes: nearby shards lift toward the viewer, tilt, separate, and refract
   the vivid world beneath (a deep gradient + a second headline) — splitting
   light into a thin chromatic fringe at every cut edge. Behind the cursor the
   shards spring back and the frost re-seals. No image files — drops anywhere.

   ONE WebGL scene (three, no react-three-fiber): a Voronoi shatter pattern is
   built on the CPU (~35 convex shards tiling the screen); two baked canvases
   (front frost / back vivid) become textures; a PerspectiveCamera looks at a
   back quad + one mesh per shard whose ShaderMaterial mixes front→refracted
   back with a fresnel rim, bevel-lit cut edges and a specular glint. One rAF
   loop springs each shard's "openness" toward cursor proximity and writes
   transforms + uniforms straight to the GPU — no per-frame React re-render.

   Standalone: the cursor is a shockwave that breaks the surface.
   ?card: a virtual cursor roams a Lissajous path so the thumbnail plays itself.
   prefers-reduced-motion: one calm intact frosted frame, no solver.
   ──────────────────────────────────────────────────────────────────────── */

// Two aligned headline layers (frosted surface vs. revealed depth). Swappable.
const FRONT = {
  kicker: "HOLD STILL",
  word: "COMPOSED",
  sub: "a surface at rest",
};
const BACK = {
  kicker: "LOOK CLOSER",
  word: "FRACTURED",
  sub: "every calm surface has a fault line",
};

const SHARD_VERT = `
  attribute vec2 aUv;
  attribute float aEdge;
  varying vec2 vUv;
  varying float vEdge;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vUv = aUv;
    vEdge = aEdge;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalMatrix * normal;
    vViewDir = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const SHARD_FRAG = `
  precision highp float;
  varying vec2 vUv;
  varying float vEdge;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  uniform sampler2D uFront;
  uniform sampler2D uBack;
  uniform float uOpen;
  uniform float uReveal;   // global floor so the card never reads fully dead

  void main() {
    vec3 N = normalize(vNormalV);
    vec3 V = normalize(vViewDir);
    float open = clamp(uOpen, 0.0, 1.0);
    float o = smoothstep(0.0, 1.0, open);

    // refraction: bend the back layer by the shard's tilt, harder as it opens
    vec2 off = N.xy * (0.010 + 0.060 * open);
    vec2 caDir = normalize(N.xy + vec2(1e-4));
    float ca = 0.004 + 0.016 * open;
    vec3 back;
    back.r = texture2D(uBack, vUv + off + caDir * ca).r;
    back.g = texture2D(uBack, vUv + off).g;
    back.b = texture2D(uBack, vUv + off - caDir * ca).b;

    vec3 front = texture2D(uFront, vUv).rgb;
    vec3 base = mix(front, back, o);

    // glass shading
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float bevel = smoothstep(0.0, 0.40, 1.0 - vEdge);   // 1 near the cut edge
    vec3 L = normalize(vec3(-0.5, 0.7, 0.75));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 42.0);

    vec3 col = base;
    col += fres * (0.10 + 0.10 * (1.0 - open)) * vec3(0.82, 0.90, 1.0); // cool rim, softer when open
    col += bevel * (0.05 + 0.18 * open) * vec3(1.0);      // cut edges catch light
    col += spec * (0.30 + 0.45 * open);                   // specular glint
    col -= bevel * (1.0 - open) * 0.17;                   // etched crack lines at rest
    col = mix(col, col * 1.03 + 0.015, uReveal);

    gl_FragColor = vec4(col, 1.0);
  }
`;

const BACK_VERT = `
  attribute vec2 aUv;
  varying vec2 vUv;
  void main() {
    vUv = aUv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BACK_FRAG = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uBack;
  void main() {
    vec3 c = texture2D(uBack, vUv).rgb;
    vec2 q = vUv - 0.5;
    float vig = 1.0 - dot(q, q) * 0.55;
    gl_FragColor = vec4(c * vig, 1.0);
  }
`;

type Poly = { x: number; y: number }[];

/* Clip a convex polygon by the half-plane on the seed's side of the bisector
   between seed s and neighbour n (Sutherland–Hodgman). */
function clipHalfPlane(poly: Poly, sx: number, sy: number, nx: number, ny: number): Poly {
  // bisector: points closer to (sx,sy) than (nx,ny). normal = s - n, through midpoint.
  const ax = sx - nx;
  const ay = sy - ny;
  const mx = (sx + nx) / 2;
  const my = (sy + ny) / 2;
  // keep points where dot(p - m, a) >= 0
  const inside = (p: { x: number; y: number }) => (p.x - mx) * ax + (p.y - my) * ay >= 0;
  const out: Poly = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn !== prevIn) {
      // intersection of segment prev→cur with the bisector line
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      const denom = dx * ax + dy * ay;
      if (Math.abs(denom) > 1e-9) {
        const t = ((mx - prev.x) * ax + (my - prev.y) * ay) / denom;
        out.push({ x: prev.x + t * dx, y: prev.y + t * dy });
      }
    }
    if (curIn) out.push(cur);
  }
  return out;
}

export default function FractureGlass() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const isCard = new URLSearchParams(window.location.search).has("card");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── renderer + scene ────────────────────────────────────────────────
    const canvas = document.createElement("canvas");
    canvas.className = "kxf-gl";
    host.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0xe9eef4, 1);

    const scene = new THREE.Scene();
    const FOV = 40;
    const CAM_Z = 10;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    // visible half-extents at z=0
    let halfH = CAM_Z * Math.tan((FOV / 2) * (Math.PI / 180));
    let halfW = halfH;

    // ── two baked textures (front frost / back vivid) ───────────────────
    const frontCanvas = document.createElement("canvas");
    const backCanvas = document.createElement("canvas");
    const frontTex = new THREE.CanvasTexture(frontCanvas);
    const backTex = new THREE.CanvasTexture(backCanvas);
    for (const tx of [frontTex, backTex]) {
      tx.flipY = false;
      tx.minFilter = THREE.LinearFilter;
      tx.magFilter = THREE.LinearFilter;
      tx.generateMipmaps = false;
    }

    const sharedUniforms = {
      uFront: { value: frontTex },
      uBack: { value: backTex },
      uReveal: { value: 0 },
    };

    // ── back quad ───────────────────────────────────────────────────────
    const backUniforms = { uBack: { value: backTex } };
    const backMat = new THREE.ShaderMaterial({
      vertexShader: BACK_VERT,
      fragmentShader: BACK_FRAG,
      uniforms: backUniforms,
    });
    const backGeo = new THREE.BufferGeometry();
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.z = -0.02;
    scene.add(backMesh);

    function buildBackQuad() {
      const X = halfW * 1.06;
      const Y = halfH * 1.06;
      const pos = new Float32Array([-X, -Y, 0, X, -Y, 0, X, Y, 0, -X, Y, 0]);
      // screen-uv: u = .5 + x/(2halfW), v = .5 - y/(2halfH)
      const uv = new Float32Array([
        0.5 - X / (2 * halfW), 0.5 + Y / (2 * halfH),
        0.5 + X / (2 * halfW), 0.5 + Y / (2 * halfH),
        0.5 + X / (2 * halfW), 0.5 - Y / (2 * halfH),
        0.5 - X / (2 * halfW), 0.5 - Y / (2 * halfH),
      ]);
      backGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      backGeo.setAttribute("aUv", new THREE.BufferAttribute(uv, 2));
      backGeo.setIndex([0, 1, 2, 0, 2, 3]);
    }

    // ── shard state ─────────────────────────────────────────────────────
    type Shard = {
      mesh: THREE.Mesh;
      mat: THREE.ShaderMaterial;
      cx: number;
      cy: number; // centroid (world)
      open: number; // 0 frosted .. 1 fully revealing the back
      ov: number; // open-spring velocity (intact preview only)
      spin: number; // per-shard tumble flavour
      broken: boolean; // has it been knocked loose?
      vx: number;
      vy: number;
      vz: number; // linear velocity while falling
      rvx: number;
      rvy: number;
      rvz: number; // angular velocity while falling
    };
    let shards: Shard[] = [];

    function disposeShards() {
      for (const s of shards) {
        scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        s.mat.dispose();
      }
      shards = [];
    }

    function buildShards() {
      disposeShards();
      const X = halfW * 1.06;
      const Y = halfH * 1.06;

      // jittered grid of seeds, count scaled to area
      const aspect = halfW / halfH;
      const cols = Math.max(4, Math.round(6 * Math.sqrt(aspect)));
      const rows = Math.max(4, Math.round(6 / Math.sqrt(aspect)));
      const seeds: { x: number; y: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const jx = (Math.random() - 0.5) * 0.9;
          const jy = (Math.random() - 0.5) * 0.9;
          seeds.push({
            x: (-X) + ((c + 0.5 + jx) / cols) * 2 * X,
            y: (-Y) + ((r + 0.5 + jy) / rows) * 2 * Y,
          });
        }
      }

      const rect: Poly = [
        { x: -X, y: -Y },
        { x: X, y: -Y },
        { x: X, y: Y },
        { x: -X, y: Y },
      ];

      for (let i = 0; i < seeds.length; i++) {
        const s = seeds[i];
        let cell: Poly = rect;
        for (let j = 0; j < seeds.length && cell.length >= 3; j++) {
          if (j === i) continue;
          cell = clipHalfPlane(cell, s.x, s.y, seeds[j].x, seeds[j].y);
        }
        if (cell.length < 3) continue;

        // centroid
        let cxw = 0;
        let cyw = 0;
        for (const p of cell) {
          cxw += p.x;
          cyw += p.y;
        }
        cxw /= cell.length;
        cyw /= cell.length;

        // fan-triangulated geometry, local coords centred on the centroid
        const n = cell.length;
        const positions = new Float32Array((n + 1) * 3);
        const uvs = new Float32Array((n + 1) * 2);
        const edges = new Float32Array(n + 1);
        // vertex 0 = centroid
        positions[0] = 0;
        positions[1] = 0;
        positions[2] = 0;
        uvs[0] = 0.5 + cxw / (2 * halfW);
        uvs[1] = 0.5 - cyw / (2 * halfH);
        edges[0] = 1;
        for (let k = 0; k < n; k++) {
          const p = cell[k];
          positions[(k + 1) * 3] = p.x - cxw;
          positions[(k + 1) * 3 + 1] = p.y - cyw;
          positions[(k + 1) * 3 + 2] = 0;
          uvs[(k + 1) * 2] = 0.5 + p.x / (2 * halfW);
          uvs[(k + 1) * 2 + 1] = 0.5 - p.y / (2 * halfH);
          edges[k + 1] = 0;
        }
        const normals = new Float32Array((n + 1) * 3);
        for (let k = 0; k <= n; k++) normals[k * 3 + 2] = 1;
        const index: number[] = [];
        for (let k = 0; k < n; k++) {
          index.push(0, k + 1, ((k + 1) % n) + 1);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geo.setAttribute("aUv", new THREE.BufferAttribute(uvs, 2));
        geo.setAttribute("aEdge", new THREE.BufferAttribute(edges, 1));
        geo.setIndex(index);

        const mat = new THREE.ShaderMaterial({
          vertexShader: SHARD_VERT,
          fragmentShader: SHARD_FRAG,
          uniforms: {
            uFront: sharedUniforms.uFront,
            uBack: sharedUniforms.uBack,
            uReveal: sharedUniforms.uReveal,
            uOpen: { value: 0 },
          },
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cxw, cyw, 0);
        scene.add(mesh);

        shards.push({
          mesh,
          mat,
          cx: cxw,
          cy: cyw,
          open: 0,
          ov: 0,
          spin: (Math.random() - 0.5) * 2,
          broken: false,
          vx: 0,
          vy: 0,
          vz: 0,
          rvx: 0,
          rvy: 0,
          rvz: 0,
        });
      }
    }

    // ── bake the two headline canvases ──────────────────────────────────
    function bakeLayer(
      cnv: HTMLCanvasElement,
      kind: "front" | "back",
    ) {
      const ctx = cnv.getContext("2d");
      if (!ctx) return;
      const w = cnv.width;
      const h = cnv.height;
      ctx.clearRect(0, 0, w, h);

      if (kind === "front") {
        const g = ctx.createLinearGradient(0, 0, w * 0.4, h);
        g.addColorStop(0, "#f2f6fa");
        g.addColorStop(0.55, "#e3eaf1");
        g.addColorStop(1, "#d4dde7");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        // soft cool bloom
        const r = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, h * 0.9);
        r.addColorStop(0, "rgba(255,255,255,0.5)");
        r.addColorStop(1, "rgba(210,222,234,0)");
        ctx.fillStyle = r;
        ctx.fillRect(0, 0, w, h);
      } else {
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#0a0a16");
        g.addColorStop(0.42, "#241056");
        g.addColorStop(0.72, "#7a1e74");
        g.addColorStop(1, "#c43a5f");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        // vivid colour blooms
        const b1 = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, h * 0.8);
        b1.addColorStop(0, "rgba(255,90,150,0.45)");
        b1.addColorStop(1, "rgba(255,90,150,0)");
        ctx.fillStyle = b1;
        ctx.fillRect(0, 0, w, h);
        const b2 = ctx.createRadialGradient(w * 0.2, h * 0.7, 0, w * 0.2, h * 0.7, h * 0.7);
        b2.addColorStop(0, "rgba(80,120,255,0.4)");
        b2.addColorStop(1, "rgba(80,120,255,0)");
        ctx.fillStyle = b2;
        ctx.fillRect(0, 0, w, h);
      }

      const L = kind === "front" ? FRONT : BACK;
      const ink = kind === "front" ? "#8aa0b6" : "#fbeeff";
      const cx = w * 0.5;
      const word = L.word;

      // size the giant word, then shrink to fit ~84% of the width
      let fs = Math.min(w * 0.16, h * 0.34);
      ctx.font = `800 ${Math.round(fs)}px "Syne", system-ui, sans-serif`;
      const maxWordW = w * 0.84;
      const measuredW = ctx.measureText(word).width;
      if (measuredW > maxWordW) fs *= maxWordW / measuredW;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // kicker (mono) above the word
      ctx.save();
      ctx.fillStyle = ink;
      ctx.globalAlpha = kind === "front" ? 0.55 : 0.78;
      ctx.font = `500 ${Math.round(fs * 0.11)}px "Spline Sans Mono", monospace`;
      // letter-spaced kicker
      drawTracked(ctx, L.kicker.toUpperCase(), cx, h * 0.5 - fs * 0.72, fs * 0.11 * 0.42);
      ctx.restore();

      // the giant word
      ctx.save();
      ctx.fillStyle = ink;
      if (kind === "front") {
        // frosted: low contrast + a soft blur
        ctx.globalAlpha = 0.92;
        ctx.shadowColor = "rgba(150,170,190,0.85)";
        ctx.shadowBlur = fs * 0.06;
      } else {
        ctx.shadowColor = "rgba(255,150,210,0.55)";
        ctx.shadowBlur = fs * 0.10;
      }
      ctx.font = `800 ${Math.round(fs)}px "Syne", system-ui, sans-serif`;
      ctx.fillText(word, cx, h * 0.5);
      ctx.restore();

      // subline (mono) below
      ctx.save();
      ctx.fillStyle = ink;
      ctx.globalAlpha = kind === "front" ? 0.4 : 0.6;
      ctx.font = `400 ${Math.round(fs * 0.085)}px "Spline Sans Mono", monospace`;
      drawTracked(ctx, L.sub.toUpperCase(), cx, h * 0.5 + fs * 0.66, fs * 0.085 * 0.3);
      ctx.restore();
    }

    // letter-spaced centred text (canvas has no letter-spacing in older engines)
    function drawTracked(
      ctx: CanvasRenderingContext2D,
      text: string,
      cx: number,
      y: number,
      track: number,
    ) {
      const widths = [...text].map((ch) => ctx.measureText(ch).width + track);
      const total = widths.reduce((a, b) => a + b, 0) - track;
      let x = cx - total / 2;
      const prevAlign = ctx.textAlign;
      ctx.textAlign = "left";
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], x, y);
        x += widths[i];
      }
      ctx.textAlign = prevAlign;
    }

    function bakePanels() {
      bakeLayer(frontCanvas, "front");
      bakeLayer(backCanvas, "back");
      frontTex.needsUpdate = true;
      backTex.needsUpdate = true;
    }

    // ── sizing ──────────────────────────────────────────────────────────
    function resize() {
      const w = host!.clientWidth || window.innerWidth;
      const h = host!.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      halfH = CAM_Z * Math.tan((FOV / 2) * (Math.PI / 180));
      halfW = halfH * aspect;

      const pr = Math.min(window.devicePixelRatio || 1, 2);
      let tw = Math.round(w * pr);
      let th = Math.round(h * pr);
      const capW = 2200;
      if (tw > capW) {
        th = Math.round(th * (capW / tw));
        tw = capW;
      }
      for (const c of [frontCanvas, backCanvas]) {
        c.width = tw;
        c.height = th;
      }
      buildBackQuad();
      buildShards();
      bakePanels();
    }

    if (document.fonts && "load" in document.fonts) {
      document.fonts.load('800 100px "Syne"').then(bakePanels).catch(() => {});
      document.fonts.load('500 40px "Spline Sans Mono"').then(bakePanels).catch(() => {});
    }

    resize();

    // coalesce resize bursts to one rebuild per frame
    let resizePending = false;
    const ro = new ResizeObserver(() => {
      if (resizePending) return;
      resizePending = true;
      requestAnimationFrame(() => {
        resizePending = false;
        resize();
      });
    });
    ro.observe(host);

    // ── cursor (world coords) ───────────────────────────────────────────
    const cursor = { x: 1e9, y: 1e9 }; // off-screen until moved
    let pointerInside = false;

    function setCursorFromClient(clientX: number, clientY: number) {
      const rect = host!.getBoundingClientRect();
      const u = (clientX - rect.left) / rect.width;
      const v = (clientY - rect.top) / rect.height;
      cursor.x = (u - 0.5) * 2 * halfW;
      cursor.y = (0.5 - v) * 2 * halfH;
    }
    const onMove = (e: PointerEvent) => {
      pointerInside = true;
      setCursorFromClient(e.clientX, e.clientY);
    };
    const onLeave = () => {
      pointerInside = false;
      cursor.x = 1e9;
      cursor.y = 1e9;
    };
    if (!isCard && !reduced) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    // ── solver constants ────────────────────────────────────────────────
    const STIFF = 0.18; // intact "stress" preview spring
    const DAMP = 0.74;
    const PREVIEW_LIFT = 0.5; // how far an intact shard leans before it breaks
    const PREVIEW_TILT = 0.3;
    const GRAV = -13.0; // world units / s² — gravity once a shard falls
    const HIDE_Y = -halfH - 3.0; // gone once it falls below this

    // Knock a shard loose: a quick pop/tilt (the "break"), then gravity takes it.
    function breakShard(s: Shard, curX: number, curY: number) {
      s.broken = true;
      let odx = s.cx - curX;
      let ody = s.cy - curY;
      const od = Math.sqrt(odx * odx + ody * ody) || 1;
      odx /= od;
      ody /= od;
      s.vx = odx * (0.5 + Math.random() * 1.4);
      s.vy = 0.7 + Math.random() * 1.2; // small upward pop first
      s.vz = 1.0 + Math.random() * 1.4; // pops toward the viewer, falls in front
      s.rvx = (Math.random() - 0.5) * 6.5;
      s.rvy = (Math.random() - 0.5) * 6.5;
      s.rvz = (Math.random() - 0.5) * 5.0;
    }

    // Re-form the whole pane so it can shatter again (frost condenses back over
    // the revealed scene). Used by the auto loop + idle reset.
    function reform() {
      for (const s of shards) {
        s.broken = false;
        s.mesh.visible = true;
        s.mesh.position.set(s.cx, s.cy, 0);
        s.mesh.rotation.set(0, 0, 0);
        s.vx = s.vy = s.vz = s.rvx = s.rvy = s.rvz = 0;
        s.ov = 0;
        s.open = 1; // start revealed; the frost eases back in
        s.mat.uniforms.uOpen.value = 1;
      }
    }

    // ── reduced motion: one calm frame — a corner already fallen as a hint ──
    if (reduced) {
      shards.forEach((s) => {
        const fallen = s.cy < -halfH * 0.4 && s.cx > halfW * 0.2;
        if (fallen) {
          s.mesh.visible = false;
        } else {
          s.open = 0;
          s.mat.uniforms.uOpen.value = 0;
        }
      });
      sharedUniforms.uReveal.value = 0;
      const renderOnce = () => renderer.render(scene, camera);
      renderOnce();
      const id = window.setTimeout(renderOnce, 420);
      return () => {
        window.clearTimeout(id);
        ro.disconnect();
        disposeShards();
        backGeo.dispose();
        backMat.dispose();
        frontTex.dispose();
        backTex.dispose();
        renderer.dispose();
        canvas.remove();
      };
    }

    // ── render loop ─────────────────────────────────────────────────────
    let raf = 0;
    let tPrev = performance.now();
    const start = tPrev;
    let allBrokenAt = -1; // elapsed time the last shard broke (for the hold + loop)
    let idleOut = 0; // seconds the pointer has been away (standalone reset)

    function frame(now: number) {
      const elapsed = (now - start) / 1000;
      const dt = Math.min(0.033, (now - tPrev) / 1000);
      tPrev = now;

      // reveal floor fades in
      sharedUniforms.uReveal.value = Math.min(1, sharedUniforms.uReveal.value + 0.02);

      const RADIUS = halfH * 1.1; // preview stress radius
      const BR = halfH * (isCard ? 0.46 : 0.4); // break radius around the cursor

      // card mode: a virtual cursor roams a Lissajous path, clearing the pane
      if (isCard) {
        cursor.x = halfW * 0.66 * Math.sin(elapsed * 0.75);
        cursor.y = halfH * 0.56 * Math.sin(elapsed * 1.12 + 0.6);
      }

      const live = isCard || pointerInside;
      let allBroken = true;

      for (const s of shards) {
        if (!s.broken) {
          allBroken = false;
          let previewOpen = 0;
          if (live) {
            const dx = cursor.x - s.cx;
            const dy = cursor.y - s.cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < BR) {
              breakShard(s, cursor.x, cursor.y);
            } else {
              const t = Math.max(0, 1 - d / RADIUS);
              previewOpen = Math.min(0.3, t * t * 0.55);
            }
          }
          if (!s.broken) {
            // intact: ease the "stress" preview (a slight lean + crack glow)
            s.ov += (previewOpen - s.open) * STIFF;
            s.ov *= DAMP;
            s.open += s.ov;
            if (s.open < 0) {
              s.open = 0;
              if (s.ov < 0) s.ov = 0;
            }
            const o = s.open;
            let odx = s.cx - cursor.x;
            let ody = s.cy - cursor.y;
            const od = Math.sqrt(odx * odx + ody * ody) || 1;
            odx /= od;
            ody /= od;
            s.mesh.position.set(s.cx, s.cy, o * PREVIEW_LIFT);
            s.mesh.rotation.set(ody * o * PREVIEW_TILT, -odx * o * PREVIEW_TILT, s.spin * o * 0.1);
            s.mat.uniforms.uOpen.value = o;
          }
        }

        if (s.broken) {
          // falling: gravity + tumble, showing the refracted back as it drops
          s.vy += GRAV * dt;
          s.mesh.position.x += s.vx * dt;
          s.mesh.position.y += s.vy * dt;
          s.mesh.position.z += s.vz * dt;
          s.mesh.rotation.x += s.rvx * dt;
          s.mesh.rotation.y += s.rvy * dt;
          s.mesh.rotation.z += s.rvz * dt;
          s.open = Math.min(1, s.open + dt * 7); // reveal what's behind
          s.mat.uniforms.uOpen.value = s.open;
          if (s.mesh.position.y < HIDE_Y) s.mesh.visible = false;
          if (s.mesh.visible) allBroken = false; // wait for it to leave the frame
        }
      }

      // auto loop: once the whole pane has fallen away, hold on the full reveal
      // then re-form the frost so it can shatter again.
      if (allBroken) {
        if (allBrokenAt < 0) allBrokenAt = elapsed;
        else if (elapsed - allBrokenAt > 1.6) {
          reform();
          allBrokenAt = -1;
        }
      } else {
        allBrokenAt = -1;
      }

      // standalone: if the pointer leaves with the pane partly broken, reset it
      if (!isCard) {
        if (!pointerInside) {
          idleOut += dt;
          if (idleOut > 2.5 && shards.some((s) => s.broken)) {
            reform();
            idleOut = 0;
          }
        } else {
          idleOut = 0;
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      disposeShards();
      backGeo.dispose();
      backMat.dispose();
      frontTex.dispose();
      backTex.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className="kxf-stage">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Spline+Sans+Mono:wght@400;500&display=swap');
        .kxf-stage {
          position: fixed; inset: 0; overflow: hidden;
          background: #e9eef4; cursor: crosshair;
          font-family: "Spline Sans Mono", monospace;
        }
        .kxf-gl { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .kxf-chrome {
          position: absolute; inset: 0; pointer-events: none; z-index: 2;
          color: #f3f1ea; mix-blend-mode: difference;
          text-transform: uppercase; letter-spacing: 0.16em;
        }
        .kxf-chrome span { position: absolute; font-size: 11px; font-weight: 500; white-space: nowrap; }
        .kxf-tl { top: 26px; left: 30px; font-weight: 700; letter-spacing: 0.04em; }
        .kxf-tr { top: 26px; right: 30px; }
        .kxf-bl { bottom: 26px; left: 30px; }
        .kxf-br { bottom: 26px; right: 30px; }
        @media (max-width: 640px) {
          .kxf-chrome span { font-size: 9px; letter-spacing: 0.12em; }
          .kxf-tl, .kxf-tr { top: 18px; }
          .kxf-tl, .kxf-bl { left: 18px; }
          .kxf-tr, .kxf-br { right: 18px; }
          .kxf-bl, .kxf-br { bottom: 18px; }
        }
      `}</style>
      <div className="kxf-chrome">
        <span className="kxf-tl">Kexsio®</span>
        <span className="kxf-tr">Fracture · Shatter</span>
        <span className="kxf-bl">Move the cursor — break the surface</span>
        <span className="kxf-br">Shatter / 01</span>
      </div>
    </div>
  );
}
