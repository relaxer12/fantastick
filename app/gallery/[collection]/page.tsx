import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  categories,
  categoryLabels,
  getPhotosByCategory,
  type Category,
} from '@/data/photos';
import PhotoGrid from '@/components/PhotoGrid';

interface PageProps {
  params: { collection: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ collection: c }));
}

export function generateMetadata({ params }: PageProps) {
  const cat = params.collection as Category;
  if (!categories.includes(cat)) return {};
  return {
    title: `${categoryLabels[cat]} — Fantastick`,
    description: `Fine art ${categoryLabels[cat].toLowerCase()} photography prints available for purchase.`,
  };
}

export default function CategoryPage({ params }: PageProps) {
  const cat = params.collection as Category;
  if (!categories.includes(cat)) notFound();

  const catPhotos = getPhotosByCategory(cat);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <header className="mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-white/40 mb-2">
            <Link href="/gallery" className="hover:text-white/70 transition-colors">Gallery</Link>
            {' / '}
            <span>{categoryLabels[cat]}</span>
          </p>
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl md:text-5xl font-light">
            {categoryLabels[cat]}
          </h2>
        </div>
        <p className="text-xs tracking-widest uppercase text-white/40">
          {catPhotos.length} photographs · Click to order a print
        </p>
      </header>

      <PhotoGrid photos={catPhotos} randomize />
    </div>
  );
}
