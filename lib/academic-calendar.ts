export type CalendarEvent = {
  id: string;
  activity: string;
  date: string;
  category: 'registration' | 'orientation' | 'lecture' | 'exam' | 'ca_test' | 'break' | 'ceremony' | 'siwes';
  semester: 1 | 2;
  details?: string[];
  duration?: string;
  isMilestone?: boolean;
};

export const ACADEMIC_SESSION = "2026/2027";
export const INSTITUTION_NAME = "Confluence University of Science and Technology (CUSTECH)";
export const INSTITUTION_ADDRESS = "Km 19, Okene-Lokoja Road, Osara, P.M.B. 1040, Okene, Kogi State";
export const ISSUED_BY = "Office of the Registrar";
export const REGISTRAR_NAME = "Mrs. Yakubu Glory Ojochogu";
export const MEMO_REF = "CUSTECH/RO/S.6";
export const MEMO_DATE = "25th September, 2026";
export const SENATE_APPROVAL = "Announced by the Registrar & Secretary to Council, Mrs. Glory Ojochogu Yakubu";

export const SENATE_REGISTRATION_NOTE = {
  title: "Adjustment of Resumption Dates & Registration Schedule (2026/2027)",
  memoRef: "CUSTECH/RO/PRP/2026/01",
  dateIssued: "25th/26th September, 2026",
  meeting: "Official Circular signed by Mrs. Glory Ojochogu Yakubu, Registrar & Secretary to Council",
  registrar: "Mrs. Glory Ojochogu Yakubu",
  freshersResumption: {
    dates: "Monday, 12th October, 2026",
    extension: "2 Weeks Extension",
    description: "Arrival on campus, physical screening, credential documentation, and online course registration for 100L and Direct Entry students."
  },
  returningResumption: {
    dates: "Monday, 19th October, 2026",
    extension: "3 Weeks Extension",
    description: "Physical return to campus for returning students (200L and above). Online portals remain open for fee payment and course registration prior to return."
  },
  normalRegistration: {
    dates: "28th September, 2026 – Friday, 13th November, 2026",
    duration: "Extended to 13th Nov 2026",
    description: "Extended regular registration window for all fresh and returning students without penalty."
  },
  lateRegistration: {
    dates: "Saturday, 14th November, 2026 – Monday, 23rd November, 2026",
    duration: "10 Days Window",
    penaltyFee: "₦10,000 (Ten Thousand Naira Only)",
    description: "Late registration window. Strictly attracts the statutory late registration fee of ₦10,000."
  },
  matriculationNote: "Supplementary academic calendar containing the new date for the Matriculation Ceremony will be issued by the Academic Planning Unit.",
  guidanceNotice: "All Faculties, Departments, and Units are to take note and be guided accordingly."
};

