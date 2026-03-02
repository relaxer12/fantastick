'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Photo } from '@/data/photos';

interface LightboxProps {
  photo: Photo | null;
  onClose: () => void;
  onBuyPrints: () => void;
}

export default function Lightbox({ photo, onClose, onBuyPrints }: LightboxProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [photo]);

  const handlePrints = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyPrints();
  }, [onBuyPrints]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="font-[family-name:var(--font-playfair)] text-white text-lg">{photo.title}</p>
          <p className="text-xs tracking-widest uppercase text-white/30 mt-0.5 capitalize">{photo.collection}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white transition-colors p-2"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
          </svg>
        </button>
      </div>

      {/* Full photo + hover overlay */}
      <div
        className="flex-1 relative flex items-center justify-center group px-4 pb-4 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full image — object-contain so nothing is cropped */}
        <div className="relative w-full h-full">
          <Image
            src={photo.src}
            alt={photo.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {/* Hover overlay with Prints button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <div className="absolute inset-0 bg-black/20" />
          <button
            onClick={handlePrints}
            className="relative z-10 border border-white text-white text-xs tracking-[0.3em] uppercase px-8 py-3.5 hover:bg-white hover:text-black transition-all duration-200 backdrop-blur-sm"
          >
            Order a Print
          </button>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="text-center pb-4 flex-shrink-0">
        <p className="text-[10px] tracking-widest uppercase text-white/20">
          Click outside or press Esc to close
        </p>
      </div>
    </div>
  );
}
