'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { cars, Car } from '@/data/cars';

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

// ---------- Frame canvas for hover-driven 3D animation ----------
function FrameCanvas({ car, hovered, mouseX }: { car: Car; hovered: boolean; mouseX: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cache = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrame = useRef(0);
  const targetFrame = useRef(0);
  const rafRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  const { totalFrames, folder, prefix, extension } = car.transitionFrames;
  // Use all frames for the full 3D animation sequence
  const ANIM_FRAMES = totalFrames;

  const framePath = useCallback((i: number) =>
    `${folder}/${prefix}${String(i).padStart(3, '0')}${extension}`,
  [folder, prefix, extension]);

  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = cache.current.get(idx);
    if (!img) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
  }, []);

  // Preload ANIM_FRAMES on mount
  useEffect(() => {
    let loaded = 0;
    for (let i = 0; i < ANIM_FRAMES; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        cache.current.set(i, img);
        loaded++;
        if (i === 0) {
          // Draw first frame once canvas is sized and make canvas visible
          requestAnimationFrame(() => {
            drawFrame(0);
            setReady(true);
          });
        }
      };
    }
  }, [ANIM_FRAMES, framePath, drawFrame]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawFrame(Math.round(currentFrame.current));
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [drawFrame]);

  // Drive target frame from mouseX (-0.5 → 0.5) mapped to frame range
  useEffect(() => {
    if (hovered) {
      // Map mouseX to 0..ANIM_FRAMES-1
      const f = Math.round((mouseX + 0.5) * (ANIM_FRAMES - 1));
      targetFrame.current = Math.max(0, Math.min(ANIM_FRAMES - 1, f));
    } else {
      targetFrame.current = 0; // snap back to frame 0 on leave
    }
  }, [hovered, mouseX, ANIM_FRAMES]);

  // Smooth interpolation loop
  useEffect(() => {
    let lastDrawn = -1;
    const loop = () => {
      const diff = targetFrame.current - currentFrame.current;
      if (Math.abs(diff) > 0.01) {
        currentFrame.current += diff * 0.18;
        const current = Math.round(currentFrame.current);
        if (current !== lastDrawn) {
          drawFrame(current);
          lastDrawn = current;
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        display: 'block',
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.4s ease',
        filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.85))`,
      }}
      aria-label={`${car.name} ${car.model} 3D view`}
    />
  );
}

// ---------- Car card ----------
function CarCard({ car, index }: { car: Car; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const inViewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(inViewRef);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const isEven = index % 2 === 0;

  return (
    <div
      ref={inViewRef}
      className="transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(60px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        data-cursor="explore"
        className="relative group"
        style={{
          transform: hovered
            ? `perspective(1200px) rotateX(${-mousePos.y * 4}deg) rotateY(${mousePos.x * 4}deg)`
            : 'perspective(1200px) rotateX(0deg) rotateY(0deg)',
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* Accent top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px z-10 transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${car.accentColorHex}, transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[520px] ${isEven ? '' : 'lg:grid-flow-dense'}`}>

          {/* ── Image / frame-animation side ── */}
          <div className={`relative overflow-hidden bg-[#0a0a0a] ${isEven ? '' : 'lg:col-start-2'}`}>

            {/* Accent glow on hover */}
            <div
              className="absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${car.accentColorHex}12 0%, rgba(5,5,5,0.5) 100%)`,
                opacity: hovered ? 1 : 0,
              }}
            />

            {/* Frame canvas — fills the card image area */}
            <div className="relative w-full h-full min-h-[340px] p-6">
              <FrameCanvas car={car} hovered={hovered} mouseX={mousePos.x} />
            </div>

            {/* Floating HUD labels on hover */}
            {hovered && (
              <>
                <div
                  className="absolute top-[20%] left-4 z-20 pointer-events-none"
                  style={{ animation: 'fadeInUp 0.35s ease forwards' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: car.accentColorHex }} />
                    <span className="font-mono text-[9px] tracking-widest" style={{ color: car.accentColorHex }}>ENGINE</span>
                  </div>
                  <div className="ml-3 mt-1 h-8 w-px opacity-40" style={{ backgroundColor: car.accentColorHex }} />
                  <div className="ml-3 font-mono text-[10px] text-zinc-200">{car.spec.engine}</div>
                </div>

                <div
                  className="absolute bottom-[25%] right-4 z-20 pointer-events-none flex flex-col items-end"
                  style={{ animation: 'fadeInUp 0.45s ease forwards' }}
                >
                  <div className="font-display font-bold text-3xl" style={{ color: car.accentColorHex }}>
                    {car.spec.powerNum}
                  </div>
                  <div className="font-mono text-[9px] tracking-widest text-zinc-300">HORSEPOWER</div>
                </div>

                {/* Frame progress hint */}
                <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2">
                  <div className="w-16 h-px bg-white/10 relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full transition-none"
                      style={{
                        width: `${((mousePos.x + 0.5) * 100).toFixed(0)}%`,
                        backgroundColor: car.accentColorHex,
                      }}
                    />
                  </div>
                  <span className="font-mono text-[8px] tracking-widest text-zinc-400">DRAG TO ROTATE</span>
                </div>
              </>
            )}

            {/* Year badge */}
            <div className="absolute top-4 right-4 z-20">
              <span
                className="font-mono text-[9px] tracking-widest px-2 py-1"
                style={{
                  color: car.accentColorHex,
                  background: `${car.accentColorHex}15`,
                  border: `1px solid ${car.accentColorHex}30`,
                }}
              >
                {car.year}
              </span>
            </div>
          </div>

          {/* ── Info side ── */}
          <div
            className={`relative flex flex-col justify-between p-8 lg:p-12 bg-[#080808] border-t border-l lg:border-t-0 ${isEven ? 'lg:border-l' : 'lg:col-start-1 lg:border-r lg:border-l-0'}`}
            style={{ borderColor: '#1a1a1a' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-px h-3" style={{ backgroundColor: car.accentColorHex }} />
              <span className="font-mono text-[9px] tracking-[0.35em] text-zinc-400">{car.category}</span>
            </div>

            <div className="mb-8">
              <div className="font-display font-bold text-5xl lg:text-6xl leading-none tracking-tight text-white" style={{ letterSpacing: '-0.03em' }}>
                {car.name}
              </div>
              <div className="font-display font-medium text-xl lg:text-2xl mt-1" style={{ color: car.accentColorHex, letterSpacing: '0.05em' }}>
                {car.model}
              </div>
            </div>

            <p className="font-ui text-sm text-zinc-300 leading-relaxed mb-8 max-w-xs">
              {car.description.substring(0, 150)}...
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'POWER', value: car.spec.power },
                { label: 'TORQUE', value: car.spec.torque },
                { label: '0–100', value: car.spec.acceleration },
                { label: 'TOP SPEED', value: car.spec.topSpeed },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 border" style={{ borderColor: '#1a1a1a', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="font-mono text-[8px] tracking-[0.25em] text-zinc-400 mb-1">{label}</div>
                  <div className="font-display font-semibold text-base text-white" style={{ letterSpacing: '-0.02em' }}>{value}</div>
                </div>
              ))}
            </div>

            <Link href={`/cars/${car.id}`} data-cursor="expand" className="group flex items-center gap-4 self-start">
              <span className="font-mono text-[10px] tracking-[0.3em]" style={{ color: car.accentColorHex }}>EXPLORE MACHINE</span>
              <div className="flex items-center gap-2 overflow-hidden" style={{ color: car.accentColorHex }}>
                <div className="h-px group-hover:w-8 transition-all duration-400" style={{ width: '16px', backgroundColor: car.accentColorHex }} />
                <svg width="12" height="6" viewBox="0 0 12 6" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                  <path d="M9 1L11 3L9 5M1 3H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Section ----------
export default function CarCollection() {
  const headingRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headingRef);

  return (
    <section id="collection" className="relative py-32 overflow-hidden" aria-labelledby="collection-heading">
      <div ref={headingRef} className="max-w-screen-2xl mx-auto px-6 lg:px-12 mb-20">
        <div className="flex items-start justify-between">
          <div style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-white/20" />
              <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-400">COLLECTION</span>
            </div>
            <h2
              id="collection-heading"
              className="font-display font-bold text-white"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
            >
              THE<br />MACHINES
            </h2>
          </div>

          <div className="hidden lg:block" style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease 0.2s' }}>
            <p className="font-ui text-sm text-zinc-400 leading-relaxed text-right max-w-[220px]">
              Different machines.<br />Different philosophies.
            </p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">04 VEHICLES</span>
              <div className="w-4 h-px bg-white/15" />
            </div>
          </div>
        </div>

        <div
          className="mt-12 h-px"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
            transform: inView ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 1s ease 0.4s',
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        {cars.map((car, i) => (
          <CarCard key={car.id} car={car} index={i} />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
