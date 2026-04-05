-- Staff Profiles and Authentication Setup
-- This migration sets up staff profile management and authentication triggers

-- ===========================================
-- STAFF PROFILE MANAGEMENT
-- ===========================================

-- Function to create staff profile on user registration
CREATE OR REPLACE FUNCTION public.handle_staff_registration()
RETURNS TRIGGER AS $$
DECLARE
    staff_data JSONB;
    dept_id INTEGER;
    category_id INTEGER;
BEGIN
    -- Check if this is a staff registration (from metadata)
    IF NEW.raw_user_meta_data->>'role' = 'staff' THEN
        -- Extract staff data from metadata
        staff_data := NEW.raw_user_meta_data->'staff_data';

        -- Get department ID
        SELECT id INTO dept_id FROM departments WHERE code = staff_data->>'department_code';

        -- Get staff category ID
        SELECT id INTO category_id FROM staff_categories WHERE code = staff_data->>'category_code';

        -- Create staff profile
        INSERT INTO public.staff_profiles (
            user_id,
            staff_category_id,
            department_id,
            employee_id,
            bio,
            employment_date,
            specialty,
            qualifications
        ) VALUES (
            NEW.id,
            category_id,
            dept_id,
            gen_employee_id(staff_data->>'category_code', dept_id),
            staff_data->>'bio',
            (staff_data->>'employment_date')::DATE,
            staff_data->>'specialty',
            staff_data->>'qualifications'
        );

        -- Update profile role
        UPDATE public.profiles SET role = 'staff' WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for staff registration
CREATE TRIGGER on_staff_registration
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_staff_registration();

-- ===========================================
-- STAFF PROFILE FUNCTIONS
-- ===========================================

