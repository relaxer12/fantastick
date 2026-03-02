'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16
        ${isHome ? 'bg-transparent' : 'bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#1f1f1f]'}`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-[family-name:var(--font-playfair)] text-xl tracking-widest uppercase hover:opacity-70 transition-opacity"
      >
        Fantastick
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm tracking-widest uppercase transition-opacity hover:opacity-70 ${
              pathname.startsWith(link.href) ? 'opacity-100' : 'opacity-50'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span className={`block h-px w-6 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block h-px w-6 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block h-px w-6 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1f1f1f] flex flex-col py-6 px-6 gap-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase opacity-80 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
