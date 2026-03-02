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
              I&apos;m a photographer based in New York, drawn to scenes that hold more than they show — a street corner gone quiet, light falling across a face, architecture that makes you feel small in exactly the right way.
            </p>
            <p>
              I&apos;ve been making photographs for twenty years, starting with a Canon my dad handed me in high school. That camera taught me to slow down and look. I&apos;m still doing the same thing.
            </p>
            <p>
              My work moves across landscapes, streets, cities, and people. The subject changes; the question stays the same — what is this moment trying to say, and can I hold still long enough to hear it?
            </p>
            <p>
              Prints are produced on archival matte paper with a 100-year color guarantee. Every order is fulfilled by Lumaprints, a professional fine art print lab, and shipped directly to you.
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
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
