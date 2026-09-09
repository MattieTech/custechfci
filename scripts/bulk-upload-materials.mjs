import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
// 1. Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Official CUSTECH Course Title Catalog (strictly derived from lib/departments-data.ts)
const OFFICIAL_COURSE_TITLES = {
  "CSC 131": "Introduction to Computing Sciences",
  "CSC 132": "Introduction to Front-End Web Development",
  "GST 111": "Communication in English",
  "GST 131": "Communication in English",
  "MTH 131": "Elementary Mathematics I",
  "MAT 132": "Elementary Mathematics II",
  "MTH 132": "Elementary Mathematics II",
  "PHY 131": "General Physics I",
  "PHY 133": "General Physics Pratical I",
  "STA 131": "Descriptive Statistics",
  "FCI 100": "Faculty Academic Regulations & Course Curriculum",
  "CSC 141": "Problem Solving",
  "CSC 142": "Fundamentals of Data Science",
  "GST 141": "Nigerian Peoples and Culture",
  "GST 142": "Leadership Skills",
  "MTH 141": "Elementary Mathematics II",
  "PHY 141": "General Physics II",
  "PHY 143": "General Physics Practical II",
  "STA 141": "Probability I",
  "SWE 142": "Introduction to Software Fundamentals",
  "CYB 131": "Fundamentals of Cyber Security"
};

function getOfficialCourseTitle(courseCode) {
  const normalized = courseCode.trim().replace(/\s+/g, ' ').toUpperCase();
  if (OFFICIAL_COURSE_TITLES[normalized]) {
    return OFFICIAL_COURSE_TITLES[normalized];
  }
  const noSpace = normalized.replace(/\s+/g, '');
  for (const [k, v] of Object.entries(OFFICIAL_COURSE_TITLES)) {
    if (k.replace(/\s+/g, '') === noSpace) return v;
  }
  return courseCode;
}

