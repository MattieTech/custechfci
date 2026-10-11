export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: 'campus' | 'events' | 'academics' | 'faculty' | 'students';
  date: string;
  uploaded_by?: string;
  featured?: boolean;
}

export const INITIAL_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'fci-complex-building',
    title: 'FCI Academic Complex & Faculty Building',
    description: 'The flagship faculty building housing lecture halls, computing facilities, and departmental offices at CUSTECH Osara.',
    image_url: '/images/school-faculty.jpeg',
    category: 'campus',
    date: 'October 2026',
    featured: true,
  },
  {
    id: 'custech-circular-notice',
    title: 'Official 2026/2027 Academic Resumption Circular',
    description: 'University circular signed by the Registrar, Mrs. Glory Ojochogu Yakubu, on resumption dates and registration guidelines.',
    image_url: '/images/custech_resumption_adjustment_circular_2026.png',
    category: 'academics',
    date: '25th September 2026',
    featured: true,
  },
  {
    id: 'custech-aerial-view',
    title: 'CUSTECH Campus Aerial Panorama',
    description: 'Panoramic aerial view of the expanding Confluence University of Science and Technology campus in Osara, Kogi State.',
    image_url: '/images/campus-aerial-1.jpg',
    category: 'campus',
    date: 'September 2026',
    featured: false,
  },
  {
    id: 'custech-main-gate',
    title: 'CUSTECH Main Campus Ceremonial Gate',
    description: 'The primary ceremonial entrance and security checkpoint of Confluence University of Science and Technology, Osara.',
    image_url: '/images/school-gate.jpeg',
    category: 'campus',
    date: 'August 2026',
    featured: false,
  },
];

const STORAGE_KEY = 'fci_custom_gallery_images_v2';

export function getStoredGalleryImages(): GalleryImage[] {
  if (typeof window === 'undefined') {
    return INITIAL_GALLERY_IMAGES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fall back to initial if corrupt
  }
  return INITIAL_GALLERY_IMAGES;
}

export function saveStoredGalleryImages(images: GalleryImage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (err) {
    console.error('Failed to save gallery images to localStorage:', err);
  }
}
