'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(false);

  const createParticle = useCallback((width: number, height: number): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -Math.random() * 0.3 - 0.1,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      life: 0,
      maxLife: Math.random() * 300 + 200,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isMobileRef.current = window.matchMedia('(max-width: 768px)').matches;
    const particleCount = isMobileRef.current ? 30 : 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize particles
      particlesRef.current = Array.from({ length: particleCount }, () =>
        createParticle(canvas.width, canvas.height)
      ).map(p => ({ ...p, life: Math.random() * p.maxLife }));
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];

        // Mouse influence (subtle)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.003;
          p.vx -= dx * force;
          p.vy -= dy * force;
        }

        // Apply velocity
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Fade in/out
        const lifePct = p.life / p.maxLife;
        const fade = lifePct < 0.1 ? lifePct / 0.1 : lifePct > 0.8 ? 1 - (lifePct - 0.8) / 0.2 : 1;
        const alpha = p.opacity * fade;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        // Reset when dead or out of bounds
        if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > width + 10) {
          particlesRef.current[i] = createParticle(width, height);
        }
      }

      // Very subtle light streaks (desktop only)
      if (!isMobileRef.current) {
        for (let j = 0; j < 2; j++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const streak = ctx.createLinearGradient(x, y, x + Math.random() * 60, y + Math.random() * 20);
          streak.addColorStop(0, 'rgba(56, 189, 248, 0)');
          streak.addColorStop(0.5, 'rgba(56, 189, 248, 0.008)');
          streak.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.beginPath();
          ctx.strokeStyle = streak;
          ctx.lineWidth = 1;
          ctx.moveTo(x, y);
          ctx.lineTo(x + 80, y + 5);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
