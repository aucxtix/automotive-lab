'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'HOME',        href: '/' },
  { label: 'COLLECTION',  href: '/#collection' },
  { label: 'ENGINEERING', href: '/#engineering' },
  { label: 'PERFORMANCE', href: '/#performance' },
  { label: 'ABOUT',       href: '/#about' },
];

// Ripple click effect
function useRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const addRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  }, []);

  return { ripples, addRipple };
}

function NavLink({ item, index }: { item: typeof NAV_ITEMS[0]; index: number }) {
  const [clicked, setClicked] = useState(false);
  const { ripples, addRipple } = useRipple();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setClicked(true);
    addRipple(e);
    setTimeout(() => setClicked(false), 400);
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className="nav-link relative flex items-center gap-1 group overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={`Navigate to ${item.label}`}
    >
      {/* Ripple container */}
      {ripples.map(rp => (
        <span
          key={rp.id}
          className="nav-ripple"
          style={{ left: rp.x, top: rp.y }}
        />
      ))}

      {/* Index dot */}
      <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>

      {/* Label */}
      <span
        className="nav-label"
        style={{ color: clicked ? '#4ade80' : undefined }}
      >
        {item.label}
      </span>

      {/* Animated underline */}
      <span className="nav-underline" />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(4,4,4,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(74,222,128,0.08)' : 'none',
          padding: scrolled ? '10px 0' : '22px 0',
        }}
        aria-label="Main navigation"
      >
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="relative group font-display font-bold text-sm tracking-[0.3em] text-white z-10"
            aria-label="Automotive Lab – Home"
          >
            <span className="transition-colors duration-300 group-hover:text-white/70">AUTOMOTIVE</span>
            <span
              className="ml-1"
              style={{
                background: 'linear-gradient(90deg,#4ade80,#22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              LAB
            </span>
            {/* Logo hover glow */}
            <span className="absolute -inset-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(74,222,128,0.06), transparent)' }}
            />
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Primary">
            {NAV_ITEMS.map((item, i) => (
              <NavLink key={item.label} item={item} index={i} />
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-5">
            {/* Explore CTA — desktop */}
            <Link
              href="/#collection"
              data-cursor="expand"
              className="hidden lg:flex items-center gap-3 px-4 py-2 group relative overflow-hidden"
              style={{ border: '1px solid rgba(74,222,128,0.2)' }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'rgba(74,222,128,0.06)' }}
              />
              <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-300 group-hover:text-[#4ade80] transition-colors duration-300 relative z-10">
                EXPLORE
              </span>
              <span
                className="w-4 h-px relative z-10 transition-all duration-400 group-hover:w-7"
                style={{ background: 'linear-gradient(90deg,rgba(74,222,128,0.5),#4ade80)' }}
              />
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative z-50 p-2 flex flex-col gap-[5px]"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className="block h-px bg-white transition-all duration-400"
                style={{
                  width: menuOpen ? '24px' : '24px',
                  transform: menuOpen ? 'translateY(5.5px) rotate(45deg)' : 'none',
                  backgroundColor: menuOpen ? '#4ade80' : 'white',
                }}
              />
              <span
                className="block h-px bg-white/40 transition-all duration-300"
                style={{ width: '16px', opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'scaleX(1)' }}
              />
              <span
                className="block h-px bg-white transition-all duration-400"
                style={{
                  width: '24px',
                  transform: menuOpen ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
                  backgroundColor: menuOpen ? '#4ade80' : 'white',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      <div
        className="fixed inset-0 z-40 lg:hidden flex flex-col"
        style={{
          background: 'rgba(3,3,3,0.97)',
          backdropFilter: 'blur(32px)',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
          pointerEvents: menuOpen ? 'all' : 'none',
          transition: 'opacity 0.45s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        aria-hidden={!menuOpen}
        aria-modal={menuOpen}
        role="dialog"
      >
        {/* Background grid */}
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 100% 0%, rgba(74,222,128,0.05) 0%, transparent 70%)' }}
        />

        {/* Menu content */}
        <div className="flex flex-col justify-center flex-1 px-10">
          {/* Label */}
          <div
            className="flex items-center gap-3 mb-12"
            style={{ opacity: menuOpen ? 1 : 0, transform: menuOpen ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.4s ease 0.1s' }}
          >
            <div className="w-3 h-px" style={{ background: '#4ade80' }} />
            <span className="font-mono text-[9px] tracking-[0.4em] text-zinc-400">NAVIGATION</span>
          </div>

          {/* Nav items */}
          {NAV_ITEMS.map((item, i) => (
            <div
              key={item.label}
              className="border-b"
              style={{
                borderColor: activeItem === i ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.04)',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(-30px)',
                transition: `opacity 0.5s ease ${0.12 + i * 0.07}s, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94) ${0.12 + i * 0.07}s, border-color 0.3s ease`,
              }}
            >
              <Link
                href={item.href}
                onClick={() => { setMenuOpen(false); setActiveItem(i); }}
                onMouseEnter={() => setActiveItem(i)}
                className="mobile-nav-link group flex items-center justify-between py-5"
                aria-label={`Go to ${item.label}`}
              >
                <div className="flex items-center gap-5">
                  {/* Number */}
                  <span
                    className="font-mono text-[10px] transition-colors duration-300"
                    style={{ color: activeItem === i ? '#4ade80' : 'rgba(255,255,255,0.18)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Label */}
                  <span
                    className="font-display font-bold transition-all duration-300"
                    style={{
                      fontSize: 'clamp(1.8rem, 8vw, 3rem)',
                      letterSpacing: '-0.03em',
                      color: activeItem === i ? '#4ade80' : 'rgba(255,255,255,0.55)',
                      textShadow: activeItem === i ? '0 0 30px rgba(74,222,128,0.25)' : 'none',
                    }}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Arrow */}
                <svg
                  width="18" height="10" viewBox="0 0 18 10" fill="none"
                  className="transition-all duration-300"
                  style={{
                    opacity: activeItem === i ? 1 : 0,
                    transform: activeItem === i ? 'translateX(0)' : 'translateX(-8px)',
                    color: '#4ade80',
                  }}
                >
                  <path d="M13 1L17 5L13 9M1 5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          ))}

          {/* Bottom explore button */}
          <div
            className="mt-10"
            style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.5s ease 0.5s' }}
          >
            <Link
              href="/#collection"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-4 px-6 py-3 group"
              style={{ border: '1px solid rgba(74,222,128,0.3)' }}
            >
              <span className="font-mono text-[10px] tracking-[0.35em] text-[#4ade80]">EXPLORE COLLECTION</span>
              <svg width="14" height="7" viewBox="0 0 14 7" fill="none" className="group-hover:translate-x-2 transition-transform duration-300">
                <path d="M10 1L13 3.5L10 6M1 3.5H13" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-10 pb-10 flex items-center justify-between"
          style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.5s ease 0.55s' }}
        >
          <span className="font-display font-bold text-sm tracking-[0.3em]">
            AUTOMOTIVE<span style={{ color: '#4ade80' }}> LAB</span>
          </span>
          <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-500">COLLECTION 2024</span>
        </div>
      </div>

      <style jsx>{`
        /* ── Desktop nav link ── */
        .nav-link {
          padding: 8px 14px;
          font-family: var(--font-ui, ui-sans-serif);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.45);
          transition: color 0.25s ease;
          cursor: pointer;
        }
        .nav-link:hover { color: #4ade80; }
        .nav-link:hover .nav-index { opacity: 1; transform: translateY(0); color: rgba(74,222,128,0.6); }
        .nav-link:hover .nav-underline { transform: scaleX(1); }
        .nav-link:active { color: #86efac; }

        .nav-index {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          color: rgba(255,255,255,0.15);
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.25s ease;
          line-height: 1;
        }

        .nav-label {
          transition: color 0.25s ease, text-shadow 0.25s ease;
        }
        .nav-link:hover .nav-label {
          text-shadow: 0 0 20px rgba(74,222,128,0.4);
        }

        .nav-underline {
          position: absolute;
          bottom: 4px;
          left: 14px;
          right: 14px;
          height: 1px;
          background: linear-gradient(90deg, #4ade80, #22d3ee);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        /* ── Ripple ── */
        .nav-ripple {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(74,222,128,0.5);
          transform: translate(-50%, -50%) scale(0);
          animation: navRippleAnim 0.65s ease-out forwards;
          pointer-events: none;
        }
        @keyframes navRippleAnim {
          to { transform: translate(-50%, -50%) scale(14); opacity: 0; }
        }

        /* ── Mobile nav ── */
        .mobile-nav-link:hover { }
      `}</style>
    </>
  );
}
