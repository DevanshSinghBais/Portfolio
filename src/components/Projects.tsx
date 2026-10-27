import React, { useState } from 'react';
import { ExternalLink, Trophy, Sparkles, ArrowUpRight, RotateCw, Layers, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';

interface Project {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  story: string;
  architectureDetails: string;
  tags: string[];
  badge?: string;
  githubUrl: string;
  liveUrl?: string;
  visualComponent: React.ReactNode;
}

export function Projects() {
  const [activeProject, setActiveProject] = useState<string>('crowdshield');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const projects: Project[] = [
    {
      id: 'crowdshield',
      num: '01',
      title: 'CrowdShield AI',
      subtitle: 'Real-time crowd tracking & spatial risk heuristic engine',
      story:
        'Built in 48 intense hackathon hours with Team QBurn. Won 1st Place at SISTec Innovation Hackathon 2026. Solved multi-camera occlusion using YOLOv8 bounding boxes combined with ByteTrack spatial heuristics.',
      architectureDetails:
        'Computes velocity flow vectors, line-crossing counters, and 10/20/30-minute crowd congestion slopes. Simulates alternative egress routing using Mesa and Dijkstra graph pathfinding via FastAPI WebSockets.',
      tags: ['Python', 'YOLOv8', 'ByteTrack', 'FastAPI', 'React', 'TypeScript'],
      badge: '1st Place Hackathon Winner 🏆',
      githubUrl: 'https://github.com/DevanshSinghBais/CrowdSheild_AI',
      visualComponent: (
        <div className="relative h-full w-full bg-[#1C1917] p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C8372D] animate-ping" />
              <span className="font-mono text-[10px] font-bold text-white tracking-widest">
                CAM-04 · PER-FRAME DETECTION
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/60">ByteTrack v8</span>
          </div>

          <div className="relative my-auto flex h-[140px] w-full items-center justify-center">
            {/* Camera grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />

            {/* Bounding Box A */}
            <div className="absolute left-10 top-4 h-20 w-14 border-2 border-[#C8372D] bg-[#C8372D]/15 rounded-sm">
              <span className="absolute -top-4 left-0 bg-[#C8372D] px-1 text-[8px] font-bold text-white font-mono">
                TRACK #104
              </span>
            </div>

            {/* Bounding Box B */}
            <div className="absolute right-14 bottom-4 h-24 w-16 border-2 border-[#D9483B] bg-[#D9483B]/20 rounded-sm">
              <span className="absolute -top-4 left-0 bg-[#D9483B] px-1 text-[8px] font-bold text-white font-mono">
                TRACK #108
              </span>
            </div>

            {/* Direction vector */}
            <svg className="absolute inset-0 h-full w-full">
              <line x1="80" y1="55" x2="180" y2="90" stroke="#C8372D" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="180" cy="90" r="4" fill="#C8372D" />
            </svg>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-2 font-mono text-[10px] text-white/70">
            <span>RISK: <strong className="text-[#C8372D]">BOUNDED HEURISTIC</strong></span>
            <span>DIJKSTRA: ACTIVE</span>
          </div>
        </div>
      ),
    },
    {
      id: 'ecomri',
      num: '02',
      title: 'EcoMRI',
      subtitle: 'Cinematic environmental anomaly intelligence platform',
      story:
        'Converts complex environmental sensor streams into clear, evidence-backed anomaly signals and localized risk forecasts across regional telemetry networks.',
      architectureDetails:
        'Features interactive station mapping, real-time telemetry time-series inspections, simulated multi-variant risk projections, end-to-end type safety via tRPC, and Drizzle ORM.',
      tags: ['TypeScript', 'React', 'Node.js', 'tRPC', 'Drizzle', 'Tailwind'],
      badge: 'Live Platform ✨',
      githubUrl: 'https://github.com/DevanshSinghBais/ecomri',
      liveUrl: 'https://ecomri.vercel.app',
      visualComponent: (
        <div className="relative h-full w-full bg-[#1C1917] p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-[#C8372D] tracking-wider uppercase">
              Station Telemetry Stream
            </span>
            <span className="font-mono text-[9px] text-white/60">Node #12</span>
          </div>

          <div className="relative my-auto flex h-[130px] w-full items-center justify-center">
            <svg viewBox="0 0 240 100" className="h-full w-full">
              <defs>
                <linearGradient id="eco-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8372D" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#C8372D" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,70 Q40,15 80,65 T160,25 T240,55 L240,100 L0,100 Z" fill="url(#eco-grad)" />
              <path d="M0,70 Q40,15 80,65 T160,25 T240,55" fill="none" stroke="#C8372D" strokeWidth="2.5" />
              <circle cx="160" cy="25" r="5" fill="#FFFFFF" stroke="#C8372D" strokeWidth="2" />
              <circle cx="160" cy="25" r="12" fill="#C8372D" opacity="0.3" className="animate-ping" />
            </svg>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-white/60 border-t border-white/10 pt-2">
            <span>AIR QUALITY: 42 AQI</span>
            <span className="text-[#C8372D] font-bold">NORMAL BOUNDS</span>
          </div>
        </div>
      ),
    },
    {
      id: 'flame',
      num: '03',
      title: 'Flame in Freefall',
      subtitle: 'Zero-g combustion dynamics & NASA technical research',
      story:
        'Synthesizes microgravity drop-tower research and spacecraft fire safety papers from NASA literature to analyze laminar spherical flame propagation.',
      architectureDetails:
        'Evaluates low-gravity soot formation thresholds, convective oxygen suppression curves, and zero-gravity heat dissipation coefficients.',
      tags: ['TypeScript', 'AI/ML', 'NASA Data', 'Thermal Physics'],
      badge: 'NASA Technical Data 🚀',
      githubUrl: 'https://github.com/DevanshSinghBais/flame-in-freefall',
      visualComponent: (
        <div className="relative h-full w-full bg-[#120D0C] p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between font-mono text-[10px] text-white/70">
            <span className="text-[#C8372D] font-bold">MICROGRAVITY DROP TOWER</span>
            <span>0.001 G</span>
          </div>

          <div className="relative my-auto flex h-[130px] w-full items-center justify-center">
            <div className="absolute h-24 w-24 rounded-full bg-[#C8372D]/20 blur-xl" />
            <div className="absolute h-16 w-16 rounded-full border-2 border-[#D9483B] bg-[#C8372D]/30 shadow-lg" />
            <div className="absolute h-7 w-7 rounded-full bg-white shadow-md animate-pulse" />
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-white/60 border-t border-white/10 pt-2">
            <span>SOOT FRACTION: ZERO</span>
            <span>LAMINAR COEF: 1.0</span>
          </div>
        </div>
      ),
    },
    {
      id: 'studypilot',
      num: '04',
      title: 'StudyPilot',
      subtitle: 'Autonomous study agent with dynamic function calling',
      story:
        'A learning co-pilot built with LLM tool-calling APIs, dynamic function schemas, and local grounding to conduct study planning, quiz synthesis, and calculations.',
      architectureDetails:
        'Implements schema validation, tool execution dispatching, Gradio web interaction, and local retrieval mechanisms for contextual question generation.',
      tags: ['Python', 'LLM API', 'Tool Calling', 'Gradio', 'RAG'],
      badge: 'Agent Architecture 🤖',
      githubUrl: 'https://github.com/DevanshSinghBais/StudyPilot',
      visualComponent: (
        <div className="relative h-full w-full bg-[#1C1917] p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between font-mono text-[10px] text-[#C8372D]">
            <span>TOOL DISPATCH ENGINE</span>
            <span className="text-white/60">AUTONOMOUS</span>
          </div>

          <div className="relative my-auto flex h-[130px] w-full items-center justify-center">
            <svg viewBox="0 0 200 100" className="h-full w-full">
              <line x1="30" y1="50" x2="100" y2="25" stroke="#C8372D" strokeWidth="1.5" />
              <line x1="100" y1="25" x2="170" y2="50" stroke="#C8372D" strokeWidth="1.5" />
              <line x1="100" y1="25" x2="100" y2="80" stroke="#C8372D" strokeWidth="1.5" />
              <circle cx="100" cy="25" r="10" fill="#C8372D" />
              <circle cx="30" cy="50" r="7" fill="#FEE2E2" stroke="#C8372D" strokeWidth="2" />
              <circle cx="170" cy="50" r="7" fill="#FEE2E2" stroke="#C8372D" strokeWidth="2" />
              <circle cx="100" cy="80" r="7" fill="#FEE2E2" stroke="#C8372D" strokeWidth="2" />
              <text x="100" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">AI</text>
              <text x="30" y="68" textAnchor="middle" fill="#A8A29E" fontSize="7" fontFamily="monospace">RAG</text>
              <text x="170" y="68" textAnchor="middle" fill="#A8A29E" fontSize="7" fontFamily="monospace">QUIZ</text>
              <text x="100" y="96" textAnchor="middle" fill="#A8A29E" fontSize="7" fontFamily="monospace">CALC</text>
            </svg>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-white/60 border-t border-white/10 pt-2">
            <span>EXECUTOR: GRADIO</span>
            <span className="text-[#34D399] font-bold">READY</span>
          </div>
        </div>
      ),
    },
    {
      id: 'repo-explainer',
      num: '05',
      title: 'GitHub Repo Explainer',
      subtitle: 'AST code parsing and Gemini API token streaming',
      story:
        'Fetches repository AST structures through the GitHub REST API and leverages the Gemini API to stream structured, beginner-friendly explanations in real time.',
      architectureDetails:
        'Constructs focused context windows from repo files, extracts module dependency graphs, and manages streaming chunk pipelines directly in Jupyter.',
      tags: ['Python', 'Gemini API', 'GitHub REST API', 'AST Parsing'],
      badge: 'Starred Repo ⭐',
      githubUrl: 'https://github.com/DevanshSinghBais/GitHub-Repo-Explainer',
      visualComponent: (
        <div className="relative h-full w-full bg-[#1C1917] p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#C8372D] font-bold">GEMINI STREAMING</span>
            <span className="text-white/60">REST API</span>
          </div>

          <div className="relative my-auto flex h-[130px] w-full flex-col justify-center rounded-xl bg-black/50 p-3 font-mono text-[10px] text-white/80 border border-white/10">
            <p className="text-[#C8372D] font-bold">&gt; GET /repos/tree</p>
            <p className="text-white/60">&gt; Parsed AST: 14 modules</p>
            <p className="text-[#34D399] font-semibold mt-1">&gt; Streaming Gemini token response...</p>
            <div className="mt-2 flex gap-1">
              <span className="h-1.5 w-6 rounded bg-[#C8372D] animate-pulse" />
              <span className="h-1.5 w-12 rounded bg-white/40" />
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-white/60 border-t border-white/10 pt-2">
            <span>RATE: 85.2 TOKENS/S</span>
            <span>LATENCY: 120ms</span>
          </div>
        </div>
      ),
    },
    {
      id: 'pneumonia',
      num: '06',
      title: 'Pneumonia Detection',
      subtitle: 'Chest X-ray neural classifier & activation maps',
      story:
        'Explored neural network architectures in TensorFlow and Keras to classify chest X-ray radiographs into normal and pneumonia cases with confidence metrics.',
      architectureDetails:
        'Standardizes 128x128 grayscale radiographs, evaluates dense and convolutional activation matrices, and provides diagnostic cross-entropy probabilities.',
      tags: ['Python', 'TensorFlow', 'Keras', 'Medical Imaging'],
      badge: 'Neural Network 🩻',
      githubUrl: 'https://github.com/DevanshSinghBais/Pneumonia_Detection',
      visualComponent: (
        <div className="relative h-full w-full bg-[#1C1917] p-5 flex flex-col justify-between overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#C8372D] font-bold">CNN FEATURE ACTIVATION</span>
            <span className="text-white/60">98.4% CONF</span>
          </div>

          <div className="relative my-auto flex h-[130px] w-full items-center justify-center">
            <div className="relative h-24 w-28 rounded-xl bg-white/10 border border-white/20 p-2 flex items-center justify-center">
              <div className="h-16 w-8 rounded-full bg-[#C8372D]/20 border border-[#C8372D]/40 mr-1" />
              <div className="h-16 w-8 rounded-full bg-[#C8372D]/20 border border-[#C8372D]/40 ml-1" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#C8372D] shadow-sm animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-white/60 border-t border-white/10 pt-2">
            <span>CLASS: PNEUMONIA</span>
            <span>LOSS: 0.042</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="projects" className="relative py-28 w-full border-t border-[#C8372D]/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-20 gap-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8372D]">
              03 / Selected Works
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] mt-2">
              Featured <span className="font-serif-human italic font-normal text-[#C8372D]">engineering builds</span>.
            </h2>
          </div>

          <span className="font-mono text-xs text-[#78716C]">
            Click any project to inspect specs or open repository
          </span>
        </div>

        {/* Editorial Showcase Flow — Spacious rows instead of boxed blocks */}
        <div className="space-y-24">
          {projects.map((project) => {
            const isFlipped = !!flippedCards[project.id];

            return (
              <div
                key={project.id}
                className="group border-t border-[#C8372D]/15 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                
                {/* Left Column: Project Narrative & Human Story */}
                <div className="lg:col-span-6 flex flex-col items-start">
                  
                  {/* Top Identifier */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs font-bold text-[#C8372D]">{project.num}</span>
                    {project.badge && (
                      <span className="stamp-badge">
                        {project.badge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight mb-2 group-hover:text-[#C8372D] transition-colors">
                    {project.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-sm font-semibold text-[#C8372D] font-mono mb-4">
                    {project.subtitle}
                  </p>

                  {/* Story */}
                  <p className="text-sm sm:text-base text-[#57534E] leading-relaxed mb-6 font-normal">
                    {project.story}
                  </p>

                  {/* Deep Architecture Note */}
                  <p className="text-xs text-[#78716C] leading-relaxed mb-6 font-mono pl-3 border-l-2 border-[#C8372D]/30">
                    <strong className="text-[#1C1917] block font-sans text-xs mb-0.5">Architecture:</strong>
                    {project.architectureDetails}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs text-[#1C1917] bg-[#FAF7F2] border border-[#C8372D]/15 px-2.5 py-1 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-6">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors border-b-2 border-transparent hover:border-[#C8372D] pb-0.5"
                    >
                      <GithubIcon className="h-4 w-4 text-[#C8372D]" />
                      <span>View Source</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#C8372D] hover:text-[#AA281F] transition-colors border-b-2 border-transparent hover:border-[#C8372D] pb-0.5"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Demo</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                </div>

                {/* Right Column: Interactive Visual Window with 3D Flip */}
                <div className="lg:col-span-6 perspective-1000">
                  <div
                    onClick={() => toggleFlip(project.id)}
                    className="relative w-full h-[320px] cursor-pointer transition-transform duration-700 preserve-3d"
                    style={{
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    
                    {/* Front Visual */}
                    <div className="absolute inset-0 h-full w-full backface-hidden rounded-2xl overflow-hidden shadow-xl shadow-red-950/5 border border-[#C8372D]/20">
                      {project.visualComponent}
                      <div className="absolute bottom-2 right-3 rounded bg-black/70 px-2 py-0.5 text-[9px] font-mono text-white/80">
                        Click to flip ↺
                      </div>
                    </div>

                    {/* Back Architectural Spec */}
                    <div
                      className="absolute inset-0 h-full w-full backface-hidden rounded-2xl bg-[#1C1917] p-6 text-white border-2 border-[#C8372D] flex flex-col justify-between"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                          <span className="font-mono text-[10px] text-[#C8372D] font-bold uppercase tracking-wider">
                            System Internals
                          </span>
                          <span className="text-[10px] text-white/50 font-mono">Flip ↺</span>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{project.title}</h4>
                        <p className="text-xs text-white/80 leading-relaxed font-mono mb-4">
                          {project.architectureDetails}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-white/50">Production Ready</span>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs font-bold text-[#C8372D] hover:underline"
                        >
                          Open on GitHub →
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export default Projects;
