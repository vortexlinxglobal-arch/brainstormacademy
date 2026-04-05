-- Core Database Schema for Brainstorm Skills Platform
-- User Roles: public, student, instructor, staff, admin
-- Departments: Academic, Administrative, Technical, Management

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'public' CHECK (role IN ('public', 'student', 'instructor', 'staff', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments
CREATE TABLE public.departments (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    head_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Categories
CREATE TABLE public.staff_categories (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff Profiles
CREATE TABLE public.staff_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    staff_category_id INTEGER REFERENCES public.staff_categories(id),
    department_id INTEGER REFERENCES public.departments(id),
    employee_id TEXT UNIQUE NOT NULL,
    bio TEXT,
    employment_date DATE,
    specialty TEXT,
    qualifications JSONB DEFAULT '[]',
    performance_rating DECIMAL(3,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registration_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    contact TEXT,
    guardian_contact TEXT,
    address JSONB,
    emergency_contact JSONB,
    academic_background JSONB DEFAULT '{}',
    enrollment_status TEXT DEFAULT 'pending' CHECK (enrollment_status IN ('pending', 'enrolled', 'graduated', 'withdrawn', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Instructor Profiles
CREATE TABLE public.instructors (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    instructor_id TEXT UNIQUE NOT NULL,
    bio TEXT,
    expertise JSONB DEFAULT '[]',
    qualifications JSONB DEFAULT '[]',
    years_of_experience INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ACADEMIC STRUCTURE
-- ===========================================

-- Trade Categories (Main skill areas)
CREATE TABLE public.trade_categories (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    color_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades (Specific skills/programs)
CREATE TABLE public.trades (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES public.trade_categories(id),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_months INTEGER NOT NULL,
    certification_type TEXT DEFAULT 'certificate',
    tuition_fee DECIMAL(10,2),
    prerequisites JSONB DEFAULT '[]',
    curriculum JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses (Individual subjects within trades)
CREATE TABLE public.courses (
    id SERIAL PRIMARY KEY,
    trade_id INTEGER REFERENCES public.trades(id),
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructor_id INTEGER REFERENCES public.instructors(id),
    duration_hours INTEGER,
    credit_hours INTEGER DEFAULT 1,
    course_fee DECIMAL(8,2),
    materials JSONB DEFAULT '[]',
    prerequisites JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Modules
CREATE TABLE public.course_modules (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(id),
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    content JSONB DEFAULT '{}',
    duration_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ENROLLMENT & PROGRESS
-- ===========================================

-- Student Enrollments
CREATE TABLE public.enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES public.students(id),
    trade_id INTEGER REFERENCES public.trades(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    expected_completion_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'withdrawn', 'suspended')),
    total_fee DECIMAL(10,2),
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Enrollments
CREATE TABLE public.course_enrollments (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES public.enrollments(id),
    course_id INTEGER REFERENCES public.courses(id),
    instructor_id INTEGER REFERENCES public.instructors(id),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'failed', 'withdrawn')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    grade TEXT,
    grade_points DECIMAL(4,2),
    completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Progress Tracking
CREATE TABLE public.student_progress (
    id SERIAL PRIMARY KEY,
    course_enrollment_id INTEGER REFERENCES public.course_enrollments(id),
    module_id INTEGER REFERENCES public.course_modules(id),
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- CONTENT MANAGEMENT
-- ===========================================

-- Learning Materials
CREATE TABLE public.learning_materials (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(id),
    module_id INTEGER REFERENCES public.course_modules(id),
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL CHECK (material_type IN ('video', 'document', 'quiz', 'assignment', 'resource')),
    content_url TEXT,
    content_data JSONB,
    is_required BOOLEAN DEFAULT true,
    order_index INTEGER,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes and Assessments
CREATE TABLE public.quizzes (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES public.courses(id),
    module_id INTEGER REFERENCES public.course_modules(id),
    title TEXT NOT NULL,
    description TEXT,
    quiz_type TEXT DEFAULT 'practice' CHECK (quiz_type IN ('practice', 'assessment', 'exam')),
    time_limit_minutes INTEGER,
    passing_score DECIMAL(5,2),
    max_attempts INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions
CREATE TABLE public.quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES public.quizzes(id),
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    options JSONB,
    correct_answer JSONB,
    points INTEGER DEFAULT 1,
    explanation TEXT,
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Quiz Attempts
CREATE TABLE public.quiz_attempts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES public.students(id),
    quiz_id INTEGER REFERENCES public.quizzes(id),
    attempt_number INTEGER DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    is_passed BOOLEAN,
    answers JSONB DEFAULT '{}',
    time_taken_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- COMMUNICATION & ENGAGEMENT
-- ===========================================

-- Announcements
CREATE TABLE public.announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience JSONB DEFAULT '["all"]', -- ['students', 'instructors', 'staff', 'public']
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Messages/Notifications
CREATE TABLE public.notifications (
    id SERIAL PRIMARY KEY,
    recipient_id UUID REFERENCES public.profiles(id),
    sender_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'info' CHECK (notification_type IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    action_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion Forums
CREATE TABLE public.forum_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.forum_posts (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES public.forum_categories(id),
    author_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.forum_replies (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES public.forum_posts(id),
    author_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    parent_reply_id INTEGER REFERENCES public.forum_replies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- FINANCIAL MANAGEMENT
-- ===========================================

-- Payment Records
CREATE TABLE public.payments (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES public.enrollments(id),
    student_id INTEGER REFERENCES public.students(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'online')),
    transaction_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    notes TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scholarships and Financial Aid
CREATE TABLE public.scholarships (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    eligibility_criteria JSONB DEFAULT '{}',
    discount_percentage DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Scholarships
CREATE TABLE public.student_scholarships (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES public.students(id),
    scholarship_id INTEGER REFERENCES public.scholarships(id),
    awarded_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ANALYTICS & REPORTING
-- ===========================================

-- System Logs
CREATE TABLE public.activity_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE public.performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_type TEXT NOT NULL,
    metric_name TEXT NOT NULL,
    value DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- UTILITY FUNCTIONS
-- ===========================================

-- Function to generate student registration numbers
CREATE OR REPLACE FUNCTION gen_student_reg_number(p_trade_id INTEGER)
RETURNS TEXT AS $$
DECLARE
    trade_code TEXT;
    year_code TEXT;
    seq_num INTEGER;
    reg_number TEXT;
BEGIN
    -- Get trade code
    SELECT code INTO trade_code FROM trades WHERE id = p_trade_id;
    IF trade_code IS NULL THEN
        RAISE EXCEPTION 'Invalid trade_id';
    END IF;

    -- Get current year (last 2 digits)
    year_code := RIGHT(EXTRACT(YEAR FROM CURRENT_DATE)::TEXT, 2);

    -- Get next sequence number for this trade and year
    SELECT COALESCE(MAX(CAST(SUBSTRING(registration_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO seq_num
    FROM students
    WHERE registration_number LIKE trade_code || year_code || '%';

    -- Generate registration number
    reg_number := trade_code || year_code || LPAD(seq_num::TEXT, 4, '0');

    RETURN reg_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate employee IDs
CREATE OR REPLACE FUNCTION gen_employee_id(p_category TEXT, p_department_id INTEGER DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    dept_code TEXT := '';
    year_code TEXT;
    seq_num INTEGER;
    emp_id TEXT;
BEGIN
    -- Get department code if provided
    IF p_department_id IS NOT NULL THEN
        SELECT code INTO dept_code FROM departments WHERE id = p_department_id;
    END IF;

    -- Get current year (last 2 digits)
    year_code := RIGHT(EXTRACT(YEAR FROM CURRENT_DATE)::TEXT, 2);

    -- Get next sequence number
    SELECT COALESCE(MAX(seq), 0) + 1
    INTO seq_num
    FROM staff_profiles
    WHERE staff_category = p_category
    AND (p_department_id IS NULL OR department_id = p_department_id);

    -- Generate employee ID
    emp_id := p_category || dept_code || year_code || LPAD(seq_num::TEXT, 3, '0');

    RETURN emp_id;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_students_registration ON public.students(registration_number);
CREATE INDEX idx_staff_employee_id ON public.staff_profiles(employee_id);
CREATE INDEX idx_instructors_rating ON public.instructors(rating);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);
CREATE INDEX idx_course_enrollments_status ON public.course_enrollments(status);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_id, is_read);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id, created_at);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category_id, created_at);

-- ===========================================
-- INITIAL DATA SEEDING
-- ===========================================

-- Insert default departments
INSERT INTO public.departments (code, name, description) VALUES
('ACAD', 'Academic Department', 'Manages academic programs and curriculum'),
('ADMIN', 'Administration', 'Handles administrative operations'),
('TECH', 'Technical Services', 'Manages technical infrastructure'),
('MGMT', 'Management', 'Executive and strategic management');

-- Insert staff categories
INSERT INTO public.staff_categories (code, name, description, permissions) VALUES
('ADM', 'Administrator', 'System administrators with full access', '{"all": true}'),
('MGR', 'Manager', 'Department managers', '{"manage_department": true, "view_reports": true}'),
('INS', 'Instructor', 'Teaching staff', '{"teach": true, "grade": true, "view_students": true}'),
('SUP', 'Support Staff', 'Administrative support', '{"view_basic": true, "manage_records": true}'),
('IQAM', 'IQAM Officer', 'Quality assurance', '{"audit": true, "report": true}');

-- Insert trade categories
INSERT INTO public.trade_categories (code, name, description, color_code) VALUES
('TECH', 'Technology', 'Digital and technical skills', '#00856f'),
('CRAFT', 'Crafts & Trades', 'Traditional craftsmanship', '#7bd6b2'),
('BUSINESS', 'Business & Management', 'Business and entrepreneurial skills', '#2b373a'),
('CREATIVE', 'Creative Arts', 'Design and creative skills', '#64748b'),
('SERVICE', 'Service Industry', 'Hospitality and service skills', '#94a3b8');

-- Insert sample trades
INSERT INTO public.trades (category_id, code, name, description, duration_months, tuition_fee) VALUES
(1, 'WEB', 'Web Development', 'Full-stack web development skills', 6, 150000.00),
(1, 'DS', 'Data Science', 'Data analysis and machine learning', 8, 200000.00),
(2, 'ELEC', 'Electrical Installation', 'Electrical systems and installation', 12, 180000.00),
(2, 'PLUMB', 'Plumbing', 'Pipe fitting and plumbing systems', 9, 160000.00),
(3, 'BM', 'Business Management', 'Business administration and management', 6, 120000.00),
(4, 'GD', 'Graphic Design', 'Digital design and multimedia', 6, 140000.00),
(5, 'CATER', 'Catering & Hospitality', 'Food service and hospitality', 6, 130000.00);

-- Insert forum categories
INSERT INTO public.forum_categories (name, description) VALUES
('General Discussion', 'General topics and discussions'),
('Technical Support', 'Technical questions and support'),
('Career Advice', 'Career guidance and opportunities'),
('Student Lounge', 'Casual student discussions'),
('Announcements', 'Official announcements and updates');

-- Insert scholarships
INSERT INTO public.scholarships (name, description, discount_percentage, eligibility_criteria) VALUES
('Merit Scholarship', 'For outstanding academic performance', 50.00, '{"min_score": 85}'),
('Need-Based Aid', 'For students with financial difficulties', 75.00, '{"income_bracket": "low"}'),
('Women in Tech', 'Special scholarship for female students in tech', 60.00, '{"gender": "female", "trade_category": "TECH"}'),
('Early Bird', 'Discount for early enrollment', 20.00, '{"enrollment_months_early": 3}');

-- ===========================================
-- TRIGGERS FOR UPDATED_AT
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_staff_profiles_updated_at BEFORE UPDATE ON public.staff_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON public.course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();