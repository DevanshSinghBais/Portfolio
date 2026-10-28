import { lazy, Suspense, useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { useAmbientMelody } from './components/portfolio/AmbientMelody';
import BootIntro from './components/portfolio/BootIntro';
import PortfolioSite from './components/portfolio/PortfolioSite';

const MascotCompanion = lazy(() => import('./components/3d/MascotCompanion'));
const TinyRunningMan = lazy(() => import('./components/TinyRunningMan'));

export function App() {
  const [entered, setEntered] = useState(false);
  const { isPlaying, toggle } = useAmbientMelody();
  const enterPortfolio = useCallback(() => setEntered(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="portfolio-app">
        <AnimatePresence mode="wait" initial={false}>
          {entered ? (
            <PortfolioSite
              key="portfolio"
              isPlaying={isPlaying}
              onToggleMelody={toggle}
            />
          ) : (
            <BootIntro key="boot" onEnter={enterPortfolio} />
          )}
        </AnimatePresence>
        {entered && (
          <Suspense fallback={null}>
            <MascotCompanion />
            <TinyRunningMan />
          </Suspense>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
