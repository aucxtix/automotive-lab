'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { getFeaturedCar } from '@/data/cars';

const car = getFeaturedCar();

const HERO_WORDS = ['ENGINEERED', 'FOR', 'OBSESSION.'];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtextRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);


  // Entrance animation
  useEffect(() => {
    let delay = 0;
    
    wordsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(60px) skewY(3deg)';
      el.style.filter = 'blur(8px)';
      
      setTimeout(() => {
        if (el) {
          el.style.transition = 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.9s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) skewY(0deg)';
          el.style.filter = 'blur(0px)';
        }
      }, 400 + i * 200);
    });

    setTimeout(() => {
      if (subtextRef.current) {
        subtextRef.current.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        subtextRef.current.style.opacity = '1';
        subtextRef.current.style.transform = 'translateY(0)';
      }
    }, 1200);

    setTimeout(() => {
      if (buttonsRef.current) {
        buttonsRef.current.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        buttonsRef.current.style.opacity = '1';
        buttonsRef.current.style.transform = 'translateY(0)';
      }
    }, 1500);

    setTimeout(() => {
      if (specsRef.current) {
        specsRef.current.style.transition = 'opacity 0.8s ease';
        specsRef.current.style.opacity = '1';
      }
    }, 1800);

    const cleanup = () => {};

    return cleanup;
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-[60vw] h-[60vh]"
          style={{
            background: `radial-gradient(ellipse at 0% 100%, rgba(56, 189, 248, 0.04) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[70vh]"
          style={{
            background: `radial-gradient(ellipse at 100% 50%, rgba(56, 189, 248, 0.03) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        
        {/* Left — Text */}
        <div>
          {/* Tag */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#38BDF8]" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-300 uppercase">
              AUTOMOTIVE LAB / COLLECTION 2024
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-display font-bold leading-none mb-10 overflow-hidden">
            {HERO_WORDS.map((word, i) => (
              <span
                key={word}
                className="block overflow-hidden"
                style={{ lineHeight: 1.05 }}
              >
                <span
                  ref={el => { wordsRef.current[i] = el; }}
                  className={word === 'OBSESSION.' ? 'block obsession-gradient' : 'block'}
                  style={{
                    fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                    letterSpacing: '-0.03em',
                    color: word === 'OBSESSION.' ? undefined : '#ffffff',
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <div
            ref={subtextRef}
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <p className="font-ui text-base lg:text-lg text-zinc-300 max-w-sm leading-relaxed mb-10">
              Explore machines through design,<br />engineering and motion.
            </p>
          </div>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <Link
              href="/#collection"
              data-cursor="expand"
              className="group relative flex items-center gap-4 px-8 py-4 border border-white/15 hover:border-[#38BDF8]/50 transition-all duration-400 overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#38BDF8] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 opacity-10" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-white relative z-10">EXPLORE COLLECTION</span>
              <span className="w-4 h-px bg-white/40 group-hover:w-8 group-hover:bg-[#38BDF8] transition-all duration-400 relative z-10" />
            </Link>

            <Link
              href={`/cars/${car.id}`}
              data-cursor="expand"
              className="group flex items-center gap-4 px-8 py-4 bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 transition-all duration-400"
            >
              <span className="font-mono text-[11px] tracking-[0.3em] text-[#38BDF8]">ENTER THE LAB</span>
              <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="group-hover:translate-x-2 transition-transform duration-300">
                <path d="M12 1L15 4L12 7M1 4H15" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>

          {/* Bottom specs bar */}
          <div
            ref={specsRef}
            className="flex items-center gap-8 mt-16 pt-8 border-t border-white/5"
            style={{ opacity: 0 }}
          >
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 mb-1">MACHINES</div>
              <div className="font-display font-bold text-2xl text-white">04</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 mb-1">MAX POWER</div>
              <div className="font-display font-bold text-2xl text-white">808 <span className="text-[#38BDF8] text-base">HP</span></div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-400 mb-1">TOP SPEED</div>
              <div className="font-display font-bold text-2xl text-white">216 <span className="text-[#38BDF8] text-base">MPH</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="font-mono text-[9px] tracking-[0.35em] text-zinc-400">SCROLL</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-4 bg-white/60"
            style={{
              animation: 'scrollIndicator 2s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollIndicator {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        @keyframes obsessionGradient {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .obsession-gradient {
          background: linear-gradient(90deg, #EF4444, #F97316, #38BDF8, #7DD3FC, #EF4444);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: obsessionGradient 4s ease infinite;
        }
      `}</style>
    </section>
  );
}
