import Image from 'next/image';
import Link from 'next/link';
import { r2Url } from '@/lib/r2';
import { categoryLabels, getCoverPhoto } from '@/data/photos';

const categoryConfig = [
  {
    slug: 'film',
    label: categoryLabels.film,
    coverKey: getCoverPhoto('film')?.publicId ?? '',
    desc: 'Film Photography',
  },
  {
    slug: 'digital',
    label: categoryLabels.digital,
    coverKey: 'digital/X2D_0069.jpg', // No. 57 — hand-picked cover
    desc: 'Digital Photography',
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12">
      <header className="mb-12 md:mb-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-3">
          Portfolio
        </h2>
        <p className="text-sm tracking-widest uppercase text-white/40">
          Select a category
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryConfig.map(({ slug, label, coverKey, desc }) => (
          <Link
            key={slug}
            href={`/gallery/${slug}`}
            className="group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden block"
          >
            {coverKey ? (
              <Image
                src={r2Url(coverKey)}
                alt={label}
                fill
                className="object-cover brightness-60 group-hover:brightness-75 transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-[#111]" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-white tracking-wide">
                {label}
              </h3>
              <p className="text-xs tracking-[0.3em] uppercase text-white/50 mt-2">
                {desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
