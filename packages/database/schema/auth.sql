-- Authentication Schema for NEET Prep AI Platform
-- Story 1.1: User Authentication System

-- User tier enum
CREATE TYPE user_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- User role enum  
CREATE TYPE user_role AS ENUM ('student', 'coach', 'parent', 'admin');

-- Students table (main user table)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  tier user_tier DEFAULT 'free',
  role user_role DEFAULT 'student',
  referred_by UUID REFERENCES students(id),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extended information)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  target_exam_date DATE,
  target_score INTEGER CHECK (target_score >= 0 AND target_score <= 720),
  study_hours_per_day INTEGER DEFAULT 2 CHECK (study_hours_per_day >= 1 AND study_hours_per_day <= 24),
  preferred_subjects TEXT[] DEFAULT '{}',
  weak_areas TEXT[] DEFAULT '{}',
  learning_style VARCHAR(50),
  timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Indexes for better performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_role ON students(role);
CREATE INDEX idx_students_tier ON students(tier);
CREATE INDEX idx_user_profiles_student_id ON user_profiles(student_id);
CREATE INDEX idx_user_profiles_exam_date ON user_profiles(target_exam_date);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own data
CREATE POLICY "Users can view own profile" ON students
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON students
FOR UPDATE USING (auth.uid() = id);

-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles" ON students
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- User profiles policies
CREATE POLICY "Users can view own user_profile" ON user_profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = user_profiles.student_id AND students.id = auth.uid()
  )
);

CREATE POLICY "Users can update own user_profile" ON user_profiles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = user_profiles.student_id AND students.id = auth.uid()
  )
);

CREATE POLICY "Users can insert own user_profile" ON user_profiles
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM students 
    WHERE students.id = user_profiles.student_id AND students.id = auth.uid()
  )
);

-- Admin policies for user_profiles
CREATE POLICY "Admins can view all user_profiles" ON user_profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM students 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Comments for documentation
COMMENT ON TABLE students IS 'Main user table storing authentication and basic profile information';
COMMENT ON TABLE user_profiles IS 'Extended user information specific to NEET preparation';
COMMENT ON COLUMN students.tier IS 'Subscription tier determining feature access';
COMMENT ON COLUMN students.role IS 'User role determining permissions and UI experience';
COMMENT ON COLUMN user_profiles.target_score IS 'NEET target score out of 720';
COMMENT ON COLUMN user_profiles.study_hours_per_day IS 'Planned daily study hours for learning path optimization';
