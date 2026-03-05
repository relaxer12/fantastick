'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { r2Url } from '@/lib/r2';
import type { Photo } from '@/data/photos';
import { categoryLabels } from '@/data/photos';
import {
  printSizes,
  sizeDimensions,
  getCompatibleSizes,
  printSizeLabels,
  frameColors,
  frameColorLabels,
  matSizes,
  matSizeLabels,
  matAddonPrices,
  getPrice,
  SHIPPING_PRICE,
  type PrintSize,
  type PrintFormat,
  type FrameColor,
  type MatSize,
  type CropMode,
} from '@/lib/pricing';

interface PhotoDrawerProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function PhotoDrawer({ photo, onClose }: PhotoDrawerProps) {
  const [size, setSize] = useState<PrintSize>('8x10');
  const [format, setFormat] = useState<PrintFormat>('print');
  const [frameColor, setFrameColor] = useState<FrameColor>('black');
  const [matSize, setMatSize] = useState<MatSize>('none');
  const cropMode: CropMode = 'fill';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nativeSizes = photo ? getCompatibleSizes(photo.aspectRatio) : [];

  const orientationMatchedNativeSizes = photo
    ? nativeSizes.filter((s) => {
        const d = sizeDimensions[s];
        const isLandscapeSize = d.width > d.height;
        const isPortraitSize = d.height > d.width;
        const isSquareSize = d.width === d.height;

        if (isSquareSize) return true;
        if (photo.aspectRatio >= 1) return isLandscapeSize;
        return isPortraitSize;
      })
    : [];

  useEffect(() => {
    if (photo) {
      const defaultSize = orientationMatchedNativeSizes[0] ?? nativeSizes[0] ?? '8x10';
      setSize(defaultSize);
      setFormat('print');
      setFrameColor('black');
      setMatSize('none');
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [photo]);

  const price = photo
    ? getPrice(size, format, format === 'framed' ? frameColor : undefined, format === 'framed' ? matSize : undefined)
    : 0;

  const isNativeSize = nativeSizes.includes(size);

  const handleBuyNow = useCallback(async () => {
    if (!photo) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoId: photo.id,
          size,
          format,
          cropMode,
          frameColor: format === 'framed' ? frameColor : undefined,
          matSize: format === 'framed' ? matSize : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }, [photo, size, format, cropMode, frameColor, matSize]);

  if (!photo) return null;

  const frameColorSwatches: Record<FrameColor, string> = {
    black: '#1a1a1a',
    white: '#f5f5f0',
    oak: '#b8874a',
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="fixed z-50 bottom-0 left-0 right-0 md:bottom-auto md:top-0 md:right-0 md:left-auto md:h-full md:w-[600px] bg-[#111111] border-t md:border-t-0 md:border-l border-[#2a2a2a] flex flex-col max-h-[90vh] md:max-h-full overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-[#2a2a2a]">
          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-xl">{photo.title}</h3>
            <p className="text-xs text-white/40 tracking-widest uppercase mt-1">{categoryLabels[photo.category]}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1 ml-4 mt-1 flex-shrink-0" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <div className="relative w-full aspect-[4/3] bg-[#0a0a0a] flex-shrink-0">
          <Image src={r2Url(photo.publicId)} alt={photo.title} fill className="object-contain" sizes="440px" />
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1">
          <div>
            <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-3">Format</label>
            <div className="flex gap-2">
              {(['print', 'framed'] as PrintFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2.5 text-xs tracking-widest uppercase border transition-all ${
                    format === f
                      ? 'border-white text-white bg-white/10'
                      : 'border-[#333] text-white/50 hover:border-white/50 hover:text-white/80'
                  }`}
                >
                  {f === 'print' ? 'Print Only' : 'Framed Print'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-3">Size & Crop Preview</label>
            <div className="grid grid-cols-2 gap-3">
              {printSizes.map((s) => {
                const dims = sizeDimensions[s];
                const selected = size === s;
                const native = nativeSizes.includes(s);

                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-2 border transition-all text-left ${
                      selected
                        ? 'border-white bg-white/10'
                        : 'border-[#333] hover:border-white/50'
                    }`}
                  >
                    <div className="relative w-full overflow-hidden bg-white/5 border border-white/10" style={{ aspectRatio: `${dims.width}/${dims.height}` }}>
                      <Image
                        src={r2Url(photo.publicId)}
                        alt={`${photo.title} preview ${s}`}
                        fill
                        className="object-cover"
                        sizes="180px"
                      />
                    </div>
                    <div className="mt-2 text-[10px] tracking-wider uppercase text-white/70">{s}&quot;</div>
                    <div className="text-[9px] text-white/40">{native ? 'Native ratio' : 'Will crop'}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {format === 'framed' && (
            <div>
              <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-3">Frame</label>
              <div className="flex gap-3">
                {frameColors.map((fc) => (
                  <button
                    key={fc}
                    onClick={() => setFrameColor(fc)}
                    className={`flex-1 flex flex-col items-center gap-2 py-3 border transition-all ${
                      frameColor === fc ? 'border-white' : 'border-[#333] hover:border-white/50'
                    }`}
                  >
                    <span className="w-6 h-6 block border border-white/10" style={{ backgroundColor: frameColorSwatches[fc] }} />
                    <span className="text-[10px] tracking-widest uppercase text-white/60">{frameColorLabels[fc]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {format === 'framed' && (
            <div>
              <label className="text-[10px] tracking-widest uppercase text-white/40 block mb-3">Mat</label>
              <div className="grid grid-cols-3 gap-2">
                {matSizes.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMatSize(m)}
                    className={`py-2 text-xs border transition-all ${
                      matSize === m
                        ? 'border-white text-white bg-white/10'
                        : 'border-[#333] text-white/50 hover:border-white/50 hover:text-white/80'
                    }`}
                  >
                    {matSizeLabels[m]}
                    {m !== 'none' && <span className="block text-[9px] text-white/30 mt-0.5">+${matAddonPrices[m]}</span>}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-white/25 mt-2 tracking-wide">White archival mat board</p>
            </div>
          )}

          <div className="border-t border-[#2a2a2a] pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-white/40 tracking-widest uppercase">
                {printSizeLabels[size]} {format === 'framed' ? 'Framed Print' : 'Print'}
                {format === 'framed' ? ` · ${frameColorLabels[frameColor]}` : ''}
              </span>
              <span className="text-sm">${price}</span>
            </div>
            {!isNativeSize && (
              <div className="text-[10px] text-white/35 mb-2 tracking-wide">
                This size will be cropped to match print ratio.
              </div>
            )}
            {format === 'framed' && matSize !== 'none' && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/40 tracking-widest uppercase">{matSizeLabels[matSize]} · White</span>
                <span className="text-sm text-white/50">incl.</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-white/40 tracking-widest uppercase">Shipping</span>
              <span className="text-sm">${SHIPPING_PRICE}</span>
            </div>
            <div className="flex justify-between items-center border-t border-[#2a2a2a] pt-4">
              <span className="text-xs tracking-widest uppercase">Total</span>
              <span className="text-lg font-medium">${price + SHIPPING_PRICE}</span>
            </div>
          </div>

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}

          <button
            onClick={handleBuyNow}
            disabled={loading}
            className="w-full py-4 bg-white text-black text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/90 active:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting…' : 'Buy Now'}
          </button>

          <p className="text-[10px] text-white/25 text-center tracking-wide">
            Secure checkout via Stripe. Printed and shipped by Lumaprints.
          </p>
        </div>
      </div>
    </>
  );
}
