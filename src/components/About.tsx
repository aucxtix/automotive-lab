'use client';

import { useRef, useState, useEffect } from 'react';

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

const PILLARS = [
  {
    title: 'THE CONCEPT',
    body: 'Automotive Lab is not a car website. It is an engineering experience. A place where machines are studied with the same obsession their creators applied when building them. Every frame. Every component. Every number.',
  },
  {
    title: 'ENGINEERING VISUALIZATION',
    body: 'Each vehicle is decomposed into its fundamental systems using real frame-sequence animation. Scroll to dismantle. Scroll back to reassemble. The relationship between parts becomes visible in a way no static image can achieve.',
  },
  {
    title: 'INTERACTIVE DESIGN',
    body: 'The interface responds to your presence. Mouse parallax. 3D card tilt. Magnetic buttons. Atmospheric particles. The site feels alive because the machines it presents deserve no less.',
  },
  {
    title: 'PHILOSOPHY',
    body: 'The car is always the hero. Every design decision, every animation, every particle exists to make the machine feel more impressive. Not to decorate a page. To communicate engineering obsession.',
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 overflow-hidden"
      aria-labelledby="about-heading"
    >
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(56,189,248,0.03) 0%, transparent 70%)' }}
      />

      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className="mb-20"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(40px)', transition: 'all 0.8s ease' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-[#38BDF8]/60" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-400">THE LABORATORY</span>
          </div>
          <h2
            id="about-heading"
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
          >
            ABOUT<br />
            <span className="text-[#38BDF8]">THE LAB</span>
          </h2>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
          {PILLARS.map(({ title, body }, i) => (
            <div
              key={title}
              className="bg-[#080808] p-8 lg:p-10 group"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 0.7s ease ${i * 120}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-px h-4 bg-[#38BDF8]/50" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                {title}
              </h3>
              <div className="h-px bg-white/5 mb-4" />
              <p className="font-ui text-sm text-zinc-300 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Tech specs */}
        <div
          className="mt-1 bg-[#060606] p-8 lg:p-10"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}
        >
          <div className="font-mono text-[9px] tracking-[0.3em] text-zinc-400 mb-6">TECHNOLOGY STACK</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['FRAMEWORK', 'Next.js 14'],
              ['LANGUAGE', 'TypeScript'],
              ['STYLING', 'Tailwind CSS'],
              ['ANIMATION', 'CSS + RAF'],
              ['RENDERING', 'Canvas API'],
              ['FRAMES', '4 × 82–102'],
              ['TOTAL FRAMES', '~388'],
              ['RESOLUTION', '1920×1080'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[8px] tracking-[0.25em] text-zinc-400">{label}</span>
                <span className="font-ui text-xs text-zinc-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer line */}
        <div
          className="mt-20 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-4"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.8s ease 0.6s' }}
        >
          <div className="font-display font-semibold text-sm tracking-[0.25em] text-zinc-300">
            AUTOMOTIVE <span className="text-[#38BDF8]">LAB</span>
          </div>
          <div className="font-mono text-[9px] tracking-[0.2em] text-zinc-400">
            ENGINEERED FOR OBSESSION · {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  );
}
