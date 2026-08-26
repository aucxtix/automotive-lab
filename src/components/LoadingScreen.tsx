'use client';

import { useEffect, useRef } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const total = 100;
    const duration = 1800; // ms
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const pct = Math.round(eased * total);

      if (progressRef.current) {
        progressRef.current.style.width = `${eased * 100}%`;
      }
      if (numRef.current) {
        numRef.current.textContent = String(pct).padStart(2, '0');
      }

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // Fade out
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.style.opacity = '0';
            containerRef.current.style.transform = 'scaleY(0)';
          }
          setTimeout(onComplete, 600);
        }, 300);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#050505] transition-all duration-600"
      style={{
        transformOrigin: 'top center',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)',
      }}
      aria-live="polite"
      aria-label="Loading experience"
    >
      {/* Tech grid background */}
      <div className="absolute inset-0 tech-grid opacity-30" />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-white/10" />
      <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-white/10" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/10" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/10" />

      <div className="relative z-10 flex flex-col items-center gap-12 px-8">
        {/* Logo */}
        <div className="text-center">
          <div className="font-display font-bold text-3xl lg:text-5xl tracking-[0.3em] text-white mb-2">
            AUTOMOTIVE<span className="text-[#38BDF8]"> LAB</span>
          </div>
          <div className="font-mono text-[10px] tracking-[0.4em] text-zinc-400 uppercase">
            INITIALIZING EXPERIENCE
          </div>
        </div>

        {/* Progress */}
        <div className="w-64 lg:w-96 flex flex-col gap-4">
          {/* Number */}
          <div className="flex justify-between items-baseline">
            <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-400">LOADING</span>
            <span className="font-display font-bold text-2xl text-white">
              <span ref={numRef}>00</span>
              <span className="text-[#38BDF8]">%</span>
            </span>
          </div>

          {/* Bar */}
          <div className="h-px bg-white/10 relative overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-[#38BDF8]"
              style={{ width: '0%', transition: 'none' }}
            />
          </div>

          {/* Status items */}
          <div className="flex flex-col gap-1 mt-2">
            {['FRAME SEQUENCES', 'PARTICLE SYSTEM', 'ENGINEERING DATA', '3D ENVIRONMENT'].map((item, i) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-1 h-1 rounded-full bg-[#38BDF8]"
                  style={{ opacity: 0.3 + i * 0.2 }}
                />
                <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-400">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
