'use client';

import { useRef, useState, useEffect } from 'react';

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

const SYSTEMS = [
  {
    id: 'engine',
    label: 'ENGINE',
    description: 'Combustion Architecture',
    detail: 'Force induction, naturally aspirated or hybrid powertrains. Each system engineered for maximum thermal efficiency and power density.',
    metrics: ['500 – 808 HP', '418 – 677 LB-FT', '6,250 – 7,500 RPM', '9:1 – 11:1 COMPRESSION'],
    color: '#EF4444',
    colorRgb: '239, 68, 68',
  },
  {
    id: 'transmission',
    label: 'TRANSMISSION',
    description: 'Power Transfer',
    detail: 'Manual, dual-clutch, and PDK systems. Each calibrated to the specific engine character. No wasted milliseconds between driver input and wheel response.',
    metrics: ['6 – 8 SPEEDS', 'SUB-100ms SHIFTS', 'REV-MATCHING', 'LAUNCH CONTROL'],
    color: '#38BDF8',
    colorRgb: '56, 189, 248',
  },
  {
    id: 'chassis',
    label: 'CHASSIS',
    description: 'Structural Platform',
    detail: 'High-strength steel unibody, aluminum monocoque, and full carbon fiber structures. Each optimized for the machine\'s specific performance envelope.',
    metrics: ['CARBON FIBER', 'HIGH-STRENGTH STEEL', '65,000 Nm/deg', 'UNIBODY CONSTRUCTION'],
    color: '#EAB308',
    colorRgb: '234, 179, 8',
  },
  {
    id: 'suspension',
    label: 'SUSPENSION',
    description: 'Dynamic Control',
    detail: 'Adaptive electromagnetic dampers, pushrod racing setups, and active systems. Thousands of adjustments per second. Always in contact. Always in control.',
    metrics: ['MAGNERIDE 4.0', 'ACTIVE PUSHROD', '1,000 Hz ADJUST', 'DRIVER-SELECT MODES'],
    color: '#4ADE80',
    colorRgb: '74, 222, 128',
  },
  {
    id: 'brakes',
    label: 'BRAKES',
    description: 'Deceleration Systems',
    detail: 'Brembo monobloc and carbon ceramic systems. From 216MPH to zero, repeatedly, without fade. Thermal management engineered for sustained track use.',
    metrics: ['380 – 440mm ROTORS', 'CARBON CERAMIC', '6-PISTON BREMBO', '2.5G DECELERATION'],
    color: '#F97316',
    colorRgb: '249, 115, 22',
  },
  {
    id: 'aero',
    label: 'AERODYNAMICS',
    description: 'Airflow Management',
    detail: 'Active splitters, retractable wings, flying buttresses and diffusers. Air is managed, not fought. Every surface generates purpose.',
    metrics: ['550 – 860 LBS DF', 'ACTIVE ELEMENTS', 'DRAG REDUCTION MODE', 'CFD OPTIMIZED'],
    color: '#2DD4BF',
    colorRgb: '45, 212, 191',
  },
  {
    id: 'electronics',
    label: 'ELECTRONICS',
    description: 'Intelligence Layer',
    detail: 'Torque vectoring, adaptive traction, launch control, track telemetry and multiple drive modes. The nervous system that connects driver intention to machine response.',
    metrics: ['TORQUE VECTORING', 'MULTI-MODE TRACTION', 'TRACK TELEMETRY', '1ms ECU CYCLES'],
    color: '#D946EF',
    colorRgb: '217, 70, 239',
  },
];

