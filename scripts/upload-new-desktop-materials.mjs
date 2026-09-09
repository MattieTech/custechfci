import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Read .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

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
  "STA 131": "Descriptive Statistics",
  "CSC 141": "Problem Solving",
  "CSC 142": "Fundamentals of Data Science",
  "SWE 142": "Introduction to Software Fundamentals",
  "GST 141": "Nigerian Peoples and Culture",
  "GST 142": "Leadership Skills",
  "MTH 141": "Elementary Mathematics II",
  "PHY 141": "General Physics II",
  "STA 141": "Probability I",
  "CSC 231": "Computer Programming I",
  "CSC 233": "Discrete Structures",
  "CSC 235": "Computing Mini-Project",
  "ENT 231": "Entrepreneurship and Innovation",
  "GST 231": "Entrepreneurship and Innovation",
  "IFT 231": "Digital Logic Design",
  "IFT 232": "Computer Architecture and Organization",
  "SWE 231": "Introduction to Software Engineering",
  "SWE 211": "Introduction to Software Engineering",
  "CYB 231": "Introduction to Cyber Security and Strategy",
  "CYB 232": "Introduction to Digital Forensics",
  "CYB 233": "Cybersecurity in Business and Industry",
  "MTH 231": "Mathematical Methods I",
  "CSC 241": "Computer Programming II",
  "CSC 242": "System Analysis and Design",
  "GST 211": "History and Philosophy of Science",
  "GST 241": "Philosophy, Logic, Environment and Sustainable Development",
  "IFT 241": "Human-Computer Interface",
  "IFT 242": "Introduction to Web Technologies II",
  "IFT 244": "Information Security Fundamentals",
  "CYB 241": "Introduction to Networking",
  "CYB 242": "System and Network Administration",
  "CYB 243": "Cyber Crime, Law and Counter measure",
  "CYB 245": "Information Security Policy",
  "CYB 246": "Enterprise and Perimeter Security",
  "MTH 241": "Mathematical Method II (Elementary Differential Equation I)",
  "SWE 241": "Introduction to Generative AI",
  "FCI 200": "Faculty 200L Examination & Academic Compendium"
};

function getOfficialCourseTitle(code) {
  const norm = code.trim().toUpperCase().replace(/\s+/g, ' ');
  if (OFFICIAL_COURSE_TITLES[norm]) return OFFICIAL_COURSE_TITLES[norm];
  const noSpace = norm.replace(/\s+/g, '');
  for (const [k, v] of Object.entries(OFFICIAL_COURSE_TITLES)) {
    if (k.replace(/\s+/g, '') === noSpace) return v;
  }
  return code;
}

const baseDir = "C:\\Users\\PC\\Desktop\\MATERIALS FOR CUSTECH FCI";

