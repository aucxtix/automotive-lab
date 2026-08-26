'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type CursorMode = 'default' | 'explore' | 'inspect' | 'expand';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const animate = useCallback(() => {
    const speed = 0.15;
    posRef.current.x += (targetRef.current.x - posRef.current.x) * speed;
    posRef.current.y += (targetRef.current.y - posRef.current.y) * speed;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;
    }
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${targetRef.current.x - 3}px, ${targetRef.current.y - 3}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="explore"]')) {
        setMode('explore');
      } else if (target.closest('[data-cursor="inspect"]')) {
        setMode('inspect');
      } else if (target.closest('[data-cursor="expand"]') || target.closest('button') || target.closest('a')) {
        setMode('expand');
      } else {
        setMode('default');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onMouseOver);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, isVisible, animate]);

  if (isMobile) return null;

  const cursorLabels: Record<CursorMode, string | null> = {
    default: null,
    explore: 'EXPLORE',
    inspect: 'INSPECT',
    expand: 'SELECT',
  };

  const label = cursorLabels[mode];

  return (
    <>
      {/* Outer ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{
          width: mode === 'default' ? 40 : 60,
          height: mode === 'default' ? 40 : 60,
          marginLeft: mode === 'default' ? 0 : -10,
          marginTop: mode === 'default' ? 0 : -10,
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease, margin 0.3s ease',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="w-full h-full rounded-full border flex items-center justify-center"
          style={{
            borderColor: mode === 'explore' ? '#38BDF8' :
                         mode === 'inspect' ? '#FACC15' :
                         mode === 'expand' ? '#EF4444' :
                         'rgba(255,255,255,0.4)',
            backgroundColor: mode !== 'default' ? 'rgba(0,0,0,0.5)' : 'transparent',
            backdropFilter: mode !== 'default' ? 'blur(4px)' : 'none',
            transition: 'border-color 0.3s ease, background-color 0.3s ease',
          }}
        >
          {label && (
            <span
              className="font-mono text-white text-[8px] tracking-widest font-medium"
              style={{
                color: mode === 'explore' ? '#38BDF8' :
                       mode === 'inspect' ? '#FACC15' :
                       '#EF4444',
              }}
            >
              {label}
            </span>
          )}
        </div>
      </div>

      {/* Center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        style={{
          width: 6,
          height: 6,
          transition: 'opacity 0.3s ease',
          opacity: isVisible && mode === 'default' ? 1 : 0,
        }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </div>
    </>
  );
}
