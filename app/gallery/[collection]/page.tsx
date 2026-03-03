import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { r2Url } from '@/lib/r2';
import {
  categories,
  categoryLabels,
  subcategoryLabels,
  filmSubcategories,
  getCoverPhoto,
  getPhotosBySubcategory,
  type Category,
  type Subcategory,
} from '@/data/photos';

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

  // Digital — coming soon
  if (cat === 'digital') {
    return (
      <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl mb-4">Digital</h2>
        <p className="text-sm tracking-widest uppercase text-white/40">Coming soon</p>
      </div>
    );
  }

  // Film — show subcategory cards
  const subcatConfig = filmSubcategories.map((sub: Subcategory) => ({
    sub,
    label: subcategoryLabels[sub],
    cover: getCoverPhoto(sub),
    count: getPhotosBySubcategory(sub).length,
  }));

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-12">
      <header className="mb-12 md:mb-16">
        <p className="text-xs tracking-widest uppercase text-white/40 mb-2">
          <Link href="/gallery" className="hover:text-white/70 transition-colors">Gallery</Link>
          {' / '}
          <span>{categoryLabels[cat]}</span>
        </p>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl">
          {categoryLabels[cat]}
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subcatConfig.map(({ sub, label, cover, count }) => (
          <Link
            key={sub}
            href={`/gallery/${cat}/${sub}`}
            className="group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden block"
          >
            {cover ? (
              <Image
                src={r2Url(cover.publicId)}
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
                {count} prints
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
