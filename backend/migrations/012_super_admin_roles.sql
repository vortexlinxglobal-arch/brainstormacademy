-- Add super_admin role support for full-platform ownership.
-- Super admins can access every portal section and manage role assignments.

ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('public', 'student', 'instructor', 'staff', 'admin', 'manager', 'super_admin'));

DROP POLICY IF EXISTS "Staff can view all trades" ON public.trades;
CREATE POLICY "Staff can view all trades" ON public.trades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'instructor', 'admin', 'manager', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Staff can manage trades" ON public.trades;
CREATE POLICY "Staff can manage trades" ON public.trades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'manager', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Staff can manage courses" ON public.courses;
CREATE POLICY "Staff can manage courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'manager', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Staff can view all enrollments" ON public.enrollments;
CREATE POLICY "Staff can view all enrollments" ON public.enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'manager', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Staff can view all students" ON public.students;
CREATE POLICY "Staff can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'manager', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Staff can manage students" ON public.students;
CREATE POLICY "Staff can manage students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'manager', 'super_admin')
        )
    );
