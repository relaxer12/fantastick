import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About — Fantastick',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Portrait */}
        <div className="relative aspect-[3/4] bg-[#111]">
          <Image
            src="https://picsum.photos/seed/portrait-hao/800/1067"
            alt="Photographer portrait"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Bio */}
        <div className="pt-2 md:pt-8">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-8">
            About
          </h2>

          <div className="space-y-5 text-white/70 leading-relaxed text-sm">
            <p>
              I&apos;m a fine art photographer based in New York, drawn to the quiet spaces between moments — the light before it shifts, the stillness inside motion, the human trace left on empty landscapes.
            </p>
            <p>
              My work spans landscapes, urban environments, and portraiture. Each image is an attempt to isolate a feeling — not a place or a person, but something harder to name.
            </p>
            <p>
              All prints are produced on archival matte paper using Giclée printing, with a 100-year color guarantee. Framed prints come in solid wood frames: black, maple, or espresso.
            </p>
            <p>
              Every order is fulfilled and shipped by Lumaprints, a professional fine art print lab. Prints are carefully packaged and shipped directly to you.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-[#2a2a2a]">
            <p className="text-[10px] tracking-widest uppercase text-white/30 mb-4">Inquiries</p>
            <a
              href="mailto:hello@fantastick.work"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              hello@fantastick.work
            </a>
          </div>

          <div className="mt-8">
            <Link
              href="/gallery"
              className="inline-block border border-white/30 text-white/60 hover:border-white hover:text-white text-xs tracking-[0.25em] uppercase px-6 py-3 transition-all"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