export default function EngineeringSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const [activeSystem, setActiveSystem] = useState(0);

  return (
    <>
    {/* Rubik Dirt — fiery/melted display font */}
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap"
    />
    <section
      ref={sectionRef}
      id="engineering"
      className="relative py-32 overflow-hidden"
      aria-labelledby="engineering-heading"
    >
      {/* Tech grid */}
      <div className="absolute inset-0 tech-grid opacity-15 pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div
          className="mb-20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-white/20" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-400">SYSTEMS ANALYSIS</span>
          </div>
          <h2
            id="engineering-heading"
            style={{ lineHeight: 0.95 }}
          >
            <span className="fire-text" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              ENGINEERING
            </span>
            <br />
            <span
              className="font-display font-bold text-zinc-400"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em' }}
            >
              IN DETAIL
            </span>
          </h2>
        </div>

        {/* Engineering grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
          
          {/* System list — left */}
          <div className="bg-[#050505] lg:col-span-1">
            {SYSTEMS.map((system, i) => (
              <button
                key={system.id}
                onClick={() => setActiveSystem(i)}
                className="w-full text-left px-6 py-5 border-b border-white/5 group relative overflow-hidden transition-all duration-300 hover:bg-white/[0.02] active:scale-[0.98]"
                style={{
                  background: activeSystem === i ? `linear-gradient(90deg, rgba(${system.colorRgb}, 0.1) 0%, transparent 100%)` : 'transparent',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(-30px)',
                  transition: `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms, background 0.3s ease, transform 0.1s ease`,
                }}
                aria-pressed={activeSystem === i}
                data-cursor="expand"
              >
                {/* Active indicator */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-400"
                  style={{ 
                    backgroundColor: system.color,
                    opacity: activeSystem === i ? 1 : 0,
                    transform: activeSystem === i ? 'scaleY(1)' : 'scaleY(0)'
                  }}
                />
                
                {/* Hover scanline */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                <div className="flex items-center justify-between relative z-10 pl-2">
                  <div>
                    <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 mb-1 group-hover:text-zinc-300 transition-colors">
                      SYS / {String(i + 1).padStart(2, '0')}
                    </div>
                    <div
                      className="font-display font-semibold text-sm tracking-wide transition-all duration-300"
                      style={{ 
                        color: activeSystem === i ? system.color : 'rgba(255,255,255,0.4)',
                        textShadow: activeSystem === i ? `0 0 20px rgba(${system.colorRgb}, 0.4)` : 'none'
                      }}
                    >
                      {system.label}
                    </div>
                  </div>
                  
                  {/* Animated Arrow */}
                  <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                    <svg
                      width="12" height="8" viewBox="0 0 12 8" fill="none"
                      className="absolute transition-all duration-400"
                      style={{
                        opacity: activeSystem === i ? 1 : 0,
                        transform: activeSystem === i ? 'translateX(0)' : 'translateX(-15px)',
                      }}
                    >
                      <path d="M8 1L11 4L8 7M1 4H11" stroke={system.color} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel — right */}
          <div
            className="bg-[#080808] lg:col-span-2 p-8 lg:p-12"
            style={{
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.8s ease 0.4s',
            }}
          >
            <div key={activeSystem} className="relative">
              {/* System number */}
              <div 
                className="font-mono text-[9px] tracking-[0.3em] mb-6"
                style={{ 
                  color: SYSTEMS[activeSystem].color,
                  animation: 'slideRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' 
                }}
              >
                SYSTEM {String(activeSystem + 1).padStart(2, '0')} / {String(SYSTEMS.length).padStart(2, '0')}
              </div>

              {/* Label */}
              <div
                className="font-display font-bold text-4xl lg:text-6xl text-white mb-3"
                style={{ letterSpacing: '-0.04em', lineHeight: 0.95, animation: 'slideRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.05s both' }}
              >
                {SYSTEMS[activeSystem].label}
              </div>

              {/* Description */}
              <div 
                className="font-mono text-[11px] tracking-[0.2em] text-zinc-300 mb-8"
                style={{ animation: 'slideRight 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both' }}
              >
                {SYSTEMS[activeSystem].description.toUpperCase()}
              </div>

              {/* Horizontal line with dot */}
              <div 
                className="flex items-center gap-3 mb-8"
                style={{ animation: 'slideRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s both' }}
              >
                <div 
                  className="w-2 h-2 rounded-full border flex items-center justify-center"
                  style={{ borderColor: `rgba(${SYSTEMS[activeSystem].colorRgb}, 0.5)` }}
                >
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: SYSTEMS[activeSystem].color }} />
                </div>
                <div 
                  className="flex-1 h-px" 
                  style={{ background: `linear-gradient(to right, rgba(${SYSTEMS[activeSystem].colorRgb}, 0.2), transparent)` }}
                />
              </div>

              {/* Detail text */}
              <p 
                className="font-ui text-sm lg:text-base text-zinc-300 leading-relaxed mb-10 max-w-xl"
                style={{ animation: 'slideRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both' }}
              >
                {SYSTEMS[activeSystem].detail}
              </p>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-3">
                {SYSTEMS[activeSystem].metrics.map((metric, idx) => (
                  <div
                    key={metric}
                    className="flex items-center gap-3 p-3 relative overflow-hidden group"
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.05)',
                      animation: `slideRight 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.25 + idx * 0.05}s both`
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      style={{ background: `rgba(${SYSTEMS[activeSystem].colorRgb}, 0.05)` }}
                    />
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: SYSTEMS[activeSystem].color }} />
                    <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-200 relative z-10 group-hover:text-white transition-colors">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-15px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes fireShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .fire-text {
          font-family: 'Rubik Dirt', cursive;
          font-weight: 400;
          letter-spacing: -0.02em;
          background: linear-gradient(
            90deg,
            #7f0000,
            #cc1100,
            #ef4444,
            #f97316,
            #facc15,
            #f97316,
            #ef4444,
            #cc1100,
            #7f0000
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fireShift 3.5s ease infinite;
          display: block;
        }
      `}</style>
    </section>
    </>
  );
}
