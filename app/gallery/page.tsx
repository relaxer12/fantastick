import Image from 'next/image';
import Link from 'next/link';
import { collections, collectionLabels, photos } from '@/data/photos';

const collectionCovers = collections.map((col) => ({
  collection: col,
  label: collectionLabels[col],
  cover: photos.find((p) => p.collection === col)!,
}));

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12">
      <header className="mb-12 md:mb-16">
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-3">
          Gallery
        </h2>
        <p className="text-sm tracking-widest uppercase text-white/40">
          Select a collection
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collectionCovers.map(({ collection, label, cover }) => (
          <Link
            key={collection}
            href={`/gallery/${collection}`}
            className="group relative aspect-[3/4] overflow-hidden block"
          >
            <Image
              src={cover.thumbnailSrc}
              alt={label}
              fill
              className="object-cover brightness-60 group-hover:brightness-75 transition-all duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
              <h3 className="font-[family-name:var(--font-playfair)] text-3xl text-white tracking-wide">
                {label}
              </h3>
              <p className="text-xs tracking-[0.3em] uppercase text-white/50 mt-2">
                {photos.filter((p) => p.collection === collection).length} prints
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
