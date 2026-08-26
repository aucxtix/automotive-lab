'use client';

import { useEffect, useRef, useState } from 'react';
import { cars } from '@/data/cars';

function useInView(ref: React.RefObject<Element | null>, threshold = 0.2) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

function AnimatedNumber({ value, suffix = '', inView }: { value: number; suffix?: string; inView: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    const from = 0;
    const to = value;
    
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span>
      {displayed.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function PerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  // Use first supercar as showcase for performance numbers
  const car = cars[2]; // supercar with 808HP

  const stats = [
    { value: car.spec.powerNum, suffix: '', unit: 'HP', label: 'HORSEPOWER', desc: 'Peak power output' },
    { value: car.spec.torqueNum, suffix: '', unit: 'LB-FT', label: 'TORQUE', desc: 'Peak torque' },
    { value: car.spec.accelerationNum, suffix: '', unit: 'SEC', label: '0–100 KM/H', desc: 'Standing acceleration' },
    { value: car.spec.topSpeedNum, suffix: '+', unit: 'MPH', label: 'TOP SPEED', desc: 'Electronically limited' },
  ];

  return (
    <section
      ref={sectionRef}
      id="performance"
      className="relative py-40 overflow-hidden"
      aria-labelledby="performance-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(239, 68, 68, 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className="mb-24"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#EF4444]/60" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-400">PERFORMANCE DATA</span>
          </div>
          <h2
            id="performance-heading"
            className="font-display font-bold text-white"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
            }}
          >
            NUMBERS<br />
            <span className="text-zinc-400">THAT</span> MATTER
          </h2>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {stats.map(({ value, suffix, unit, label, desc }, i) => (
            <div
              key={label}
              className="relative bg-[#050505] p-8 lg:p-12 group"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(60px)',
                transition: `all 0.8s ease ${i * 150}ms`,
              }}
            >
              {/* Hover accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{ background: 'linear-gradient(90deg, transparent, #EF4444, transparent)' }}
              />

              {/* Number */}
              <div
                className="font-display font-bold text-white leading-none mb-2"
                style={{
                  fontSize: 'clamp(4rem, 8vw, 8rem)',
                  letterSpacing: '-0.05em',
                  lineHeight: 0.85,
                }}
              >
                <AnimatedNumber value={value} suffix={suffix} inView={inView} />
              </div>

              {/* Unit */}
              <div
                className="font-mono font-medium text-lg mb-6"
                style={{ color: '#EF4444', letterSpacing: '0.1em' }}
              >
                {unit}
              </div>

              {/* Divider */}
              <div
                className="h-px mb-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(239,68,68,0.3) 0%, transparent 100%)',
                  transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: `transform 0.8s ease ${i * 150 + 400}ms`,
                }}
              />

              {/* Label */}
              <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 mb-1">{label}</div>
              <div className="font-ui text-xs text-zinc-400">{desc}</div>
            </div>
          ))}
        </div>

        {/* Bottom car reference */}
        <div
          className="mt-12 flex items-center gap-6"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.8s ease 0.6s',
          }}
        >
          <div className="h-px flex-1 bg-white/5" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">
            REFERENCE: {car.name} {car.model} / {car.year}
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </div>
    </section>
  );
}
