import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  categories,
  categoryLabels,
  filmSubcategories,
  subcategoryLabels,
  getPhotosBySubcategory,
  type Category,
  type Subcategory,
} from '@/data/photos';
import PhotoGrid from '@/components/PhotoGrid';

interface PageProps {
  params: { collection: string; subcategory: string };
}

export function generateStaticParams() {
  return filmSubcategories.map((sub) => ({
    collection: 'film',
    subcategory: sub,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const sub = params.subcategory as Subcategory;
  if (!filmSubcategories.includes(sub)) return {};
  return {
    title: `${subcategoryLabels[sub]} — Fantastick`,
    description: `Fine art ${subcategoryLabels[sub].toLowerCase()} photography prints available for purchase.`,
  };
}

export default function SubcategoryPage({ params }: PageProps) {
  const cat = params.collection as Category;
  const sub = params.subcategory as Subcategory;

  if (!categories.includes(cat) || !filmSubcategories.includes(sub)) {
    notFound();
  }

  const subPhotos = getPhotosBySubcategory(sub);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <header className="mb-10 md:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-white/40 mb-2">
            <Link href="/gallery" className="hover:text-white/70 transition-colors">Gallery</Link>
            {' / '}
            <Link href={`/gallery/${cat}`} className="hover:text-white/70 transition-colors">
              {categoryLabels[cat]}
            </Link>
            {' / '}
            <span>{subcategoryLabels[sub]}</span>
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
            {subcategoryLabels[sub]}
          </h2>
        </div>
        <p className="text-xs tracking-widest uppercase text-white/40">
          {subPhotos.length} photographs · Click to order a print
        </p>
      </header>

      <PhotoGrid photos={subPhotos} />
    </div>
  );
}
