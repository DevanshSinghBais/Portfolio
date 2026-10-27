import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MiniatureWorld() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 3.5, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 8, 4);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rubyCoreLight = new THREE.PointLight(0xc8372d, 4, 8);
    rubyCoreLight.position.set(0, 0.6, 0);
    scene.add(rubyCoreLight);

    // Island Root Group
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Materials
    const creamBedrockMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      roughness: 0.35,
      metalness: 0.1,
    });

    const warmStoneMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8ded1,
      roughness: 0.8,
    });

    const rubyGlassMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8372d,
      emissive: 0xaa281f,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
    });

    const wireframeRuby = new THREE.MeshBasicMaterial({
      color: 0xc8372d,
      wireframe: true,
    });

    // 1. Floating Hexagonal Base (Multi-tier Island)
    const baseGeo = new THREE.CylinderGeometry(2.3, 1.6, 0.7, 6);
    const baseIsland = new THREE.Mesh(baseGeo, creamBedrockMaterial);
    baseIsland.receiveShadow = true;
    islandGroup.add(baseIsland);

    // Lower crystalline rock stalactites
    const rockBottomGeo = new THREE.ConeGeometry(1.6, 1.8, 6);
    const rockBottom = new THREE.Mesh(rockBottomGeo, warmStoneMaterial);
    rockBottom.position.y = -1.2;
    rockBottom.rotation.x = Math.PI;
    islandGroup.add(rockBottom);

    // Secondary platform ring
    const innerRingGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 6);
    const innerPlatform = new THREE.Mesh(innerRingGeo, warmStoneMaterial);
    innerPlatform.position.y = 0.42;
    islandGroup.add(innerPlatform);

    // 2. Central Neural Monolith / AI Core (Rotating Icosahedron with Wireframe)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 1.1, 0);
    islandGroup.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(0.55, 0);
    const coreMesh = new THREE.Mesh(coreGeo, rubyGlassMaterial);
    coreGroup.add(coreMesh);

    const coreWireGeo = new THREE.IcosahedronGeometry(0.72, 1);
    const coreWire = new THREE.Mesh(coreWireGeo, wireframeRuby);
    coreGroup.add(coreWire);

    // 3. Orbiting Planetary Satellite Ring
    const orbitRingGeo = new THREE.TorusGeometry(2.8, 0.025, 16, 100);
    const orbitRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xc8372d,
      transparent: true,
      opacity: 0.45,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMaterial);
    orbitRing.rotation.x = Math.PI / 2.6;
    islandGroup.add(orbitRing);

    // Orbiting mini satellites
    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const satGeo = new THREE.OctahedronGeometry(0.18);
      const sat = new THREE.Mesh(satGeo, rubyGlassMaterial);
      satellites.push(sat);
      islandGroup.add(sat);
    }

    // 4. Tech Pillars / Vision Towers on the island
    const pillarData = [
      { x: -1.2, z: -0.7, h: 0.9 },
      { x: 1.2, z: -0.6, h: 1.1 },
      { x: -0.8, z: 1.1, h: 0.8 },
      { x: 0.9, z: 0.9, h: 1.0 },
    ];

    pillarData.forEach((p) => {
      const pillarGeo = new THREE.BoxGeometry(0.28, p.h, 0.28);
      const pillar = new THREE.Mesh(pillarGeo, creamBedrockMaterial);
      pillar.position.set(p.x, 0.35 + p.h / 2, p.z);
      pillar.castShadow = true;
      islandGroup.add(pillar);

      // Beacon on top of pillar
      const beaconGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const beacon = new THREE.Mesh(beaconGeo, rubyGlassMaterial);
      beacon.position.set(p.x, 0.35 + p.h + 0.1, p.z);
      islandGroup.add(beacon);
    });

    // 5. Floating ambient particle clouds around island
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6;
      particlePos[i + 1] = Math.random() * 3.5 - 0.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc8372d,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    islandGroup.add(particles);

    // Mouse Parallax & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = y * 0.25;
    };

    mount.addEventListener('mousemove', onMouseMove);

    // Resize handler
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow continuous island rotation + mouse tilt
      islandGroup.rotation.y += 0.004;
      islandGroup.rotation.y += (targetRotationY - islandGroup.rotation.y) * 0.05;
      islandGroup.rotation.x += (targetRotationX - islandGroup.rotation.x) * 0.05;

      // Gentle floating bob
      islandGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Rotate AI Core
      coreMesh.rotation.y += 0.02;
      coreMesh.rotation.x += 0.015;
      coreWire.rotation.y -= 0.012;
      coreWire.rotation.z += 0.01;

      // Pulse Core light
      rubyCoreLight.intensity = 3 + Math.sin(elapsedTime * 4) * 1.5;

      // Orbit satellites along ring
      satellites.forEach((sat, idx) => {
        const offset = (idx * (Math.PI * 2)) / satellites.length;
        const satAngle = elapsedTime * 0.8 + offset;
        const satRadius = 2.8;

        const satX = Math.cos(satAngle) * satRadius;
        const satZ = Math.sin(satAngle) * satRadius;

        // Apply same tilt as orbitRing
        sat.position.set(satX, Math.sin(satAngle) * 0.4 + 0.2, satZ);
        sat.rotation.x += 0.03;
        sat.rotation.y += 0.04;
      });

      // Swirl particles
      particles.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div ref={mountRef} className="h-[420px] w-full max-w-[540px] cursor-grab active:cursor-grabbing" />
      {/* Floating 3D badges */}
      <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-2 rounded-xl bg-white/90 px-3.5 py-1.5 shadow-lg border border-[#C8372D]/20 backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-[#C8372D] animate-ping" />
        <span className="text-[11px] font-mono font-bold text-[#1C1917]">
          Neural Architecture Diorama
        </span>
      </div>
      <div className="pointer-events-none absolute top-4 right-6 rounded-lg bg-[#FAF7F2]/90 px-2.5 py-1 text-[10px] font-mono text-[#78716C] border border-[#C8372D]/15">
        Interactive 3D · Three.js
      </div>
    </div>
  );
}
export default MiniatureWorld;
