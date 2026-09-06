export const SITE_CONFIG = {
  name: 'FCI Student Guide',
  description: 'Official student portal for the Faculty of Computing and Informatics at CUSTECH Osara.',
  university: 'Confluence University of Science and Technology (CUSTECH) Osara',
};

export const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/departments', label: 'Departments', icon: 'building' },
  { href: '/resources', label: 'Resources', icon: 'book' },
  { href: '/timetable', label: 'Timetable', icon: 'calendar' },
  { href: '/calendar', label: 'Calendar', icon: 'calendar' },
  { href: '/news', label: 'News', icon: 'newspaper' },
  { href: '/about', label: 'About', icon: 'info' },
  { href: '/contacts', label: 'Contact', icon: 'mail' },
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
