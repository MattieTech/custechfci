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

const OFFICIAL_COURSE_TITLES = {
  "CSC 142": "Fundamentals of Data Science",
  "CSC 231": "Computer Programming I",
  "IFT 231": "Digital Logic Design",
  "IFT 232": "Computer Architecture and Organization",
  "IFT 241": "Human-Computer Interface",
  "MTH 231": "Mathematical Methods I",
  "MTH 241": "Mathematical Method II (Elementary Differential Equation I)",
  "SWE 231": "Introduction to Software Engineering",
  "SWE 241": "Introduction to Generative AI"
};

const baseDir = "C:\\Users\\PC\\Desktop\\PAST QUESTIONS CUSTECH";

const PAST_QUESTIONS_LIST = [
  {
    localFile: "CSC142 PAST QUESTION.pdf",
    title: "CSC 142: Fundamentals of Data Science - Past Examination & Study Questions",
    courseCode: "CSC 142",
    level: 100,
    semester: 2,
    materialType: "past_question",
    description: "Official past examination and continuous assessment questions for CSC 142: Fundamentals of Data Science."
  },
  {
    localFile: "CSC231 EXAM PAST QUESTION.pdf",
    title: "CSC 231: Computer Programming I - Past Semester Examination Questions",
    courseCode: "CSC 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official 1st semester past examination question paper for CSC 231: Computer Programming I."
  },
  {
    localFile: "IFT231 PAST EXAM QUESTION.pdf",
    title: "IFT 231: Digital Logic Design - Past Semester Examination Questions",
    courseCode: "IFT 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official 1st semester past examination question paper for IFT 231: Digital Logic Design."
  },
  {
    localFile: "IFT232 EXAM PAST QUESTION.pdf",
    title: "IFT 232: Computer Architecture and Organization - Past Semester Examination Questions",
    courseCode: "IFT 232",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official 1st semester past examination question paper for IFT 232: Computer Architecture and Organization."
  },
  {
    localFile: "IFT232 TEST PAST QUESTION.pdf",
    title: "IFT 232: Computer Architecture and Organization - Continuous Assessment (CA) Test Questions",
    courseCode: "IFT 232",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official continuous assessment test questions for IFT 232: Computer Architecture and Organization."
  },
  {
    localFile: "IFT241 EXAM PAST QUESTION.pdf",
    title: "IFT 241: Human-Computer Interface - Past Semester Examination Questions",
    courseCode: "IFT 241",
    level: 200,
    semester: 2,
    materialType: "past_question",
    description: "Official 2nd semester past examination question paper for IFT 241: Human-Computer Interface."
  },
  {
    localFile: "MTH231 PAST TEST QUESTION.pdf",
    title: "MTH 231: Mathematical Methods I - Continuous Assessment (CA) Test Questions",
    courseCode: "MTH 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official continuous assessment test questions for MTH 231: Mathematical Methods I."
  },
  {
    localFile: "MTH241 EXAM PAST QUESTION.pdf",
    title: "MTH 241: Mathematical Method II - Past Semester Examination Questions",
    courseCode: "MTH 241",
    level: 200,
    semester: 2,
    materialType: "past_question",
    description: "Official 2nd semester past examination question paper for MTH 241: Mathematical Method II (Elementary Differential Equation I)."
  },
  {
    localFile: "SWE231 EXAM PAST QUESTION.pdf",
    title: "SWE 231: Introduction to Software Engineering - Past Semester Examination Questions",
    courseCode: "SWE 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official 1st semester past examination question paper for SWE 231: Introduction to Software Engineering."
  },
  {
    localFile: "SWE231 TEST PAST QUESTION.pdf",
    title: "SWE 231: Introduction to Software Engineering - Continuous Assessment (CA) Test Questions",
    courseCode: "SWE 231",
    level: 200,
    semester: 1,
    materialType: "past_question",
    description: "Official continuous assessment test questions for SWE 231: Introduction to Software Engineering."
  },
  {
    localFile: "SWE241 EXAM PAST QUESTION.pdf",
    title: "SWE 241: Introduction to Generative AI - Past Semester Examination Questions",
    courseCode: "SWE 241",
    level: 200,
    semester: 2,
    materialType: "past_question",
    description: "Official 2nd semester past examination question paper for SWE 241: Introduction to Generative AI."
  },
  {
    localFile: "SWE241 TEST PAST QUESTION.pdf",
    title: "SWE 241: Introduction to Generative AI - Continuous Assessment (CA) Test Questions",
    courseCode: "SWE 241",
    level: 200,
    semester: 2,
    materialType: "past_question",
    description: "Official continuous assessment test questions for SWE 241: Introduction to Generative AI."
  }
];

