-- Student Management and Enrollment System
-- This migration sets up student profiles, enrollment, and academic tracking

-- ===========================================
-- STUDENT REGISTRATION FUNCTIONS
-- ===========================================

-- Function to handle student registration
CREATE OR REPLACE FUNCTION public.handle_student_registration()
RETURNS TRIGGER AS $$
DECLARE
    student_data JSONB;
    trade_code TEXT;
    enrollment_id INTEGER;
BEGIN
    -- Check if this is a student registration
    IF NEW.raw_user_meta_data->>'role' = 'student' THEN
        -- Extract student data from metadata
        student_data := NEW.raw_user_meta_data->'student_data';

        -- Generate registration number
        trade_code := student_data->>'trade_code';
        IF trade_code IS NULL THEN
            RAISE EXCEPTION 'Trade code is required for student registration';
        END IF;

        -- Create student profile
        INSERT INTO public.students (
            user_id,
            registration_number,
            first_name,
            last_name,
            date_of_birth,
            gender,
            contact,
            guardian_contact,
            address,
            academic_background
        ) VALUES (
            NEW.id,
            gen_student_reg_number((SELECT id FROM trades WHERE code = trade_code)),
            student_data->>'first_name',
            student_data->>'last_name',
            (student_data->>'date_of_birth')::DATE,
            student_data->>'gender',
            student_data->>'contact',
            student_data->>'guardian_contact',
            student_data->>'address',
            student_data->>'academic_background'
        );

        -- Update profile role
        UPDATE public.profiles SET role = 'student' WHERE id = NEW.id;

        -- Auto-enroll in the selected trade
        SELECT enroll_student_in_trade(
            (SELECT id FROM students WHERE user_id = NEW.id),
            trade_code,
            NEW.id
        ) INTO enrollment_id;

        -- Auto-enroll in all courses for the trade
        PERFORM enroll_student_in_course(
            enrollment_id,
            c.code,
            NEW.id
        )
        FROM courses c
        WHERE c.trade_id = (SELECT id FROM trades WHERE code = trade_code)
        AND c.is_active = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for student registration
CREATE TRIGGER on_student_registration
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_student_registration();

-- ===========================================
-- STUDENT PROFILE MANAGEMENT
-- ===========================================