// 3. Complete list of all academic materials found on the computer
const RAW_MATERIALS = [
  // ===== FIRST SEMESTER (100L) =====
  // CSC 131
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\CSC131 LECTURE NOTES DR ALFA.pdf",
    title: "CSC 131: Introduction to Computer Science - Dr. Alfa Lecture Notes",
    title: "CSC 131: Introduction to Computing Sciences - Dr. Alfa Lecture Notes",
    courseCode: "CSC 131",
    courseTitle: "Introduction to Computer Science & Problem Solving",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Official comprehensive lecture notes by Dr. Alfa covering computer hardware, software paradigms, number systems, and algorithmic thinking."
  },
  // CSC 132
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\Lecture Note CSC 132.pdf",
    title: "CSC 132: Introduction to Computing Systems - Lecture Notes",
    title: "CSC 132: Introduction to Front-End Web Development - Lecture Notes",
    courseCode: "CSC 132",
    courseTitle: "Introduction to Computing Systems",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Core lecture notes covering computer organisation, system architecture, CPU registers, memory hierarchy, and peripheral systems."
    description: "Core lecture notes covering computing architecture, web standards, HTML/CSS structure, and client-side web concepts."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\components of a computing system (1).pdf",
    title: "CSC 132: Components of a Computing System Guide",
    courseCode: "CSC 132",
    courseTitle: "Introduction to Computing Systems",
    level: 100,
    semester: 1,
    materialType: "handout",
    description: "Illustrated guide on motherboard components, ALU, Control Unit, buses, input/output interfaces, and storage drives."
    materialType: "lecture_note",
    description: "Illustrated guide on motherboard architecture, ALU, Control Unit, system buses, and I/O devices."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\generations_of_computers.pdf",
    title: "CSC 132: Generations of Computers Overview (1st - 5th Gen)",
    courseCode: "CSC 132",
    courseTitle: "Introduction to Computing Systems",
    level: 100,
    semester: 1,
    materialType: "handout",
    description: "Historical timeline of computing technology from vacuum tubes and transistors to integrated circuits, microprocessors, and AI."
    materialType: "lecture_note",
    description: "Historical timeline of computing technology from vacuum tubes and transistors to VLSI microprocessors and AI."
  },
  // MAT 132
  // MAT 132 / MTH 132
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\MAT 132 - VECTOR (CUSTECH)-1.pdf",
    title: "MAT 132: Vector Algebra & Geometry (CUSTECH Course Pack)",
    courseCode: "MAT 132",
    courseTitle: "Vectors & Coordinate Geometry",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Official CUSTECH lecture material covering scalar/vector quantities, dot product, cross product, lines, and planes in 3D space."
    description: "Official CUSTECH course material covering scalar/vector quantities, dot product, cross product, lines, and planes in 3D space."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\Straight line and its equation MATH132.pdf",
    title: "MAT 132: Straight Lines and Coordinate Equations",
    courseCode: "MAT 132",
    courseTitle: "Vectors & Coordinate Geometry",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Cartesian coordinates, slope/gradient calculations, parallel & perpendicular lines, angle between two lines, and conic sections."
    description: "Cartesian coordinates, gradient formulas, parallel/perpendicular lines, and coordinate geometry problems."
  },
  // MTH 131
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\MTH131 PT2.pdf",
    title: "MTH 131: General Mathematics I (Algebra & Trigonometry) Part 2",
    title: "MTH 131: Elementary Mathematics I (Algebra & Trigonometry) Part 2",
    courseCode: "MTH 131",
    courseTitle: "General Mathematics I (Algebra & Trigonometry)",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Mathematical induction, matrices, determinants, complex numbers, polynomial equations, and partial fractions."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\A.P and G.P.pdf",
    title: "MTH 131: Arithmetic and Geometric Progressions (AP & GP) Master Note",
    courseCode: "MTH 131",
    courseTitle: "General Mathematics I (Algebra & Trigonometry)",
    level: 100,
    semester: 1,
    materialType: "handout",
    materialType: "lecture_note",
    description: "Comprehensive notes and step-by-step solved examples on nth terms, sum of sequences, and infinite geometric series."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\Engineering Mathematics, Fifth Edition.pdf",
    title: "MAT 131: Engineering Mathematics (5th Edition Reference Textbook)",
    title: "MTH 131: Engineering Mathematics (5th Edition Reference Textbook)",
    courseCode: "MTH 131",
    courseTitle: "General Mathematics I (Algebra & Trigonometry)",
    level: 100,
    semester: 1,
    materialType: "handout",
    description: "Complete standard textbook by John Bird covering fundamental mathematical principles with applied engineering examples."
    materialType: "textbook",
    description: "Complete reference textbook by John Bird covering fundamental mathematical principles with applied engineering examples."
  },
  // PHY 131
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\PHY 131.pdf",
    title: "PHY 131: General Physics I (Mechanics & Thermal Physics)",
    title: "PHY 131: General Physics I (Mechanics, Properties of Matter & Thermal Physics)",
    courseCode: "PHY 131",
    courseTitle: "General Physics I (Mechanics, Properties of Matter & Thermal Physics)",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Core faculty physics note covering kinematics, Newton's laws of motion, work, energy, rotational dynamics, fluids, and thermodynamics."
    description: "Core faculty physics notes covering kinematics, Newton's laws of motion, work, energy, rotational dynamics, fluids, and thermodynamics."
  },
  // STA 131
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\STA 131 MD.pdf",
    title: "STA 131: Introduction to Statistics & Probability I",
    title: "STA 131: Descriptive Statistics - Faculty Lecture Notes",
    courseCode: "STA 131",
    courseTitle: "Introduction to Statistics & Probability I",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Statistical data collection, tabular and diagrammatic presentation, measures of central tendency (mean, median, mode) and dispersion."
    description: "Statistical data collection, tabular/diagrammatic representation, measures of central tendency, and measures of dispersion."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\STA131 PAST QUESTIONS.pdf",
    title: "STA 131: Official Past Examination Questions",
    courseCode: "STA 131",
    courseTitle: "Introduction to Statistics & Probability I",
    level: 100,
    semester: 1,
    materialType: "past_question",
    description: "Compilation of official past semester exam questions for STA 131 at CUSTECH Osara."
    description: "Official past semester examination question compilation for STA 131 at CUSTECH Osara."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\STA131FULL LECTURER NOTE.pdf.pdf",
    title: "STA 131: Complete Faculty Lecture Notes",
    title: "STA 131: Descriptive Statistics Full Faculty Compilation",
    courseCode: "STA 131",
    courseTitle: "Introduction to Statistics & Probability I",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Full semester lecture compilation from the Department of Mathematical Sciences for STA 131."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\Descriptive_Statistics_Solutions.pdf",
    title: "STA 131: Descriptive Statistics Solved Exercises & Tutorial Solutions",
    title: "STA 131: Descriptive Statistics Solved Exercises & Tutorial Guide",
    courseCode: "STA 131",
    courseTitle: "Introduction to Statistics & Probability I",
    level: 100,
    semester: 1,
    materialType: "past_question",
    description: "Detailed step-by-step tutorial solutions for variance, standard deviation, coefficient of variation, skewness, and kurtosis."
    description: "Detailed tutorial solutions for variance, standard deviation, coefficient of variation, skewness, and kurtosis."
  },
  // GST 111
  // GST 111 / GST 131
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\Speaking_and_Reading_Skills_Full_Note.pdf",
    title: "GST 111: Communication in English - Speaking and Reading Skills Full Note",
    courseCode: "GST 111",
    courseTitle: "Communication in English I",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Complete lecture note covering phonetic transcription, speech sound production, syllable stress, intonation, and reading comprehension."
    description: "Phonetic transcription, speech organs, syllable stress, intonation patterns, and reading comprehension techniques."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\GST 111- 200 Questions and Answers Bank.pdf",
    title: "GST 111: 200 Questions & Answers Practice Exam Bank",
    title: "GST 111: Communication in English - 200 Questions & Answers Practice Exam Bank",
    courseCode: "GST 111",
    courseTitle: "Communication in English I",
    level: 100,
    semester: 1,
    materialType: "past_question",
    description: "Curated 200-question practice test bank with verified answers for GST 111 CBT examination preparation."
  },
  // FCI General
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\FACULTY OF COMPUTING AND INFORMATICS COURSE STRUCTURE.pdf",
    title: "FCI 100: Official Faculty Course Structure & Academic Curriculum",
    title: "FCI 100: Official Faculty Course Structure & Academic Curriculum Handbook",
    courseCode: "FCI 100",
    courseTitle: "Faculty Academic Regulations & Course Curriculum",
    level: 100,
    semester: 1,
    materialType: "syllabus",
    materialType: "other",
    description: "Official handbook and course distribution across 100L – 400L for all 5 departments in the Faculty of Computing and Informatics."
  },

  // ===== SECOND SEMESTER (100L) =====
  // CSC 141
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\CSC 141 PRogramin.pdf",
    title: "CSC 141: Introduction to Computer Programming (Python & Algorithms)",
    title: "CSC 141: Problem Solving (Python Programming & Algorithms)",
    courseCode: "CSC 141",
    courseTitle: "Introduction to Computer Programming",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Foundational programming concepts covering data types, control flow, functions, loops, lists, and basic algorithm design in Python."
    description: "Foundational programming concepts covering data types, control flow, functions, loops, lists, and algorithm design in Python."
  },
  // CSC 142
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\CSC 142 LECTURE 1-3.pdf",
    title: "CSC 142: Introduction to Data Science - Lectures 1 to 3",
    title: "CSC 142: Fundamentals of Data Science - Lectures 1 to 3",
    courseCode: "CSC 142",
    courseTitle: "Introduction to Data Science & Analytics",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Overview of Data Science, data types, data acquisition, and numerical computing using Python NumPy arrays."
    description: "Overview of Data Science, data types, data collection, and numerical computing using Python NumPy arrays."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\CSC 142 LECTURE 4-7.pdf",
    title: "CSC 142: Introduction to Data Science - Lectures 4 to 7",
    title: "CSC 142: Fundamentals of Data Science - Lectures 4 to 7",
    courseCode: "CSC 142",
    courseTitle: "Introduction to Data Science & Analytics",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Data wrangling with Pandas DataFrames, indexing, filtering, handling null values, and summary statistics."
    description: "Data wrangling with Pandas DataFrames, series, indexing, filtering, handling null values, and summary statistics."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\CSC142 LECTURE  8-10 .pdf",
    title: "CSC 142: Introduction to Data Science - Lectures 8 to 10",
    title: "CSC 142: Fundamentals of Data Science - Lectures 8 to 10",
    courseCode: "CSC 142",
    courseTitle: "Introduction to Data Science & Analytics",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Exploratory data analysis (EDA), data visualization using Matplotlib & Seaborn, and introductory machine learning workflows."
    description: "Exploratory data analysis (EDA), data visualization using Matplotlib & Seaborn, and introductory machine learning concepts."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\CSC142 PAST QUESTIONS .pdf",
    title: "CSC 142: Past Examination Questions",
    title: "CSC 142: Fundamentals of Data Science - Past Examination Questions",
    courseCode: "CSC 142",
    courseTitle: "Introduction to Data Science & Analytics",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Official past examination papers for CSC 142 Introduction to Data Science at CUSTECH Osara."
    description: "Official past examination question papers for CSC 142 Fundamentals of Data Science at CUSTECH Osara."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\CSC142_Past_Questions_Answers.pdf",
    title: "CSC 142: Past Examination Questions with Model Answers & Code",
    title: "CSC 142: Fundamentals of Data Science - Worked Past Questions with Code Solutions",
    courseCode: "CSC 142",
    courseTitle: "Introduction to Data Science & Analytics",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Worked answers, code implementations, and full solutions for CSC 142 past exam papers."
    description: "Worked answers, Python code snippets, and explanations for CSC 142 past exam papers."
  },
  // SWE 142
  {
    localPath: "C:\\Users\\PC\\Downloads\\SWE142 Past Questions.pdf",
    title: "SWE 142: Fundamentals of Software Engineering Past Questions",
    title: "SWE 142: Introduction to Software Fundamentals - Past Examination Questions",
    courseCode: "SWE 142",
    courseTitle: "Fundamentals of Software Engineering",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Past examination questions covering SDLC models, requirements gathering, architectural design, testing, and maintenance."
    description: "Official past examination questions covering SDLC models, requirements engineering, design, testing, and maintenance."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\SWE142_Answers_Explained.pdf",
    title: "SWE 142: Past Questions Detailed Solutions & Explanations",
    title: "SWE 142: Introduction to Software Fundamentals - Detailed Solutions & Explanations",
    courseCode: "SWE 142",
    courseTitle: "Fundamentals of Software Engineering",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Comprehensive explanatory solutions to past SWE 142 questions with clear engineering diagrams and definitions."
    description: "Comprehensive explanatory solutions to past SWE 142 exam questions with engineering diagrams and definitions."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\modules1_3_software_fundamentals.pdf",
    title: "SWE 142: Software Fundamentals Course Modules 1 - 3",
    title: "SWE 142: Introduction to Software Fundamentals - Course Modules 1 to 3",
    courseCode: "SWE 142",
    courseTitle: "Fundamentals of Software Engineering",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Core modules covering software processes, agile methodologies, user stories, and requirements specification."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\software_fundamentals_100_questions.pdf",
    title: "SWE 142: 100 Essential Software Fundamentals Questions & Revision Pack",
    title: "SWE 142: Introduction to Software Fundamentals - 100 Essential Revision Questions",
    courseCode: "SWE 142",
    courseTitle: "Fundamentals of Software Engineering",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "High-yield 100 review questions covering software engineering principles, testing strategies, and design patterns."
    description: "High-yield 100 review questions covering software engineering principles, testing strategies, and design paradigms."
  },
  // GST 141 & 142
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\GST142.pdf",
    title: "GST 142: Nigerian Peoples and Culture (Comprehensive Note)",
    title: "GST 142: Leadership Skills - Comprehensive Study Note",
    courseCode: "GST 142",
    courseTitle: "Nigerian Peoples and Culture",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Detailed textbook and lecture notes on ethnic cultures of Nigeria, constitutional history, social justice, and national unity."
    description: "Comprehensive lecture note covering leadership principles, governance, team dynamics, ethics, and civic responsibility."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\GST 141 LECTURE Material 1.pdf",
    title: "GST 141: Communication in English II (Lecture Material 1)",
    title: "GST 141: Nigerian Peoples and Culture - Lecture Material 1",
    courseCode: "GST 141",
    courseTitle: "Communication in English II",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Advanced sentence structures, paragraph development, essay writing, and technical report writing."
    description: "Detailed study material on the ethnic groups of Nigeria, cultural heritage, constitutional development, and national unity."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\GST141 PAST QUESTIONS .pdf",
    title: "GST 141: Official Past Examination Questions",
    title: "GST 141: Nigerian Peoples and Culture - Official Past Examination Questions",
    courseCode: "GST 141",
    courseTitle: "Communication in English II",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Official past semester exam papers for GST 141 at CUSTECH."
    description: "Official past semester exam papers for GST 141 at CUSTECH Osara."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\GST141_Past_Questions_Answers.pdf",
    title: "GST 141: Past Questions Solved Answer Key",
    title: "GST 141: Nigerian Peoples and Culture - Past Questions Solved Answer Key",
    courseCode: "GST 141",
    courseTitle: "Communication in English II",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Verified CBT answer key and explanations for GST 141 past questions."
  },
  // MTH 141
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\omo\\MTH 141 FUNCTION OF REAL VARIABLE (CALCULUS)_090035.pdf",
    title: "MTH 141: Functions of Real Variables & Differential Calculus",
    title: "MTH 141: Elementary Mathematics II (Functions of Real Variables & Calculus)",
    courseCode: "MTH 141",
    courseTitle: "General Mathematics II (Calculus)",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Limits, continuity, techniques of differentiation, Rolle's theorem, Mean Value Theorem, Taylor series, and curve sketching."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\MTH141 PAST QUESTIONS.pdf",
    title: "MTH 141: Mathematics II (Calculus) Past Examination Questions",
    title: "MTH 141: Elementary Mathematics II - Past Examination Questions",
    courseCode: "MTH 141",
    courseTitle: "General Mathematics II (Calculus)",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Second Semester past exam questions covering differential and integral calculus for computing students."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\MTH141_Answers_StepByStep.pdf",
    title: "MTH 141: Step-by-Step Calculus Solutions & Proofs",
    title: "MTH 141: Elementary Mathematics II - Step-by-Step Calculus Solutions",
    courseCode: "MTH 141",
    courseTitle: "General Mathematics II (Calculus)",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Complete step-by-step calculus solutions, limit calculations, derivatives, and definite/indefinite integrals."
    description: "Step-by-step calculus solutions, limit calculations, derivatives, and definite/indefinite integrals."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\MTH141 TEST.pdf",
    title: "MTH 141: Continuous Assessment (CA) Test Papers",
    title: "MTH 141: Elementary Mathematics II - Continuous Assessment (CA) Test Papers",
    courseCode: "MTH 141",
    courseTitle: "General Mathematics II (Calculus)",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Mid-semester continuous assessment test papers with calculus problem sets."
  },
  // PHY 141
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\PHY141 ELECTRIC-FIELD-AND-POTENTIAL.pdf",
    title: "PHY 141: Electric Field, Coulomb's Law & Electrostatic Potential",
    title: "PHY 141: General Physics II - Electric Field, Coulomb's Law & Electrostatic Potential",
    courseCode: "PHY 141",
    courseTitle: "General Physics II (Electricity, Magnetism & Modern Physics)",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Electric charge distributions, Coulomb's law, electric field intensity, Gauss's law, and electric potential differences."
    description: "Electric charge distributions, Coulomb's law, electric field intensity, Gauss's law, and electrostatic potential."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\PHY141 LN 18_05_2026.pdf",
    title: "PHY 141: Electromagnetism, Current Electricity & Magnetic Fields",
    title: "PHY 141: General Physics II - Electromagnetism, Current Electricity & Magnetic Fields",
    courseCode: "PHY 141",
    courseTitle: "General Physics II (Electricity, Magnetism & Modern Physics)",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "DC circuits, Kirchhoff's rules, magnetic forces on moving charges, Biot-Savart law, Faraday's law of electromagnetic induction."
    description: "DC circuits, Kirchhoff's rules, magnetic forces on moving charges, Biot-Savart law, and Faraday's law of induction."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\PHY141 PAST QUESTIONS .pdf",
    title: "PHY 141: General Physics II Past Examination Questions",
    title: "PHY 141: General Physics II - Past Examination Questions",
    courseCode: "PHY 141",
    courseTitle: "General Physics II (Electricity, Magnetism & Modern Physics)",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Official past examination questions for PHY 141 at CUSTECH Osara."
    description: "Official past examination questions for PHY 141 General Physics II at CUSTECH Osara."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\PHY141_Physics_Solutions.pdf",
    title: "PHY 141: Solved Numerical Problems & Physics Calculations",
    title: "PHY 141: General Physics II - Solved Numerical Problems & Calculations",
    courseCode: "PHY 141",
    courseTitle: "General Physics II (Electricity, Magnetism & Modern Physics)",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Detailed numerical workings for electric flux, RC circuits, magnetic torque, and resonance in AC circuits."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\PHY141 TEST.pdf",
    title: "PHY 141: Continuous Assessment (CA) Test Papers",
    title: "PHY 141: General Physics II - Continuous Assessment (CA) Test Papers",
    courseCode: "PHY 141",
    courseTitle: "General Physics II (Electricity, Magnetism & Modern Physics)",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Faculty CA test evaluation questions for second semester physics."
  },
  // STA 141
  {
    localPath: "C:\\Users\\PC\\Downloads\\STA141 PAST QUESTIONS .pdf",
    title: "STA 141: Probability & Statistics II Past Examination Questions",
    title: "STA 141: Probability I - Past Examination Questions",
    courseCode: "STA 141",
    courseTitle: "Probability & Statistics II",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Official past exam questions for second semester probability distributions and sampling theory."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\STA141_Past_Questions_Solutions.pdf",
    title: "STA 141: Solved Past Examination Papers",
    title: "STA 141: Probability I - Solved Past Examination Papers",
    courseCode: "STA 141",
    courseTitle: "Probability & Statistics II",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Worked answers for probability density functions, expectation, variance, and cumulative distributions."
  },
  {
    localPath: "C:\\Users\\PC\\Downloads\\STA141_Probability_CA_Solutions.pdf",
    title: "STA 141: Probability Distributions & CA Solutions Guide",
    title: "STA 141: Probability I - Probability Distributions & CA Solutions Guide",
    courseCode: "STA 141",
    courseTitle: "Probability & Statistics II",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Comprehensive step-by-step solutions for Binomial, Poisson, Uniform, and Normal distribution test problems."
    description: "Comprehensive step-by-step solutions for Binomial, Poisson, Uniform, and Normal distribution problems."
  },
  {
    localPath: "C:\\Users\\PC\\Desktop\\MY DESTOP FILE\\STA141 TEST.pdf",
    title: "STA 141: Continuous Assessment (CA) Test Papers",
    title: "STA 141: Probability I - Continuous Assessment (CA) Test Papers",
    courseCode: "STA 141",
    courseTitle: "Probability & Statistics II",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "CA quiz and test papers covering probability distributions and statistical inference."
    description: "Continuous assessment test papers covering probability distributions and statistical inference."
  }
];

