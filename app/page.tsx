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
  'mf-3-47', // Film No. 49 — from Film tile
  'd-52',    // Digital No. 49 — large-format detail (landscape)
  's-15',    // Film — Concrete corridor to tree
  'd-46',    // Digital No. 43 — portrait orientation
  'mf-3-46', // Film No. 48 — replaces No. 22 bench shot
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
          className="object-cover"
          sizes="100vw"
        />

        {/* Gradient overlay — preserves tonal character of the photo,
            darkens only where text needs to be legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/75" />

        {/* Editorial bottom-left positioning — quieter, more gallery-like */}
        <div className="absolute bottom-14 left-8 md:left-16 z-10">
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] uppercase text-white">
            Hao Huang
          </h1>
          <p className="text-[10px] tracking-[0.45em] uppercase text-white/50 mt-3 mb-8">
            Fine Art Photography
          </p>
          <Link
            href="/gallery"
            className="inline-block border border-white/35 text-white/75 hover:border-[#b8956a] hover:text-[#b8956a] text-[10px] tracking-[0.3em] uppercase px-8 py-3 transition-all duration-500"
          >
            View Portfolio
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-16 z-10 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-8 bg-white animate-pulse" />
          <span className="text-[9px] tracking-widest uppercase text-white">Scroll</span>
        </div>
      </section>

      {/* ── Featured Work ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 md:px-8 lg:px-12 bg-[#08090d]">
        <header className="mb-10 md:mb-14 text-center">
          <p className="text-[10px] tracking-[0.45em] uppercase text-white/25 mb-4">Selected Work</p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-light tracking-wide">
            Featured Photographs
          </h2>
        </header>

        <PhotoGrid photos={featuredPhotos} />

        <div className="mt-16 flex justify-center">
          <Link
            href="/gallery"
            className="border border-white/30 text-white/60 hover:border-[#b8956a] hover:text-[#b8956a] text-[10px] tracking-[0.3em] uppercase px-10 py-4 transition-all duration-500"
          >
            View Portfolio
          </Link>
        </div>
      </section>
    </>
  );
}
