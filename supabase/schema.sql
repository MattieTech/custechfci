-- FCI Student Guide — Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. DEPARTMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  careers TEXT[] DEFAULT '{}',
  skills JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 3. COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  credit_units INTEGER NOT NULL CHECK (credit_units > 0),
  status TEXT NOT NULL DEFAULT 'Core' CHECK (status IN ('Core', 'Elective')),
  level INTEGER NOT NULL CHECK (level IN (100, 200, 300, 400)),
  semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_department ON public.courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_level_semester ON public.courses(level, semester);

-- ============================================
-- 4. MATERIALS (Academic resources)
-- ============================================
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  course_code TEXT,
  course_title TEXT,
  level INTEGER CHECK (level IN (100, 200, 300, 400)),
  semester INTEGER CHECK (semester IN (1, 2)),
  material_type TEXT NOT NULL DEFAULT 'other' CHECK (
    material_type IN ('past_question', 'lecture_note', 'textbook', 'assignment', 'other')
  ),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  session TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_materials_type ON public.materials(material_type);
CREATE INDEX IF NOT EXISTS idx_materials_level ON public.materials(level);
CREATE INDEX IF NOT EXISTS idx_materials_published ON public.materials(is_published);

-- ============================================
-- 5. ANNOUNCEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general' CHECK (
    category IN ('general', 'academic', 'events', 'facilities', 'workshop', 'awards')
  ),
  is_important BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);

-- ============================================
-- 6. EXAM TIMETABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.exam_timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  timetable_type TEXT NOT NULL DEFAULT 'exam' CHECK (timetable_type IN ('lecture', 'ca_test', 'exam')),
  day_of_week TEXT CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  exam_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue TEXT,
  level INTEGER NOT NULL CHECK (level IN (100, 200, 300, 400)),
  semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
  session TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timetable_type ON public.exam_timetable(timetable_type);
CREATE INDEX IF NOT EXISTS idx_timetable_date ON public.exam_timetable(exam_date);
CREATE INDEX IF NOT EXISTS idx_timetable_level ON public.exam_timetable(level);
CREATE INDEX IF NOT EXISTS idx_timetable_published ON public.exam_timetable(is_published);

-- ============================================
-- 7. CONTACTS (Faculty/Course Representatives)
-- ============================================
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('faculty_rep', 'course_rep')),
  phone TEXT,
  whatsapp_url TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level IN (100, 200, 300, 400)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 8. COMMUNITY_GROUPS (Department & Class WhatsApp/Telegram Groups)
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 100,
  rep_name TEXT,
  whatsapp_link TEXT NOT NULL,
  telegram_link TEXT,
  member_estimate TEXT DEFAULT '100+ students',
  is_verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_groups_dept ON public.community_groups(department);
CREATE INDEX IF NOT EXISTS idx_community_groups_level ON public.community_groups(level);

-- ============================================
-- 9. LEVEL_REPRESENTATIVES (Hierarchy: Level -> Faculty Rep & Departmental Reps)
-- ============================================
CREATE TABLE IF NOT EXISTS public.level_representatives (
  level INTEGER PRIMARY KEY CHECK (level IN (100, 200, 300, 400)),
  faculty_rep JSONB NOT NULL,
  departments JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.level_representatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access on level_representatives" ON public.level_representatives FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admins to insert/update level_representatives" ON public.level_representatives FOR ALL TO authenticated USING (true);

-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES: users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- DEPARTMENTS: public read, admin write
CREATE POLICY "Anyone can view departments" ON public.departments
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (public.is_admin());

-- COURSES: public read, admin write
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses
  FOR ALL USING (public.is_admin());

-- MATERIALS: public read published, admin write
CREATE POLICY "Anyone can view published materials" ON public.materials
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all materials" ON public.materials
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage materials" ON public.materials
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update materials" ON public.materials
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete materials" ON public.materials
  FOR DELETE USING (public.is_admin());

-- ANNOUNCEMENTS: public read published, admin write
CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all announcements" ON public.announcements
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage announcements" ON public.announcements
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update announcements" ON public.announcements
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete announcements" ON public.announcements
  FOR DELETE USING (public.is_admin());

-- EXAM TIMETABLE: public read published, admin write
CREATE POLICY "Anyone can view published timetable" ON public.exam_timetable
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all timetable entries" ON public.exam_timetable
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage timetable" ON public.exam_timetable
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update timetable" ON public.exam_timetable
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete timetable" ON public.exam_timetable
  FOR DELETE USING (public.is_admin());

-- CONTACTS: public read, admin write
CREATE POLICY "Anyone can view contacts" ON public.contacts
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage contacts" ON public.contacts
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update contacts" ON public.contacts
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete contacts" ON public.contacts
  FOR DELETE USING (public.is_admin());

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase Dashboard > Storage, or via SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('announcements', 'announcements', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view material files" ON storage.objects
  FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Admins can upload material files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'materials' AND public.is_admin());
CREATE POLICY "Admins can update material files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'materials' AND public.is_admin());
CREATE POLICY "Admins can delete material files" ON storage.objects
  FOR DELETE USING (bucket_id = 'materials' AND public.is_admin());

CREATE POLICY "Anyone can view announcement images" ON storage.objects
  FOR SELECT USING (bucket_id = 'announcements');
CREATE POLICY "Admins can upload announcement images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'announcements' AND public.is_admin());
CREATE POLICY "Admins can delete announcement images" ON storage.objects
  FOR DELETE USING (bucket_id = 'announcements' AND public.is_admin());

-- ============================================
-- SCHEMA & TABLE PERMISSIONS
-- ============================================
-- Ensure Supabase API roles have proper access to public schema tables
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
