import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function FloatingShapesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc8372d, 1.6);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // Floating Geometries
    const shapes: THREE.Mesh[] = [];
    const shapeCount = 18;

    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.OctahedronGeometry(1.1, 0),
      new THREE.TetrahedronGeometry(1.3, 0),
      new THREE.TorusGeometry(1.0, 0.22, 12, 28),
    ];

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0xfdfaf6,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.45,
      }),
      new THREE.MeshBasicMaterial({
        color: 0xc8372d,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf4efea,
        roughness: 0.4,
        transparent: true,
        opacity: 0.35,
      }),
    ];

    for (let i = 0; i < shapeCount; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const scale = 0.6 + Math.random() * 0.7;
      mesh.scale.set(scale, scale, scale);

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.006,
        rotSpeedY: (Math.random() - 0.5) * 0.006,
        floatSpeed: 0.5 + Math.random() * 1.5,
        initialY: mesh.position.y,
      };

      scene.add(mesh);
      shapes.push(mesh);
    }

    // Floating Dust Particles
    const dustCount = 110;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 60;
      dustPos[i + 1] = (Math.random() - 0.5) * 60;
      dustPos[i + 2] = (Math.random() - 0.5) * 30;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xc8372d,
      size: 0.1,
      transparent: true,
      opacity: 0.3,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Scroll Tracking for Dynamic Scroll Animation
    let scrollYTarget = 0;
    let scrollSpeed = 0;
    let lastScroll = 0;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScroll;
      scrollSpeed = delta * 0.003;
      scrollYTarget = (current / (document.documentElement.scrollHeight - window.innerHeight)) * 12;
      lastScroll = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mouse Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      targetCameraX = mouseX * 2.2;
      targetCameraY = mouseY * 1.8;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera responds smoothly to both mouse parallax and scroll position
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - scrollYTarget - camera.position.y) * 0.04;
      camera.lookAt(0, -scrollYTarget * 0.8, 0);

      // Decay scroll speed
      scrollSpeed *= 0.92;

      // Rotate and float shapes — scroll speed adds dynamic spin!
      shapes.forEach((shape) => {
        shape.rotation.x += shape.userData.rotSpeedX + scrollSpeed * 0.5;
        shape.rotation.y += shape.userData.rotSpeedY + scrollSpeed * 0.5;
        shape.position.y =
          shape.userData.initialY + Math.sin(elapsedTime * shape.userData.floatSpeed) * 1.2;
      });

      // Slowly rotate dust cloud with scroll influence
      dust.rotation.y += 0.0006 + scrollSpeed * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
    />
  );
}
export default FloatingShapesBackground;
