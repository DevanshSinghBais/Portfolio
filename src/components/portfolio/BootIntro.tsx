import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const sourceLines = [
  'const scene = new THREE.Scene();',
  'camera.position.set(0, 0, CAM_Z);',
  'renderer.render(scene, camera);',
];

interface BootIntroProps {
  onEnter: () => void;
}

export default function BootIntro({ onEnter }: BootIntroProps) {
  const [typedLines, setTypedLines] = useState(['', '', '']);
  const [ready, setReady] = useState(false);
  const activeLineIndex = typedLines.findIndex((line, index) => line.length < sourceLines[index].length);

  useEffect(() => {
    let lineIndex = 0;
    let characterIndex = 0;
    let timeout = 0;
    let cancelled = false;

    const finish = () => {
      setReady(true);
      timeout = window.setTimeout(() => {
        if (!cancelled) onEnter();
      }, 1200);
    };

    const typeNextCharacter = () => {
      if (cancelled) return;
      if (lineIndex >= sourceLines.length) {
        finish();
        return;
      }

      const activeLine = lineIndex;
      const nextCharacter = characterIndex + 1;
      characterIndex = nextCharacter;
      setTypedLines((lines) => {
        const next = [...lines];
        next[activeLine] = sourceLines[activeLine].slice(0, nextCharacter);
        return next;
      });

      if (nextCharacter >= sourceLines[activeLine].length) {
        lineIndex += 1;
        characterIndex = 0;
        timeout = window.setTimeout(typeNextCharacter, 280);
      } else {
        const char = sourceLines[activeLine][nextCharacter - 1];
        const pause = char === ';' || char === ')' ? 105 : 24;
        timeout = window.setTimeout(typeNextCharacter, pause);
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedLines(sourceLines);
      finish();
    } else {
      timeout = window.setTimeout(typeNextCharacter, 500);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [onEnter]);

  return (
    <motion.div
      className="boot-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Portfolio introduction"
    >
      <header className="boot-header">
        <a href="#" className="wordmark" aria-label="Devansh Singh Bais">
          devansh<span>.bais</span><i>()</i>
        </a>
        <button type="button" className="boot-skip" onClick={onEnter}>
          Skip intro <span aria-hidden="true">↗</span>
        </button>
      </header>

      <main className="boot-content">
        <div className="boot-code-label">src / FractureGlass.tsx</div>
        <pre className="boot-code" aria-label="Three.js code being typed">
          <code>
            {typedLines.map((line, index) => (
              <span className="boot-code-line" key={sourceLines[index]}>
                <span className="boot-line-number">0{index + 1}</span>
                <span>{line}</span>
                {index === activeLineIndex && !ready && <span className="type-caret" aria-hidden="true" />}
              </span>
            ))}
          </code>
        </pre>

        <div className="boot-meta">
          <span>Bhopal, India</span>
          <span className="boot-meta-divider" aria-hidden="true" />
          <span>B.Tech CSE · MANIT Bhopal</span>
        </div>

        <button
          className={`boot-enter${ready ? ' is-ready' : ''}`}
          type="button"
          onClick={onEnter}
          disabled={!ready}
          aria-disabled={!ready}
        >
          <span>{ready ? 'Enter portfolio' : 'Writing the scene'}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </main>

      <footer className="boot-footer">
        <span>Three.js · React · A little curiosity</span>
        <span className="boot-status">
          <span className="status-dot" aria-hidden="true" />
          {ready ? 'Ready' : 'Initializing'}
        </span>
      </footer>
    </motion.div>
  );
}
