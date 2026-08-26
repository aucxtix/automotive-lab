'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cars, Car } from '@/data/cars';

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function StatBar({ label, a, b, maxVal, colorA, colorB }: {
  label: string; a: number; b: number; maxVal: number; colorA: string; colorB: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const pctA = (a / maxVal) * 100;
  const pctB = (b / maxVal) * 100;

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-mono text-[9px] tracking-[0.25em] text-zinc-400">{label}</span>
        <div className="flex gap-4">
          <span className="font-display font-semibold text-sm text-white">{a.toLocaleString()}</span>
          <span className="font-mono text-[9px] tracking-widest text-zinc-400">VS</span>
          <span className="font-display font-semibold text-sm text-white">{b.toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex-1 h-1 bg-white/5 overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: inView ? `${pctA}%` : '0%', backgroundColor: colorA }}
          />
        </div>
        <div className="flex-1 h-1 bg-white/5 overflow-hidden">
          <div
            className="h-full ml-auto transition-all duration-1000 ease-out"
            style={{ width: inView ? `${pctB}%` : '0%', backgroundColor: colorB, float: 'right' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const [carA, setCarA] = useState<Car>(cars[0]);
  const [carB, setCarB] = useState<Car>(cars[2]);
  const [dropdownA, setDropdownA] = useState(false);
  const [dropdownB, setDropdownB] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="relative py-32 overflow-hidden"
      aria-labelledby="comparison-heading"
    >
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className="mb-16"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.8s ease' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-white/20" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-400">HEAD TO HEAD</span>
          </div>
          <h2
            id="comparison-heading"
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
          >
            COMPARE<br />
            <span className="text-zinc-400">MACHINES</span>
          </h2>
        </div>

        {/* Car selectors */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 mb-1"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}
        >
          {[{ car: carA, open: dropdownA, setOpen: setDropdownA, setCar: setCarA, label: 'MACHINE A' },
            { car: carB, open: dropdownB, setOpen: setDropdownB, setCar: setCarB, label: 'MACHINE B' }
          ].map(({ car, open, setOpen, setCar, label }, idx) => (
            <div key={idx} className="bg-[#080808] p-6 lg:p-8 relative">
              <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 mb-3">{label}</div>

              {/* Selector button */}
              <button
                onClick={() => setOpen(!open)}
                data-cursor="expand"
                className="w-full flex items-center justify-between gap-4 p-4 border border-white/10 hover:border-white/20 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: car.accentColorHex }} />
                  <span className="font-display font-semibold text-white">
                    {car.name} <span style={{ color: car.accentColorHex }}>{car.model}</span>
                  </span>
                </div>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                  className="transition-transform duration-300"
                  style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M1 1L6 6L11 1" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute top-full left-0 right-0 z-30 bg-[#0d0d0d] border border-white/10 shadow-2xl">
                  {cars.map((c) => (
                    <button
                      key={c.id}
                      data-cursor="expand"
                      onClick={() => { setCar(c); setOpen(false); }}
                      className="w-full flex items-center gap-3 px-6 py-4 hover:bg-white/5 transition-colors duration-200 text-left"
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.accentColorHex }} />
                      <span className="font-display font-medium text-sm text-white">{c.name} {c.model}</span>
                      <span className="ml-auto font-mono text-[9px] text-zinc-400">{c.year}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Mini hero */}
              <div className="relative h-40 mt-4">
                <Image
                  src={car.heroImage}
                  alt={`${car.name} ${car.model}`}
                  fill
                  className="object-contain"
                  style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.8))' }}
                />
              </div>

              {/* Power badge */}
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="font-display font-bold text-4xl"
                  style={{ color: car.accentColorHex, letterSpacing: '-0.04em' }}
                >
                  {car.spec.powerNum}
                </span>
                <span className="font-mono text-[9px] tracking-widest text-zinc-400">HP</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison bars */}
        <div
          className="bg-[#080808] p-6 lg:p-10 space-y-6"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}
        >
          <div className="flex justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: carA.accentColorHex }} />
              <span className="font-mono text-[9px] tracking-widest" style={{ color: carA.accentColorHex }}>{carA.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-widest" style={{ color: carB.accentColorHex }}>{carB.name}</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: carB.accentColorHex }} />
            </div>
          </div>

          <StatBar label="POWER (HP)" a={carA.spec.powerNum} b={carB.spec.powerNum} maxVal={900} colorA={carA.accentColorHex} colorB={carB.accentColorHex} />
          <StatBar label="TORQUE (LB-FT)" a={carA.spec.torqueNum} b={carB.spec.torqueNum} maxVal={750} colorA={carA.accentColorHex} colorB={carB.accentColorHex} />
          <StatBar label="TOP SPEED (MPH)" a={carA.spec.topSpeedNum} b={carB.spec.topSpeedNum} maxVal={250} colorA={carA.accentColorHex} colorB={carB.accentColorHex} />
          <StatBar label="WEIGHT (LBS)" a={carA.spec.weightNum} b={carB.spec.weightNum} maxVal={5000} colorA={carA.accentColorHex} colorB={carB.accentColorHex} />

          {/* Text specs */}
          <div className="pt-6 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
            {[
              ['ENGINE', carA.spec.engine, carB.spec.engine],
              ['TRANSMISSION', carA.spec.transmission, carB.spec.transmission],
              ['DRIVETRAIN', carA.spec.drivetrain, carB.spec.drivetrain],
              ['BRAKES', carA.spec.brakes, carB.spec.brakes],
              ['0–100', carA.spec.acceleration, carB.spec.acceleration],
              ['TOP SPEED', carA.spec.topSpeed, carB.spec.topSpeed],
            ].map(([label, a, b]) => (
              <div key={label} className="bg-[#080808] px-4 py-3 flex flex-col gap-1">
                <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-400">{label}</span>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-ui text-xs text-zinc-200 truncate">{a}</span>
                  <span className="font-ui text-xs text-zinc-200 truncate text-right">{b}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
