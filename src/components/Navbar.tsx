import React, { useState, useEffect } from 'react';
import { Code2, Trophy, Mail, Menu, X, Terminal, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Competitive', href: '#competitive' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 z-[100] h-[3px] bg-gradient-to-r from-[#C8372D] via-[#D9483B] to-[#AA281F] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/85 py-3 shadow-md shadow-red-950/5 backdrop-blur-xl border-b border-[#C8372D]/10'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8">
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5 font-mono text-lg font-bold tracking-tight text-[#1C1917]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8372D] text-white shadow-md shadow-red-900/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="flex items-center">
              <span>devansh</span>
              <span className="text-[#C8372D]">.bais()</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-semibold tracking-wide text-[#57534E] transition-colors duration-200 hover:text-[#C8372D]"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Badges & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://github.com/DevanshSinghBais"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#57534E] border border-[#C8372D]/15 shadow-sm transition-all duration-200 hover:text-[#C8372D] hover:border-[#C8372D] hover:scale-105"
              title="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <a
              href="https://leetcode.com/u/DevanshSinghBais/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#57534E] border border-[#C8372D]/15 shadow-sm transition-all duration-200 hover:text-[#C8372D] hover:border-[#C8372D] hover:scale-105"
              title="LeetCode"
            >
              <Code2 className="h-4 w-4" />
            </a>

            <a
              href="https://codeforces.com/profile/devanshsinghbais0071"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#57534E] border border-[#C8372D]/15 shadow-sm transition-all duration-200 hover:text-[#C8372D] hover:border-[#C8372D] hover:scale-105"
              title="Codeforces"
            >
              <Trophy className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/devansh-singh-bais-748b192b5/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-[#57534E] border border-[#C8372D]/15 shadow-sm transition-all duration-200 hover:text-[#C8372D] hover:border-[#C8372D] hover:scale-105"
              title="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>

            <a
              href="#contact"
              className="ml-2 inline-flex items-center gap-1.5 rounded-xl bg-[#C8372D] px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-900/20 transition-all duration-200 hover:bg-[#AA281F] hover:scale-105"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Let's Talk</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-[#1C1917] border border-[#C8372D]/20 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="bg-[#FAF7F2]/95 px-6 py-6 border-b border-[#C8372D]/15 shadow-xl backdrop-blur-2xl md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#1C1917] hover:text-[#C8372D]"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex gap-4 pt-4 border-t border-[#F3ECE2]">
                <a href="https://github.com/DevanshSinghBais" target="_blank" rel="noreferrer" className="text-[#57534E] hover:text-[#C8372D]">GitHub</a>
                <a href="https://leetcode.com/u/DevanshSinghBais/" target="_blank" rel="noreferrer" className="text-[#57534E] hover:text-[#C8372D]">LeetCode</a>
                <a href="https://codeforces.com/profile/devanshsinghbais0071" target="_blank" rel="noreferrer" className="text-[#57534E] hover:text-[#C8372D]">Codeforces</a>
                <a href="https://www.linkedin.com/in/devansh-singh-bais-748b192b5/" target="_blank" rel="noreferrer" className="text-[#57534E] hover:text-[#C8372D]">LinkedIn</a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
export default Navbar;
