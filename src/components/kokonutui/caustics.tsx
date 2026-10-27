import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CausticsProps {
  className?: string;
}

export function Caustics({ className }: CausticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    // Warm Silk Caustic blobs
    const blobs = [
      { x: width * 0.25, y: height * 0.35, vx: 0.35, vy: 0.25, radius: 180, color: 'rgba(200, 55, 45, 0.07)' },
      { x: width * 0.75, y: height * 0.45, vx: -0.28, vy: 0.32, radius: 240, color: 'rgba(217, 72, 59, 0.06)' },
      { x: width * 0.5, y: height * 0.7, vx: 0.2, vy: -0.3, radius: 210, color: 'rgba(223, 211, 195, 0.35)' },
      { x: width * 0.85, y: height * 0.8, vx: -0.3, vy: -0.2, radius: 190, color: 'rgba(200, 55, 45, 0.05)' },
    ];

    let t = 0;

    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw caustics blobs
      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;

        if (blob.x < -100 || blob.x > width + 100) blob.vx *= -1;
        if (blob.y < -100 || blob.y > height + 100) blob.vy *= -1;

        const dynamicRadius = blob.radius + Math.sin(t + blob.x * 0.01) * 25;
        const grad = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          dynamicRadius
        );
        grad.addColorStop(0, blob.color);
        grad.addColorStop(0.65, blob.color.replace(/[\d\.]+\)$/, '0.02)'));
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Subtle light refraction wave lines
      ctx.strokeStyle = 'rgba(200, 55, 45, 0.04)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yOffset = height * (0.2 + i * 0.2);
        for (let x = 0; x <= width; x += 40) {
          const y = yOffset + Math.sin(x * 0.006 + t * 0.8 + i) * 35;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 z-0 h-full w-full', className)}
    />
  );
}
export default Caustics;
