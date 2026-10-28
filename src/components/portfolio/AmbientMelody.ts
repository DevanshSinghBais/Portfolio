import { useCallback, useEffect, useRef, useState } from 'react';

const melody = [60, 64, 67, 71, 69, 67, 64, 62, 60, 64, 69, 72, 71, 69, 67, 64];
const bass = [48, 43, 45, 43];
const beatMs = 760;

function frequencyFromMidi(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function playTone(context: AudioContext, output: GainNode, note: number, duration: number, volume: number) {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequencyFromMidi(note), now);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(volume, now + 0.045);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(envelope);
  envelope.connect(output);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);
}

export function useAmbientMelody() {
  const contextRef = useRef<AudioContext | null>(null);
  const outputRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const enabledRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const requestPlay = useCallback(() => {
    if (!enabledRef.current) return;

    try {
      if (!contextRef.current) {
        const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
        const AudioContextConstructor = window.AudioContext ?? audioWindow.webkitAudioContext;
        if (!AudioContextConstructor) return;

        const context = new AudioContextConstructor();
        const output = context.createGain();
        output.gain.value = 0;
        output.connect(context.destination);
        contextRef.current = context;
        outputRef.current = output;
      }

      const context = contextRef.current;
      const output = outputRef.current;
      if (!context || !output) return;

      const beginLoop = () => {
        if (!enabledRef.current || contextRef.current !== context || context.state !== 'running') return;
        output.gain.setTargetAtTime(0.1, context.currentTime, 0.4);

        if (timerRef.current === null) {
          const playStep = () => {
            if (!enabledRef.current || context.state !== 'running') return;
            const step = stepRef.current % melody.length;
            playTone(context, output, melody[step], 1.25, 0.18);
            if (step % 4 === 0) playTone(context, output, bass[Math.floor(step / 4) % bass.length], 2.2, 0.12);
            stepRef.current += 1;
          };

          playStep();
          timerRef.current = window.setInterval(playStep, beatMs);
        }

        setIsPlaying(true);
      };

      if (context.state === 'running') beginLoop();
      else void context.resume().then(beginLoop).catch(() => undefined);
    } catch {
      // Autoplay can be blocked until the visitor interacts with the page.
    }
  }, []);

  const stop = useCallback(() => {
    enabledRef.current = false;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const context = contextRef.current;
    const output = outputRef.current;
    if (context && output) output.gain.setTargetAtTime(0, context.currentTime, 0.18);
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (enabledRef.current) {
      stop();
      return;
    }

    enabledRef.current = true;
    setIsPlaying(true);
    requestPlay();
  }, [requestPlay, stop]);

  useEffect(() => {
    requestPlay();

    const resumeAfterInteraction = () => requestPlay();
    window.addEventListener('pointerdown', resumeAfterInteraction, { once: true, passive: true });
    window.addEventListener('keydown', resumeAfterInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resumeAfterInteraction);
      window.removeEventListener('keydown', resumeAfterInteraction);
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      if (contextRef.current && contextRef.current.state !== 'closed') {
        void contextRef.current.close();
      }
    };
  }, [requestPlay]);

  return { isPlaying, toggle };
}
