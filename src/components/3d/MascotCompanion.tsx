import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, ArrowDown, ArrowUp, Zap, MessageSquare } from 'lucide-react';

export function MascotCompanion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [speech, setSpeech] = useState<string>("Hey, I'm Singh! Devansh's AI companion. Scroll to explore!");
  const [isMinimized, setIsMinimized] = useState(false);
  const [scrollDir, setScrollDir] = useState<'down' | 'up' | 'idle'>('idle');
  const mascotRef = useRef<THREE.Group | null>(null);
  const thrusterRef = useRef<THREE.Mesh | null>(null);
  const antennaTipRef = useRef<THREE.Mesh | null>(null);
  const wingsRef = useRef<{ left: THREE.Mesh; right: THREE.Mesh } | null>(null);

  const sectionQuotes: Record<string, string[]> = {
    hero: [
      "I'm Singh! Devansh built this whole 3D world from scratch.",
      "Scroll down to see the real code and projects!",
      "Welcome to Devansh's portfolio. Enjoy the ride! ☕",
    ],
    about: [
      "Devansh is at MANIT Bhopal — B.Tech CSE 2026.",
      "He lives on late-night chai and computer vision models.",
      "He believes in shipping tools that solve actual problems.",
    ],
    skills: [
      "Python + YOLOv8 + ByteTrack is his sweet spot.",
      "Check out that Bklit radar telemetry chart!",
      "He also writes high-throughput FastAPI & TypeScript backends.",
    ],
    projects: [
      "CrowdShield AI won 1st prize at SISTec Hackathon! 🏆",
      "Notice the camera overlays? Live tracking simulation.",
      "Click any project to see the deep system specs!",
    ],
    competitive: [
      "Pupil on Codeforces! He loves graph traversals and DP.",
      "Algorithmic problem-solving keeps his system code sharp.",
      "Check out his synced solutions on GitHub!",
    ],
    contact: [
      "Drop him a note! He loves talking AI and hackathons.",
      "Hit 'Send Message' to see the confetti explosion! ✨",
      "He usually replies within 24 hours.",
    ],
  };

  const triggerReaction = () => {
    const randomDialogue = [
      "CrowdShield AI took the hackathon trophy home! 🏆",
      "MANIT Bhopal represent! 🎓",
      "Check out his Codeforces rating — 1229 max! ⚡",
      "Full 3D physics running in real-time right here! 🚀",
      "Need a vision pipeline? Devansh has got you covered.",
    ];
    setSpeech(randomDialogue[Math.floor(Math.random() * randomDialogue.length)]);

    // Perform celebratory 360 spin
    if (mascotRef.current) {
      let spinProgress = 0;
      const spinInterval = setInterval(() => {
        if (mascotRef.current) {
          mascotRef.current.rotation.y += 0.35;
          spinProgress += 0.35;
          if (spinProgress >= Math.PI * 2) {
            clearInterval(spinInterval);
          }
        }
      }, 16);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.2, 4.0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(130, 130);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(2, 4, 3);
    scene.add(dirLight);

    const rubyGlowLight = new THREE.PointLight(0xc8372d, 3.5, 6);
    rubyGlowLight.position.set(0, -0.3, 1.2);
    scene.add(rubyGlowLight);

    // Mascot Group
    const mascotGroup = new THREE.Group();
    mascotRef.current = mascotGroup;
    scene.add(mascotGroup);

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xfdfaf6,
      roughness: 0.18,
      metalness: 0.1,
    });

    const rubyMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8372d,
      roughness: 0.2,
      metalness: 0.85,
    });

    const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.05,
      metalness: 0.95,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9483b,
      emissive: 0xc8372d,
      emissiveIntensity: 2.2,
    });

    // 1. Head
    const headGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const head = new THREE.Mesh(headGeo, bodyMaterial);
    mascotGroup.add(head);

    // 2. Visor
    const visorGeo = new THREE.SphereGeometry(0.48, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const visor = new THREE.Mesh(visorGeo, visorMaterial);
    visor.rotation.x = Math.PI / 2;
    visor.position.set(0, 0.08, 0.42);
    mascotGroup.add(visor);

    // 3. Glowing Eyes
    const eyeGeo = new THREE.CapsuleGeometry(0.06, 0.16, 8, 16);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    leftEye.rotation.z = Math.PI / 2;
    leftEye.position.set(-0.16, 0.08, 0.72);
    mascotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
    rightEye.rotation.z = Math.PI / 2;
    rightEye.position.set(0.16, 0.08, 0.72);
    mascotGroup.add(rightEye);

    // 4. Antenna Pin
    const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 12);
    const antenna = new THREE.Mesh(antennaGeo, rubyMaterial);
    antenna.position.set(0, 0.85, 0);
    mascotGroup.add(antenna);

    const antennaTipGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const antennaTip = new THREE.Mesh(antennaTipGeo, eyeMaterial);
    antennaTip.position.set(0, 1.02, 0);
    antennaTipRef.current = antennaTip;
    mascotGroup.add(antennaTip);

    // 5. Thruster Wings
    const wingGeo = new THREE.TorusGeometry(0.32, 0.07, 16, 32);
    const leftWing = new THREE.Mesh(wingGeo, rubyMaterial);
    leftWing.position.set(-0.88, -0.05, 0);
    leftWing.rotation.y = Math.PI / 4;
    mascotGroup.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, rubyMaterial);
    rightWing.position.set(0.88, -0.05, 0);
    rightWing.rotation.y = -Math.PI / 4;
    mascotGroup.add(rightWing);
    wingsRef.current = { left: leftWing, right: rightWing };

    // 6. Thruster Jet Flame
    const thrusterGeo = new THREE.ConeGeometry(0.24, 0.5, 16);
    const thrusterMat = new THREE.MeshStandardMaterial({
      color: 0xff334b,
      emissive: 0xdc2626,
      emissiveIntensity: 2.8,
      transparent: true,
      opacity: 0.9,
    });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI;
    thruster.position.set(0, -0.85, 0);
    thrusterRef.current = thruster;
    mascotGroup.add(thruster);

    // Mouse Tracking for Head Aiming
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * 0.75;
      targetRotX = -normY * 0.5;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Track Scroll Dynamics (Velocity + Direction + Section Awareness)
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollVelocity = Math.min(Math.max(delta * 0.05, -1.2), 1.2);

      if (delta > 4) {
        setScrollDir('down');
      } else if (delta < -4) {
        setScrollDir('up');
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollVelocity = 0;
        setScrollDir('idle');
      }, 180);

      lastScrollY = currentScrollY;

      // Section recognition based on viewport
      const sections = ['hero', 'about', 'skills', 'projects', 'competitive', 'contact'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.25) {
            const pool = sectionQuotes[sec];
            if (pool) {
              setSpeech(pool[Math.floor(Math.random() * pool.length)]);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Bobbing floating motion
      const bobbing = Math.sin(elapsedTime * 2.5) * 0.12;
      mascotGroup.position.y = bobbing;

      // Dynamic Flight Tilt based on Scroll Velocity!
      // Downwards scroll: Leans forward into dive mode
      // Upwards scroll: Leans backward looking up
      const scrollTilt = scrollVelocity * 0.65;

      mascotGroup.rotation.y += (targetRotY - mascotGroup.rotation.y) * 0.08;
      mascotGroup.rotation.x += (targetRotX + scrollTilt - mascotGroup.rotation.x) * 0.1;

      // Dynamic Thruster Flame Reaction
      if (thrusterRef.current) {
        const speedBoost = Math.abs(scrollVelocity) * 2.2;
        thrusterRef.current.scale.set(
          1 + Math.sin(elapsedTime * 14) * 0.15 + speedBoost * 0.4,
          1 + Math.sin(elapsedTime * 18) * 0.25 + speedBoost * 1.3,
          1 + Math.sin(elapsedTime * 14) * 0.15 + speedBoost * 0.4
        );
      }

      // Flap wings slightly on scroll
      if (wingsRef.current) {
        const wingFlap = Math.sin(elapsedTime * 4) * 0.1 + scrollVelocity * 0.2;
        wingsRef.current.left.rotation.z = wingFlap;
        wingsRef.current.right.rotation.z = -wingFlap;
      }

      if (antennaTipRef.current) {
        antennaTipRef.current.scale.setScalar(1 + Math.sin(elapsedTime * 6) * 0.15);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Dynamic Speech Bubble */}
      {!isMinimized && (
        <div className="mb-2 max-w-[240px] rounded-2xl bg-white/95 px-4 py-3 shadow-xl border border-[#C8372D]/20 backdrop-blur-xl transition-all duration-300">
          <div className="flex items-center justify-between border-b border-[#F3ECE2] pb-1.5 mb-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#C8372D] font-mono">
              <Zap className="h-3.5 w-3.5 fill-[#C8372D]" /> Singh (AI Co-pilot)
            </span>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-[11px] text-[#78716C] hover:text-[#C8372D] font-mono"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#1C1917] leading-relaxed font-sans font-medium">
            {speech}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#78716C] font-mono">
            <span className="flex items-center gap-1 text-[#C8372D] font-semibold">
              {scrollDir === 'down' && <><ArrowDown className="h-3 w-3 animate-bounce" /> Diving down</>}
              {scrollDir === 'up' && <><ArrowUp className="h-3 w-3 animate-bounce" /> Cruising up</>}
              {scrollDir === 'idle' && <span>Hovering</span>}
            </span>
            <span className="cursor-pointer hover:underline text-[#C8372D]" onClick={triggerReaction}>
              Tap Singh 💬
            </span>
          </div>
        </div>
      )}

      {/* Mascot Container */}
      <div
        onClick={triggerReaction}
        className="group relative flex cursor-pointer items-center justify-center rounded-full bg-white/90 p-1 shadow-2xl border-2 border-[#C8372D]/30 backdrop-blur-xl transition-all duration-300 hover:border-[#C8372D] hover:scale-105"
        title="Click Singh to hear his thoughts!"
      >
        <div ref={containerRef} className="h-[105px] w-[105px]" />

        {/* Status pill */}
        <div className="absolute -bottom-1 -left-1 flex items-center gap-1.5 rounded-full bg-[#1C1917] px-2.5 py-0.5 text-[9px] font-bold text-white shadow-md border border-[#C8372D]/40">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C8372D] animate-ping" />
          <span>SINGH</span>
        </div>
      </div>
    </div>
  );
}
export default MascotCompanion;
