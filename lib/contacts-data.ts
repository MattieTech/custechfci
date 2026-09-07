import { createClient } from '@/lib/supabase/client';

export type Representative = {
  name: string;
  phone: string;
  whatsapp: string;
};

export type DepartmentRepresentatives = {
  department: string;
  course_rep: Representative;
  assistant_rep: Representative;
};

export type LevelRepresentatives = {
  level: number; // 100, 200, 300, 400
  faculty_rep: Representative;
  departments: DepartmentRepresentatives[];
};

export const FCI_DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Cyber Security',
  'Information Technology (IFT)',
  'Library & Information Science',
];

export const DEFAULT_LEVEL_REPRESENTATIVES: LevelRepresentatives[] = [
  // 100 LEVEL
  {
    level: 100,
    faculty_rep: {
      name: '100L Faculty Representative',
      phone: '09054177365',
      whatsapp: 'https://wa.me/2349054177365',
    },
    departments: [
      {
        department: 'Computer Science',
        course_rep: {
          name: 'CSC 100L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'CSC 100L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Software Engineering',
        course_rep: {
          name: 'SWE 100L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'SWE 100L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Cyber Security',
        course_rep: {
          name: 'CYB 100L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'CYB 100L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Information Technology (IFT)',
        course_rep: {
          name: 'IFT 100L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'IFT 100L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Library & Information Science',
        course_rep: {
          name: 'LIS 100L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'LIS 100L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
    ],
  },

  // 200 LEVEL (with restored official rep contacts)
  {
    level: 200,
    faculty_rep: {
      name: '200L Faculty Representative',
      phone: '09054177365',
      whatsapp: 'https://wa.me/2349054177365',
    },
    departments: [
      {
        department: 'Computer Science',
        course_rep: {
          name: 'CSC 200L Course Rep',
          phone: '09044201253',
          whatsapp: 'https://wa.me/2349044201253',
        },
        assistant_rep: {
          name: 'CSC 200L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Software Engineering',
        course_rep: {
          name: 'SWE 200L Course Rep',
          phone: '08107966054',
          whatsapp: 'https://wa.me/2348107966054',
        },
        assistant_rep: {
          name: 'SWE 200L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Cyber Security',
        course_rep: {
          name: 'CYB 200L Course Rep',
          phone: '09036812126',
          whatsapp: 'https://wa.me/2349036812126',
        },
        assistant_rep: {
          name: 'CYB 200L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Information Technology (IFT)',
        course_rep: {
          name: 'IFT 200L Course Rep',
          phone: '08157135703',
          whatsapp: 'https://wa.me/2348157135703',
        },
        assistant_rep: {
          name: 'IFT 200L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Library & Information Science',
        course_rep: {
          name: 'LIS 200L Course Rep',
          phone: '07046346210',
          whatsapp: 'https://wa.me/2347046346210',
        },
        assistant_rep: {
          name: 'LIS 200L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
    ],
  },

  // 300 LEVEL
  {
    level: 300,
    faculty_rep: {
      name: '300L Faculty Representative',
      phone: '08000000000',
      whatsapp: 'https://wa.me/2348000000000',
    },
    departments: [
      {
        department: 'Computer Science',
        course_rep: {
          name: 'CSC 300L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'CSC 300L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Software Engineering',
        course_rep: {
          name: 'SWE 300L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'SWE 300L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Cyber Security',
        course_rep: {
          name: 'CYB 300L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'CYB 300L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Information Technology (IFT)',
        course_rep: {
          name: 'IFT 300L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'IFT 300L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Library & Information Science',
        course_rep: {
          name: 'LIS 300L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'LIS 300L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
    ],
  },

  // 400 LEVEL
  {
    level: 400,
    faculty_rep: {
      name: '400L Faculty Representative',
      phone: '08000000000',
      whatsapp: 'https://wa.me/2348000000000',
    },
    departments: [
      {
        department: 'Computer Science',
        course_rep: {
          name: 'CSC 400L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'CSC 400L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Software Engineering',
        course_rep: {
          name: 'SWE 400L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'SWE 400L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Cyber Security',
        course_rep: {
          name: 'CYB 400L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'CYB 400L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Information Technology (IFT)',
        course_rep: {
          name: 'IFT 400L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'IFT 400L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
      {
        department: 'Library & Information Science',
        course_rep: {
          name: 'LIS 400L Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
        assistant_rep: {
          name: 'LIS 400L Assistant Course Rep',
          phone: '08000000000',
          whatsapp: 'https://wa.me/2348000000000',
        },
      },
    ],
  },
];

const STORAGE_KEY = 'custech_level_representatives';

export async function loadLevelRepresentatives(): Promise<LevelRepresentatives[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('level_representatives').select('*').order('level', { ascending: true });
    if (!error && data && data.length > 0) {
      return data as LevelRepresentatives[];
    }
  } catch (err) {
    // Ignore and fallback to localStorage
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Ignore parse error
      }
    }
  }

  return DEFAULT_LEVEL_REPRESENTATIVES;
}

export async function saveLevelRepresentativesLocally(data: LevelRepresentatives[]): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('representatives_updated'));
  }

  try {
    const supabase = createClient();
    for (const item of data) {
      await supabase.from('level_representatives').upsert({
        level: item.level,
        faculty_rep: item.faculty_rep,
        departments: item.departments,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    // Fallback succeeds via localStorage
  }
}

export function formatWhatsAppUrl(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  const waNumber = digits.startsWith('0') ? `234${digits.substring(1)}` : digits;
  return `https://wa.me/${waNumber}`;
}

