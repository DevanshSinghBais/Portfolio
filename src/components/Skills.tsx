import React, { useState } from 'react';
import { Cpu, Eye, Bot, Server, Database, Code2, Sparkles } from 'lucide-react';
import SkillsRadar from './bklit/skills-radar';

export function Skills() {
  const skillGroups = [
    {
      category: 'Vision & Deep Learning',
      icon: Eye,
      description: 'Model inference, spatial bounding, and multi-object tracking pipelines.',
      items: ['TensorFlow', 'OpenCV', 'YOLOv8', 'ByteTrack', 'Keras', 'NumPy', 'Scikit-learn', 'PyTorch'],
    },
    {
      category: 'LLMs & Generative AI',
      icon: Bot,
      description: 'Structured outputs, dynamic function schemas, and agentic workflows.',
      items: ['Gemini API', 'Tool Calling', 'RAG Pipelines', 'Vector Databases', 'Embeddings', 'Prompt Engineering'],
    },
    {
      category: 'Languages & Core DSA',
      icon: Code2,
      description: 'Primary weapons for system architecture and competitive problem-solving.',
      items: ['Python', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'C', 'Java'],
    },
    {
      category: 'Backends & Distributed Systems',
      icon: Server,
      description: 'Scalable APIs, WebSocket streaming, and containerized deployment.',
      items: ['FastAPI', 'Node.js', 'Express', 'WebSockets', 'PostgreSQL', 'Docker', 'Linux', 'Git'],
    },
  ];

  return (
    <section id="skills" className="relative py-28 w-full border-t border-[#C8372D]/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8372D]">
            02 / Tools & Telemetry
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] mt-2">
            The technical <span className="font-serif-human italic font-normal text-[#C8372D]">spectrum</span>.
          </h2>
          <p className="mt-2 text-base text-[#57534E]">
            A transparent inventory of what I build with daily, evaluated by actual project commits.
          </p>
        </div>

        {/* Fluid Two-Column Layout — NO BLOCKY BOX GRIDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Natural Typographic Skill Groups */}
          <div className="lg:col-span-7 space-y-10">
            {skillGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div key={group.category} className="group border-b border-[#C8372D]/15 pb-8 last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-[#C8372D]">0{idx + 1}</span>
                    <h3 className="text-lg font-bold text-[#1C1917] flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#C8372D]" />
                      <span>{group.category}</span>
                    </h3>
                  </div>

                  <p className="text-xs text-[#78716C] mb-4">
                    {group.description}
                  </p>

                  {/* Flowing tags with hairline borders */}
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1C1917] hover:text-[#C8372D] transition-colors py-1 px-2.5 rounded-md hover:bg-[#FBF0EE]"
                      >
                        <span className="h-1 w-1 rounded-full bg-[#C8372D]" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Bklit Radar Chart Floating Seamlessly */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[420px]">
              {/* Soft ambient blur */}
              <div className="absolute inset-0 -z-10 rounded-full bg-[#C8372D]/5 blur-2xl pointer-events-none" />
              
              <div className="text-center mb-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C8372D]">
                  Live Radar Analysis · Bklit.com
                </span>
              </div>

              <SkillsRadar />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default Skills;
