export interface Photo {
  id: string;
  title: string;
  collection: 'landscapes' | 'urban' | 'portraits';
  src: string;
  thumbnailSrc: string;
  aspectRatio: number; // width / height
}

export const collections = ['landscapes', 'urban', 'portraits'] as const;
export type Collection = typeof collections[number];

export const collectionLabels: Record<Collection, string> = {
  landscapes: 'Landscapes',
  urban: 'Urban',
  portraits: 'Portraits',
};

export const photos: Photo[] = [
  // Landscapes
  { id: 'l1', title: 'Alpine Silence', collection: 'landscapes', src: 'https://picsum.photos/seed/land1/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/land1/800/533', aspectRatio: 1600 / 1067 },
  { id: 'l2', title: 'First Light', collection: 'landscapes', src: 'https://picsum.photos/seed/land2/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/land2/800/533', aspectRatio: 1600 / 1067 },
  { id: 'l3', title: 'Still Water', collection: 'landscapes', src: 'https://picsum.photos/seed/land3/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/land3/533/800', aspectRatio: 1067 / 1600 },
  { id: 'l4', title: 'Dusk Over the Ridge', collection: 'landscapes', src: 'https://picsum.photos/seed/land4/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/land4/800/533', aspectRatio: 1600 / 1067 },
  { id: 'l5', title: 'Fog Valley', collection: 'landscapes', src: 'https://picsum.photos/seed/land5/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/land5/800/533', aspectRatio: 1600 / 1067 },
  { id: 'l6', title: 'The Quiet Lake', collection: 'landscapes', src: 'https://picsum.photos/seed/land6/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/land6/533/800', aspectRatio: 1067 / 1600 },
  { id: 'l7', title: 'Snowline', collection: 'landscapes', src: 'https://picsum.photos/seed/land7/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/land7/800/533', aspectRatio: 1600 / 1067 },
  { id: 'l8', title: 'Coastal Blue', collection: 'landscapes', src: 'https://picsum.photos/seed/land8/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/land8/800/533', aspectRatio: 1600 / 1067 },
  { id: 'l9', title: 'Prairie Gold', collection: 'landscapes', src: 'https://picsum.photos/seed/land9/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/land9/533/800', aspectRatio: 1067 / 1600 },

  // Urban
  { id: 'u1', title: 'Midnight Corridor', collection: 'urban', src: 'https://picsum.photos/seed/urb1/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/urb1/533/800', aspectRatio: 1067 / 1600 },
  { id: 'u2', title: 'Glass & Steel', collection: 'urban', src: 'https://picsum.photos/seed/urb2/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/urb2/800/533', aspectRatio: 1600 / 1067 },
  { id: 'u3', title: 'Rain on Asphalt', collection: 'urban', src: 'https://picsum.photos/seed/urb3/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/urb3/800/533', aspectRatio: 1600 / 1067 },
  { id: 'u4', title: 'Platform 9', collection: 'urban', src: 'https://picsum.photos/seed/urb4/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/urb4/533/800', aspectRatio: 1067 / 1600 },
  { id: 'u5', title: 'The Yellow Cab', collection: 'urban', src: 'https://picsum.photos/seed/urb5/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/urb5/800/533', aspectRatio: 1600 / 1067 },
  { id: 'u6', title: 'Stairwell No. 3', collection: 'urban', src: 'https://picsum.photos/seed/urb6/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/urb6/533/800', aspectRatio: 1067 / 1600 },
  { id: 'u7', title: 'Neon & Smoke', collection: 'urban', src: 'https://picsum.photos/seed/urb7/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/urb7/800/533', aspectRatio: 1600 / 1067 },
  { id: 'u8', title: 'Empty Streets', collection: 'urban', src: 'https://picsum.photos/seed/urb8/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/urb8/800/533', aspectRatio: 1600 / 1067 },
  { id: 'u9', title: 'The Overpass', collection: 'urban', src: 'https://picsum.photos/seed/urb9/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/urb9/533/800', aspectRatio: 1067 / 1600 },

  // Portraits
  { id: 'p1', title: 'Solitude', collection: 'portraits', src: 'https://picsum.photos/seed/por1/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/por1/533/800', aspectRatio: 1067 / 1600 },
  { id: 'p2', title: 'Morning Light', collection: 'portraits', src: 'https://picsum.photos/seed/por2/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/por2/533/800', aspectRatio: 1067 / 1600 },
  { id: 'p3', title: 'The Gaze', collection: 'portraits', src: 'https://picsum.photos/seed/por3/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/por3/800/533', aspectRatio: 1600 / 1067 },
  { id: 'p4', title: 'In Between', collection: 'portraits', src: 'https://picsum.photos/seed/por4/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/por4/533/800', aspectRatio: 1067 / 1600 },
  { id: 'p5', title: 'Window Seat', collection: 'portraits', src: 'https://picsum.photos/seed/por5/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/por5/533/800', aspectRatio: 1067 / 1600 },
  { id: 'p6', title: 'Afterglow', collection: 'portraits', src: 'https://picsum.photos/seed/por6/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/por6/533/800', aspectRatio: 1067 / 1600 },
  { id: 'p7', title: 'The Wait', collection: 'portraits', src: 'https://picsum.photos/seed/por7/1600/1067', thumbnailSrc: 'https://picsum.photos/seed/por7/800/533', aspectRatio: 1600 / 1067 },
  { id: 'p8', title: 'Distance', collection: 'portraits', src: 'https://picsum.photos/seed/por8/1067/1600', thumbnailSrc: 'https://picsum.photos/seed/por8/533/800', aspectRatio: 1067 / 1600 },
];

export const getPhotosByCollection = (collection: Collection) =>
  photos.filter((p) => p.collection === collection);

export const getPhotoById = (id: string) =>
  photos.find((p) => p.id === id);
