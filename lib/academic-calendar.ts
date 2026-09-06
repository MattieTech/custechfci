export type CalendarEvent = {
  id: string;
  activity: string;
  date: string;
  category: 'registration' | 'orientation' | 'lecture' | 'exam' | 'ca_test' | 'break' | 'ceremony' | 'siwes';
  semester: 1 | 2;
  details?: string[];
  isMilestone?: boolean;
};

export const ACADEMIC_SESSION = "2026/2027";
export const INSTITUTION_NAME = "Confluence University of Science and Technology (CUSTECH), Osara";
export const ISSUED_BY = "Directorate of Academic Planning";

export const FIRST_SEMESTER_EVENTS: CalendarEvent[] = [
  {
    id: "sem1-commencement",
    activity: "Commencement of First Semester",
    date: "Monday, 28 September 2026",
    category: "registration",
    semester: 1,
    isMilestone: true,
  },
  {
    id: "sem1-reg-screening",
    activity: "Registration, Screening & Programme Transfer",
    date: "Monday, 28 September – Friday, 9 October 2026",
    category: "registration",
    semester: 1,
    details: [
      "Online Course and Revalidation of Registration",
      "Screening & documentation of fresh students",
      "Change of Programme / Inter-Departmental Transfer"
    ]
  },
  {
    id: "sem1-orientation",
    activity: "Orientation Week",
    date: "12 October – 17 October 2026",
    category: "orientation",
    semester: 1,
    details: [
      "Monday 12 October 2026 (General Orientation)",
      "13 – 17 October 2026 (Department / Faculty Orientation)"
    ]
  },
  {
    id: "sem1-lectures-part1",
    activity: "Lectures (First Phase)",
    date: "Tuesday, 13 October 2026 – Friday, 18 December 2026",
    category: "lecture",
    semester: 1,
    details: ["Mandatory 75% lecture and laboratory attendance required"]
  },
  {
    id: "sem1-matriculation",
    activity: "Matriculation Ceremony",
    date: "Wednesday, 11 November 2026",
    category: "ceremony",
    semester: 1,
    isMilestone: true,
    details: ["Official induction of newly admitted 100L undergraduate students"]
  },
  {
    id: "sem1-ca-test",
    activity: "Continuous Assessment (CA) (Test Component)",
    date: "Monday, 14 December – Friday, 18 December 2026",
    category: "ca_test",
    semester: 1,
    isMilestone: true,
    details: ["Mid-semester continuous evaluation and CBT tests"]
  },
  {
    id: "sem1-xmas-break",
    activity: "Christmas & New Year Break",
    date: "Monday, 21 December 2026 – Saturday, 2 January 2027",
    category: "break",
    semester: 1
  },
  {
    id: "sem1-lectures-part2",
    activity: "Lectures Resume (Second Phase)",
    date: "Monday, 4 January – Friday, 15 January 2027",
    category: "lecture",
    semester: 1,
    details: ["Conclusion of lecture syllabuses and project submissions"]
  },
  {
    id: "sem1-revision",
    activity: "Revision Week",
    date: "Monday, 18 January – Friday, 22 January 2027",
    category: "lecture",
    semester: 1
  },
  {
    id: "sem1-exams",
    activity: "First Semester Examination",
    date: "Monday, 25 January – Saturday, 6 February 2027",
    category: "exam",
    semester: 1,
    isMilestone: true,
    details: ["Faculty hall allocations, paper exams and computer-based tests"]
  },
  {
    id: "sem1-end",
    activity: "End of First Semester",
    date: "Saturday, 6 February 2027",
    category: "break",
    semester: 1,
    isMilestone: true
  },
  {
    id: "sem1-break",
    activity: "Semester Break",
    date: "Monday, 8 February – Friday, 19 February 2027",
    category: "break",
    semester: 1
  }
];

export const SECOND_SEMESTER_EVENTS: CalendarEvent[] = [
  {
    id: "sem2-commencement",
    activity: "Commencement of Second Semester",
    date: "Monday, 22 February 2027",
    category: "lecture",
    semester: 2,
    isMilestone: true
  },
  {
    id: "sem2-lectures-part1",
    activity: "Lectures (First Phase)",
    date: "Monday, 22 February – Saturday, 10 April 2027",
    category: "lecture",
    semester: 2
  },
  {
    id: "sem2-ca-test",
    activity: "Continuous Assessment (CA) (Test Component)",
    date: "Monday, 12 April – Friday, 16 April 2027",
    category: "ca_test",
    semester: 2,
    isMilestone: true,
    details: ["Mid-semester continuous evaluation and quizzes"]
  },
  {
    id: "sem2-lectures-part2",
    activity: "Lectures Resume (Second Phase)",
    date: "Monday, 19 April – Friday, 28 May 2027",
    category: "lecture",
    semester: 2
  },
  {
    id: "sem2-revision",
    activity: "Revision Week",
    date: "Monday, 31 May – Friday, 4 June 2027",
    category: "lecture",
    semester: 2
  },
  {
    id: "sem2-exams",
    activity: "Second Semester Examination",
    date: "Monday, 7 June – Saturday, 19 June 2027",
    category: "exam",
    semester: 2,
    isMilestone: true,
    details: ["Faculty examination papers, practicals and CBT tests"]
  },
  {
    id: "sem2-end",
    activity: "End of Second Semester",
    date: "Saturday, 19 June 2027",
    category: "break",
    semester: 2,
    isMilestone: true
  },
  {
    id: "sem2-siwes",
    activity: "SIWES / SWEP Industrial Training",
    date: "Monday, 21 June – Friday, 10 September 2027",
    category: "siwes",
    semester: 2,
    isMilestone: true,
    details: [
      "Students Industrial Work Experience Scheme (SIWES)",
      "Students Work Experience Programme (SWEP) for applicable engineering and computing departments"
    ]
  }
];

export const ALL_CALENDAR_EVENTS: CalendarEvent[] = [
  ...FIRST_SEMESTER_EVENTS,
  ...SECOND_SEMESTER_EVENTS,
];

