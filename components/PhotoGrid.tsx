'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Photo } from '@/data/photos';
import PhotoDrawer from './PhotoDrawer';

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      {/* Masonry grid using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div
              className="relative w-full overflow-hidden bg-[#111]"
              style={{ aspectRatio: photo.aspectRatio }}
            >
              <Image
                src={photo.thumbnailSrc}
                alt={photo.title}
                fill
                className="object-cover group-hover:brightness-110 transition-all duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
                <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-[family-name:var(--font-playfair)] text-white">{photo.title}</p>
                  <p className="text-[10px] tracking-widest uppercase text-white/60 mt-1">Order Print</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PhotoDrawer
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
