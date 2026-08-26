'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CarCollection from '@/components/CarCollection';
import EngineeringSection from '@/components/EngineeringSection';
import PerformanceSection from '@/components/PerformanceSection';
import Comparison from '@/components/Comparison';
import About from '@/components/About';
import { getFeaturedCar } from '@/data/cars';

const featuredCar = getFeaturedCar();

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <CustomCursor />
        <ParticleBackground />
        <Navbar />

        <main id="main-content">
          {/* Hero */}
          <Hero />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Car Collection */}
          <CarCollection />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Engineering */}
          <EngineeringSection />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Performance */}
          <PerformanceSection />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Exploded View Teaser */}
          <section className="py-24 px-6 lg:px-12 text-center bg-[#050505]">
            <div className="max-w-screen-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#38BDF8]/50" />
                <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-400">SIGNATURE FEATURE</span>
                <div className="w-8 h-px bg-[#38BDF8]/50" />
              </div>
              <h2
                className="font-display font-bold text-white mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
              >
                DISMANTLE.<br />
                <span className="text-[#38BDF8]">UNDERSTAND.</span><br />
                REASSEMBLE.
              </h2>
              <p className="font-ui text-sm text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                Each car page features a scroll-driven frame sequence that takes you from assembled vehicle to fully exploded engineering view and back.
              </p>
              <a
                href={`/cars/${featuredCar.id}`}
                data-cursor="expand"
                className="inline-flex items-center gap-4 px-8 py-4 border border-[#38BDF8]/30 hover:border-[#38BDF8]/60 text-[#38BDF8] transition-all duration-400 group"
              >
                <span className="font-mono text-[11px] tracking-[0.3em]">EXPLORE {featuredCar.name}</span>
                <svg width="16" height="8" viewBox="0 0 16 8" fill="none" className="group-hover:translate-x-2 transition-transform duration-300">
                  <path d="M12 1L15 4L12 7M1 4H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </a>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Comparison */}
          <Comparison />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* About */}
          <About />
        </main>
      </div>
    </>
  );
}
