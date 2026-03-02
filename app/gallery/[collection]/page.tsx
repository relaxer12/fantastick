import { notFound } from 'next/navigation';
import { collections, collectionLabels, getPhotosByCollection, type Collection } from '@/data/photos';
import PhotoGrid from '@/components/PhotoGrid';
import Link from 'next/link';

interface PageProps {
  params: { collection: string };
}

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c }));
}

export function generateMetadata({ params }: PageProps) {
  const col = params.collection as Collection;
  if (!collections.includes(col)) return {};
  return {
    title: `${collectionLabels[col]} — Fantastick`,
    description: `Fine art ${collectionLabels[col].toLowerCase()} photography prints available for purchase.`,
  };
}

export default function CollectionPage({ params }: PageProps) {
  const col = params.collection as Collection;

  if (!collections.includes(col)) {
    notFound();
  }

  const colPhotos = getPhotosByCollection(col);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      {/* Header */}
      <header className="mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-white/40 mb-2">
            <Link href="/gallery" className="hover:text-white/70 transition-colors">Gallery</Link>
            {' / '}
            <span>{collectionLabels[col]}</span>
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
            {collectionLabels[col]}
          </h2>
        </div>
        <p className="text-xs tracking-widest uppercase text-white/40">
          {colPhotos.length} photographs · Click to order a print
        </p>
      </header>

      <PhotoGrid photos={colPhotos} />
    </div>
  );
}
