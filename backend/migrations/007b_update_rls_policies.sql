-- Update RLS Policies for Student Progress and Activities
-- Run this after confirming the profiles table exists and basic tables are created

-- Drop existing simple policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.student_progress;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.student_progress;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.student_progress;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.student_activities;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.student_activities;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.student_activities;

-- Create proper RLS Policies for student_progress
CREATE POLICY "Students can view their own progress" ON public.student_progress
    FOR SELECT USING (
        course_enrollment_id IN (
            SELECT ce.id FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can insert their own progress" ON public.student_progress
    FOR INSERT WITH CHECK (
        course_enrollment_id IN (
            SELECT ce.id FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can update their own progress" ON public.student_progress
    FOR UPDATE USING (
        course_enrollment_id IN (
            SELECT ce.id FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

-- Create proper RLS Policies for student_activities
CREATE POLICY "Students can view their own activities" ON public.student_activities
    FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE POLICY "Students can insert their own activities" ON public.student_activities
    FOR INSERT WITH CHECK (auth.uid()::text = student_id::text);

CREATE POLICY "Instructors and admins can manage student activities" ON public.student_activities
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('instructor', 'admin')
        )
    );

CREATE POLICY "Instructors and admins can manage student activities" ON public.student_activities
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND role IN ('instructor', 'admin')
        )
    );

-- Allow instructors and admins to view all progress and activities
-- (Only if profiles table exists - check first)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Enable RLS before creating policies if needed
        ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.student_activities ENABLE ROW LEVEL SECURITY;

        -- Policies for instructors and admins
        CREATE POLICY "Instructors and admins can view all progress" ON public.student_progress
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE id = auth.uid()
                    AND role IN ('instructor', 'admin')
                )
            );

        CREATE POLICY "Instructors and admins can view all activities" ON public.student_activities
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE id = auth.uid()
                    AND role IN ('instructor', 'admin')
                )
            );
    END IF;
END $$;