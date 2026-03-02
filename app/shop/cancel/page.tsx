import Link from 'next/link';

export const metadata = {
  title: 'Order Cancelled — Fantastick',
};

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md">
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl mb-4">Order Cancelled</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Your order was not completed. No charge was made. Head back to the gallery whenever you&apos;re ready.
        </p>
        <Link
          href="/gallery"
          className="inline-block border border-white/30 text-white/60 hover:border-white hover:text-white text-xs tracking-[0.25em] uppercase px-6 py-3 transition-all"
        >
          Back to Gallery
        </Link>
      </div>
    </div>
  );
}
