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
    id: 'fci-complex-front',
    title: 'FCI Academic Complex & Lecture Halls',
    description: 'The modern faculty building hosting lecture theatres, computer laboratories, and administrative offices at CUSTECH Osara.',
    image_url: '/images/faculty_complex_hero.png',
    category: 'campus',
    date: 'September 2026',
    featured: true,
  },
  {
    id: 'custech-circular-notice',
    title: '2026/2027 Academic Resumption Directive',
    description: 'Official university circular signed by the Registrar, Mrs. Glory Ojochogu Yakubu, on resumption dates and registration guidelines.',
    image_url: '/images/custech_resumption_adjustment_circular_2026.png',
    category: 'academics',
    date: '25th September 2026',
    featured: true,
  },
  {
    id: 'computer-labs-fci',
    title: 'Department of Computer Science Lab',
    description: 'High-speed computing laboratory dedicated to hands-on software development, algorithm testing, and academic project work.',
    image_url: '/images/fci_hero_lab.png',
    category: 'academics',
    date: 'August 2026',
    featured: true,
  },
  {
    id: 'fci-auditorium',
    title: 'Faculty Multi-Purpose Auditorium',
    description: 'Venue for departmental orientations, distinguished public lectures, and academic guild symposiums.',
    image_url: '/images/fci_hall.png',
    category: 'events',
    date: 'July 2026',
    featured: false,
  },
];

const STORAGE_KEY = 'fci_custom_gallery_images_v1';

export function getStoredGalleryImages(): GalleryImage[] {
  if (typeof window === 'undefined') {
    return INITIAL_GALLERY_IMAGES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GALLERY_IMAGES));
      return INITIAL_GALLERY_IMAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_GALLERY_IMAGES;
  } catch {
    return INITIAL_GALLERY_IMAGES;
  }
}

export function saveStoredGalleryImages(images: GalleryImage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (err) {
    console.error('Failed to save gallery images to localStorage:', err);
  }
}