async function runBulkUpload() {
  console.log("=== Starting CUSTECH FCI Automated Academic Materials Uploader ===");
  console.log(`Connecting to Supabase at ${supabaseUrl}...`);
// Helper: upload with strict per-attempt timeout and retries
async function uploadWithTimeout(storageKey, fileBuffer, mimeType, timeoutMs = 45000) {
  const uploadPromise = supabase.storage
    .from('materials')
    .upload(storageKey, fileBuffer, {
      contentType: mimeType,
      upsert: true
    });

  // Ensure storage bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.warn("Bucket check warning:", bucketError.message);
  } else {
    const bucketNames = buckets.map(b => b.name);
    console.log("Available storage buckets:", bucketNames.join(', '));
    if (!bucketNames.includes('materials')) {
      console.log("Creating 'materials' public storage bucket...");
      await supabase.storage.createBucket('materials', { public: true });
  const timerPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Upload timed out after ${timeoutMs / 1000}s`)), timeoutMs)
  );

  const res = await Promise.race([uploadPromise, timerPromise]);
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

async function uploadWithRetry(storageKey, fileBuffer, mimeType, maxRetries = 2, timeoutMs = 45000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadWithTimeout(storageKey, fileBuffer, mimeType, timeoutMs);
    } catch (err) {
      console.warn(`    ⚠️ Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

  // Get existing material titles to avoid duplicate insertions
  const { data: existingMaterials, error: matError } = await supabase
async function run() {
  console.log("==================================================================");
  console.log("CUSTECH FCI OFFICIAL ACADEMIC MATERIALS AUTOMATED UPLOADER");
  console.log("Curriculum Grounding: Verified via lib/departments-data.ts");
  console.log("==================================================================");

  // 1. Fetch current database records
  const { data: existingRows, error: fetchErr } = await supabase
    .from('materials')
    .select('id, title, course_code, file_name');
    .select('id, title, course_code, course_title, file_name');

  if (matError) {
    console.error("Error checking existing materials:", matError.message);
  } else {
    console.log(`Existing materials in database: ${existingMaterials ? existingMaterials.length : 0}`);
  if (fetchErr) {
    console.error("Failed to query existing materials:", fetchErr.message);
    process.exit(1);
  }

  const existingTitles = new Set((existingMaterials || []).map(m => m.title.trim().toLowerCase()));
  console.log(`Currently in database: ${existingRows.length} materials.`);

  let uploadSuccessCount = 0;
  let skipCount = 0;
  // Set of existing file base names or existing titles to prevent duplication
  const existingTitles = new Set(existingRows.map(r => r.title.trim().toLowerCase()));
  const existingFiles = new Set(existingRows.map(r => (r.file_name || '').toLowerCase()));

  // 2. Sort materials by file size ASCENDING (all small notes and past questions first, heavy files at the end)
  const sortedMaterials = [...RAW_MATERIALS]
    .filter(m => fs.existsSync(m.localPath))
    .map(m => ({
      ...m,
      fileSize: fs.statSync(m.localPath).size
    }))
    .sort((a, b) => a.fileSize - b.fileSize);

  console.log(`\nProcessing ${sortedMaterials.length} academic materials (sorted smallest to largest)...`);

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < RAW_MATERIALS.length; i++) {
    const item = RAW_MATERIALS[i];
    const progress = `[${i + 1}/${RAW_MATERIALS.length}]`;
  for (let i = 0; i < sortedMaterials.length; i++) {
    const item = sortedMaterials[i];
    const progress = `[${i + 1}/${sortedMaterials.length}]`;
    const baseName = path.basename(item.localPath);
    const cleanFileName = baseName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const sizeMb = (item.fileSize / (1024 * 1024)).toFixed(2);

    if (!fs.existsSync(item.localPath)) {
      console.warn(`${progress} File not found on disk: ${item.localPath}`);
      errorCount++;
      continue;
    }
    const officialCourseTitle = getOfficialCourseTitle(item.courseCode);

    if (existingTitles.has(item.title.trim().toLowerCase())) {
      console.log(`${progress} Already uploaded: ${item.title}`);
      skipCount++;
    // Check if already in database
    const alreadyUploaded = existingTitles.has(item.title.trim().toLowerCase()) ||
      existingFiles.has(cleanFileName.toLowerCase()) ||
      existingRows.some(r => r.course_code.replace(/\s+/g,'').toUpperCase() === item.courseCode.replace(/\s+/g,'').toUpperCase() && r.title.trim().toLowerCase() === item.title.trim().toLowerCase());

    if (alreadyUploaded) {
      console.log(`${progress} Already uploaded: [${item.courseCode}] ${item.title} (${sizeMb} MB)`);
      skippedCount++;
      continue;
    }

    console.log(`${progress} Uploading [${item.courseCode}] (${sizeMb} MB): "${item.title}"...`);

    try {
      const stats = fs.statSync(item.localPath);
      const fileBuffer = fs.readFileSync(item.localPath);
      const ext = path.extname(item.localPath).replace('.', '').toLowerCase() || 'pdf';
      const baseName = path.basename(item.localPath);

      // Clean storage path
      const courseFolder = item.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
      const cleanFileName = baseName.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const storageKey = `academic_materials/${courseFolder}/${Date.now()}_${cleanFileName}`;

      const mimeType = ext === 'pdf' ? 'application/pdf'
        : (ext === 'pptx' || ext === 'ppt') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        : (ext === 'docx' || ext === 'doc') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/octet-stream';

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('materials')
        .upload(storageKey, fileBuffer, {
          contentType: mimeType,
          upsert: true
        });
      // Dynamic timeout: 35s for small files, up to 120s for files > 20MB
      const timeout = item.fileSize > 20 * 1024 * 1024 ? 120000 : 35000;

      if (uploadErr) {
        console.error(`${progress} Upload failed for ${baseName}:`, uploadErr.message);
        errorCount++;
        continue;
      }
      await uploadWithRetry(storageKey, fileBuffer, mimeType, 2, timeout);

      // 2. Get Public URL
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(storageKey);

      // 3. Ensure material_type satisfies database check constraint
      // Allowed: 'lecture_note', 'past_question', 'textbook', 'assignment', 'other'
      // Material type check constraint
      let safeType = item.materialType;
      const validTypes = ['lecture_note', 'past_question', 'textbook', 'assignment', 'other'];
      if (!validTypes.includes(safeType)) {
        if (safeType === 'handout') safeType = 'lecture_note';
        else if (safeType === 'syllabus') safeType = 'other';
        else safeType = 'lecture_note';
        safeType = safeType === 'handout' ? 'lecture_note' : (safeType === 'syllabus' ? 'other' : 'lecture_note');
      }

      // 4. Insert record into materials table
      // Insert record
      const payload = {
        title: item.title,
        description: item.description,
        course_code: item.courseCode,
        course_title: item.courseTitle,
        course_title: officialCourseTitle,
        level: item.level,
        semester: item.semester,
        material_type: safeType,
        session: "2025/2026",
        file_url: publicUrl,
        file_name: cleanFileName,
        file_size: stats.size,
        file_size: item.fileSize,
        download_count: 0,
        is_published: true,
        is_published: true
      };

      const { data: inserted, error: insertErr } = await supabase
      const { error: insErr } = await supabase
        .from('materials')
        .insert(payload)
        .select();
        .insert(payload);

      if (insertErr) {
        console.error(`${progress} DB insert failed for ${item.title}:`, insertErr.message);
      if (insErr) {
        console.error(`  ❌ DB insert failed for ${item.title}:`, insErr.message);
        errorCount++;
      } else {
        console.log(`✅ ${progress} Uploaded: ${item.courseCode} - ${item.title} (${(stats.size / 1024).toFixed(0)} KB)`);
        console.log(`  ✅ Published: [${item.courseCode} - ${officialCourseTitle}] "${item.title}"`);
        existingTitles.add(item.title.trim().toLowerCase());
        uploadSuccessCount++;
        existingFiles.add(cleanFileName.toLowerCase());
        uploadedCount++;
      }
    } catch (err) {
      console.error(`${progress} Exception processing ${item.localPath}:`, err.message);
      console.error(`  ❌ Error processing ${baseName}:`, err.message);
      errorCount++;
    }
  }

  console.log("\n===============================================");
  console.log(`Bulk Upload Completed:`);
  console.log(`  Successfully Added & Published: ${uploadSuccessCount}`);
  console.log(`  Skipped (Already in database):  ${skipCount}`);
  console.log(`  Errors / Missing:                ${errorCount}`);
  console.log("===============================================\n");
  console.log("\n==================================================================");
  console.log("FINAL UPLOAD SUMMARY:");
  console.log(`  Successfully Uploaded & Published: ${uploadedCount}`);
  console.log(`  Skipped (Already Present):         ${skippedCount}`);
  console.log(`  Failed / Errors:                    ${errorCount}`);
  console.log("==================================================================\n");

  process.exit(0);
}

runBulkUpload();
run();
