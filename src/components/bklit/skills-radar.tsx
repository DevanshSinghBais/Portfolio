import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface RadarSkillItem {
  subject: string;
  level: number; // 0 to 100
  fullMark: number;
  category: string;
}

interface SkillsRadarProps {
  className?: string;
  skills?: RadarSkillItem[];
}

const defaultSkills: RadarSkillItem[] = [
  { subject: 'Python & AI', level: 96, fullMark: 100, category: 'Core ML' },
  { subject: 'Computer Vision', level: 92, fullMark: 100, category: 'YOLO/OpenCV' },
  { subject: 'LLMs & Agents', level: 94, fullMark: 100, category: 'GenAI/RAG' },
  { subject: 'Backend & APIs', level: 90, fullMark: 100, category: 'FastAPI/Node' },
  { subject: 'TypeScript/React', level: 88, fullMark: 100, category: 'Frontend' },
  { subject: 'DSA & Systems', level: 86, fullMark: 100, category: 'Competitive' },
];

export function SkillsRadar({ className, skills = defaultSkills }: SkillsRadarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const size = 380;
  const center = size / 2;
  const radius = 135;
  const total = skills.length;
  const angleStep = (Math.PI * 2) / total;

  // Grid levels (5 concentric polygon rings)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getCoordinates = (index: number, valueRatio: number) => {
    // Start from top (- PI / 2)
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueRatio;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build the data polygon points
  const points = skills.map((item, i) => {
    const coords = getCoordinates(i, item.level / item.fullMark);
    return `${coords.x},${coords.y}`;
  }).join(' ');

  return (
    <div className={cn('relative flex flex-col items-center justify-center p-4', className)}>
      <div className="relative w-full max-w-[400px] aspect-square">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="bklit-radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C8372D" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#D9483B" stopOpacity="0.08" />
            </linearGradient>
            <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#C8372D" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Concentric Polygons */}
          {levels.map((level, lvlIdx) => {
            const levelPoints = skills.map((_, i) => {
              const coords = getCoordinates(i, level);
              return `${coords.x},${coords.y}`;
            }).join(' ');

            return (
              <polygon
                key={`grid-level-${lvlIdx}`}
                points={levelPoints}
                fill={lvlIdx % 2 === 0 ? 'rgba(200, 55, 45, 0.02)' : 'transparent'}
                stroke="rgba(200, 55, 45, 0.12)"
                strokeWidth={lvlIdx === levels.length - 1 ? 1.5 : 1}
                strokeDasharray={lvlIdx < levels.length - 1 ? '4 3' : 'none'}
              />
            );
          })}

          {/* Axes from center to each vertex */}
          {skills.map((_, i) => {
            const outer = getCoordinates(i, 1.0);
            return (
              <line
                key={`axis-${i}`}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(200, 55, 45, 0.14)"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Polygon with Glow and Hover */}
          <polygon
            points={points}
            fill="url(#bklit-radar-fill)"
            stroke="#C8372D"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#radar-glow)"
            className="transition-all duration-500 ease-out"
          />

          {/* Interactive Vertex Dots */}
          {skills.map((item, i) => {
            const coords = getCoordinates(i, item.level / item.fullMark);
            const isHovered = hoveredIndex === i;

            return (
              <g
                key={`dot-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer transition-transform duration-200"
              >
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 8 : 5}
                  fill="#FFFFFF"
                  stroke="#C8372D"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-200 shadow-md"
                />
                {isHovered && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={14}
                    fill="#C8372D"
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}

          {/* Labels */}
          {skills.map((item, i) => {
            const labelCoords = getCoordinates(i, 1.22);
            const isHovered = hoveredIndex === i;

            return (
              <text
                key={`label-${i}`}
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={cn(
                  'font-sans text-[11px] font-semibold tracking-wide transition-colors duration-200',
                  isHovered ? 'fill-[#C8372D] font-bold text-[12px]' : 'fill-[#57534E]'
                )}
              >
                {item.subject}
              </text>
            );
          })}
        </svg>

        {/* Hover Info Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/95 px-4 py-2.5 text-center shadow-xl border border-[#C8372D]/20 backdrop-blur-md">
            <p className="text-xs font-bold text-[#C8372D]">
              {skills[hoveredIndex].subject}
            </p>
            <p className="text-base font-extrabold text-[#1C1917]">
              {skills[hoveredIndex].level}%
            </p>
            <p className="text-[10px] text-[#78716C] uppercase tracking-wider font-mono">
              {skills[hoveredIndex].category}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-full bg-[#F3ECE2] px-3.5 py-1 text-xs font-medium text-[#78716C]">
        <span className="h-2 w-2 rounded-full bg-[#C8372D] animate-pulse" />
        <span>Bklit Radar Telemetry · Live Assessment</span>
      </div>
    </div>
  );
}
export default SkillsRadar;
