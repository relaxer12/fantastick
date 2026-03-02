import Image from 'next/image';
import Link from 'next/link';

const heroImages = [
  'https://picsum.photos/seed/hero1/1920/1080',
  'https://picsum.photos/seed/hero2/1920/1080',
  'https://picsum.photos/seed/hero3/1920/1080',
];

export default function HomePage() {
  const hero = heroImages[0];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Hero image */}
      <Image
        src={hero}
        alt="Featured photograph"
        fill
        priority
        className="object-cover brightness-50"
        sizes="100vw"
      />

      {/* Overlay content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl lg:text-9xl tracking-widest uppercase text-white mb-6">
          HAO HUANG
        </h1>
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white/60 mb-12">
          Fine Art Photography
        </p>
        <Link
          href="/gallery"
          className="border border-white/40 text-white/80 hover:border-white hover:text-white text-xs tracking-[0.3em] uppercase px-8 py-3 transition-all duration-300"
        >
          View Portfolio
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/40 animate-pulse" />
      </div>
    </div>
  );
}
