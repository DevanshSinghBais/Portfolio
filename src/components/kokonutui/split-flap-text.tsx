import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SplitFlapTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function SplitFlapText({
  words,
  className,
  interval = 3200,
}: SplitFlapTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0] || '');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % words.length;
          setDisplayText(words[nextIndex]);
          return nextIndex;
        });
        setIsFlipping(false);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono font-bold tracking-tight',
        className
      )}
    >
      <span
        className={cn(
          'inline-block rounded-lg bg-[#F3ECE2] px-3.5 py-1.5 text-[#C8372D] border border-[#C8372D]/20 shadow-sm transition-all duration-300 transform',
          isFlipping ? '-rotate-x-90 opacity-20 scale-95' : 'rotate-x-0 opacity-100 scale-100'
        )}
        style={{ perspective: '600px' }}
      >
        {displayText}
      </span>
    </span>
  );
}
export default SplitFlapText;
