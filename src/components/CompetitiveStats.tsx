import React from 'react';
import { Trophy, Code2, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function CompetitiveStats() {
  return (
    <section id="competitive" className="relative py-28 w-full border-t border-[#C8372D]/10">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8372D]">
            04 / Algorithmic Foundations
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] mt-2">
            Competitive <span className="font-serif-human italic font-normal text-[#C8372D]">problem solving</span>.
          </h2>
          <p className="mt-2 text-base text-[#57534E]">
            Practicing algorithmic invariants and graph theory to write performant system software.
          </p>
        </div>

        {/* Clean Editorial Layout — NO HEAVY SQUARES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Codeforces Profile Summary */}
          <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-[#C8372D]/15 pb-10 lg:pb-0 lg:pr-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[#C8372D]" />
                <h3 className="text-2xl font-bold text-[#1C1917]">Codeforces</h3>
              </div>
              <span className="stamp-badge">Pupil Rank</span>
            </div>

            <p className="text-sm font-mono text-[#C8372D] mb-6">
              @devanshsinghbais0071
            </p>

            <div className="grid grid-cols-3 gap-6 py-6 border-y border-[#C8372D]/10 mb-6">
              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase block">Current</span>
                <span className="text-3xl font-black text-[#1C1917]">1144</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase block">Peak Rating</span>
                <span className="text-3xl font-black text-[#C8372D]">1229</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase block">Contests</span>
                <span className="text-3xl font-black text-[#1C1917]">Div 2/3</span>
              </div>
            </div>

            <p className="text-sm text-[#57534E] leading-relaxed mb-6 font-normal">
              Regularly participating in timed rounds to drill dynamic programming, two-pointer techniques, 
              number theory, and tree traversals under strict time constraints.
            </p>

            <a
              href="https://codeforces.com/profile/devanshsinghbais0071"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors border-b-2 border-transparent hover:border-[#C8372D] pb-0.5"
            >
              <span>Verify on Codeforces</span>
              <ArrowUpRight className="h-4 w-4 text-[#C8372D]" />
            </a>
          </div>

          {/* Right: LeetCode & Practice Architecture */}
          <div className="lg:col-span-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Code2 className="h-6 w-6 text-[#C8372D]" />
                <h3 className="text-2xl font-bold text-[#1C1917]">LeetCode</h3>
              </div>
              <span className="stamp-badge-alt">DSA Invariants</span>
            </div>

            <p className="text-sm font-mono text-[#C8372D] mb-6">
              @DevanshSinghBais
            </p>

            <div className="grid grid-cols-3 gap-6 py-6 border-y border-[#C8372D]/10 mb-6">
              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase block">Focus</span>
                <span className="text-3xl font-black text-[#1C1917]">Graphs</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase block">Languages</span>
                <span className="text-3xl font-black text-[#C8372D]">C++ / Py</span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-[#78716C] uppercase block">Git Sync</span>
                <span className="text-3xl font-black text-[#1C1917]">Auto</span>
              </div>
            </div>

            <p className="text-sm text-[#57534E] leading-relaxed mb-6 font-normal">
              Focusing on BFS/DFS shortest paths, Dijkstra heuristics (applied directly in the CrowdShield AI routing engine), 
              sliding window limits, and binary search invariants.
            </p>

            <a
              href="https://leetcode.com/u/DevanshSinghBais/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors border-b-2 border-transparent hover:border-[#C8372D] pb-0.5"
            >
              <span>View LeetCode Profile</span>
              <ArrowUpRight className="h-4 w-4 text-[#C8372D]" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
export default CompetitiveStats;
