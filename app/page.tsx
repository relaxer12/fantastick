import Image from 'next/image';
import Link from 'next/link';
import { r2Url } from '@/lib/r2';
import { getPhotoById } from '@/data/photos';
import PhotoGrid from '@/components/PhotoGrid';

const heroKey = '35mm/35mm-1-17.jpg';

// Atlas-curated top 10 — film + digital mix (updated after digital portfolio added)
const featuredIds = [
  'd-1',     // Digital No. 1  — opener/hero digital (landscape)
  's-16',    // Film — Concrete structure + folding chair
  'd-9',     // Digital No. 9  — portrait orientation
  'mf-3-20', // Film — Woman on bench vs trellis wall
  'd-52',    // Digital No. 49 — large-format detail (landscape)
  's-15',    // Film — Concrete corridor to tree
  'd-46',    // Digital No. 43 — portrait orientation
  'mf-3-47', // Film — Log barns in snow
  'd-27',    // Digital No. 27 — landscape
  'mf-3-45', // Film — Abandoned Karmann Ghia wide
];

const featuredPhotos = featuredIds
  .map((id) => getPhotoById(id))
  .filter(Boolean) as NonNullable<ReturnType<typeof getPhotoById>>[];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative h-screen w-full overflow-hidden">
        <Image
          src={r2Url(heroKey)}
          alt="Featured photograph"
          fill
          priority
          className="object-cover brightness-50"
          sizes="100vw"
        />

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
          <span className="text-[10px] tracking-widest uppercase text-white">Scroll</span>
          <div className="w-px h-8 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* ── Featured Work ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-12 bg-[#0a0a0a]">
        <header className="mb-10 md:mb-14 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-3">Selected Work</p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl">
            Featured Photographs
          </h2>
        </header>

        <PhotoGrid photos={featuredPhotos} />

        <div className="mt-16 flex justify-center">
          <Link
            href="/gallery"
            className="border border-white/40 text-white/70 hover:border-white hover:text-white text-xs tracking-[0.3em] uppercase px-10 py-4 transition-all duration-300"
          >
            View Portfolio
          </Link>
        </div>
      </section>
    </>
  );
}
