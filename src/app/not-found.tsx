import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-mono text-[10px] tracking-[0.35em] text-zinc-400 mb-6">ERROR / 404</div>
        <div
          className="font-display font-bold text-white mb-4"
          style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', letterSpacing: '-0.05em', lineHeight: 0.85 }}
        >
          404
        </div>
        <div className="font-display font-semibold text-xl text-zinc-400 mb-8">
          MACHINE NOT FOUND
        </div>
        <p className="font-ui text-sm text-zinc-400 mb-10 max-w-xs mx-auto">
          The vehicle you&apos;re looking for has left the laboratory.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-4 px-6 py-3 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white transition-all duration-300"
        >
          <span className="font-mono text-[10px] tracking-[0.3em]">RETURN TO LAB</span>
        </Link>
      </div>
    </div>
  );
}
