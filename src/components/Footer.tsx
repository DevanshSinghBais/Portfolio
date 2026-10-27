import React from 'react';
import { Terminal, Heart, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-[#C8372D]/15 bg-white/70 py-12 backdrop-blur-xl z-10">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-8">
        
        {/* Left: Branding & Info */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-[#1C1917]">
            <Terminal className="h-4 w-4 text-[#C8372D]" />
            <span>Devansh Singh Bais</span>
            <span className="text-[#C8372D]">·</span>
            <span className="text-xs font-normal text-[#78716C]">MANIT Bhopal</span>
          </div>
          <p className="text-xs text-[#78716C] font-mono">
            Crafted with Three.js, Kokonut UI, Bklit, Tailwind CSS & Motion
          </p>
        </div>

        {/* Center: Ethos */}
        <p className="text-xs text-[#57534E] flex items-center gap-1.5 font-medium">
          <span>Build carefully. Ship useful things.</span>
        </p>

        {/* Right: Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 rounded-xl bg-[#FAF7F2] px-3.5 py-2 text-xs font-mono font-bold text-[#1C1917] border border-[#C8372D]/20 shadow-sm transition-all hover:bg-[#C8372D] hover:text-white"
        >
          <span>Top</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </button>

      </div>
    </footer>
  );
}
export default Footer;
