import { redirect } from 'next/navigation';

interface PageProps {
  params: { collection: string; subcategory: string };
}

// Redirect any old subcategory URLs (e.g. /gallery/film/35mm, /gallery/film/medium-format)
// to the unified collection page.
export default function SubcategoryRedirectPage({ params }: PageProps) {
  redirect(`/gallery/${params.collection}`);
}