// Helper with retries
async function uploadWithRetry(storageKey, fileBuffer, mimeType, maxRetries = 3, timeoutMs = 60000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const uploadPromise = supabase.storage
        .from('materials')
        .upload(storageKey, fileBuffer, {
          contentType: mimeType,
          upsert: true
        });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${timeoutMs / 1000}s`)), timeoutMs)
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
  console.log("CUSTECH FCI: AUTOMATIC PAST QUESTIONS UPLOADER");
  console.log(`Source Folder: ${baseDir}`);
  console.log(`Total files to upload: ${PAST_QUESTIONS_LIST.length}`);
  console.log("==================================================================");

  // Fetch current materials to avoid duplicates
  const { data: existingRows, error: fetchErr } = await supabase
    .from('materials')
    .select('id, title, course_code, file_name');

  if (fetchErr) {
    console.error("DB Error:", fetchErr.message);
    process.exit(1);
  }

  const dbTitles = new Set(existingRows.map(r => r.title.trim().toLowerCase()));
  const dbFiles = new Set(existingRows.map(r => (r.file_name || '').toLowerCase()));

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < PAST_QUESTIONS_LIST.length; i++) {
    const item = PAST_QUESTIONS_LIST[i];
    const progress = `[${i + 1}/${PAST_QUESTIONS_LIST.length}]`;
    const fullPath = path.join(baseDir, item.localFile);

    if (!fs.existsSync(fullPath)) {
      console.warn(`${progress} File not found on Desktop: ${fullPath}`);
      errorCount++;
      continue;
    }

    const cleanFileName = item.localFile.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const officialCourseTitle = OFFICIAL_COURSE_TITLES[item.courseCode] || item.courseCode;

    // Check duplicate
    if (dbTitles.has(item.title.trim().toLowerCase()) || dbFiles.has(cleanFileName.toLowerCase())) {
      console.log(`${progress} Already in DB: [${item.courseCode}] ${item.title}`);
      skippedCount++;
      continue;
    }

    const stats = fs.statSync(fullPath);
    const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`${progress} Uploading [${item.courseCode} - ${officialCourseTitle}] (${sizeMb} MB): "${item.localFile}"...`);

    try {
      const fileBuffer = fs.readFileSync(fullPath);
      const courseFolder = item.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
      const storageKey = `academic_materials/${courseFolder}/${Date.now()}_${cleanFileName}`;
      const mimeType = 'application/pdf';

      await uploadWithRetry(storageKey, fileBuffer, mimeType, 3, 60000);

      const { data: { publicUrl } } = supabase.storage
        .from('materials')
        .getPublicUrl(storageKey);

      const payload = {
        title: item.title,
        description: item.description,
        course_code: item.courseCode,
        course_title: officialCourseTitle,
        level: item.level,
        semester: item.semester,
        material_type: "past_question",
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
        console.log(`  ✅ Successfully published: "${item.title}"`);
        dbTitles.add(item.title.trim().toLowerCase());
        dbFiles.add(cleanFileName.toLowerCase());
        uploadedCount++;
      }
    } catch (err) {
      console.error(`  ❌ Error processing ${item.localFile}: ${err.message}`);
      errorCount++;
    }
  }

  console.log("\n==================================================================");
  console.log("PAST QUESTIONS UPLOAD COMPLETED SUMMARY:");
  console.log(`  Successfully Uploaded & Published: ${uploadedCount}`);
  console.log(`  Skipped (Already in DB):           ${skippedCount}`);
  console.log(`  Errors / Failures:                 ${errorCount}`);
  console.log("==================================================================\n");

  if (errorCount > 0) {
    process.exit(1);
  }
}

run();

