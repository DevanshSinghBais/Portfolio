import React, { useState } from 'react';
import { Mail, Send, CheckCircle, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import Caustics from './kokonutui/caustics';
import ParticleButton from './kokonutui/particle-button';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative py-32 w-full overflow-hidden border-t border-[#C8372D]/10">
      {/* Organic Caustics Light Wave in Background */}
      <Caustics />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8 z-10">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C8372D]">
            05 / Direct Channel
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1C1917] mt-2">
            Let's build <span className="font-serif-human italic font-normal text-[#C8372D]">something useful</span>.
          </h2>
          <p className="mt-3 text-base text-[#57534E] max-w-xl">
            Have an open role, an engineering collaboration, or an AI research project? 
            Send a message below or email me directly at{' '}
            <a
              href="mailto:devanshsinghbais111@gmail.com"
              className="text-[#C8372D] font-semibold underline underline-offset-4"
            >
              devanshsinghbais111@gmail.com
            </a>.
          </p>
        </div>

        {/* Minimalist Editorial Stationery Form */}
        {submitted ? (
          <div className="py-12 flex flex-col items-start border-t border-[#C8372D]/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C8372D] text-white shadow-lg mb-4">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-[#1C1917] mb-1">Message received.</h3>
            <p className="text-sm text-[#57534E] mb-6">
              Thanks for writing in, {formData.name}. Devansh will get back to your inbox soon.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', message: '' });
              }}
              className="font-mono text-xs font-bold text-[#C8372D] hover:underline"
            >
              ← Send another note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10 border-t border-[#C8372D]/20 pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              
              {/* Name */}
              <div className="relative">
                <label className="block text-xs font-mono font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full border-b-2 border-[#C8372D]/20 bg-transparent py-2.5 text-base text-[#1C1917] placeholder-[#A8A29E] focus:border-[#C8372D] focus:outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-xs font-mono font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@domain.com"
                  className="w-full border-b-2 border-[#C8372D]/20 bg-transparent py-2.5 text-base text-[#1C1917] placeholder-[#A8A29E] focus:border-[#C8372D] focus:outline-none transition-colors"
                />
              </div>

            </div>

            {/* Message */}
            <div className="relative">
              <label className="block text-xs font-mono font-bold text-[#1C1917] uppercase tracking-wider mb-2">
                What's on your mind?
              </label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Let's talk about building a computer vision model, an internship opening, or a hackathon idea..."
                className="w-full border-b-2 border-[#C8372D]/20 bg-transparent py-2.5 text-base text-[#1C1917] placeholder-[#A8A29E] focus:border-[#C8372D] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6">
              <span className="text-xs font-mono text-[#78716C]">
                Direct response within 24 hours · Bhopal, India (IST)
              </span>

              <ParticleButton type="submit" variant="primary">
                <Send className="h-4 w-4" />
                <span>Send Note</span>
              </ParticleButton>
            </div>
          </form>
        )}

        {/* Flat Typographic Social Links Row */}
        <div className="mt-20 pt-10 border-t border-[#C8372D]/15 flex flex-wrap items-center gap-8 text-xs font-mono">
          <a
            href="https://github.com/DevanshSinghBais"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors"
          >
            <GithubIcon className="h-4 w-4 text-[#C8372D]" />
            <span>GitHub</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>

          <a
            href="https://www.linkedin.com/in/devansh-singh-bais-748b192b5/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors"
          >
            <LinkedinIcon className="h-4 w-4 text-[#C8372D]" />
            <span>LinkedIn</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>

          <a
            href="https://leetcode.com/u/DevanshSinghBais/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors"
          >
            <span>LeetCode</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>

          <a
            href="https://codeforces.com/profile/devanshsinghbais0071"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-bold text-[#1C1917] hover:text-[#C8372D] transition-colors"
          >
            <span>Codeforces</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

      </div>
    </section>
  );
}
export default Contact;
