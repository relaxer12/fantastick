import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-white">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
