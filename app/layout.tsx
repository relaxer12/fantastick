import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Nav from '@/components/Nav';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fantastick — Fine Art Photography',
  description: 'Fine art photography prints available for purchase. Landscapes, urban, and portrait collections.',
  openGraph: {
    title: 'Fantastick — Fine Art Photography',
    description: 'Fine art photography prints available for purchase.',
    url: 'https://fantastick.work',
    siteName: 'Fantastick',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#08090d] text-white">
        <Nav />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
