import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  color: string;
}

export function TinyRunningMan() {
  const [pos, setPos] = useState({ x: 200, y: 200 });
  const [facingLeft, setFacingLeft] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isVanished, setIsVanished] = useState(false);
  const [runFrame, setRunFrame] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [poof, setPoof] = useState<{ x: number; y: number } | null>(null);
  const [blink, setBlink] = useState(false);

  const posRef = useRef({ x: 200, y: 200 });
  const targetRef = useRef({ x: 200, y: 200 });
  const lastMouseTimeRef = useRef(performance.now());
  const isVanishedRef = useRef(false);

  // Periodic cute blinking when idle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3200);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    // Start near center of view
    const startX = window.innerWidth * 0.45;
    const startY = window.innerHeight * 0.4;
    posRef.current = { x: startX, y: startY };
    targetRef.current = { x: startX, y: startY };
    setPos({ x: startX, y: startY });

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastMouseTimeRef.current, 1);
      const dx = e.clientX - targetRef.current.x;
      const dy = e.clientY - targetRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = (dist / dt) * 16;
      lastMouseTimeRef.current = now;

      // FAST WHIP TELEPORT: When cursor moves very fast
      if ((speed > 42 || dist > 380) && !isVanishedRef.current) {
        isVanishedRef.current = true;
        setIsVanished(true);

        // Poof effect at old position
        setPoof({ x: posRef.current.x, y: posRef.current.y });

        // Spawn warp particles
        const warpPuffs: Particle[] = [];
        for (let i = 0; i < 8; i++) {
          warpPuffs.push({
            id: Math.random(),
            x: posRef.current.x,
            y: posRef.current.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            scale: Math.random() * 1.5 + 0.8,
            opacity: 0.8,
            color: '#C8372D',
          });
        }
        setParticles((prev) => [...prev, ...warpPuffs]);

        // Reappear near cursor
        setTimeout(() => {
          posRef.current = {
            x: e.clientX + (e.clientX < posRef.current.x ? 28 : -28),
            y: e.clientY + 22,
          };
          setPos({ ...posRef.current });
          isVanishedRef.current = false;
          setIsVanished(false);
          setPoof(null);
        }, 180);
      }

      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Physics Animation Loop
    let animId: number;
    let step = 0;

    const loop = () => {
      if (!isVanishedRef.current) {
        const offsetX = targetRef.current.x > posRef.current.x ? -28 : 28;
        const offsetY = 20;
        const targetX = targetRef.current.x + offsetX;
        const targetY = targetRef.current.y + offsetY;

        const dx = targetX - posRef.current.x;
        const dy = targetY - posRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 7) {
          setIsRunning(true);
          setFacingLeft(dx < 0);
          step += 0.38;
          setRunFrame(Math.floor(step));

          // Easing speed
          const speed = Math.min(Math.max(dist * 0.14, 3.8), 12);
          posRef.current.x += (dx / dist) * speed;
          posRef.current.y += (dy / dist) * speed;
          setPos({ x: posRef.current.x, y: posRef.current.y });

          // Footstep dust & sparks
          if (Math.random() < 0.32) {
            setParticles((prev) => [
              ...prev.slice(-14),
              {
                id: Math.random(),
                x: posRef.current.x + (dx < 0 ? 12 : -12),
                y: posRef.current.y + 26,
                vx: (Math.random() - 0.5) * 1.8 + (dx < 0 ? 1.5 : -1.5),
                vy: -Math.random() * 1.4,
                scale: 1,
                opacity: 0.65,
                color: Math.random() > 0.4 ? '#C8372D' : '#DFD3C3',
              },
            ]);
          }
        } else {
          setIsRunning(false);
          posRef.current.x += dx * 0.22;
          posRef.current.y += dy * 0.22;
          setPos({ x: posRef.current.x, y: posRef.current.y });
        }
      }

      // Update particle dust
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            scale: Math.max(p.scale * 0.93, 0.2),
            opacity: p.opacity - 0.045,
          }))
          .filter((p) => p.opacity > 0)
      );

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Running stride cycle
  const legCycle = (runFrame % 8) / 8;
  const leftLegAngle = isRunning ? Math.sin(legCycle * Math.PI * 2) * 34 : 0;
  const rightLegAngle = isRunning ? -Math.sin(legCycle * Math.PI * 2) * 34 : 0;
  const armSwing = isRunning ? -Math.sin(legCycle * Math.PI * 2) * 28 : Math.sin(runFrame * 0.1) * 3;
  const bodyBob = isRunning ? Math.abs(Math.sin(legCycle * Math.PI * 2)) * 3.5 : 0;
  const drawstringSway = isRunning ? Math.sin(legCycle * Math.PI * 2) * 6 : 0;
  const bodyTilt = isRunning ? (facingLeft ? -8 : 8) : 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Particle dust trail */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.scale * 6}px`,
            height: `${p.scale * 6}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Teleport Sonic Poof */}
      {poof && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${poof.x}px`, top: `${poof.y}px` }}
        >
          <div className="h-10 w-10 rounded-full bg-[#C8372D]/25 blur-sm animate-ping flex items-center justify-center">
            <span className="text-sm">⚡</span>
          </div>
        </div>
      )}

      {/* The Detailed Tiny Running Man */}
      {!isVanished && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y - bodyBob}px`,
            transform: `translate(-50%, -50%) scaleX(${facingLeft ? -1 : 1}) rotate(${bodyTilt}deg)`,
          }}
        >
          <svg width="44" height="52" viewBox="0 0 44 52" className="overflow-visible drop-shadow-lg">
            <defs>
              {/* Hoodie Rich Gradients */}
              <linearGradient id="hoodie-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D9483B" />
                <stop offset="50%" stopColor="#C8372D" />
                <stop offset="100%" stopColor="#A5261E" />
              </linearGradient>

              {/* Sneaker Gradient */}
              <linearGradient id="sneaker-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C8372D" />
                <stop offset="70%" stopColor="#D9483B" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>

              {/* Hair Gradient */}
              <linearGradient id="hair-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3A3330" />
                <stop offset="100%" stopColor="#1C1917" />
              </linearGradient>

              <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
              </filter>
            </defs>

            {/* 1. Ground Drop Shadow */}
            <ellipse cx="22" cy="48" rx="11" ry="3.2" fill="rgba(28, 25, 23, 0.22)" />

            {/* 2. Mini Tech Backpack (worn on back) */}
            <g transform="translate(11, 21)">
              <rect x="0" y="0" width="7" height="11" rx="2.5" fill="#292524" stroke="#1C1917" strokeWidth="1" />
              <rect x="2" y="3" width="3" height="4" rx="1" fill="#C8372D" />
              <line x1="3.5" y1="9" x2="3.5" y2="10" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* 3. Back Leg (Running stride) */}
            <g style={{ transformOrigin: '19px 33px', transform: `rotate(${rightLegAngle}deg)` }}>
              {/* Dark Cargo Pants */}
              <line x1="19" y1="33" x2="17" y2="43" stroke="#292524" strokeWidth="3.4" strokeLinecap="round" />
              {/* Retro Sneaker */}
              <g transform="translate(13, 41)">
                <path d="M 0 3 L 8 3 Q 9 3 9 2 L 8 0 L 2 0 Z" fill="url(#sneaker-grad)" />
                {/* White Rubber Sole */}
                <rect x="0" y="3" width="9.5" height="2" rx="1" fill="#FFFFFF" stroke="#1C1917" strokeWidth="0.5" />
                {/* Black Sneaker Laces */}
                <line x1="4" y1="1" x2="6" y2="1" stroke="#1C1917" strokeWidth="0.8" />
              </g>
            </g>

            {/* 4. Front Leg (Running stride) */}
            <g style={{ transformOrigin: '24px 33px', transform: `rotate(${leftLegAngle}deg)` }}>
              {/* Dark Cargo Pants with pocket seam */}
              <line x1="24" y1="33" x2="26" y2="43" stroke="#1C1917" strokeWidth="3.4" strokeLinecap="round" />
              {/* Retro Sneaker */}
              <g transform="translate(22, 41)">
                <path d="M 0 3 L 8 3 Q 9 3 9 2 L 8 0 L 2 0 Z" fill="url(#sneaker-grad)" />
                {/* White Rubber Sole */}
                <rect x="0" y="3" width="9.5" height="2" rx="1" fill="#FFFFFF" stroke="#1C1917" strokeWidth="0.5" />
                {/* Black Sneaker Laces */}
                <line x1="4" y1="1" x2="6" y2="1" stroke="#1C1917" strokeWidth="0.8" />
              </g>
            </g>

            {/* 5. RED HOODIE TORSO (Detailed Layering) */}
            <rect
              x="15"
              y="18"
              width="15"
              height="16"
              rx="4.5"
              fill="url(#hoodie-grad)"
              stroke="#8E1F17"
              strokeWidth="1.2"
              filter="url(#soft-shadow)"
            />

            {/* Kangaroo Pouch Pocket */}
            <path
              d="M 17 26 L 27 26 L 26 31 L 18 31 Z"
              fill="#A5261E"
              stroke="#8E1F17"
              strokeWidth="0.8"
            />
            {/* Pocket Stitch Line */}
            <line x1="19" y1="28.5" x2="25" y2="28.5" stroke="#D9483B" strokeWidth="0.8" strokeDasharray="1.5 1" />

            {/* Chest Graphic: Subtle Developer Tag `</>` */}
            <text x="22" y="23" textAnchor="middle" fill="#FFFFFF" opacity="0.85" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
              &lt;/&gt;
            </text>

            {/* White Hoodie Drawstrings (Swaying dynamically with run) */}
            <g transform={`translate(${drawstringSway * 0.4}, 0)`}>
              <line x1="20" y1="19" x2={20 + drawstringSway * 0.8} y2="25" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx={20 + drawstringSway * 0.8} cy="25" r="0.9" fill="#1C1917" />
            </g>
            <g transform={`translate(${drawstringSway * 0.2}, 0)`}>
              <line x1="23" y1="19" x2={23 + drawstringSway * 0.6} y2="24.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx={23 + drawstringSway * 0.6} cy="24.5" r="0.9" fill="#1C1917" />
            </g>

            {/* 6. Arms with Red Hoodie Sleeves */}
            <g style={{ transformOrigin: '22px 20px', transform: `rotate(${armSwing}deg)` }}>
              {/* Sleeve */}
              <line x1="22" y1="20" x2="16" y2="28" stroke="url(#hoodie-grad)" strokeWidth="3.6" strokeLinecap="round" />
              {/* Cuff */}
              <circle cx="16" cy="28" r="1.8" fill="#8E1F17" />
              {/* Hand */}
              <circle cx="15.5" cy="29.5" r="2.2" fill="#F5DDC7" />
            </g>

            {/* 7. HEAD & DETAILED FACE */}
            {/* Red Hood Backdrop */}
            <circle cx="22" cy="11" r="9.5" fill="url(#hoodie-grad)" stroke="#8E1F17" strokeWidth="1.2" />
            
            {/* Hood Interior Collar Shadow */}
            <circle cx="23.5" cy="11.5" r="7.8" fill="#8E1F17" />

            {/* Face (Warm Skin tone) */}
            <circle cx="24.5" cy="11.5" r="6.4" fill="#F5DDC7" />

            {/* Messy Anime/Developer Hair Bangs peeking out! */}
            <path
              d="M 20 6 Q 24 4 28 6 Q 27 9 26 10 Q 24 8 23 10 Q 22 7 20 6 Z"
              fill="url(#hair-grad)"
            />

            {/* Eyebrows */}
            <path
              d="M 24 7.5 Q 26.5 7 28 8"
              stroke="#1C1917"
              strokeWidth="0.9"
              fill="none"
              strokeLinecap="round"
            />

            {/* Expressive Eye with reflections (Pupil & Catchlight) */}
            {!blink ? (
              <g>
                <circle cx="26.5" cy="10.5" r="1.7" fill="#1C1917" />
                <circle cx="26" cy="10" r="0.6" fill="#FFFFFF" />
                <circle cx="27.2" cy="11.2" r="0.3" fill="#FFFFFF" />
              </g>
            ) : (
              /* Blinking eye curve */
              <path d="M 25 10.5 Q 26.5 12 28 10.5" stroke="#1C1917" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            )}

            {/* Rosy Anime Blush */}
            <ellipse cx="25.5" cy="13" rx="1.6" ry="1.1" fill="#E6695E" opacity="0.65" />

            {/* Tiny Smile */}
            <path d="M 26.2 13.8 Q 27.5 14.8 28.5 13.5" stroke="#8E1F17" strokeWidth="0.8" fill="none" strokeLinecap="round" />

            {/* Over-Ear Cyber Headset / Headphone Band on Hood */}
            <path
              d="M 16 11 Q 17 4 23 4"
              stroke="#292524"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Glowing Headset Ear Cup */}
            <rect x="14" y="9" width="3.5" height="5.5" rx="1.5" fill="#1C1917" stroke="#34D399" strokeWidth="0.8" />
            <circle cx="15.7" cy="11.7" r="1" fill="#34D399" />
          </svg>
        </div>
      )}
    </div>
  );
}
export default TinyRunningMan;