-- Function to get staff profile with department and category info
CREATE OR REPLACE FUNCTION get_staff_profile(p_user_id UUID)
RETURNS TABLE (
    id INTEGER,
    user_id UUID,
    employee_id TEXT,
    full_name TEXT,
    email TEXT,
    department_name TEXT,
    department_code TEXT,
    category_name TEXT,
    category_code TEXT,
    bio TEXT,
    employment_date DATE,
    specialty TEXT,
    qualifications JSONB,
    performance_rating DECIMAL(3,2),
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sp.id,
        sp.user_id,
        sp.employee_id,
        p.full_name,
        p.email,
        d.name as department_name,
        d.code as department_code,
        sc.name as category_name,
        sc.code as category_code,
        sp.bio,
        sp.employment_date,
        sp.specialty,
        sp.qualifications,
        sp.performance_rating,
        sp.is_active,
        sp.created_at
    FROM public.staff_profiles sp
    JOIN public.profiles p ON sp.user_id = p.id
    LEFT JOIN public.departments d ON sp.department_id = d.id
    LEFT JOIN public.staff_categories sc ON sp.staff_category_id = sc.id
    WHERE sp.user_id = p_user_id AND sp.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update staff performance rating
CREATE OR REPLACE FUNCTION update_staff_performance(
    p_staff_id INTEGER,
    p_rating DECIMAL(3,2),
    p_updated_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    old_rating DECIMAL(3,2);
BEGIN
    -- Get current rating
    SELECT performance_rating INTO old_rating
    FROM public.staff_profiles
    WHERE id = p_staff_id;

    -- Update rating
    UPDATE public.staff_profiles
    SET performance_rating = p_rating, updated_at = NOW()
    WHERE id = p_staff_id;

    -- Log the change
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_updated_by,
        'update_staff_performance',
        'staff_profile',
        p_staff_id::TEXT,
        jsonb_build_object('old_rating', old_rating, 'new_rating', p_rating)
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get staff by department
CREATE OR REPLACE FUNCTION get_staff_by_department(p_department_code TEXT)
RETURNS TABLE (
    id INTEGER,
    employee_id TEXT,
    full_name TEXT,
    email TEXT,
    category_name TEXT,
    specialty TEXT,
    performance_rating DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sp.id,
        sp.employee_id,
        p.full_name,
        p.email,
        sc.name as category_name,
        sp.specialty,
        sp.performance_rating
    FROM public.staff_profiles sp
    JOIN public.profiles p ON sp.user_id = p.id
    JOIN public.departments d ON sp.department_id = d.id
    JOIN public.staff_categories sc ON sp.staff_category_id = sc.id
    WHERE d.code = p_department_code
    AND sp.is_active = true
    ORDER BY sp.performance_rating DESC, p.full_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- STAFF AUTHENTICATION HELPERS
-- ===========================================

-- Function to check staff permissions
CREATE OR REPLACE FUNCTION check_staff_permission(
    p_user_id UUID,
    p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    staff_permissions JSONB;
BEGIN
    SELECT sc.permissions INTO staff_permissions
    FROM public.staff_profiles sp
    JOIN public.staff_categories sc ON sp.staff_category_id = sc.id
    WHERE sp.user_id = p_user_id AND sp.is_active = true;

    -- Check if user has 'all' permission or specific permission
    RETURN (staff_permissions->>'all')::BOOLEAN = true
        OR (staff_permissions->>p_permission)::BOOLEAN = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get staff dashboard data
CREATE OR REPLACE FUNCTION get_staff_dashboard(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    staff_info JSONB;
    department_stats JSONB;
    recent_activities JSONB;
BEGIN
    -- Get staff info
    SELECT jsonb_build_object(
        'employee_id', sp.employee_id,
        'department', d.name,
        'category', sc.name,
        'performance_rating', sp.performance_rating,
        'specialty', sp.specialty
    ) INTO staff_info
    FROM public.staff_profiles sp
    JOIN public.departments d ON sp.department_id = d.id
    JOIN public.staff_categories sc ON sp.staff_category_id = sc.id
    WHERE sp.user_id = p_user_id;

    -- Get department statistics (if applicable)
    SELECT jsonb_build_object(
        'total_staff', COUNT(*),
        'active_staff', COUNT(CASE WHEN sp.is_active THEN 1 END),
        'avg_performance', ROUND(AVG(sp.performance_rating)::NUMERIC, 2)
    ) INTO department_stats
    FROM public.staff_profiles sp
    WHERE sp.department_id = (SELECT department_id FROM public.staff_profiles WHERE user_id = p_user_id);

    -- Get recent activities
    SELECT jsonb_agg(
        jsonb_build_object(
            'action', action,
            'resource_type', resource_type,
            'created_at', created_at
        )
    ) INTO recent_activities
    FROM public.activity_logs
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 10;

    -- Combine results
    result := jsonb_build_object(
        'staff_info', staff_info,
        'department_stats', department_stats,
        'recent_activities', recent_activities
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- STAFF PROFILE VIEWS
-- ===========================================

-- View for active staff with full details
CREATE OR REPLACE VIEW active_staff_details AS
SELECT
    sp.id,
    sp.user_id,
    sp.employee_id,
    p.full_name,
    p.email,
    p.avatar_url,
    d.name as department_name,
    d.code as department_code,
    sc.name as category_name,
    sc.code as category_code,
    sc.permissions,
    sp.bio,
    sp.employment_date,
    sp.specialty,
    sp.qualifications,
    sp.performance_rating,
    sp.created_at,
    sp.updated_at
FROM public.staff_profiles sp
JOIN public.profiles p ON sp.user_id = p.id
LEFT JOIN public.departments d ON sp.department_id = d.id
LEFT JOIN public.staff_categories sc ON sp.staff_category_id = sc.id
WHERE sp.is_active = true AND p.is_active = true;

-- View for staff performance summary
CREATE OR REPLACE VIEW staff_performance_summary AS
SELECT
    d.name as department,
    sc.name as category,
    COUNT(*) as staff_count,
    ROUND(AVG(sp.performance_rating)::NUMERIC, 2) as avg_rating,
    MIN(sp.performance_rating) as min_rating,
    MAX(sp.performance_rating) as max_rating
FROM public.staff_profiles sp
JOIN public.departments d ON sp.department_id = d.id
JOIN public.staff_categories sc ON sp.staff_category_id = sc.id
WHERE sp.is_active = true
GROUP BY d.name, sc.name
ORDER BY d.name, sc.name;

-- ===========================================
-- INITIAL STAFF DATA
-- ===========================================

-- Insert sample staff profiles (these would normally be created through registration)
-- Note: In production, these would be created through the registration process

-- Sample admin user (would be created via auth.users trigger)
-- INSERT INTO public.staff_profiles (user_id, staff_category_id, department_id, employee_id, bio, employment_date, specialty)
-- SELECT
--     u.id,
--     sc.id,
--     d.id,
--     'ADM001',
--     'System Administrator with 10+ years experience',
--     '2020-01-15',
--     'System Administration'
-- FROM auth.users u
-- CROSS JOIN (SELECT id FROM staff_categories WHERE code = 'ADM') sc
-- CROSS JOIN (SELECT id FROM departments WHERE code = 'TECH') d
-- WHERE u.email = 'admin@brainstormskills.com';

-- ===========================================
-- STAFF PROFILE POLICIES (RLS)
-- ===========================================

-- Enable RLS on staff_profiles
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Staff can view their own profile
CREATE POLICY "Staff can view own profile" ON public.staff_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Staff can update their own profile
CREATE POLICY "Staff can update own profile" ON public.staff_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Admins can view all staff profiles
CREATE POLICY "Admins can view all staff profiles" ON public.staff_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Managers can view staff in their department
CREATE POLICY "Managers can view department staff" ON public.staff_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.staff_profiles sp2
            JOIN public.departments d ON sp2.department_id = d.id
            WHERE sp2.user_id = auth.uid()
            AND d.head_id = auth.uid()
        )
    );

-- Policy: Admins can manage all staff profiles
CREATE POLICY "Admins can manage all staff profiles" ON public.staff_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );