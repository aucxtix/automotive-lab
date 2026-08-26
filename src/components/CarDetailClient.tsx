'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Car } from '@/data/cars';
import FrameSequence from '@/components/FrameSequence';

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function AnimatedNumber({ value, inView }: { value: number; inView: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return <>{n.toLocaleString()}</>;
}

export default function CarDetailClient({ car }: { car: Car }) {
  const heroRef = useRef<HTMLElement>(null);
  const carImgRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const engineRef = useRef<HTMLElement>(null);
  const perfRef = useRef<HTMLElement>(null);
  const engineInView = useInView(engineRef);
  const perfInView = useInView(perfRef);

  const animate = useCallback(() => {
    if (carImgRef.current) {
      const mx = (mouseRef.current.x / window.innerWidth - 0.5) * 10;
      const my = (mouseRef.current.y / window.innerHeight - 0.5) * 6;
      carImgRef.current.style.transform = `translateX(${mx * 0.4}px) translateY(${my * 0.3}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMM = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMM, { passive: true });
    rafRef.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMM); cancelAnimationFrame(rafRef.current); };
  }, [animate]);

  const { spec, engineSystems, transitionFrames, accentColorHex } = car;

  return (
    <div className="bg-[#050505] min-h-screen">
      {/* Back nav */}
      <div className="fixed top-6 left-6 lg:left-12 z-50">
        <Link
          href="/"
          data-cursor="expand"
          className="flex items-center gap-3 group"
        >
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="group-hover:-translate-x-1 transition-transform duration-300">
            <path d="M4 1L1 4L4 7M15 4H1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300">COLLECTION</span>
        </Link>
      </div>



      {/* FRAME SEQUENCE HERO */}
      <section aria-label="Exploded view sequence">
        <FrameSequence car={car} />
      </section>

      {/* ENGINEERING SYSTEMS */}
      <section
        ref={engineRef}
        className="py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto"
        aria-labelledby="engine-systems-heading"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-px" style={{ backgroundColor: accentColorHex }} />
          <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">ENGINEERING SYSTEMS</span>
        </div>
        <h2
          id="engine-systems-heading"
          className="font-display font-bold text-white mb-12"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
        >
          WHAT MAKES<br />
          <span style={{ color: accentColorHex }}>IT TICK</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
          {engineSystems.map((sys, i) => (
            <div
              key={sys.id}
              className="bg-[#080808] p-6 lg:p-8"
              style={{
                opacity: engineInView ? 1 : 0,
                transform: engineInView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s ease ${i * 80}ms`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-px mt-2 flex-shrink-0"
                  style={{ height: '2.5rem', backgroundColor: `${accentColorHex}60` }}
                />
                <div>
                  <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 mb-1">
                    SYS/{String(i + 1).padStart(2, '0')}
                  </div>
                  <div
                    className="font-display font-bold text-lg text-white mb-1"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {sys.name}
                  </div>
                  <div className="font-mono text-[10px] tracking-wide mb-3" style={{ color: `${accentColorHex}80` }}>
                    {sys.description}
                  </div>
                  <p className="font-ui text-sm text-zinc-300 leading-relaxed">{sys.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PERFORMANCE NUMBERS */}
      <section
        ref={perfRef}
        className="py-24 px-6 lg:px-12 bg-[#060606]"
        aria-labelledby="perf-heading"
      >
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px" style={{ backgroundColor: accentColorHex }} />
            <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">BY THE NUMBERS</span>
          </div>
          <h2
            id="perf-heading"
            className="font-display font-bold text-white mb-16"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }}
          >
            PERFORMANCE<br />
            <span style={{ color: accentColorHex }}>STATISTICS</span>
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              { val: spec.powerNum, unit: 'HP', label: 'HORSEPOWER' },
              { val: spec.torqueNum, unit: 'LB-FT', label: 'TORQUE' },
              { val: Math.round(spec.accelerationNum * 10) / 10, unit: 'SEC', label: '0–100 KM/H', noCount: true, display: spec.acceleration },
              { val: spec.topSpeedNum, unit: 'MPH', label: 'TOP SPEED' },
            ].map(({ val, unit, label, noCount, display }, i) => (
              <div
                key={label}
                className="bg-[#050505] p-6 lg:p-10"
                style={{
                  opacity: perfInView ? 1 : 0,
                  transform: perfInView ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.7s ease ${i * 120}ms`,
                }}
              >
                <div
                  className="font-display font-bold text-white leading-none mb-2"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.05em' }}
                >
                  {noCount ? display : <AnimatedNumber value={val} inView={perfInView} />}
                </div>
                <div
                  className="font-mono font-medium text-base mb-4"
                  style={{ color: accentColorHex, letterSpacing: '0.1em' }}
                >
                  {unit}
                </div>
                <div className="h-px mb-3" style={{ background: `linear-gradient(90deg, ${accentColorHex}40 0%, transparent 100%)` }} />
                <div className="font-mono text-[8px] tracking-[0.3em] text-zinc-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL SPEC TABLE */}
      <section className="py-24 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-6 h-px" style={{ backgroundColor: accentColorHex }} />
          <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">FULL SPECIFICATION</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
          {[
            ['ENGINE', spec.engine],
            ['DISPLACEMENT', spec.displacement],
            ['POWER', spec.power],
            ['TORQUE', spec.torque],
            ['0–100 KM/H', spec.acceleration],
            ['TOP SPEED', spec.topSpeed],
            ['TRANSMISSION', spec.transmission],
            ['DRIVETRAIN', spec.drivetrain],
            ['WEIGHT', spec.weight],
            ['BRAKES', spec.brakes],
            ['SUSPENSION', spec.suspension],
            ['AERO', spec.aero ?? 'STANDARD'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="bg-[#080808] px-6 py-4 flex items-center justify-between gap-4"
            >
              <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 flex-shrink-0">{label}</span>
              <span className="font-ui text-sm text-zinc-200 text-right">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* GRAND FINALE ENDING */}
      <section className="relative py-32 px-6 lg:px-12 min-h-[50vh] flex flex-col items-center justify-center border-t border-white/5 overflow-hidden group">
        <div className="absolute inset-0 bg-[#050505] transition-colors duration-700 group-hover:bg-[#080808]" />
        
        {/* Subtle background glow on hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700"
          style={{ background: `radial-gradient(circle at center, ${accentColorHex} 0%, transparent 50%)` }}
        />
        
        <div className="relative z-10 flex flex-col items-center text-center w-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-white/10 group-hover:bg-white/30 transition-colors duration-500" />
            <span className="font-mono text-[9px] tracking-[0.4em] text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500">
              EXPERIENCE CONCLUDED
            </span>
            <div className="w-8 h-px bg-white/10 group-hover:bg-white/30 transition-colors duration-500" />
          </div>
          
          <Link href="/#collection" data-cursor="expand" className="relative block group/link">
            {/* Outline Text */}
            <h2 
              className="font-display font-black text-transparent transition-all duration-500 group-hover/link:opacity-0"
              style={{ 
                fontSize: 'clamp(3rem, 12vw, 10rem)', 
                lineHeight: 0.85, 
                letterSpacing: '-0.04em',
                WebkitTextStroke: '2px rgba(255,255,255,0.1)'
              }}
            >
              RETURN TO<br/>COLLECTION
            </h2>
            
            {/* Solid Glow Text */}
            <h2 
              className="absolute inset-0 font-display font-black opacity-0 scale-95 transition-all duration-700 group-hover/link:opacity-100 group-hover/link:scale-100"
              style={{ 
                fontSize: 'clamp(3rem, 12vw, 10rem)', 
                lineHeight: 0.85, 
                letterSpacing: '-0.04em',
                color: accentColorHex,
                textShadow: `0 0 100px ${accentColorHex}60`
              }}
            >
              RETURN TO<br/>COLLECTION
            </h2>
          </Link>
          
          <div className="mt-16 font-mono text-[8px] tracking-[0.5em] text-zinc-600">
            AUTOMOTIVE LAB 2024
          </div>
        </div>
      </section>
    </div>
  );
}
