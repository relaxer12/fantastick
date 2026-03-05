'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { r2Url } from '@/lib/r2';
import type { Photo } from '@/data/photos';
import Lightbox from './Lightbox';
import PhotoDrawer from './PhotoDrawer';

interface PhotoGridProps {
  photos: Photo[];
  randomize?: boolean;
}

export default function PhotoGrid({ photos, randomize = false }: PhotoGridProps) {
  const displayPhotos = useMemo(() => {
    if (!randomize) return photos;
    const arr = [...photos];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [photos, randomize]);

  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [drawerPhoto, setDrawerPhoto] = useState<Photo | null>(null);

  const handlePhotoClick = (photo: Photo) => {
    setLightboxPhoto(photo);
  };

  const handleOrderPrints = () => {
    // Move from lightbox to drawer
    setDrawerPhoto(lightboxPhoto);
    setLightboxPhoto(null);
  };

  const handleLightboxClose = () => {
    setLightboxPhoto(null);
  };

  const handleDrawerClose = () => {
    setDrawerPhoto(null);
  };

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {displayPhotos.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden"
            onClick={() => handlePhotoClick(photo)}
          >
            <div
              className="relative w-full overflow-hidden bg-[#111]"
              style={{ aspectRatio: photo.aspectRatio }}
            >
              <Image
                src={r2Url(photo.publicId)}
                alt={photo.title}
                fill
                className="object-cover group-hover:brightness-110 transition-all duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-[family-name:var(--font-playfair)] text-white">{photo.title}</p>
                  <p className="text-[10px] tracking-widest uppercase text-white/50 mt-1">View</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox — full screen photo view */}
      <Lightbox
        photo={lightboxPhoto}
        onClose={handleLightboxClose}
        onBuyPrints={handleOrderPrints}
      />

      {/* Drawer — purchase flow */}
      <PhotoDrawer
        photo={drawerPhoto}
        onClose={handleDrawerClose}
      />
    </>
  );
}
