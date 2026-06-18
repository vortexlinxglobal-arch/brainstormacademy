-- Create tables only (run this first)
-- This migration can be used on a minimal database where the core student_progress table is not yet defined.
-- It adopts the current course enrollment-based progress schema used in 001_core_roles_departments.sql.

CREATE TABLE IF NOT EXISTS public.student_progress (
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

CREATE TABLE IF NOT EXISTS public.student_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_progress_course_enrollment ON public.student_progress(course_enrollment_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_module ON public.student_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_student_id ON public.student_activities(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activities_timestamp ON public.student_activities(timestamp DESC);