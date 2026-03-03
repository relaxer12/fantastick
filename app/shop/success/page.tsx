import Link from 'next/link';

export const metadata = {
  title: 'Order Confirmed — Fantastick',
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md">
        {/* Icon */}
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 10L8 15L17 5" stroke="white" strokeWidth="1.5" strokeLinecap="square"/>
          </svg>
        </div>

        <h2 className="font-[family-name:var(--font-playfair)] text-4xl mb-4">Order Confirmed</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Thank you for your purchase. Your print is now being prepared by Lumaprints and will be shipped directly to you. You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="border-t border-[#2a2a2a] pt-6 space-y-3 text-xs text-white/30 tracking-wide">
          <p>Questions? Email <a href="mailto:hao.huang@hey.com" className="text-white/50 hover:text-white transition-colors">hao.huang@hey.com</a></p>
        </div>

        <div className="mt-10">
          <Link
            href="/gallery"
            className="inline-block border border-white/30 text-white/60 hover:border-white hover:text-white text-xs tracking-[0.25em] uppercase px-6 py-3 transition-all"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
