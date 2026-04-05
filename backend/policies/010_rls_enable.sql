-- Row Level Security (RLS) Policies for Brainstorm Skills Platform
-- This file enables RLS and sets up comprehensive security policies

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

-- Core tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- Academic structure
ALTER TABLE public.trade_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Enrollment and progress
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Content and materials
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Communication
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Financial
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_scholarships ENABLE ROW LEVEL SECURITY;

-- Analytics
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

-- Note: Profile policies are defined in 001_core_roles_departments.sql

-- ===========================================
-- DEPARTMENT AND STAFF POLICIES
-- ===========================================

-- Departments: Public can view departments
CREATE POLICY "Public can view departments" ON public.departments
    FOR SELECT USING (true);

-- Departments: Staff can manage departments
CREATE POLICY "Staff can manage departments" ON public.departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Staff categories: Staff can view categories
CREATE POLICY "Staff can view staff categories" ON public.staff_categories
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Staff categories: Admins can manage categories
CREATE POLICY "Admins can manage staff categories" ON public.staff_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===========================================
-- ACADEMIC STRUCTURE POLICIES
-- ===========================================

-- Note: Policies for trades and courses are defined in 003_trades_courses.sql
-- This section contains additional policies for related tables

-- Course modules: Enrolled students and staff can view
CREATE POLICY "Enrolled students and staff can view course modules" ON public.course_modules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'instructor')
        ) OR
        EXISTS (
            SELECT 1 FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid() AND ce.course_id = course_modules.course_id
        )
    );

-- Course modules: Staff can manage modules
CREATE POLICY "Staff can manage course modules" ON public.course_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- ===========================================
-- ENROLLMENT POLICIES
-- ===========================================

-- Note: Enrollment, course enrollment, and student progress policies are defined in 003_trades_courses.sql

-- ===========================================
-- CONTENT POLICIES
-- ===========================================

-- Learning materials: Enrolled students and staff can view
CREATE POLICY "Enrolled students and staff can view learning materials" ON public.learning_materials
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'instructor')
        ) OR
        EXISTS (
            SELECT 1 FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid() AND ce.course_id = learning_materials.course_id
        )
    );

-- Learning materials: Staff can manage materials
CREATE POLICY "Staff can manage learning materials" ON public.learning_materials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Quizzes: Enrolled students and staff can view
CREATE POLICY "Enrolled students and staff can view quizzes" ON public.quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'instructor')
        ) OR
        EXISTS (
            SELECT 1 FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid() AND ce.course_id = quizzes.course_id
        )
    );

-- Quizzes: Staff can manage quizzes
CREATE POLICY "Staff can manage quizzes" ON public.quizzes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Quiz questions: Same as quizzes
CREATE POLICY "Enrolled students and staff can view quiz questions" ON public.quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'instructor')
        ) OR
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.course_enrollments ce ON q.course_id = ce.course_id
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid() AND q.id = quiz_questions.quiz_id
        )
    );

-- Quiz questions: Staff can manage questions
CREATE POLICY "Staff can manage quiz questions" ON public.quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Quiz attempts: Students can view/manage their own attempts
CREATE POLICY "Students can manage own quiz attempts" ON public.quiz_attempts
    FOR ALL USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Quiz attempts: Instructors can view attempts for their quizzes
CREATE POLICY "Instructors can view quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (
        quiz_id IN (
            SELECT q.id FROM public.quizzes q
            JOIN public.courses c ON q.course_id = c.id
            WHERE c.instructor_id IN (
                SELECT id FROM public.instructors WHERE user_id = auth.uid()
            )
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- ===========================================
-- COMMUNICATION POLICIES
-- ===========================================

-- Announcements: Target audience can view
CREATE POLICY "Users can view relevant announcements" ON public.announcements
    FOR SELECT USING (
        target_audience @> '["all"]'::jsonb OR
        target_audience @> ('["' || (SELECT role FROM public.profiles WHERE id = auth.uid()) || '"]')::jsonb OR
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('staff', 'admin')
    );

-- Announcements: Staff can manage announcements
CREATE POLICY "Staff can manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Notifications: Users can view their own notifications
-- Note: Notification policies are defined in earlier migrations

-- Forum categories: Public can view active categories
CREATE POLICY "Public can view forum categories" ON public.forum_categories
    FOR SELECT USING (is_active = true);

-- Forum categories: Staff can manage categories
CREATE POLICY "Staff can manage forum categories" ON public.forum_categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Forum posts: Public can view posts
CREATE POLICY "Public can view forum posts" ON public.forum_posts
    FOR SELECT USING (true);

-- Forum posts: Authenticated users can create posts
CREATE POLICY "Authenticated users can create forum posts" ON public.forum_posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Forum posts: Authors and staff can update posts
CREATE POLICY "Authors and staff can update forum posts" ON public.forum_posts
    FOR UPDATE USING (
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Forum replies: Public can view replies
CREATE POLICY "Public can view forum replies" ON public.forum_replies
    FOR SELECT USING (true);

-- Forum replies: Authenticated users can create replies
CREATE POLICY "Authenticated users can create forum replies" ON public.forum_replies
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Forum replies: Authors and staff can update replies
CREATE POLICY "Authors and staff can update forum replies" ON public.forum_replies
    FOR UPDATE USING (
        auth.uid() = author_id OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- ===========================================
-- FINANCIAL POLICIES
-- ===========================================

-- Payments: Students can view their own payments
CREATE POLICY "Students can view own payments" ON public.payments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Payments: Staff can view all payments
CREATE POLICY "Staff can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Payments: Staff can manage payments
CREATE POLICY "Staff can manage payments" ON public.payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Scholarships: Public can view active scholarships
CREATE POLICY "Public can view active scholarships" ON public.scholarships
    FOR SELECT USING (is_active = true);

-- Scholarships: Staff can manage scholarships
CREATE POLICY "Staff can manage scholarships" ON public.scholarships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Student scholarships: Students can view their own scholarships
CREATE POLICY "Students can view own scholarships" ON public.student_scholarships
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Student scholarships: Staff can manage student scholarships
CREATE POLICY "Staff can manage student scholarships" ON public.student_scholarships
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- ===========================================
-- ANALYTICS POLICIES
-- ===========================================

-- Note: Activity log and performance metric policies for system use

-- Performance metrics: Staff can view metrics
CREATE POLICY "Staff can view performance metrics" ON public.performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Performance metrics: System can create metrics
CREATE POLICY "System can create performance metrics" ON public.performance_metrics
    FOR INSERT WITH CHECK (true);

-- ===========================================
-- UTILITY POLICIES
-- ===========================================

-- Create a function to check if user has admin role
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has staff role
CREATE OR REPLACE FUNCTION is_staff(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role IN ('staff', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is instructor
CREATE OR REPLACE FUNCTION is_instructor(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'instructor'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is student
CREATE OR REPLACE FUNCTION is_student(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'student'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- AUDIT POLICIES
-- ===========================================

-- Create a function to log all policy violations (optional)
CREATE OR REPLACE FUNCTION log_policy_violation(
    p_table_name TEXT,
    p_operation TEXT,
    p_user_id UUID,
    p_details JSONB DEFAULT '{}'
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        p_user_id,
        'policy_violation',
        p_table_name,
        p_operation,
        p_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;