// Curated 100L and 200L academic materials from the new desktop folder
const NEW_MATERIALS = [
  // ===== 200 LEVEL - 1ST SEMESTER =====
  // CSC 231: Computer Programming I
  {
    localFile: "Principle of prorgramming CSC231.docx",
    title: "CSC 231: Computer Programming I - Comprehensive Principles & Lecture Notes",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Foundational programming paradigms, syntax, variables, data structures, and procedural problem-solving in Python."
  },
  {
    localFile: "computer_programming_tutorial.pdf.pdf",
    title: "CSC 231: Computer Programming I - Practical Programming Tutorial Guide",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Hands-on programming tutorial covering basic constructs, memory management, and structured algorithm design."
  },
  {
    localFile: "functional_programming_tutorial.pdf.pdf",
    title: "CSC 231: Computer Programming I - Functional Programming Tutorial",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Core functional programming principles, pure functions, recursion, lambda expressions, and higher-order functions."
  },
  {
    localFile: "python_prog_slides.pdf",
    title: "CSC 231: Computer Programming I - Python Programming Course Slides",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Faculty lecture slides covering Python syntax, data types, operators, and control structures."
  },
  {
    localFile: "FUNCTIONS & VARIABLES UNIT 1 .pdf",
    title: "CSC 231: Computer Programming I - Unit 1: Functions & Variables",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Variable scope, function definitions, parameters, return values, and modular code architecture."
  },
  {
    localFile: "CONDITIONALS UNIT 2.pdf",
    title: "CSC 231: Computer Programming I - Unit 2: Conditionals & Boolean Logic",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Conditional statements (if/elif/else), relational operators, truth tables, and branching logic."
  },
  {
    localFile: "LOOPS UNIT 3.pdf",
    title: "CSC 231: Computer Programming I - Unit 3: Loops & Iterations",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "While loops, for loops, nested loops, break, continue, and iterable traversal."
  },
  {
    localFile: "EXCEPTIONS UNIT 4.pdf",
    title: "CSC 231: Computer Programming I - Unit 4: Exception Handling",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Try, except, finally blocks, error types, defensive programming, and runtime exception handling."
  },
  {
    localFile: "Intro to Jupyter Notebook.pdf",
    title: "CSC 231: Computer Programming I - Introduction to Jupyter Notebooks Guide",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "other",
    description: "Interactive computing environment setup, cell execution, kernel management, and notebook workflows for programming."
  },

  // CSC 233: Discrete Structures
  {
    localFile: "CSC235 (DISCRETE STRUCTURES 1).pdf",
    title: "CSC 233: Discrete Structures - Part 1 Master Lecture Notes",
    courseCode: "CSC 233",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Set theory, relations, functions, propositional logic, predicates, and mathematical reasoning for computer science."
  },
  {
    localFile: "DISCRETE STRUCT.pdf",
    title: "CSC 233: Discrete Structures - Departmental Lecture Compilation",
    courseCode: "CSC 233",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Combinatorics, graph theory basics, trees, Boolean algebra, and recurrence relations."
  },
  {
    localFile: "CSC235 Test question solved✍️.pdf",
    title: "CSC 233: Discrete Structures - Solved Continuous Assessment Test Questions",
    courseCode: "CSC 233",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Step-by-step solved test questions, mathematical proofs, and truth table calculations."
  },

  // IFT 231: Digital Logic Design
  {
    localFile: "IFT 231 DIGITAL LOGIC MODULE 1.docx",
    title: "IFT 231: Digital Logic Design - Module 1: Binary Systems & Number Representations",
    courseCode: "IFT 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Binary, octal, hexadecimal number systems, radix conversions, 1's and 2's complements, and binary arithmetic."
  },
  {
    localFile: "IFT 231 DIGITAL LOGIC DESIGN MODULE 2.docx",
    title: "IFT 231: Digital Logic Design - Module 2: Logic Gates & Combinational Circuits",
    courseCode: "IFT 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Standard logic gates (AND, OR, NOT, NAND, NOR, XOR), Boolean postulates, and Karnaugh maps (K-maps)."
  },
  {
    localFile: "LOGIC GATE -BOOLEAN ALGEBRA.docx",
    title: "IFT 231: Digital Logic Design - Logic Gates & Boolean Algebra Reference Guide",
    courseCode: "IFT 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Circuit minimization, De Morgan's laws, sum-of-products (SOP), and product-of-sums (POS) forms."
  },

  // IFT 232: Computer Architecture and Organization
  {
    localFile: "IFT232 MODULE ONE.pptx",
    title: "IFT 232: Computer Architecture and Organization - Module 1 Slides",
    courseCode: "IFT 232",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Instruction set architecture (ISA), CPU datapath, registers, bus organization, and von Neumann architecture."
  },
  {
    localFile: "MODULE TWO IFT232 SLIDE.pptx",
    title: "IFT 232: Computer Architecture and Organization - Module 2 Slides",
    courseCode: "IFT 232",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Control Unit design, hardwired vs. microprogrammed control, and instruction execution cycles."
  },
  {
    localFile: "IFT232 MODULE FOUR.pptx",
    title: "IFT 232: Computer Architecture and Organization - Module 4 Slides",
    courseCode: "IFT 232",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Input/Output organization, programmed I/O, interrupt-driven I/O, and Direct Memory Access (DMA)."
  },
  {
    localFile: "IFT232.PDF.pdf",
    title: "IFT 232: Computer Architecture and Organization - Comprehensive Course Pack",
    courseCode: "IFT 232",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Memory hierarchy, cache design, virtual memory, pipelining, superscalar processors, and multi-core systems."
  },

  // CYB 233: Cybersecurity in Business and Industry
  {
    localFile: "CYBERSECURITY IN BUSINESS AND INDUSTRY PART 1.pptx",
    title: "CYB 233: Cybersecurity in Business and Industry - Part 1 Slides",
    courseCode: "CYB 233",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Enterprise cyber risk management, business continuity planning, compliance frameworks, and threat landscapes."
  },
  {
    localFile: "CYB233 Lecture 2.pptx",
    title: "CYB 233: Cybersecurity in Business and Industry - Lecture 2 Slides",
    courseCode: "CYB 233",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Corporate cybersecurity policies, employee security awareness, risk assessment matrices, and incident handling."
  },

  // MTH 231: Mathematical Methods I
  {
    localFile: "MTH 231.pdf",
    title: "MTH 231: Mathematical Methods I - Faculty Lecture Notes",
    courseCode: "MTH 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Differential equations of first and second order, series solutions, partial differentiation, and multiple integrals."
  },
  {
    localFile: "MTH231 SOLVED✍️.pdf",
    title: "MTH 231: Mathematical Methods I - Solved Tutorial Problems & Exercises",
    courseCode: "MTH 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Complete handwritten and verified step-by-step solutions to MTH 231 tutorial problems and differential equations."
  },

  // SWE 231: Introduction to Software Engineering
  {
    localFile: "SWE 211 Note 2025.pdf",
    title: "SWE 231: Introduction to Software Engineering - 2025/2026 Faculty Course Note",
    courseCode: "SWE 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Software process models (Waterfall, Agile, Scrum), requirements engineering, software architecture, and quality assurance."
  },

  // ENT 231 / GST 231: Entrepreneurship and Innovation
  {
    localFile: "ENT231 INTRODUCTION TO ENTREPRENEURSHIP PART A.pdf",
    title: "ENT 231: Entrepreneurship and Innovation - Part A Course Material",
    courseCode: "ENT 231",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Concept of entrepreneurship, innovation mindset, opportunity identification, business models, and feasibility analysis."
  },
  {
    localFile: "ENT 231 Study Question of the First Lecturer.pdf",
    title: "ENT 231: Entrepreneurship and Innovation - Study Questions & Exam Revision",
    courseCode: "ENT 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Revision questions and test preparation prompts for CUSTECH entrepreneurship students."
  },
  {
    localFile: "GST 211 (History and philosophy of science)-2.doc",
    title: "GST 211: History and Philosophy of Science - Complete Lecture Notes",
    courseCode: "GST 211",
    level: 200,
    semester: 1,
    materialType: "lecture_note",
    description: "Historical evolution of science, scientific method, paradigm shifts, technological revolutions, and scientific ethics."
  },

  // ===== 200 LEVEL - 2ND SEMESTER =====
  // CSC 241: Computer Programming II
  {
    localFile: "PRINCIPLES OF PROGRAMING II.pdf",
    title: "CSC 241: Computer Programming II - Principles of Programming II Master Note",
    courseCode: "CSC 241",
    level: 200,
    semester: 2,
    materialType: "lecture_note",
    description: "Object-Oriented Programming (OOP) paradigms, classes, objects, encapsulation, inheritance, and polymorphism in Python & Java."
  },
  {
    localFile: "Introduction to python programming II.docx",
    title: "CSC 241: Computer Programming II - Python Advanced Programming Guide",
    courseCode: "CSC 241",
    level: 200,
    semester: 2,
    materialType: "lecture_note",
    description: "Advanced Python data structures, file I/O operations, list comprehensions, generators, and OOP implementations."
  },
  {
    localFile: "object-oriented-modeling-in-java.pdf",
    title: "CSC 241: Computer Programming II - Object-Oriented Modeling & Design in Java",
    courseCode: "CSC 241",
    level: 200,
    semester: 2,
    materialType: "textbook",
    description: "UML diagrams, class relationships, design patterns, and enterprise Java application development."
  },

  // CYB 242: System and Network Administration
  {
    localFile: "CYB 242 PT 2.pptx",
    title: "CYB 242: System and Network Administration - Part 2 Lecture Slides",
    courseCode: "CYB 242",
    level: 200,
    semester: 2,
    materialType: "lecture_note",
    description: "Network configuration, user permissions, Linux server administration, SSH, firewalls, and network monitoring tools."
  },

  // GST 241: Philosophy, Logic, Environment and Sustainable Development
  {
    localFile: "GST241 Philosophy,logic, and human existence .pdf",
    title: "GST 241: Philosophy, Logic and Human Existence - Course Compilation",
    courseCode: "GST 241",
    level: 200,
    semester: 2,
    materialType: "lecture_note",
    description: "Branches of philosophy, epistemic theories, formal/informal fallacies, syllogisms, logic, and existential philosophy."
  },
  {
    localFile: "PHILOSOPHY for CUSTECH-1.pdf",
    title: "GST 241: Philosophy, Logic, Environment and Sustainable Development - CUSTECH Guide",
    courseCode: "GST 241",
    level: 200,
    semester: 2,
    materialType: "lecture_note",
    description: "Official CUSTECH lecture handbook covering logic, critical thinking, environmental ethics, and sustainable development."
  },

  // 200L Faculty Comprehensive Past Questions
  {
    localFile: "Past Q. Mize200L.pdf",
    title: "FCI 200: Faculty of Computing & Informatics - 200L 1st Semester Past Questions Compendium",
    courseCode: "FCI 200",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Comprehensive compendium of official past examination papers for 200L First Semester courses across all FCI departments."
  },
  {
    localFile: "200L 2nd Semester PST.Mize.pdf",
    title: "FCI 200: Faculty of Computing & Informatics - 200L 2nd Semester Past Questions Compendium",
    courseCode: "FCI 200",
    level: 200,
    semester: 2,
    materialType: "past_question",
    description: "Comprehensive compendium of official past examination papers for 200L Second Semester courses across all FCI departments."
  },
  {
    localFile: "Past Questions. Mize.pdf",
    title: "FCI 200: Faculty of Computing & Informatics - 200L General Revision Past Examination Papers",
    courseCode: "FCI 200",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "High-yield examination revision pack containing past tests and semester exams for computing students."
  },

  // ===== 100 LEVEL ADDITIONS =====
  {
    localFile: "141 part note.pdf",
    title: "CSC 141: Problem Solving - Advanced Python Algorithms Part Note",
    courseCode: "CSC 141",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Algorithmic thinking, search/sort algorithms, time complexity, and Python problem-solving exercises."
  },
  {
    localFile: "CSC141 SLIDE.pptx",
    title: "CSC 141: Problem Solving - Official Course Lecture Slides",
    courseCode: "CSC 141",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Official lecture presentation slides covering programming logic, pseudocode, flowcharts, and Python syntax."
  },
  {
    localFile: "mr fine boy 142 1st week note.pdf",
    title: "CSC 142: Fundamentals of Data Science - Week 1 Lecture Notes",
    courseCode: "CSC 142",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Introductory lecture note on data science paradigms, lifecycle, and data ecosystem."
  },
  {
    localFile: "CSC142_Data_Science_Questions_And_Answers.pdf",
    title: "CSC 142: Fundamentals of Data Science - Revision Questions & Verified Answers",
    courseCode: "CSC 142",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Focused question and answer bank covering NumPy, Pandas, data exploration, and analytics."
  },
  {
    localFile: "CUSTECH_SoftwareFundamentals_100QA.pdf",
    title: "SWE 142: Introduction to Software Fundamentals - 100 Q&A Master Study Guide",
    courseCode: "SWE 142",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "100 high-yield questions with clear explanations covering SDLC, agile development, testing, and requirements."
  },
  {
    localFile: "PHY 141 (Magnetism).pdf",
    title: "PHY 141: General Physics II - Magnetism & Magnetic Fields Special Module",
    courseCode: "PHY 141",
    level: 100,
    semester: 2,
    materialType: "lecture_note",
    description: "Comprehensive lecture module on magnetic flux, Lorentz force, Biot-Savart law, Ampere's law, and electromagnetic induction."
  },
  {
    localFile: "WEB DEVELOPMENT.docx",
    title: "CSC 132: Introduction to Front-End Web Development - Lab Practice & Web Tutorial",
    courseCode: "CSC 132",
    level: 100,
    semester: 1,
    materialType: "lecture_note",
    description: "Hands-on web development lab guide covering HTML5 semantic elements, CSS3 flexbox/grid styling, and responsive layout design."
  },
  {
    localFile: "CHAPTER 4 LINUX INSTALL.pdf",
    title: "CSC 132: Introduction to Front-End Web Development - Chapter 4: Linux Systems & Tools Guide",
    courseCode: "CSC 132",
    level: 100,
    semester: 1,
    materialType: "other",
    description: "Linux OS installation, shell commands, web environment configuration, and developer toolchain setup."
  }
];

