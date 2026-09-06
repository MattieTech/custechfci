import { createClient } from '@/lib/supabase/client';

export type ClassGroup = {
  id: string;
  name: string;
  department: string;
  level: number;
  rep_name: string;
  whatsapp_link: string;
  telegram_link?: string;
  member_estimate: string;
  is_verified: boolean;
};

export const DEFAULT_COMMUNITY_GROUPS: ClassGroup[] = [
  // 200 Level Departmental Groups (with official 200L Course Reps)
  {
    id: 'cs-200',
    name: 'CSC 200L Official Class Forum',
    department: 'Computer Science',
    level: 200,
    rep_name: 'Course Rep (09044201253)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-cs200',
    telegram_link: 'https://t.me/custech_fci',
    member_estimate: '160+ students',
    is_verified: true,
  },
  {
    id: 'se-200',
    name: 'SWE 200L Developers Assembly',
    department: 'Software Engineering',
    level: 200,
    rep_name: 'Course Rep (08107966054)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-se200',
    telegram_link: 'https://t.me/custech_fci',
    member_estimate: '140+ students',
    is_verified: true,
  },
  {
    id: 'cyb-200',
    name: 'CYB 200L Cyber Guild',
    department: 'Cyber Security',
    level: 200,
    rep_name: 'Course Rep (09036812126)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-cyb200',
    member_estimate: '120+ students',
    is_verified: true,
  },
  {
    id: 'it-200',
    name: 'IFT 200L Tech Assembly',
    department: 'Information Technology (IFT)',
    level: 200,
    rep_name: 'Course Rep (08157135703)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-it200',
    member_estimate: '95+ students',
    is_verified: true,
  },
  {
    id: 'lis-200',
    name: 'LIS 200L Knowledge Network',
    department: 'Library & Information Science',
    level: 200,
    rep_name: 'Course Rep (07046346210)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-lis200',
    member_estimate: '75+ students',
    is_verified: true,
  },

  // 100 Level Departmental Groups (Fresh Students - Liaison via Faculty Rep)
  {
    id: 'cs-100',
    name: 'CSC 100L Freshers Group',
    department: 'Computer Science',
    level: 100,
    rep_name: 'Moderated via Faculty Rep (09054177365)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-cs100',
    telegram_link: 'https://t.me/custech_fci',
    member_estimate: '180+ students',
    is_verified: true,
  },
  {
    id: 'se-100',
    name: 'SWE 100L Innovators Hub',
    department: 'Software Engineering',
    level: 100,
    rep_name: 'Moderated via Faculty Rep (09054177365)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-se100',
    telegram_link: 'https://t.me/custech_fci',
    member_estimate: '140+ students',
    is_verified: true,
  },
  {
    id: 'cyb-100',
    name: 'CYB 100L Security Freshers',
    department: 'Cyber Security',
    level: 100,
    rep_name: 'Moderated via Faculty Rep (09054177365)',
    whatsapp_link: 'https://chat.whatsapp.com/sample-cyb100',
    member_estimate: '110+ students',
    is_verified: true,
  },

  // General Faculty Broadcast Channel
  {
    id: 'fci-announcements',
    name: 'FCI Official Broadcast & News Channel',
    department: 'General Faculty',
    level: 0,
    rep_name: 'Faculty Executive Council',
    whatsapp_link: 'https://whatsapp.com/channel/sample-fci',
    telegram_link: 'https://t.me/custech_fci',
    member_estimate: '850+ students',
    is_verified: true,
  },
];

const STORAGE_KEY = 'custech_community_groups';

export async function loadCommunityGroups(): Promise<ClassGroup[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('community_groups').select('*').order('level', { ascending: true });
    if (!error && data && data.length > 0) {
      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        department: d.department,
        level: d.level,
        rep_name: d.rep_name || '',
        whatsapp_link: d.whatsapp_link,
        telegram_link: d.telegram_link || undefined,
        member_estimate: d.member_estimate || '100+ students',
        is_verified: d.is_verified ?? true,
      }));
    }
  } catch (e) {
    // Ignore and fallback to local
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
  }

  return DEFAULT_COMMUNITY_GROUPS;
}

export async function saveCommunityGroupsLocally(groups: ClassGroup[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    window.dispatchEvent(new Event('community_groups_updated'));
  }

  try {
    const supabase = createClient();
    for (const g of groups) {
      await supabase.from('community_groups').upsert({
        id: g.id.includes('-') && !g.id.includes(' ') && g.id.length < 36 ? undefined : g.id,
        name: g.name,
        department: g.department,
        level: g.level,
        rep_name: g.rep_name,
        whatsapp_link: g.whatsapp_link,
        telegram_link: g.telegram_link,
        member_estimate: g.member_estimate,
        is_verified: g.is_verified,
      });
    }
  } catch (e) {
    // Fail silently to local storage
  }
}
