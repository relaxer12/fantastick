export interface Photo {
  id: string;
  title: string;
  collection: 'landscapes' | 'urban' | 'portraits';
  publicId: string; // Cloudinary public ID e.g. "landscapes/alpine-silence"
  aspectRatio: number; // width / height
}

export const collections = ['landscapes', 'urban', 'portraits'] as const;
export type Collection = typeof collections[number];

export const collectionLabels: Record<Collection, string> = {
  landscapes: 'Landscapes',
  urban: 'Urban',
  portraits: 'Portraits',
};

// ─────────────────────────────────────────────────────────────────────────────
// REPLACE the publicId values below with your actual Cloudinary public IDs.
// After uploading photos to Cloudinary, the public ID is shown in the Media
// Library — it looks like "landscapes/your-photo-filename" (no extension).
// ─────────────────────────────────────────────────────────────────────────────

export const photos: Photo[] = [
  // Landscapes
  { id: 'l1', title: 'Alpine Silence',      collection: 'landscapes', publicId: 'landscapes/alpine-silence',    aspectRatio: 1600 / 1067 },
  { id: 'l2', title: 'First Light',         collection: 'landscapes', publicId: 'landscapes/first-light',       aspectRatio: 1600 / 1067 },
  { id: 'l3', title: 'Still Water',         collection: 'landscapes', publicId: 'landscapes/still-water',       aspectRatio: 1067 / 1600 },
  { id: 'l4', title: 'Dusk Over the Ridge', collection: 'landscapes', publicId: 'landscapes/dusk-over-ridge',   aspectRatio: 1600 / 1067 },
  { id: 'l5', title: 'Fog Valley',          collection: 'landscapes', publicId: 'landscapes/fog-valley',        aspectRatio: 1600 / 1067 },
  { id: 'l6', title: 'The Quiet Lake',      collection: 'landscapes', publicId: 'landscapes/the-quiet-lake',    aspectRatio: 1067 / 1600 },
  { id: 'l7', title: 'Snowline',            collection: 'landscapes', publicId: 'landscapes/snowline',          aspectRatio: 1600 / 1067 },
  { id: 'l8', title: 'Coastal Blue',        collection: 'landscapes', publicId: 'landscapes/coastal-blue',      aspectRatio: 1600 / 1067 },
  { id: 'l9', title: 'Prairie Gold',        collection: 'landscapes', publicId: 'landscapes/prairie-gold',      aspectRatio: 1067 / 1600 },

  // Urban
  { id: 'u1', title: 'Midnight Corridor',   collection: 'urban', publicId: 'urban/midnight-corridor',  aspectRatio: 1067 / 1600 },
  { id: 'u2', title: 'Glass & Steel',       collection: 'urban', publicId: 'urban/glass-and-steel',    aspectRatio: 1600 / 1067 },
  { id: 'u3', title: 'Rain on Asphalt',     collection: 'urban', publicId: 'urban/rain-on-asphalt',    aspectRatio: 1600 / 1067 },
  { id: 'u4', title: 'Platform 9',          collection: 'urban', publicId: 'urban/platform-9',         aspectRatio: 1067 / 1600 },
  { id: 'u5', title: 'The Yellow Cab',      collection: 'urban', publicId: 'urban/the-yellow-cab',     aspectRatio: 1600 / 1067 },
  { id: 'u6', title: 'Stairwell No. 3',     collection: 'urban', publicId: 'urban/stairwell-no-3',     aspectRatio: 1067 / 1600 },
  { id: 'u7', title: 'Neon & Smoke',        collection: 'urban', publicId: 'urban/neon-and-smoke',     aspectRatio: 1600 / 1067 },
  { id: 'u8', title: 'Empty Streets',       collection: 'urban', publicId: 'urban/empty-streets',      aspectRatio: 1600 / 1067 },
  { id: 'u9', title: 'The Overpass',        collection: 'urban', publicId: 'urban/the-overpass',       aspectRatio: 1067 / 1600 },

  // Portraits
  { id: 'p1', title: 'Solitude',            collection: 'portraits', publicId: 'portraits/solitude',     aspectRatio: 1067 / 1600 },
  { id: 'p2', title: 'Morning Light',       collection: 'portraits', publicId: 'portraits/morning-light', aspectRatio: 1067 / 1600 },
  { id: 'p3', title: 'The Gaze',            collection: 'portraits', publicId: 'portraits/the-gaze',      aspectRatio: 1600 / 1067 },
  { id: 'p4', title: 'In Between',          collection: 'portraits', publicId: 'portraits/in-between',    aspectRatio: 1067 / 1600 },
  { id: 'p5', title: 'Window Seat',         collection: 'portraits', publicId: 'portraits/window-seat',   aspectRatio: 1067 / 1600 },
  { id: 'p6', title: 'Afterglow',           collection: 'portraits', publicId: 'portraits/afterglow',     aspectRatio: 1067 / 1600 },
  { id: 'p7', title: 'The Wait',            collection: 'portraits', publicId: 'portraits/the-wait',      aspectRatio: 1600 / 1067 },
  { id: 'p8', title: 'Distance',            collection: 'portraits', publicId: 'portraits/distance',      aspectRatio: 1067 / 1600 },
];

export const getPhotosByCollection = (collection: Collection) =>
  photos.filter((p) => p.collection === collection);

export const getPhotoById = (id: string) =>
  photos.find((p) => p.id === id);