// Upload helper with retries and 60s timeout
async function uploadWithRetry(storageKey, fileBuffer, mimeType, maxRetries = 2, timeoutMs = 60000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const uploadPromise = supabase.storage
        .from('materials')
        .upload(storageKey, fileBuffer, {
          contentType: mimeType,
          upsert: true
        });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${timeoutMs/1000}s`)), timeoutMs)
      );
      const res = await Promise.race([uploadPromise, timeoutPromise]);
      if (res.error) throw new Error(res.error.message);
      return res.data;
    } catch (err) {
      console.warn(`    ⚠️ Attempt ${attempt}/${maxRetries} failed: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function run() {
  console.log("==================================================================");
  console.log("CUSTECH FCI: 100L & 200L ACADEMIC MATERIALS UPLOADER");
  console.log("Source Folder: 'MATERIALS FOR CUSTECH FCI'");
  console.log("Official Department Catalog: lib/departments-data.ts");
  console.log("==================================================================");

  // 1. Fetch current database materials
  const { data: existingRows, error: fetchErr } = await supabase
    .from('materials')
    .select('id, title, course_code, file_name');

  if (fetchErr) {
    console.error("DB Error:", fetchErr.message);
    process.exit(1);
  }

  console.log(`Currently in database: ${existingRows.length} materials.`);
  const dbTitles = new Set(existingRows.map(r => r.title.trim().toLowerCase()));
  const dbFiles = new Set(existingRows.map(r => (r.file_name || '').toLowerCase()));

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < NEW_MATERIALS.length; i++) {
    const item = NEW_MATERIALS[i];
    const progress = `[${i + 1}/${NEW_MATERIALS.length}]`;
    const fullPath = path.join(baseDir, item.localFile);

    if (!fs.existsSync(fullPath)) {
      console.warn(`${progress} File not found: ${fullPath}`);
      errorCount++;
      continue;
    }

    const cleanFileName = item.localFile.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const officialCourseTitle = getOfficialCourseTitle(item.courseCode);

    // Check duplicate
    if (dbTitles.has(item.title.trim().toLowerCase()) || dbFiles.has(cleanFileName.toLowerCase())) {
      console.log(`${progress} Already uploaded: [${item.courseCode}] ${item.title}`);
      skippedCount++;
      continue;
    }

    const stats = fs.statSync(fullPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`${progress} Uploading [${item.courseCode} - ${officialCourseTitle}] (${sizeMb} MB): "${item.title}"...`);

    try {
      const fileBuffer = fs.readFileSync(fullPath);
      const ext = path.extname(item.localFile).replace('.', '').toLowerCase() || 'pdf';
      const courseFolder = item.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
      const storageKey = `academic_materials/${courseFolder}/${Date.now()}_${cleanFileName}`;

      const mimeType = ext === 'pdf' ? 'application/pdf'
        : (ext === 'pptx' || ext === 'ppt') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        : (ext === 'docx' || ext === 'doc') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/octet-stream';

      await uploadWithRetry(storageKey, fileBuffer, mimeType, 2, 60000);

      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(storageKey);

      let safeType = item.materialType;
      const validTypes = ['lecture_note', 'past_question', 'textbook', 'assignment', 'other'];
      if (!validTypes.includes(safeType)) {
        safeType = safeType === 'handout' ? 'lecture_note' : (safeType === 'syllabus' ? 'other' : 'lecture_note');
      }

      const payload = {
        title: item.title,
        description: item.description,
        course_code: item.courseCode,
        course_title: officialCourseTitle,
        level: item.level,
        semester: item.semester,
        material_type: safeType,
        session: "2025/2026",
        file_url: publicUrl,
        file_name: cleanFileName,
        file_size: stats.size,
        download_count: 0,
        is_published: true
      };

      const { error: insErr } = await supabase.from('materials').insert(payload);

      if (insErr) {
        console.error(`  ❌ DB Insert error: ${insErr.message}`);
        errorCount++;
      } else {
        console.log(`  ✅ Published: [${item.courseCode} - ${officialCourseTitle}] "${item.title}"`);
        dbTitles.add(item.title.trim().toLowerCase());
        dbFiles.add(cleanFileName.toLowerCase());
        uploadedCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n==================================================================");
  console.log("DESKTOP FOLDER UPLOAD SUMMARY:");
  console.log(`  Successfully Uploaded & Published: ${uploadedCount}`);
  console.log(`  Skipped (Already in DB):           ${skippedCount}`);
  console.log(`  Failed / Errors:                    ${errorCount}`);
  console.log("==================================================================\n");

  process.exit(0);
}

run();

