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
export const MEMO_DATE = "7th September, 2026";
export const SENATE_APPROVAL = "Approved by Senate at its 32nd Meeting held on Tuesday, 2nd September 2026";

export const SENATE_REGISTRATION_NOTE = {
  title: "Senate Resolution on Online Course Registration & Validation",
  memoRef: "CUSTECH/RO/S.6",
  dateIssued: "7th September, 2026",
  meeting: "32nd Senate Meeting held on Tuesday, 2nd September 2026",
  registrar: "Mrs. Yakubu Glory Ojochogu",
  normalRegistration: {
    dates: "28th September, 2026 – 31st October, 2026",
    duration: "5 Weeks",
    description: "Online Course Registration and Revalidation for all fresh and returning students without penalty."
  },
  lateRegistration: {
    dates: "1st November, 2026 – 10th November, 2026",
    duration: "10 Days",
    penaltyFee: "₦10,000 (Ten Thousand Naira Only)",
    description: "Late registration window. Strictly attracts a mandatory penalty fee of ₦10,000 before portal closes."
  },
  guidanceNotice: "All Faculties, Departments, and Units are to take note and be guided accordingly."
};

export const FIRST_SEMESTER_EVENTS: CalendarEvent[] = [
  {
    id: "sem1-commencement",
    activity: "Commencement of First Semester",
    date: "Monday, 28th September 2026",
    category: "registration",
    semester: 1,
    duration: "19 Weeks Total",
    isMilestone: true,
    details: ["Official kickoff of the 2026/2027 Academic Session for all FCI departments"]
  },
  {
    id: "sem1-reg-screening",
    activity: "Online Course Registration, Screening & Programme Transfer",
    date: "Monday, 28th September – Friday, 9th October 2026",
    category: "registration",
    semester: 1,
    duration: "2 Weeks",
    details: [
      "Online Course Registration and Revalidation",
      "Screening & documentation of fresh students",
      "Change of Programme / Inter-Departmental Transfer"
    ]
  },
  {
    id: "sem1-orientation",
    activity: "Orientation Week (General and Department/Faculty)",
    date: "Monday, 12th October – Saturday, 17th October 2026",
    category: "orientation",
    semester: 1,
    duration: "1 Week",
    details: [
      "Monday, 12th October 2026: General University Orientation",
      "Tuesday, 13th – Saturday, 17th October 2026: Faculty & Departmental Orientation"
    ]
  },
  {
    id: "sem1-lectures-part1",
    activity: "Lectures (First Phase)",
    date: "Tuesday, 13th October – Friday, 18th December 2026",
    category: "lecture",
    semester: 1,
    duration: "10 Weeks",
    details: ["Intensive classroom lectures, practical laboratory sessions, and attendance recording (75% mandatory)"]
  },
  {
    id: "sem1-reg-close-normal",
    activity: "Close of Normal Registration for the Session",
    date: "Saturday, 31st October 2026",
    category: "registration",
    semester: 1,
    isMilestone: true,
    details: [
      "Senate deadline for normal course registration and revalidation",
      "Registrations after this date attract ₦10,000 late penalty fee"
    ]
  },
  {
    id: "sem1-reg-late",
    activity: "Late Registration Period (Attracts ₦10,000 Late Surcharge)",
    date: "Sunday, 1st November – Tuesday, 10th November 2026",
    category: "registration",
    semester: 1,
    details: [
      "Mandatory late registration penalty fee of ₦10,000 applies to all late submissions",
      "Final opportunity for student portal course endorsement"
    ]
  },
  {
    id: "sem1-reg-close-late",
    activity: "Close of Late Registration for the Session",
    date: "Tuesday, 10th November 2026",
    category: "registration",
    semester: 1,
    isMilestone: true,
    details: ["University registration portal strictly closes at 11:59 PM ahead of Matriculation"]
  },
  {
    id: "sem1-matriculation",
    activity: "Matriculation Ceremony",
    date: "Wednesday, 11th November 2026",
    category: "ceremony",
    semester: 1,
    duration: "1 Day",
    isMilestone: true,
    details: ["Official induction and oath-taking ceremony of newly admitted 100L undergraduate students"]
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
