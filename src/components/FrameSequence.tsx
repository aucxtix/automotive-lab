'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Car } from '@/data/cars';

interface FrameSequenceProps {
  car: Car;
}

const PRELOAD_RADIUS = 5;

export default function FrameSequence({ car }: FrameSequenceProps) {
  const { transitionFrames: frames, accentColorHex: accentColor, spec, name, model, category, year, description } = car;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const imageCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const rafRef = useRef<number>(0);
  const [currentFrameNum, setCurrentFrameNum] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [isExploded, setIsExploded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef(0);
  const touchFrameRef = useRef(0);

  const getFramePath = useCallback((index: number) => {
    const padded = String(index).padStart(3, '0');
    return `${frames.folder}/${frames.prefix}${padded}${frames.extension}`;
  }, [frames]);

  const loadImage = useCallback((index: number): Promise<HTMLImageElement> => {
    if (imageCache.current.has(index)) {
      return Promise.resolve(imageCache.current.get(index)!);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = getFramePath(index);
      img.onload = () => {
        imageCache.current.set(index, img);
        setLoaded(prev => prev + 1);
        resolve(img);
      };
      img.onerror = reject;
    });
  }, [getFramePath]);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = imageCache.current.get(frameIndex);
    if (!img) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
  }, []);

  const animLoop = useCallback(() => {
    const diff = targetFrameRef.current - currentFrameRef.current;
    if (Math.abs(diff) > 0.5) {
      currentFrameRef.current += diff * 0.3; // Increased from 0.15 for faster catch-up
      const frame = Math.round(currentFrameRef.current);
      drawFrame(frame);
      setCurrentFrameNum(frame);
    }
    rafRef.current = requestAnimationFrame(animLoop);
  }, [drawFrame]);

  const preloadAround = useCallback((center: number) => {
    for (let i = -PRELOAD_RADIUS; i <= PRELOAD_RADIUS; i++) {
      const idx = Math.max(0, Math.min(frames.totalFrames - 1, center + i));
      if (!imageCache.current.has(idx)) {
        loadImage(idx).catch(() => {});
      }
    }
  }, [frames.totalFrames, loadImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const scrollable = container.scrollHeight - window.innerHeight;
      const scrollTop = -rect.top;
      const progress = Math.max(0, Math.min(1, scrollTop / scrollable));
      const frame = Math.round(progress * (frames.totalFrames - 1));
      targetFrameRef.current = frame;
      setIsExploded(progress > 0.45 && progress < 0.75);
      preloadAround(frame);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [frames.totalFrames, preloadAround]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
      touchFrameRef.current = targetFrameRef.current;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchStartRef.current - e.touches[0].clientY;
      const newFrame = Math.round(Math.max(0, Math.min(frames.totalFrames - 1,
        touchFrameRef.current + (dy / window.innerHeight) * frames.totalFrames * 2
      )));
      targetFrameRef.current = newFrame;
      preloadAround(newFrame);
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, [frames.totalFrames, preloadAround]);

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame(Math.round(currentFrameRef.current));
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    loadImage(0).then(() => {
      drawFrame(0);
      
      // Load first 20 frames immediately for quick start
      for (let i = 1; i < Math.min(20, frames.totalFrames); i++) {
        loadImage(i).catch(() => {});
      }
      
      // Queue the rest to load immediately after without a huge timeout gap
      setTimeout(() => {
        for (let i = 20; i < frames.totalFrames; i++) {
          loadImage(i).catch(() => {});
        }
      }, 300);
    });
    rafRef.current = requestAnimationFrame(animLoop);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [frames.totalFrames, loadImage, drawFrame, animLoop]);

  const progress = currentFrameNum / (frames.totalFrames - 1);
  const phase = progress < 0.2 ? 'ASSEMBLED' : progress < 0.45 ? 'DISMANTLING' : progress < 0.75 ? 'EXPLODED' : 'REASSEMBLY';

  return (
    <div ref={containerRef} className="relative" style={{ height: '800vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          data-cursor="inspect"
          aria-label="Interactive car dismantling sequence"
          style={{ touchAction: isMobile ? 'none' : 'auto' }}
        />

        {loaded < 5 && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="font-mono text-[10px] tracking-widest text-zinc-400">LOADING FRAMES</div>
              <div className="w-48 h-px bg-white/10 relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{
                    width: `${(loaded / Math.min(10, frames.totalFrames)) * 100}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* HUD */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 lg:px-12 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">SEQUENCE ACTIVE</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">
                FRAME {String(currentFrameNum).padStart(3, '0')} / {String(frames.totalFrames - 1).padStart(3, '0')}
              </span>
              <div
                className="hidden lg:block font-mono text-[9px] tracking-[0.3em] px-3 py-1 border"
                style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}10` }}
              >
                {phase}
              </div>
            </div>
          </div>

          {/* Hero Title & Floating Specs that fade out on scroll */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-100"
            style={{ 
              opacity: Math.max(0, 1 - progress * 4), // Fades out completely by 25% scroll
              transform: `translateY(${progress * -150}px)` // Parallax up
            }}
          >
            {/* Title Block */}
            <div className="absolute top-24 left-6 lg:left-12 max-w-screen-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-px h-4" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[9px] tracking-[0.35em] text-zinc-400">{category} / {year}</span>
              </div>
              <h1
                className="font-display font-bold text-white leading-none drop-shadow-xl"
                style={{ fontSize: 'clamp(3rem, 10vw, 9rem)', letterSpacing: '-0.04em' }}
              >
                {name}
              </h1>
              <div
                className="font-display font-semibold drop-shadow-lg"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', color: accentColor, letterSpacing: '0.02em' }}
              >
                {model}
              </div>
              <p className="font-ui text-sm lg:text-base text-white leading-relaxed max-w-md mt-6 opacity-100 drop-shadow-md bg-black/30 p-4 rounded-lg backdrop-blur-md border border-white/10">
                {description}
              </p>
            </div>

            {/* Floating specs — desktop */}
            <div className="hidden lg:block absolute inset-0">
              {/* Top right */}
              <div className="absolute top-[20%] right-[10%] flex flex-col items-end gap-1">
                <span className="font-mono text-[8px] tracking-widest" style={{ color: `${accentColor}80` }}>POWER</span>
                <div className="h-px w-12 opacity-30" style={{ backgroundColor: accentColor }} />
                <div className="w-1.5 h-1.5 rounded-full self-end" style={{ backgroundColor: accentColor }} />
                <span className="font-display font-bold text-3xl text-white">{spec.power}</span>
              </div>

              {/* Bottom left */}
              <div className="absolute bottom-[20%] left-[10%]">
                <span className="font-display font-bold text-3xl text-white">{spec.acceleration}</span>
                <div className="h-px w-12 mt-1 opacity-30" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[8px] tracking-widest" style={{ color: `${accentColor}80` }}>0–100 KM/H</span>
              </div>

              {/* Bottom right */}
              <div className="absolute bottom-[20%] right-[10%] flex flex-col items-end">
                <span className="font-display font-bold text-3xl text-white">{spec.topSpeed}</span>
                <div className="h-px w-12 mt-1 opacity-30 ml-auto" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-[8px] tracking-widest" style={{ color: `${accentColor}80` }}>TOP SPEED</span>
              </div>
            </div>
            
            {/* Mobile specs */}
            <div className="lg:hidden absolute bottom-[10%] left-6 right-6 grid grid-cols-2 gap-3">
              {[
                { label: 'POWER', value: spec.power },
                { label: '0–100', value: spec.acceleration },
                { label: 'TOP SPEED', value: spec.topSpeed },
                { label: 'TORQUE', value: spec.torque },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 border glass-card" style={{ borderColor: `${accentColor}20`, background: 'rgba(5,5,5,0.4)' }}>
                  <div className="font-mono text-[8px] tracking-[0.25em] text-zinc-400 mb-1">{label}</div>
                  <div className="font-display font-semibold text-lg text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="w-px h-48 bg-white/10 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full"
                style={{ height: `${progress * 100}%`, backgroundColor: accentColor }}
              />
            </div>
            <span className="font-mono text-[8px] text-zinc-400">{Math.round(progress * 100)}%</span>
          </div>

          {/* Bottom instruction */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-3 px-5 py-3 glass-card">
              <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400">
                {isMobile ? 'DRAG TO SCRUB' : 'SCROLL TO ADVANCE SEQUENCE'}
              </span>
            </div>
          </div>
        </div>

        {/* Exploded callouts */}
        {isExploded && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {[
              { label: 'ENGINE', x: '32%', y: '28%' },
              { label: 'TRANSMISSION', x: '50%', y: '58%' },
              { label: 'SUSPENSION', x: '22%', y: '52%' },
              { label: 'BRAKES', x: '16%', y: '68%' },
              { label: 'EXHAUST', x: '72%', y: '62%' },
              { label: 'CHASSIS', x: '50%', y: '78%' },
            ].map(({ label, x, y }, i) => (
              <div
                key={label}
                data-cursor="inspect"
                className="absolute flex items-center gap-2"
                style={{ left: x, top: y, transform: 'translate(-50%, -50%)', animation: `fadeInUp 0.4s ease ${i * 80}ms both` }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span
                  className="font-mono text-[8px] tracking-widest px-2 py-1"
                  style={{ color: accentColor, background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 10px)); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
}
