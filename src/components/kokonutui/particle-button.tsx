import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ParticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ParticleButton({
  children,
  variant = 'primary',
  className,
  onClick,
  ...props
}: ParticleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      // Warm Lacquer Vermilion Red Confetti & Sparks
      confetti({
        particleCount: 38,
        spread: 60,
        origin: { x, y },
        colors: ['#C8372D', '#D9483B', '#AA281F', '#E6695E', '#DFD3C3', '#FAF7F2'],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 25,
        shapes: ['circle', 'square'],
        scalar: 0.85,
      });
    }

    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#C8372D] to-[#AA281F] text-white shadow-md shadow-red-900/20 hover:shadow-lg hover:shadow-red-900/30 hover:from-[#AA281F] hover:to-[#8E1F17]',
    secondary:
      'bg-[#F3ECE2] text-[#1C1917] hover:bg-[#E9DFD2] border border-[#C8372D]/20 shadow-sm',
    outline:
      'bg-transparent text-[#C8372D] border-2 border-[#C8372D] hover:bg-[#FBF0EE] hover:shadow-sm',
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-out active:scale-95 disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
    </button>
  );
}
export default ParticleButton;
