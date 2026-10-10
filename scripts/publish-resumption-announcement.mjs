import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log("Publishing Resumption Adjustment Announcement...");

  // 1. Upload circular image to Supabase announcements bucket
  const localImgPath = path.resolve("public/images/custech_resumption_adjustment_circular_2026.png");
  let publicImageUrl = "/images/custech_resumption_adjustment_circular_2026.png";

  if (fs.existsSync(localImgPath)) {
    const fileBuffer = fs.readFileSync(localImgPath);
    const storageKey = `announcements/circular_${Date.now()}_custech_resumption_adjustment_2026.png`;

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('announcements')
      .upload(storageKey, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadErr) {
      console.warn("Storage upload warning (will use local path):", uploadErr.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('announcements')
        .getPublicUrl(storageKey);
      publicImageUrl = publicUrl;
      console.log("Uploaded circular image to Supabase:", publicUrl);
    }
  }

  // 2. Announcement content
  const title = "CUSTECH Adjusts Resumption Dates for 2026/2027 Academic Session";
  const content = `The Confluence University of Science and Technology (CUSTECH), Osara, has announced an adjustment to the resumption dates for fresh and returning students for the 2026/2027 academic session.

In an official circular dated September 25th, 2026 (Ref: CUSTECH/RO/S.6) and signed by the Registrar and Secretary to Council, Mrs. Glory Ojochogu Yakubu, the University explained that the adjustment was necessitated by unforeseen technical glitches and logistical challenges, aimed at ensuring seamless administrative preparations for the new academic session.

📅 REVISED COMMENCEMENT & RESUMPTION SCHEDULE:

🎓 1. Fresh Students (100 Level & Direct Entry):
• Original Resumption Date: Monday, 28th September, 2026
• NEW RESUMPTION DATE (2 Weeks Extension): Monday, 12th October, 2026
• Fresh students are expected to arrive on campus and commence screening, physical documentation, and online course registration immediately upon resumption.

📚 2. Returning Students (200 Level and Above):
• Original Resumption Date: Monday, 28th September, 2026
• NEW RESUMPTION DATE (3 Weeks Extension): Monday, 19th October, 2026
• Returning students are to note that online portals remain open for fee payment and course registration prior to their physical arrival on campus.

📝 3. Registration Deadlines & Late Registration Window:
• Regular Registration Deadline: Extended to Friday, 13th November, 2026
• Late Registration Window: Saturday, 14th November to Monday, 23rd November, 2026
• Late Registration Surcharge Fee: Statutory fee of ₦10,000 (Ten Thousand Naira) applies strictly during late window.

🏛️ 4. Matriculation Ceremony & Workload:
• A supplementary academic calendar containing the new date for the Matriculation Ceremony and revised academic schedule will be issued in due course by the Academic Planning Unit.

Management regrets any inconvenience the adjustment may cause and wishes all students safe journeys back to campus.

Signed:
Information, Public Relations and Protocol Unit, CUSTECH, Osara
For: Office of the Registrar`;

  // 3. Insert announcement into Supabase
  const payload = {
    title,
    content,
    category: "academic",
    is_important: true,
    is_published: true,
    image_url: publicImageUrl,
    published_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('announcements').insert(payload).select();

  if (error) {
    console.error("Failed to insert announcement:", error.message);
  } else {
    console.log("✅ Announcement successfully created with ID:", data[0]?.id);
  }
}

run();

