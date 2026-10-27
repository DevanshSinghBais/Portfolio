import React from 'react';
import FloatingShapesBackground from './components/3d/FloatingShapesBackground';
import MascotCompanion from './components/3d/MascotCompanion';
import CustomCursor from './components/CustomCursor';
import TinyRunningMan from './components/TinyRunningMan';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import CompetitiveStats from './components/CompetitiveStats';
import Contact from './components/Contact';
import Footer from './components/Footer';

export function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#FAF7F2] text-[#1C1917] selection:bg-[#C8372D] selection:text-white">
      {/* 3D Interactive Floating Wireframe Shapes in Background */}
      <FloatingShapesBackground />

      {/* Interactive Custom Mouse Cursor */}
      <CustomCursor />

      {/* Cute Tiny Running Man that chases cursor & teleports on fast whip */}
      <TinyRunningMan />

      {/* 3D Personal AI Companion Mascot 'Singh' (Follows Scroll, Emotes & Interacts) */}
      <MascotCompanion />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CompetitiveStats />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