export const FIRST_SEMESTER_EVENTS: CalendarEvent[] = [
  {
    id: "sem1-resumption-fresh",
    activity: "Fresh Students Resumption (100L & Direct Entry)",
    date: "Monday, 12th October 2026",
    category: "registration",
    semester: 1,
    duration: "New Date",
    isMilestone: true,
    details: [
      "Official resumption date for newly admitted 100L and Direct Entry students",
      "Commence screening, physical documentation, and online course registration immediately upon arrival"
    ]
  },
  {
    id: "sem1-resumption-returning",
    activity: "Returning Students Resumption (200L & Above)",
    date: "Monday, 19th October 2026",
    category: "registration",
    semester: 1,
    duration: "3-Week Extension",
    isMilestone: true,
    details: [
      "Physical return to campus for all returning students (200L, 300L, 400L, 500L)",
      "Fee payment and course registration continue seamlessly via student online portal prior to physical arrival"
    ]
  },
  {
    id: "sem1-orientation",
    activity: "Orientation Week (General and Department/Faculty)",
    date: "Monday, 19th October – Saturday, 24th October 2026",
    category: "orientation",
    semester: 1,
    duration: "1 Week",
    details: [
      "General University Orientation for fresh students",
      "Faculty & Departmental Orientation sessions across FCI departments"
    ]
  },
  {
    id: "sem1-lectures-part1",
    activity: "Lectures (First Phase)",
    date: "Monday, 19th October – Friday, 18th December 2026",
    category: "lecture",
    semester: 1,
    duration: "9 Weeks",
    details: ["Intensive classroom lectures, practical laboratory sessions, and attendance recording (75% mandatory)"]
  },
  {
    id: "sem1-reg-close-normal",
    activity: "Close of Regular Course Registration (Extended)",
    date: "Friday, 13th November 2026",
    category: "registration",
    semester: 1,
    isMilestone: true,
    details: [
      "Official extended deadline for standard course registration without penalty fee",
      "Fresh & returning students must complete course validation on or before 11:59 PM"
    ]
  },
  {
    id: "sem1-reg-late",
    activity: "Late Registration Period (Attracts ₦10,000 Statutory Surcharge)",
    date: "Saturday, 14th November – Monday, 23rd November 2026",
    category: "registration",
    semester: 1,
    details: [
      "Late registration window strictly attracts the statutory late penalty fee of ₦10,000",
      "Final opportunity for portal enrollment before final portal shutdown"
    ]
  },
  {
    id: "sem1-reg-close-late",
    activity: "Final Portal Closure (End of Late Registration)",
    date: "Monday, 23rd November 2026",
    category: "registration",
    semester: 1,
    isMilestone: true,
    details: ["University registration portal strictly closes at 11:59 PM for the 2026/2027 academic session"]
  },
  {
    id: "sem1-matriculation",
    activity: "Matriculation Ceremony (Supplementary Date Pending)",
    date: "Date to be announced by Academic Planning Unit",
    category: "ceremony",
    semester: 1,
    duration: "1 Day",
    isMilestone: true,
    details: ["Revised date for matriculation ceremony will be communicated via supplementary academic calendar"]
  },
  {
    id: "sem1-ca-test",
    activity: "Continuous Assessment (CA) (Test Component)",
    date: "Monday, 14th December – Friday, 18th December 2026",
    category: "ca_test",
    semester: 1,
    duration: "1 Week",
    isMilestone: true,
    details: ["Mid-semester continuous evaluation, classroom quizzes, and CBT tests"]
  },
  {
    id: "sem1-xmas-break",
    activity: "Christmas & New Year Break",
    date: "Monday, 21st December 2026 – Saturday, 2nd January 2027",
    category: "break",
    semester: 1,
    duration: "2 Weeks"
  },
  {
    id: "sem1-lectures-part2",
    activity: "Lectures Resume (Second Phase)",
    date: "Monday, 4th January – Friday, 15th January 2027",
    category: "lecture",
    semester: 1,
    duration: "2 Weeks",
    details: ["Conclusion of lecture syllabuses, project assignments, and practical logbook submissions"]
  },
  {
    id: "sem1-revision",
    activity: "Revision Week",
    date: "Monday, 18th January – Friday, 22nd January 2027",
    category: "lecture",
    semester: 1,
    duration: "1 Week",
    details: ["Academic consultation, tutorial revisions, and exam hall clearance"]
  },
  {
    id: "sem1-exams",
    activity: "First Semester Examination",
    date: "Monday, 25th January – Saturday, 6th February 2027",
    category: "exam",
    semester: 1,
    duration: "2 Weeks",
    isMilestone: true,
    details: ["Faculty written examinations, CBT assessments, and laboratory practical defenses"]
  },
  {
    id: "sem1-end",
    activity: "End of First Semester",
    date: "Saturday, 6th February 2027",
    category: "break",
    semester: 1,
    isMilestone: true
  },
  {
    id: "sem1-break",
    activity: "Semester Break",
    date: "Monday, 8th February – Friday, 19th February 2027",
    category: "break",
    semester: 1,
    duration: "2 Weeks"
  }
];

export const SECOND_SEMESTER_EVENTS: CalendarEvent[] = [
  {
    id: "sem2-commencement",
    activity: "Commencement of Second Semester",
    date: "Monday, 22nd February 2027",
    category: "lecture",
    semester: 2,
    duration: "17 Weeks Total",
    isMilestone: true
  },
  {
    id: "sem2-lectures-part1",
    activity: "Lectures (First Phase)",
    date: "Monday, 22nd February – Saturday, 10th April 2027",
    category: "lecture",
    semester: 2,
    duration: "7 Weeks",
    details: ["Mandatory 75% lecture and laboratory attendance required"]
  },
  {
    id: "sem2-ca-test",
    activity: "Continuous Assessment (CA) (Test Component)",
    date: "Monday, 12th April – Friday, 16th April 2027",
    category: "ca_test",
    semester: 2,
    duration: "1 Week",
    isMilestone: true,
    details: ["Mid-semester continuous evaluation, quizzes, and practical tests"]
  },
  {
    id: "sem2-lectures-part2",
    activity: "Lectures Resume (Second Phase)",
    date: "Monday, 19th April – Friday, 28th May 2027",
    category: "lecture",
    semester: 2,
    duration: "6 Weeks"
  },
  {
    id: "sem2-revision",
    activity: "Revision Week",
    date: "Monday, 31st May – Friday, 4th June 2027",
    category: "lecture",
    semester: 2,
    duration: "1 Week"
  },
  {
    id: "sem2-exams",
    activity: "Second Semester Examination",
    date: "Monday, 7th June – Saturday, 19th June 2027",
    category: "exam",
    semester: 2,
    duration: "2 Weeks",
    isMilestone: true,
    details: ["Faculty examination papers, CBT tests, and final degree project defenses"]
  },
  {
    id: "sem2-end",
    activity: "End of Second Semester",
    date: "Saturday, 19th June 2027",
    category: "break",
    semester: 2,
    isMilestone: true
  },
  {
    id: "sem2-siwes",
    activity: "SIWES / SWEP Industrial Training",
    date: "Monday, 21st June – Friday, 10th September 2027",
    category: "siwes",
    semester: 2,
    duration: "12 Weeks",
    isMilestone: true,
    details: [
      "Students Industrial Work Experience Scheme (SIWES)",
      "Students Work Experience Programme (SWEP) for eligible Computing and Engineering disciplines"
    ]
  }
];

export const ALL_CALENDAR_EVENTS: CalendarEvent[] = [
  ...FIRST_SEMESTER_EVENTS,
  ...SECOND_SEMESTER_EVENTS,
];
