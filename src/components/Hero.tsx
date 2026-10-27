import React, { useEffect, useState } from 'react';
import { ArrowDown, Terminal, Sparkles, MapPin, Clock } from 'lucide-react';
import { GithubIcon } from './Icons';
import ParticleButton from './kokonutui/particle-button';
import SplitFlapText from './kokonutui/split-flap-text';
import MiniatureWorld from './3d/MiniatureWorld';

export function Hero() {
  const [bhopalTime, setBhopalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setBhopalTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roles = [
    'Computer Vision Pipelines',
    'YOLOv8 & Tracking Engines',
    'LLMs & Agentic Systems',
    'Scalable Distributed APIs',
    '48h Hackathon Builds 🏆',
  ];

  return (
    <section id="hero" className="relative min-h-[92vh] w-full pt-32 pb-20 flex items-center justify-center overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 w-full z-10">
        
        {/* Top Editorial Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8372D]/15 pb-6 mb-12 text-xs font-mono text-[#78716C]">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8372D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8372D]"></span>
            </span>
            <span className="text-[#1C1917] font-bold">Devansh Singh Bais</span>
            <span>·</span>
            <span>B.Tech CSE @ MANIT Bhopal</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#C8372D]" /> Bhopal, India
            </span>
            <span className="flex items-center gap-1.5 text-[#C8372D] font-bold">
              <Clock className="h-3.5 w-3.5" /> {bhopalTime || 'IST'}
            </span>
          </div>
        </div>

        {/* Fluid Split: Left Typography Story, Right 3D World */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small stamp label */}
            <div className="stamp-badge mb-6">
              <span>MANIT Bhopal '26</span>
              <span>·</span>
              <span>Team QBurn</span>
            </div>

            {/* Giant Human Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#1C1917] leading-[1.05] mb-6">
              I build AI systems that <span className="font-serif-human italic font-normal text-[#C8372D]">survive</span> outside notebooks.
            </h1>

            {/* Dynamic subtitle */}
            <div className="flex items-center gap-2 text-lg sm:text-xl font-medium text-[#57534E] mb-6 flex-wrap">
              <span>Obsessed with</span>
              <SplitFlapText words={roles} />
            </div>

            {/* Honest, human paragraph — no buzzword vomit */}
            <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl mb-10 font-normal">
              Most AI prototypes look impressive in a slide deck but crumble under real workloads. 
              I design real-time vision pipelines with YOLO & ByteTrack, LLM agents with function schemas, 
              and reliable backends that don't choke when throughput spikes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5">
              <a href="#projects">
                <ParticleButton variant="primary" className="text-sm">
                  <span>Explore Projects</span>
                  <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                </ParticleButton>
              </a>

              <a
                href="https://github.com/DevanshSinghBais"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors border-b-2 border-transparent hover:border-[#C8372D] pb-0.5"
              >
                <GithubIcon className="h-4 w-4" />
                <span>github.com/DevanshSinghBais</span>
                <span className="text-[#C8372D]">↗</span>
              </a>
            </div>

            {/* Minimalist Stat Line */}
            <div className="flex items-center gap-8 mt-12 pt-6 border-t border-[#C8372D]/10 text-xs font-mono">
              <div>
                <span className="font-bold text-[#C8372D] text-base">1st Place</span>
                <span className="text-[#78716C] block text-[11px]">SISTec Hackathon</span>
              </div>
              <div className="h-6 w-px bg-[#C8372D]/20" />
              <div>
                <span className="font-bold text-[#1C1917] text-base">1229</span>
                <span className="text-[#78716C] block text-[11px]">Codeforces Pupil</span>
              </div>
              <div className="h-6 w-px bg-[#C8372D]/20" />
              <div>
                <span className="font-bold text-[#C8372D] text-base">16+</span>
                <span className="text-[#78716C] block text-[11px]">Open Repositories</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Miniature World */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[460px]">
              {/* Soft radial glow */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-[#C8372D]/10 via-[#FBF0EE]/30 to-transparent blur-3xl pointer-events-none" />
              <MiniatureWorld />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default Hero;