-- Function to get student profile with enrollment info
CREATE OR REPLACE FUNCTION get_student_profile(p_user_id UUID)
RETURNS TABLE (
    id INTEGER,
    user_id UUID,
    registration_number TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    date_of_birth DATE,
    gender TEXT,
    contact TEXT,
    guardian_contact TEXT,
    address JSONB,
    academic_background JSONB,
    enrollment_status TEXT,
    trade_name TEXT,
    trade_code TEXT,
    enrollment_date DATE,
    expected_completion_date DATE,
    total_fee DECIMAL(10,2),
    paid_amount DECIMAL(10,2),
    payment_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.user_id,
        s.registration_number,
        s.first_name,
        s.last_name,
        CONCAT(s.first_name, ' ', s.last_name) as full_name,
        p.email,
        s.date_of_birth,
        s.gender,
        s.contact,
        s.guardian_contact,
        s.address,
        s.academic_background,
        s.enrollment_status,
        t.name as trade_name,
        t.code as trade_code,
        e.enrollment_date,
        e.expected_completion_date,
        e.total_fee,
        e.paid_amount,
        e.payment_status,
        s.created_at
    FROM public.students s
    JOIN public.profiles p ON s.user_id = p.id
    LEFT JOIN public.enrollments e ON s.id = e.student_id AND e.status = 'active'
    LEFT JOIN public.trades t ON e.trade_id = t.id
    WHERE s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update student profile
CREATE OR REPLACE FUNCTION update_student_profile(
    p_user_id UUID,
    p_contact TEXT DEFAULT NULL,
    p_guardian_contact TEXT DEFAULT NULL,
    p_address JSONB DEFAULT NULL,
    p_academic_background JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.students SET
        contact = COALESCE(p_contact, contact),
        guardian_contact = COALESCE(p_guardian_contact, guardian_contact),
        address = COALESCE(p_address, address),
        academic_background = COALESCE(p_academic_background, academic_background),
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Log the update
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_user_id,
        'update_student_profile',
        'student_profile',
        (SELECT id::TEXT FROM students WHERE user_id = p_user_id),
        jsonb_build_object('updated_fields', jsonb_build_object(
            'contact', p_contact IS NOT NULL,
            'guardian_contact', p_guardian_contact IS NOT NULL,
            'address', p_address IS NOT NULL,
            'academic_background', p_academic_background IS NOT NULL
        ))
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- STUDENT DASHBOARD FUNCTIONS
-- ===========================================

-- Function to get student dashboard data
CREATE OR REPLACE FUNCTION get_student_dashboard(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    profile_data JSONB;
    enrollment_data JSONB;
    progress_data JSONB;
    upcoming_activities JSONB;
    notifications_data JSONB;
BEGIN
    -- Get profile data
    SELECT jsonb_build_object(
        'registration_number', registration_number,
        'full_name', CONCAT(first_name, ' ', last_name),
        'enrollment_status', enrollment_status
    ) INTO profile_data
    FROM public.students WHERE user_id = p_user_id;

    -- Get enrollment data
    SELECT jsonb_build_object(
        'trade_name', t.name,
        'trade_code', t.code,
        'enrollment_date', e.enrollment_date,
        'expected_completion', e.expected_completion_date,
        'total_fee', e.total_fee,
        'paid_amount', e.paid_amount,
        'payment_status', e.payment_status,
        'courses_enrolled', (
            SELECT COUNT(*) FROM course_enrollments ce WHERE ce.enrollment_id = e.id
        )
    ) INTO enrollment_data
    FROM public.enrollments e
    JOIN public.trades t ON e.trade_id = t.id
    JOIN public.students s ON e.student_id = s.id
    WHERE s.user_id = p_user_id AND e.status = 'active';

    -- Get progress data
    SELECT jsonb_agg(
        jsonb_build_object(
            'course_title', c.title,
            'progress_percentage', ROUND(AVG(sp.progress_percentage)::NUMERIC, 2),
            'completed_modules', COUNT(CASE WHEN sp.status = 'completed' THEN 1 END),
            'total_modules', COUNT(*),
            'status', ce.status
        )
    ) INTO progress_data
    FROM public.students s
    JOIN public.enrollments e ON s.id = e.student_id
    JOIN public.course_enrollments ce ON e.id = ce.enrollment_id
    JOIN public.courses c ON ce.course_id = c.id
    JOIN public.student_progress sp ON ce.id = sp.course_enrollment_id
    WHERE s.user_id = p_user_id AND e.status = 'active'
    GROUP BY c.title, ce.status, ce.id;

    -- Get upcoming activities (next modules to complete)
    SELECT jsonb_agg(
        jsonb_build_object(
            'course_title', c.title,
            'module_title', cm.title,
            'due_date', (ce.enrollment_date + INTERVAL '1 week' * cm.order_index)
        )
    ) INTO upcoming_activities
    FROM public.students s
    JOIN public.enrollments e ON s.id = e.student_id
    JOIN public.course_enrollments ce ON e.id = ce.enrollment_id
    JOIN public.courses c ON ce.course_id = c.id
    JOIN public.course_modules cm ON c.id = cm.course_id
    LEFT JOIN public.student_progress sp ON ce.id = sp.course_enrollment_id AND cm.id = sp.module_id
    WHERE s.user_id = p_user_id
    AND e.status = 'active'
    AND (sp.status IS NULL OR sp.status = 'not_started')
    ORDER BY cm.order_index
    LIMIT 5;

    -- Get recent notifications
    SELECT jsonb_agg(
        jsonb_build_object(
            'title', title,
            'message', message,
            'type', notification_type,
            'is_read', is_read,
            'created_at', created_at
        )
    ) INTO notifications_data
    FROM public.notifications
    WHERE recipient_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 10;

    -- Combine all data
    result := jsonb_build_object(
        'profile', profile_data,
        'enrollment', enrollment_data,
        'progress', progress_data,
        'upcoming_activities', upcoming_activities,
        'notifications', notifications_data
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- STUDENT ACADEMIC FUNCTIONS
-- ===========================================

-- Function to get student's current courses
CREATE OR REPLACE FUNCTION get_student_courses(p_user_id UUID)
RETURNS TABLE (
    course_id INTEGER,
    course_code TEXT,
    course_title TEXT,
    instructor_name TEXT,
    enrollment_date DATE,
    status TEXT,
    progress_percentage DECIMAL(5,2),
    grade TEXT,
    completion_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id as course_id,
        c.code as course_code,
        c.title as course_title,
        i.full_name as instructor_name,
        ce.enrollment_date,
        ce.status,
        ROUND(AVG(sp.progress_percentage)::NUMERIC, 2) as progress_percentage,
        ce.grade,
        ce.completion_date
    FROM public.students s
    JOIN public.enrollments e ON s.id = e.student_id
    JOIN public.course_enrollments ce ON e.id = ce.enrollment_id
    JOIN public.courses c ON ce.course_id = c.id
    LEFT JOIN public.instructors i ON ce.instructor_id = i.id
    LEFT JOIN public.student_progress sp ON ce.id = sp.course_enrollment_id
    WHERE s.user_id = p_user_id AND e.status = 'active'
    GROUP BY c.id, c.code, c.title, i.full_name, ce.enrollment_date, ce.status, ce.grade, ce.completion_date, ce.id
    ORDER BY ce.enrollment_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get student's course modules with progress
CREATE OR REPLACE FUNCTION get_student_course_modules(p_user_id UUID, p_course_id INTEGER)
RETURNS TABLE (
    module_id INTEGER,
    module_title TEXT,
    description TEXT,
    order_index INTEGER,
    status TEXT,
    progress_percentage DECIMAL(5,2),
    time_spent_minutes INTEGER,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        cm.id as module_id,
        cm.title as module_title,
        cm.description,
        cm.order_index,
        COALESCE(sp.status, 'not_started') as status,
        COALESCE(sp.progress_percentage, 0.00) as progress_percentage,
        COALESCE(sp.time_spent_minutes, 0) as time_spent_minutes,
        sp.last_accessed_at,
        sp.completed_at
    FROM public.course_modules cm
    LEFT JOIN public.student_progress sp ON cm.id = sp.module_id
    LEFT JOIN public.course_enrollments ce ON sp.course_enrollment_id = ce.id
    LEFT JOIN public.enrollments e ON ce.enrollment_id = e.id
    LEFT JOIN public.students s ON e.student_id = s.id
    WHERE cm.course_id = p_course_id
    AND (s.user_id = p_user_id OR p_user_id IS NULL)
    ORDER BY cm.order_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- STUDENT PERFORMANCE TRACKING
-- ===========================================

-- Function to calculate student GPA
CREATE OR REPLACE FUNCTION calculate_student_gpa(p_student_id INTEGER)
RETURNS DECIMAL(4,2) AS $$
DECLARE
    total_points DECIMAL(10,2) := 0;
    total_credits INTEGER := 0;
    grade_points DECIMAL(4,2);
BEGIN
    SELECT
        SUM(ce.grade_points * c.credit_hours),
        SUM(c.credit_hours)
    INTO total_points, total_credits
    FROM public.course_enrollments ce
    JOIN public.courses c ON ce.course_id = c.id
    JOIN public.enrollments e ON ce.enrollment_id = e.id
    WHERE e.student_id = p_student_id
    AND ce.status = 'completed'
    AND ce.grade_points IS NOT NULL;

    IF total_credits = 0 THEN
        RETURN 0.00;
    END IF;

    RETURN ROUND((total_points / total_credits)::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get student academic record
CREATE OR REPLACE FUNCTION get_student_academic_record(p_user_id UUID)
RETURNS TABLE (
    course_code TEXT,
    course_title TEXT,
    credit_hours INTEGER,
    grade TEXT,
    grade_points DECIMAL(4,2),
    semester TEXT,
    completion_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.code as course_code,
        c.title as course_title,
        c.credit_hours,
        ce.grade,
        ce.grade_points,
        EXTRACT(YEAR FROM ce.completion_date)::TEXT || '-' ||
        CASE
            WHEN EXTRACT(MONTH FROM ce.completion_date) <= 6 THEN '1'
            ELSE '2'
        END as semester,
        ce.completion_date
    FROM public.students s
    JOIN public.enrollments e ON s.id = e.student_id
    JOIN public.course_enrollments ce ON e.id = ce.enrollment_id
    JOIN public.courses c ON ce.course_id = c.id
    WHERE s.user_id = p_user_id
    AND ce.status = 'completed'
    ORDER BY ce.completion_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- STUDENT STATISTICS AND REPORTS
-- ===========================================

-- View for student enrollment statistics
CREATE OR REPLACE VIEW student_enrollment_stats AS
SELECT
    t.name as trade_name,
    t.code as trade_code,
    COUNT(DISTINCT s.id) as total_students,
    COUNT(DISTINCT CASE WHEN s.enrollment_status = 'enrolled' THEN s.id END) as active_students,
    COUNT(DISTINCT CASE WHEN s.enrollment_status = 'graduated' THEN s.id END) as graduated_students,
    COUNT(DISTINCT CASE WHEN s.enrollment_status = 'withdrawn' THEN s.id END) as withdrawn_students,
    ROUND(AVG(CASE WHEN e.status = 'completed' THEN e.total_fee END)::NUMERIC, 2) as avg_trade_fee,
    SUM(e.paid_amount) as total_collected
FROM public.trades t
LEFT JOIN public.enrollments e ON t.id = e.trade_id
LEFT JOIN public.students s ON e.student_id = s.id
GROUP BY t.id, t.name, t.code
ORDER BY total_students DESC;

-- View for student performance summary
CREATE OR REPLACE VIEW student_performance_summary AS
SELECT
    s.id,
    s.registration_number,
    CONCAT(s.first_name, ' ', s.last_name) as full_name,
    t.name as trade_name,
    s.enrollment_status,
    calculate_student_gpa(s.id) as gpa,
    (
        SELECT COUNT(*) FROM course_enrollments ce
        WHERE ce.enrollment_id IN (SELECT id FROM enrollments WHERE student_id = s.id)
        AND ce.status = 'completed'
    ) as completed_courses,
    (
        SELECT COUNT(*) FROM course_enrollments ce
        WHERE ce.enrollment_id IN (SELECT id FROM enrollments WHERE student_id = s.id)
    ) as total_courses,
    (
        SELECT ROUND(AVG(sp.progress_percentage)::NUMERIC, 2)
        FROM student_progress sp
        JOIN course_enrollments ce ON sp.course_enrollment_id = ce.id
        WHERE ce.enrollment_id IN (SELECT id FROM enrollments WHERE student_id = s.id)
    ) as overall_progress
FROM public.students s
LEFT JOIN public.enrollments e ON s.id = e.student_id AND e.status = 'active'
LEFT JOIN public.trades t ON e.trade_id = t.id
ORDER BY s.created_at DESC;

-- ===========================================
-- STUDENT NOTIFICATION SYSTEM
-- ===========================================

-- Function to send notification to student
CREATE OR REPLACE FUNCTION notify_student(
    p_student_id INTEGER,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT DEFAULT 'info',
    p_sender_id UUID DEFAULT NULL,
    p_action_url TEXT DEFAULT NULL,
    p_action_text TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    notification_id INTEGER;
    user_id UUID;
BEGIN
    -- Get student's user_id
    SELECT user_id INTO user_id FROM students WHERE id = p_student_id;

    -- Create notification
    INSERT INTO public.notifications (
        recipient_id,
        sender_id,
        title,
        message,
        notification_type,
        action_url,
        action_text
    ) VALUES (
        user_id,
        COALESCE(p_sender_id, p_sender_id),
        p_title,
        p_message,
        p_type,
        p_action_url,
        p_action_text
    ) RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(p_user_id UUID, p_notification_ids INTEGER[] DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    IF p_notification_ids IS NULL THEN
        -- Mark all notifications as read
        UPDATE public.notifications
        SET is_read = true
        WHERE recipient_id = p_user_id AND is_read = false;

        GET DIAGNOSTICS updated_count = ROW_COUNT;
    ELSE
        -- Mark specific notifications as read
        UPDATE public.notifications
        SET is_read = true
        WHERE recipient_id = p_user_id
        AND id = ANY(p_notification_ids)
        AND is_read = false;

        GET DIAGNOSTICS updated_count = ROW_COUNT;
    END IF;

    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- RLS POLICIES FOR STUDENTS
-- ===========================================

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Students can view their own profile
CREATE POLICY "Students can view own profile" ON public.students
    FOR SELECT USING (auth.uid() = user_id);

-- Students can update their own profile
CREATE POLICY "Students can update own profile" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);

-- Staff and admins can view all student profiles
CREATE POLICY "Staff can view all students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Staff and admins can manage student profiles
CREATE POLICY "Staff can manage students" ON public.students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Instructors can view students in their courses
CREATE POLICY "Instructors can view their students" ON public.students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.instructors i
            JOIN public.course_enrollments ce ON i.id = ce.instructor_id
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            WHERE i.user_id = auth.uid() AND e.student_id = students.id
        )
    );

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = recipient_id);

-- Notifications: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = recipient_id);

-- Notifications: System can create notifications
CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);