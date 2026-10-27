import React from 'react';
import { Award, GraduationCap, MapPin, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="relative py-28 w-full border-t border-[#C8372D]/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8372D]">
            01 / Origin & Mindset
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] mt-2">
            The developer <span className="font-serif-human italic font-normal text-[#C8372D]">behind the code</span>.
          </h2>
        </div>

        {/* Fluid Editorial Two-Column Spread — No Rigid Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Portrait & Journey Timeline */}
          <div className="lg:col-span-5 flex flex-col items-start">
            
            {/* Authentic Photo Card */}
            <div className="relative mb-8 group">
              <div className="relative overflow-hidden rounded-2xl border border-[#C8372D]/20 bg-white p-2 shadow-lg shadow-red-950/5">
                <img
                  src="https://avatars.githubusercontent.com/u/229690909?v=4"
                  alt="Devansh Singh Bais"
                  className="h-64 w-64 sm:h-72 sm:w-72 object-cover rounded-xl grayscale-[15%] contrast-[105%] group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* Handcrafted sticker badge */}
              <div className="absolute -bottom-3 -right-3 stamp-badge">
                <span>MANIT Bhopal CSE</span>
              </div>
            </div>

            {/* Micro Journey Timeline */}
            <div className="w-full pl-4 border-l-2 border-[#C8372D]/25 space-y-6 text-xs font-mono">
              <div>
                <span className="text-[#C8372D] font-bold">2026 · SISTec Hackathon</span>
                <p className="text-[#57534E] font-sans mt-0.5">
                  Won 1st Place with Team QBurn for CrowdShield AI (computer vision + crowd simulation).
                </p>
              </div>

              <div>
                <span className="text-[#1C1917] font-bold">2025 · Deep Learning & LLMs</span>
                <p className="text-[#57534E] font-sans mt-0.5">
                  Built EcoMRI, StudyPilot, and micrograd from scratch to understand autograd & backprop.
                </p>
              </div>

              <div>
                <span className="text-[#78716C]">Current Focus</span>
                <p className="text-[#57534E] font-sans mt-0.5">
                  Multi-object vision tracking, tool-calling agents, and competitive algorithms.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Natural Prose & Core Tenets (Fluid text, no heavy blocks) */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-[#57534E]">
            
            <p className="text-xl sm:text-2xl font-light text-[#1C1917] leading-relaxed">
              I am an AI/ML engineer in progress at <strong className="font-semibold text-[#C8372D]">MANIT Bhopal</strong>. 
              I care about the messy middle ground between training a neural network and making it work reliably in production.
            </p>

            <p className="text-base leading-relaxed">
              When working on deep learning systems, the model is usually only 20% of the challenge. The real engineering 
              is in streaming video frames without dropping frame rates, keeping bounding boxes stable across occlusions, 
              sanitizing LLM outputs into structured JSON schemas, and writing APIs that fail gracefully.
            </p>

            {/* Three Personal Focus Pillars — Open List with Accent Rule */}
            <div className="pt-6 border-t border-[#C8372D]/15 space-y-6">
              
              <div className="flex items-start gap-4">
                <span className="font-mono text-sm font-bold text-[#C8372D] pt-0.5">01</span>
                <div>
                  <h4 className="text-base font-bold text-[#1C1917] mb-1">
                    Computer Vision & Multi-Camera Tracking
                  </h4>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Working hands-on with YOLOv8, ByteTrack, and OpenCV. Calculating velocity vectors, 
                    directional line crossings, and density projections for spatial monitoring.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-mono text-sm font-bold text-[#C8372D] pt-0.5">02</span>
                <div>
                  <h4 className="text-base font-bold text-[#1C1917] mb-1">
                    LLM Tool Use & Retrieval Architecture
                  </h4>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Connecting models like Gemini and local LLMs to executable Python tools, 
                    dynamic function schemas, and RAG pipelines for contextual reasoning.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="font-mono text-sm font-bold text-[#C8372D] pt-0.5">03</span>
                <div>
                  <h4 className="text-base font-bold text-[#1C1917] mb-1">
                    High-Throughput Backends & Distributed Systems
                  </h4>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Engineering APIs with FastAPI, Node.js, WebSockets, and PostgreSQL. Dockerizing services 
                    to ensure reproducible environments from local GPUs to cloud instances.
                  </p>
                </div>
              </div>

            </div>

            {/* Direct human quote */}
            <div className="pt-4 font-mono text-xs text-[#78716C]">
              <span className="text-[#C8372D] font-bold">&gt; ethos:</span> "Build carefully. Ship useful things. Keep the architecture honest."
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
export default About;
