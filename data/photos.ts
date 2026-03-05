export interface Photo {
  id: string;
  title: string;
  category: 'film' | 'digital';
  publicId: string;       // R2 object key, e.g. "35mm/35mm-1-17.jpg"
  aspectRatio: number;    // width / height
}

// ─── Category config ──────────────────────────────────────────────────────────

export const categories = ['film', 'digital'] as const;
export type Category = typeof categories[number];

export const categoryLabels: Record<Category, string> = {
  film: 'Film',
  digital: 'Digital',
};

// ─── Photos ──────────────────────────────────────────────────────────────────

export const photos: Photo[] = [

  // ── 35mm ──────────────────────────────────────────────────────────────────
  { id: 's-2',  title: 'No. 2',  category: 'film', publicId: '35mm/35mm-1-2.jpg',  aspectRatio: 0.6672 },
  { id: 's-3',  title: 'No. 3',  category: 'film', publicId: '35mm/35mm-1-3.jpg',  aspectRatio: 0.6635 },
  { id: 's-4',  title: 'No. 4',  category: 'film', publicId: '35mm/35mm-1-4.jpg',  aspectRatio: 0.6695 },
  { id: 's-5',  title: 'No. 5',  category: 'film', publicId: '35mm/35mm-1-5.jpg',  aspectRatio: 0.6629 },
  { id: 's-6',  title: 'No. 6',  category: 'film', publicId: '35mm/35mm-1-6.jpg',  aspectRatio: 0.6631 },
  { id: 's-7',  title: 'No. 7',  category: 'film', publicId: '35mm/35mm-1-7.jpg',  aspectRatio: 0.6629 },
  { id: 's-8',  title: 'No. 8',  category: 'film', publicId: '35mm/35mm-1-8.jpg',  aspectRatio: 0.6630 },
  { id: 's-9',  title: 'No. 9',  category: 'film', publicId: '35mm/35mm-1-9.jpg',  aspectRatio: 0.6629 },
  { id: 's-10', title: 'No. 10', category: 'film', publicId: '35mm/35mm-1-10.jpg', aspectRatio: 0.6629 },
  { id: 's-11', title: 'No. 11', category: 'film', publicId: '35mm/35mm-1-11.jpg', aspectRatio: 1.5084 },
  { id: 's-12', title: 'No. 12', category: 'film', publicId: '35mm/35mm-1-12.jpg', aspectRatio: 0.6630 },
  { id: 's-13', title: 'No. 13', category: 'film', publicId: '35mm/35mm-1-13.jpg', aspectRatio: 0.6846 },
  { id: 's-14', title: 'No. 14', category: 'film', publicId: '35mm/35mm-1-14.jpg', aspectRatio: 0.6667 },
  { id: 's-15', title: 'No. 15', category: 'film', publicId: '35mm/35mm-1-15.jpg', aspectRatio: 1.5022 },
  { id: 's-16', title: 'No. 16', category: 'film', publicId: '35mm/35mm-1-16.jpg', aspectRatio: 1.5017 },
  { id: 's-17', title: 'No. 17', category: 'film', publicId: '35mm/35mm-1-17.jpg', aspectRatio: 1.5007 },
  { id: 's-18', title: 'No. 18', category: 'film', publicId: '35mm/35mm-1-18.jpg', aspectRatio: 1.5067 },
  { id: 's-19', title: 'No. 19', category: 'film', publicId: '35mm/35mm-1-19.jpg', aspectRatio: 0.6781 },
  { id: 's-20', title: 'No. 20', category: 'film', publicId: '35mm/35mm-1-20.jpg', aspectRatio: 0.6668 },
  { id: 's-21', title: 'No. 21', category: 'film', publicId: '35mm/35mm-1-21.jpg', aspectRatio: 1.4998 },
  { id: 's-22', title: 'No. 22', category: 'film', publicId: '35mm/35mm-1-22.jpg', aspectRatio: 0.6632 },
  { id: 's-23', title: 'No. 23', category: 'film', publicId: '35mm/35mm-1-23.jpg', aspectRatio: 1.5080 },
  { id: 's-24', title: 'No. 24', category: 'film', publicId: '35mm/35mm-1-24.jpg', aspectRatio: 1.5078 },
  { id: 's-26', title: 'No. 26', category: 'film', publicId: '35mm/35mm-1-26.jpg', aspectRatio: 1.5081 },
  { id: 's-27', title: 'No. 27', category: 'film', publicId: '35mm/35mm-1-27.jpg', aspectRatio: 1.5083 },
  { id: 's-28', title: 'No. 28', category: 'film', publicId: '35mm/35mm-1-28.jpg', aspectRatio: 1.5084 },
  { id: 's-29', title: 'No. 29', category: 'film', publicId: '35mm/35mm-1-29.jpg', aspectRatio: 0.6629 },
  { id: 's-30', title: 'No. 30', category: 'film', publicId: '35mm/35mm-1-30.jpg', aspectRatio: 0.6629 },
  { id: 's-31', title: 'No. 31', category: 'film', publicId: '35mm/35mm-1-31.jpg', aspectRatio: 0.6628 },

  // ── Medium Format ─────────────────────────────────────────────────────────
  { id: 'mf-1',    title: 'No. 1',  category: 'film', publicId: 'mf/MF-1.jpg',    aspectRatio: 1.0235 },
  { id: 'mf-2',    title: 'No. 2',  category: 'film', publicId: 'mf/MF-2.jpg',    aspectRatio: 0.8001 },
  { id: 'mf-3',    title: 'No. 3',  category: 'film', publicId: 'mf/MF-3.jpg',    aspectRatio: 0.7325 },
  { id: 'mf-3-2',  title: 'No. 4',  category: 'film', publicId: 'mf/MF-3-2.jpg',  aspectRatio: 1.0020 },
  { id: 'mf-3-3',  title: 'No. 5',  category: 'film', publicId: 'mf/MF-3-3.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-4',  title: 'No. 6',  category: 'film', publicId: 'mf/MF-3-4.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-5',  title: 'No. 7',  category: 'film', publicId: 'mf/MF-3-5.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-6',  title: 'No. 8',  category: 'film', publicId: 'mf/MF-3-6.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-7',  title: 'No. 9',  category: 'film', publicId: 'mf/MF-3-7.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-8',  title: 'No. 10', category: 'film', publicId: 'mf/MF-3-8.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-9',  title: 'No. 11', category: 'film', publicId: 'mf/MF-3-9.jpg',  aspectRatio: 1.0000 },
  { id: 'mf-3-10', title: 'No. 12', category: 'film', publicId: 'mf/MF-3-10.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-11', title: 'No. 13', category: 'film', publicId: 'mf/MF-3-11.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-12', title: 'No. 14', category: 'film', publicId: 'mf/MF-3-12.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-13', title: 'No. 15', category: 'film', publicId: 'mf/MF-3-13.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-14', title: 'No. 16', category: 'film', publicId: 'mf/MF-3-14.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-15', title: 'No. 17', category: 'film', publicId: 'mf/MF-3-15.jpg', aspectRatio: 1.2523 },
  { id: 'mf-3-16', title: 'No. 18', category: 'film', publicId: 'mf/MF-3-16.jpg', aspectRatio: 1.2525 },
  { id: 'mf-3-17', title: 'No. 19', category: 'film', publicId: 'mf/MF-3-17.jpg', aspectRatio: 1.0038 },
  { id: 'mf-3-18', title: 'No. 20', category: 'film', publicId: 'mf/MF-3-18.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-19', title: 'No. 21', category: 'film', publicId: 'mf/MF-3-19.jpg', aspectRatio: 1.2523 },
  { id: 'mf-3-20', title: 'No. 22', category: 'film', publicId: 'mf/MF-3-20.jpg', aspectRatio: 0.8570 },
  { id: 'mf-3-21', title: 'No. 23', category: 'film', publicId: 'mf/MF-3-21.jpg', aspectRatio: 0.8762 },
  { id: 'mf-3-22', title: 'No. 24', category: 'film', publicId: 'mf/MF-3-22.jpg', aspectRatio: 0.8573 },
  { id: 'mf-3-23', title: 'No. 25', category: 'film', publicId: 'mf/MF-3-23.jpg', aspectRatio: 1.1667 },
  { id: 'mf-3-24', title: 'No. 26', category: 'film', publicId: 'mf/MF-3-24.jpg', aspectRatio: 1.1666 },
  { id: 'mf-3-25', title: 'No. 27', category: 'film', publicId: 'mf/MF-3-25.jpg', aspectRatio: 1.2476 },
  { id: 'mf-3-26', title: 'No. 28', category: 'film', publicId: 'mf/MF-3-26.jpg', aspectRatio: 1.1668 },
  { id: 'mf-3-27', title: 'No. 29', category: 'film', publicId: 'mf/MF-3-27.jpg', aspectRatio: 0.8575 },
  { id: 'mf-3-28', title: 'No. 30', category: 'film', publicId: 'mf/MF-3-28.jpg', aspectRatio: 0.8572 },
  { id: 'mf-3-29', title: 'No. 31', category: 'film', publicId: 'mf/MF-3-29.jpg', aspectRatio: 1.1663 },
  { id: 'mf-3-30', title: 'No. 32', category: 'film', publicId: 'mf/MF-3-30.jpg', aspectRatio: 0.8573 },
  { id: 'mf-3-31', title: 'No. 33', category: 'film', publicId: 'mf/MF-3-31.jpg', aspectRatio: 0.8573 },
  { id: 'mf-3-32', title: 'No. 34', category: 'film', publicId: 'mf/MF-3-32.jpg', aspectRatio: 1.2659 },
  { id: 'mf-3-33', title: 'No. 35', category: 'film', publicId: 'mf/MF-3-33.jpg', aspectRatio: 0.8571 },
  { id: 'mf-3-34', title: 'No. 36', category: 'film', publicId: 'mf/MF-3-34.jpg', aspectRatio: 1.2249 },
  { id: 'mf-3-35', title: 'No. 37', category: 'film', publicId: 'mf/MF-3-35.jpg', aspectRatio: 0.8161 },
  { id: 'mf-3-36', title: 'No. 38', category: 'film', publicId: 'mf/MF-3-36.jpg', aspectRatio: 0.8681 },
  { id: 'mf-3-37', title: 'No. 39', category: 'film', publicId: 'mf/MF-3-37.jpg', aspectRatio: 0.8158 },
  { id: 'mf-3-38', title: 'No. 40', category: 'film', publicId: 'mf/MF-3-38.jpg', aspectRatio: 1.1329 },
  { id: 'mf-3-39', title: 'No. 41', category: 'film', publicId: 'mf/MF-3-39.jpg', aspectRatio: 1.1665 },
  { id: 'mf-3-40', title: 'No. 42', category: 'film', publicId: 'mf/MF-3-40.jpg', aspectRatio: 1.2260 },
  { id: 'mf-3-41', title: 'No. 43', category: 'film', publicId: 'mf/MF-3-41.jpg', aspectRatio: 1.2260 },
  { id: 'mf-3-42', title: 'No. 44', category: 'film', publicId: 'mf/MF-3-42.jpg', aspectRatio: 1.2263 },
  { id: 'mf-3-43', title: 'No. 45', category: 'film', publicId: 'mf/MF-3-43.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-44', title: 'No. 46', category: 'film', publicId: 'mf/MF-3-44.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-45', title: 'No. 47', category: 'film', publicId: 'mf/MF-3-45.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-46', title: 'No. 48', category: 'film', publicId: 'mf/MF-3-46.jpg', aspectRatio: 0.8158 },
  { id: 'mf-3-47', title: 'No. 49', category: 'film', publicId: 'mf/MF-3-47.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-48', title: 'No. 50', category: 'film', publicId: 'mf/MF-3-48.jpg', aspectRatio: 1.1665 },
  { id: 'mf-3-49', title: 'No. 51', category: 'film', publicId: 'mf/MF-3-49.jpg', aspectRatio: 1.1667 },
  { id: 'mf-3-50', title: 'No. 52', category: 'film', publicId: 'mf/MF-3-50.jpg', aspectRatio: 1.1666 },
  { id: 'mf-3-51', title: 'No. 53', category: 'film', publicId: 'mf/MF-3-51.jpg', aspectRatio: 1.1665 },
  { id: 'mf-3-52', title: 'No. 54', category: 'film', publicId: 'mf/MF-3-52.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-53', title: 'No. 55', category: 'film', publicId: 'mf/MF-3-53.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-54', title: 'No. 56', category: 'film', publicId: 'mf/MF-3-54.jpg', aspectRatio: 1.2943 },
  { id: 'mf-3-55', title: 'No. 57', category: 'film', publicId: 'mf/MF-3-55.jpg', aspectRatio: 1.1665 },
  { id: 'mf-3-56', title: 'No. 58', category: 'film', publicId: 'mf/MF-3-56.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-57', title: 'No. 59', category: 'film', publicId: 'mf/MF-3-57.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-58', title: 'No. 60', category: 'film', publicId: 'mf/MF-3-58.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-59', title: 'No. 61', category: 'film', publicId: 'mf/MF-3-59.jpg', aspectRatio: 1.2258 },
  { id: 'mf-3-60', title: 'No. 62', category: 'film', publicId: 'mf/MF-3-60.jpg', aspectRatio: 1.1665 },
  { id: 'mf-3-61', title: 'No. 63', category: 'film', publicId: 'mf/MF-3-61.jpg', aspectRatio: 0.8018 },
  { id: 'mf-3-62', title: 'No. 64', category: 'film', publicId: 'mf/MF-3-62.jpg', aspectRatio: 1.1665 },
  { id: 'mf-3-63', title: 'No. 65', category: 'film', publicId: 'mf/MF-3-63.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-64', title: 'No. 66', category: 'film', publicId: 'mf/MF-3-64.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-65', title: 'No. 67', category: 'film', publicId: 'mf/MF-3-65.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-66', title: 'No. 68', category: 'film', publicId: 'mf/MF-3-66.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-67', title: 'No. 69', category: 'film', publicId: 'mf/MF-3-67.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-68', title: 'No. 70', category: 'film', publicId: 'mf/MF-3-68.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-69', title: 'No. 71', category: 'film', publicId: 'mf/MF-3-69.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-70', title: 'No. 72', category: 'film', publicId: 'mf/MF-3-70.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-71', title: 'No. 73', category: 'film', publicId: 'mf/MF-3-71.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-72', title: 'No. 74', category: 'film', publicId: 'mf/MF-3-72.jpg', aspectRatio: 1.0041 },
  { id: 'mf-3-73', title: 'No. 75', category: 'film', publicId: 'mf/MF-3-73.jpg', aspectRatio: 1.0000 },
  { id: 'mf-3-74', title: 'No. 76', category: 'film', publicId: 'mf/MF-3-74.jpg', aspectRatio: 0.8571 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const getPhotosByCategory = (cat: Category) =>
  photos.filter((p) => p.category === cat);

export const getPhotoById = (id: string) =>
  photos.find((p) => p.id === id);

/** First photo in a category — used as cover image */
export const getCoverPhoto = (cat: Category) =>
  photos.find((p) => p.category === cat);
