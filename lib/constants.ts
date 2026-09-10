export const SITE_CONFIG = {
  name: 'CUSTECH FCI',
  description: 'Official student portal for the Faculty of Computing and Informatics at CUSTECH Osara.',
  university: 'Confluence University of Science and Technology (CUSTECH) Osara',
};

export interface NavDropdownItem {
  href: string;
  label: string;
  description: string;
  badge?: string;
  iconName: string;
}

export interface HeaderNavItem {
  label: string;
  href?: string;
  badge?: string;
  children?: NavDropdownItem[];
}

export const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/departments', label: 'Departments', icon: 'building' },
  { href: '/resources', label: 'Study Materials', icon: 'book' },
  { href: '/cbt', label: 'CBT Drill', icon: 'zap' },
  { href: '/cgpa', label: 'CGPA', icon: 'calculator' },
  { href: '/ai-tutor', label: 'Ask AI', icon: 'bot' },
  { href: '/departments', label: 'Departments', icon: 'building' },
  { href: '/resources', label: 'Resources', icon: 'book' },
  { href: '/resources', label: 'Resources & Vault', icon: 'book' },
  { href: '/timetable', label: 'Timetable', icon: 'calendar' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar' },
  { href: '/grievances', label: 'Grievances', icon: 'inbox' },
  { href: '/lost-and-found', label: 'Lost & Found', icon: 'search' },
  { href: '/news', label: 'News', icon: 'newspaper' },
  { href: '/about', label: 'About', icon: 'info' },
  { href: '/contacts', label: 'Contact', icon: 'mail' },
  { href: '/grievances', label: 'Grievances', icon: 'inbox' },
  { href: '/lost-and-found', label: 'Lost & Found', icon: 'search' },
];

export const HEADER_NAV_ITEMS: HeaderNavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/departments', label: 'Departments' },
  {
    label: 'Academic Tools',
    children: [
      {
        href: '/cbt',
        label: 'FCI CBT Drill',
        description: 'Timed mock exams, practice drills & question explanations',
        badge: 'Practice',
        iconName: 'zap',
      },
      {
        href: '/cgpa',
        label: 'Smart CGPA Calculator',
        description: 'Official 5.0 scale GPA calculator & target forecaster',
        badge: '5.0',
        iconName: 'calculator',
      },
      {
        href: '/ai-tutor',
        label: 'Ask FCI AI (Tutor)',
        description: '24/7 AI course study copilot & interactive flashcards',
        badge: 'AI Copilot',
        iconName: 'bot',
      },
      {
        href: '/timetable',
        label: 'Lecture & Exam Timetable',
        description: 'Weekly class schedules, hall allocations & test dates',
        iconName: 'calendar',
      },
      {
        href: '/calendar',
        label: 'Academic Calendar',
        description: 'Senate-approved semester dates, milestones & deadlines',
        iconName: 'clock',
      },
    ],
  },
  {
    href: '/resources',
    label: 'Materials Vault',
    badge: '89+ Notes',
  },
  {
    label: 'Student Welfare',
    children: [
      {
        href: '/grievances',
        label: 'Guild Grievance Box',
        description: 'Anonymous complaints, suggestions & tracking tickets',
        badge: 'Anonymous',
        iconName: 'inbox',
      },
      {
        href: '/lost-and-found',
        label: 'Faculty Lost & Found',
        description: 'Community board to report and reclaim misplaced items',
        iconName: 'search',
      },
      {
        href: '/news',
        label: 'News & Announcements',
        description: 'Official faculty notices, senate circulars & updates',
        iconName: 'newspaper',
      },
      {
        href: '/contacts',
        label: 'Course Reps & Directory',
        description: 'Contact info and WhatsApp channels for reps and staff',
        iconName: 'mail',
      },
      {
        href: '/about',
        label: 'About Faculty',
        description: 'FCI leadership, history, degree programs & vision',
        iconName: 'info',
      },
    ],
  },
];

export const DEPARTMENTS = [
  {
    name: 'Computer Science',
    slug: 'computer-science',
    icon: 'monitor',
    description: 'Study the theory, experimentation, and engineering that form the basis for the design and use of computers.',
  },
  {
    name: 'Cyber Security',
    slug: 'cyber-security',
    icon: 'shield',
    description: 'Learn to protect computer systems and networks from information disclosure, theft of or damage to their hardware, software, or electronic data.',
  },
  {
    name: 'Information Technology',
    slug: 'information-technology',
    icon: 'server',
    description: 'Focus on the practical application of technology to support business and organizational needs.',
  },
  {
    name: 'Software Engineering',
    slug: 'software-engineering',
    icon: 'code',
    description: 'Master the systematic application of engineering approaches to the development of software.',
  },
  {
    name: 'Library and Information Science',
    slug: 'library-info-science',
    icon: 'book-open',
    description: 'Learn information organisation, digital libraries, knowledge management, archiving, and research services.',
  },
];

export const GRADE_POINTS: Record<string, number> = {
  'A': 5.0,
  'B': 4.0,
  'C': 3.0,
  'D': 2.0,
  'E': 1.0,
  'F': 0.0,
};

export const CLASSIFICATIONS = [
  { minGpa: 4.5, label: 'First Class Honours' },
  { minGpa: 3.5, label: 'Second Class Honours (Upper Division)' },
  { minGpa: 2.4, label: 'Second Class Honours (Lower Division)' },
  { minGpa: 1.5, label: 'Third Class Honours' },
  { minGpa: 1.0, label: 'Pass' },
  { minGpa: 0.0, label: 'Fail' },
];
