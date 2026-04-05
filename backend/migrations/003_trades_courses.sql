-- Trades and Courses Management
-- This migration sets up the academic structure and course management

-- ===========================================
-- TRADE MANAGEMENT FUNCTIONS
-- ===========================================

-- Function to create a new trade
CREATE OR REPLACE FUNCTION create_trade(
    p_created_by UUID,
    p_category_code TEXT,
    p_code TEXT,
    p_name TEXT,
    p_description TEXT,
    p_duration_months INTEGER,
    p_tuition_fee DECIMAL(10,2),
    p_prerequisites JSONB DEFAULT '[]',
    p_curriculum JSONB DEFAULT '{}'
)
RETURNS INTEGER AS $$
DECLARE
    category_id INTEGER;
    trade_id INTEGER;
BEGIN
    -- Get category ID
    SELECT id INTO category_id FROM trade_categories WHERE code = p_category_code;
    IF category_id IS NULL THEN
        RAISE EXCEPTION 'Invalid trade category code: %', p_category_code;
    END IF;

    -- Create trade
    INSERT INTO public.trades (
        category_id,
        code,
        name,
        description,
        duration_months,
        tuition_fee,
        prerequisites,
        curriculum
    ) VALUES (
        category_id,
        p_code,
        p_name,
        p_description,
        p_duration_months,
        p_tuition_fee,
        p_prerequisites,
        p_curriculum
    ) RETURNING id INTO trade_id;

    -- Log the creation
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_created_by,
        'create_trade',
        'trade',
        trade_id::TEXT,
        jsonb_build_object('trade_code', p_code, 'trade_name', p_name)
    );

    RETURN trade_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update trade information
CREATE OR REPLACE FUNCTION update_trade(
    p_updated_by UUID,
    p_trade_id INTEGER,
    p_name TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_duration_months INTEGER DEFAULT NULL,
    p_tuition_fee DECIMAL(10,2) DEFAULT NULL,
    p_prerequisites JSONB DEFAULT NULL,
    p_curriculum JSONB DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    old_data JSONB;
BEGIN
    -- Get current data for logging
    SELECT jsonb_build_object(
        'name', name,
        'description', description,
        'duration_months', duration_months,
        'tuition_fee', tuition_fee,
        'prerequisites', prerequisites,
        'curriculum', curriculum,
        'is_active', is_active
    ) INTO old_data
    FROM public.trades WHERE id = p_trade_id;

    -- Update trade
    UPDATE public.trades SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        duration_months = COALESCE(p_duration_months, duration_months),
        tuition_fee = COALESCE(p_tuition_fee, tuition_fee),
        prerequisites = COALESCE(p_prerequisites, prerequisites),
        curriculum = COALESCE(p_curriculum, curriculum),
        is_active = COALESCE(p_is_active, is_active)
    WHERE id = p_trade_id;

    -- Log the update
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_updated_by,
        'update_trade',
        'trade',
        p_trade_id::TEXT,
        jsonb_build_object('old_data', old_data, 'updated_fields', jsonb_build_object(
            'name', p_name IS NOT NULL,
            'description', p_description IS NOT NULL,
            'duration_months', p_duration_months IS NOT NULL,
            'tuition_fee', p_tuition_fee IS NOT NULL,
            'prerequisites', p_prerequisites IS NOT NULL,
            'curriculum', p_curriculum IS NOT NULL,
            'is_active', p_is_active IS NOT NULL
        ))
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- COURSE MANAGEMENT FUNCTIONS
-- ===========================================

-- Function to create a new course
CREATE OR REPLACE FUNCTION create_course(
    p_created_by UUID,
    p_trade_code TEXT,
    p_code TEXT,
    p_title TEXT,
    p_description TEXT,
    p_instructor_id INTEGER,
    p_duration_hours INTEGER,
    p_course_fee DECIMAL(8,2),
    p_credit_hours INTEGER DEFAULT 1,
    p_materials JSONB DEFAULT '[]',
    p_prerequisites JSONB DEFAULT '[]'
)
RETURNS INTEGER AS $$
DECLARE
    trade_id INTEGER;
    course_id INTEGER;
BEGIN
    -- Get trade ID
    SELECT id INTO trade_id FROM trades WHERE code = p_trade_code;
    IF trade_id IS NULL THEN
        RAISE EXCEPTION 'Invalid trade code: %', p_trade_code;
    END IF;

    -- Create course
    INSERT INTO public.courses (
        trade_id,
        code,
        title,
        description,
        instructor_id,
        duration_hours,
        credit_hours,
        course_fee,
        materials,
        prerequisites
    ) VALUES (
        trade_id,
        p_code,
        p_title,
        p_description,
        p_instructor_id,
        p_duration_hours,
        p_credit_hours,
        p_course_fee,
        p_materials,
        p_prerequisites
    ) RETURNING id INTO course_id;

    -- Log the creation
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_created_by,
        'create_course',
        'course',
        course_id::TEXT,
        jsonb_build_object('course_code', p_code, 'course_title', p_title, 'trade_code', p_trade_code)
    );

    RETURN course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add course module
CREATE OR REPLACE FUNCTION add_course_module(
    p_created_by UUID,
    p_course_code TEXT,
    p_title TEXT,
    p_description TEXT,
    p_order_index INTEGER,
    p_duration_hours INTEGER,
    p_content JSONB DEFAULT '{}'
)
RETURNS INTEGER AS $$
DECLARE
    course_id INTEGER;
    module_id INTEGER;
BEGIN
    -- Get course ID
    SELECT id INTO course_id FROM courses WHERE code = p_course_code;
    IF course_id IS NULL THEN
        RAISE EXCEPTION 'Invalid course code: %', p_course_code;
    END IF;

    -- Add module
    INSERT INTO public.course_modules (
        course_id,
        title,
        description,
        order_index,
        content,
        duration_hours
    ) VALUES (
        course_id,
        p_title,
        p_description,
        p_order_index,
        p_content,
        p_duration_hours
    ) RETURNING id INTO module_id;

    -- Log the creation
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_created_by,
        'add_course_module',
        'course_module',
        module_id::TEXT,
        jsonb_build_object('course_code', p_course_code, 'module_title', p_title)
    );

    RETURN module_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- COURSE CATALOG VIEWS
-- ===========================================

-- View for complete course catalog
CREATE OR REPLACE VIEW course_catalog AS
SELECT
    c.id,
    c.code,
    c.title,
    c.description,
    t.name as trade_name,
    t.code as trade_code,
    tc.name as category_name,
    tc.code as category_code,
    c.instructor_id,
    c.duration_hours,
    c.credit_hours,
    c.course_fee,
    c.materials,
    c.prerequisites,
    c.is_active,
    c.created_at,
    (
        SELECT COUNT(*) FROM course_modules cm WHERE cm.course_id = c.id
    ) as module_count,
    (
        SELECT COUNT(*) FROM course_enrollments ce WHERE ce.course_id = c.id AND ce.status = 'completed'
    ) as completed_enrollments
FROM public.courses c
JOIN public.trades t ON c.trade_id = t.id
JOIN public.trade_categories tc ON t.category_id = tc.id
WHERE c.is_active = true;

-- View for trade catalog with course counts
CREATE OR REPLACE VIEW trade_catalog AS
SELECT
    t.id,
    t.code,
    t.name,
    t.description,
    tc.name as category_name,
    tc.code as category_code,
    tc.color_code,
    t.duration_months,
    t.certification_type,
    t.tuition_fee,
    t.prerequisites,
    t.curriculum,
    t.is_active,
    t.created_at,
    (
        SELECT COUNT(*) FROM courses c WHERE c.trade_id = t.id AND c.is_active = true
    ) as course_count,
    (
        SELECT COUNT(*) FROM enrollments e WHERE e.trade_id = t.id AND e.status = 'active'
    ) as active_enrollments,
    (
        SELECT COUNT(*) FROM enrollments e WHERE e.trade_id = t.id AND e.status = 'completed'
    ) as completed_enrollments
FROM public.trades t
JOIN public.trade_categories tc ON t.category_id = tc.id
WHERE t.is_active = true;

-- ===========================================
-- STUDENT ENROLLMENT FUNCTIONS
-- ===========================================

-- Function to enroll student in trade
CREATE OR REPLACE FUNCTION enroll_student_in_trade(
    p_enrolled_by UUID,
    p_student_id INTEGER,
    p_trade_code TEXT
)
RETURNS INTEGER AS $$
DECLARE
    trade_id INTEGER;
    enrollment_id INTEGER;
    trade_fee DECIMAL(10,2);
    expected_completion DATE;
BEGIN
    -- Get trade details
    SELECT id, tuition_fee, duration_months INTO trade_id, trade_fee, expected_completion
    FROM trades WHERE code = p_trade_code AND is_active = true;

    IF trade_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive trade code: %', p_trade_code;
    END IF;

    -- Calculate expected completion date
    expected_completion := CURRENT_DATE + INTERVAL '1 month' * duration_months;

    -- Create enrollment
    INSERT INTO public.enrollments (
        student_id,
        trade_id,
        expected_completion_date,
        total_fee,
        payment_status
    ) VALUES (
        p_student_id,
        trade_id,
        expected_completion,
        trade_fee,
        CASE WHEN trade_fee = 0 THEN 'paid' ELSE 'pending' END
    ) RETURNING id INTO enrollment_id;

    -- Log the enrollment
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_enrolled_by,
        'enroll_student_trade',
        'enrollment',
        enrollment_id::TEXT,
        jsonb_build_object('student_id', p_student_id, 'trade_code', p_trade_code)
    );

    RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to enroll student in course
CREATE OR REPLACE FUNCTION enroll_student_in_course(
    p_enrolled_by UUID,
    p_enrollment_id INTEGER,
    p_course_code TEXT
)
RETURNS INTEGER AS $$
DECLARE
    course_id INTEGER;
    instructor_id INTEGER;
    course_enrollment_id INTEGER;
BEGIN
    -- Get course details
    SELECT id, instructor_id INTO course_id, instructor_id
    FROM courses WHERE code = p_course_code AND is_active = true;

    IF course_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive course code: %', p_course_code;
    END IF;

    -- Create course enrollment
    INSERT INTO public.course_enrollments (
        enrollment_id,
        course_id,
        instructor_id,
        status
    ) VALUES (
        p_enrollment_id,
        course_id,
        instructor_id,
        'enrolled'
    ) RETURNING id INTO course_enrollment_id;

    -- Create progress records for all modules
    INSERT INTO public.student_progress (course_enrollment_id, module_id, status)
    SELECT course_enrollment_id, cm.id, 'not_started'
    FROM course_modules cm
    WHERE cm.course_id = course_id
    ORDER BY cm.order_index;

    -- Log the enrollment
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (
        p_enrolled_by,
        'enroll_student_course',
        'course_enrollment',
        course_enrollment_id::TEXT,
        jsonb_build_object('enrollment_id', p_enrollment_id, 'course_code', p_course_code)
    );

    RETURN course_enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- PROGRESS TRACKING FUNCTIONS
-- ===========================================

-- Function to update student progress
CREATE OR REPLACE FUNCTION update_student_progress(
    p_course_enrollment_id INTEGER,
    p_module_id INTEGER,
    p_progress_percentage DECIMAL(5,2),
    p_status TEXT DEFAULT NULL,
    p_time_spent INTEGER DEFAULT 0
)
RETURNS BOOLEAN AS $$
DECLARE
    current_status TEXT;
BEGIN
    -- Get current status
    SELECT status INTO current_status
    FROM public.student_progress
    WHERE course_enrollment_id = p_course_enrollment_id AND module_id = p_module_id;

    -- Update progress
    UPDATE public.student_progress SET
        progress_percentage = p_progress_percentage,
        status = COALESCE(p_status, status),
        time_spent_minutes = COALESCE(p_time_spent, time_spent_minutes, 0) + COALESCE(p_time_spent, 0),
        last_accessed_at = NOW(),
        completed_at = CASE
            WHEN p_progress_percentage = 100.00 THEN NOW()
            ELSE completed_at
        END
    WHERE course_enrollment_id = p_course_enrollment_id AND module_id = p_module_id;

    -- Update course enrollment status if all modules completed
    IF p_progress_percentage = 100.00 THEN
        -- Check if all modules in this course are completed
        IF NOT EXISTS (
            SELECT 1 FROM student_progress sp
            JOIN course_modules cm ON sp.module_id = cm.id
            WHERE sp.course_enrollment_id = p_course_enrollment_id
            AND cm.course_id = (SELECT course_id FROM course_enrollments WHERE id = p_course_enrollment_id)
            AND sp.status != 'completed'
        ) THEN
            UPDATE public.course_enrollments
            SET status = 'completed', completion_date = NOW()
            WHERE id = p_course_enrollment_id;
        END IF;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get student progress summary
CREATE OR REPLACE FUNCTION get_student_progress_summary(p_student_id INTEGER)
RETURNS TABLE (
    trade_name TEXT,
    course_title TEXT,
    overall_progress DECIMAL(5,2),
    completed_modules INTEGER,
    total_modules INTEGER,
    status TEXT,
    enrollment_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.name as trade_name,
        c.title as course_title,
        ROUND(AVG(sp.progress_percentage)::NUMERIC, 2) as overall_progress,
        COUNT(CASE WHEN sp.status = 'completed' THEN 1 END) as completed_modules,
        COUNT(*) as total_modules,
        ce.status,
        ce.enrollment_date
    FROM public.students s
    JOIN public.enrollments e ON s.id = e.student_id
    JOIN public.trades t ON e.trade_id = t.id
    JOIN public.course_enrollments ce ON e.id = ce.enrollment_id
    JOIN public.courses c ON ce.course_id = c.id
    JOIN public.student_progress sp ON ce.id = sp.course_enrollment_id
    WHERE s.id = p_student_id
    GROUP BY t.name, c.title, ce.status, ce.enrollment_date, ce.id
    ORDER BY ce.enrollment_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- SAMPLE COURSES AND MODULES
-- ===========================================

-- Insert sample courses for existing trades
INSERT INTO public.courses (trade_id, code, title, description, instructor_id, duration_hours, credit_hours, course_fee, materials, prerequisites) VALUES
(1, 'WEB101', 'HTML & CSS Fundamentals', 'Learn the basics of web development with HTML and CSS', NULL, 40, 3, 15000.00, '["Laptop", "Text Editor"]', '[]'),
(1, 'WEB102', 'JavaScript Programming', 'Introduction to JavaScript programming language', NULL, 60, 4, 20000.00, '["Laptop", "Node.js"]', '["WEB101"]'),
(1, 'WEB103', 'React Development', 'Modern frontend development with React', NULL, 80, 5, 25000.00, '["Laptop", "Node.js", "Git"]', '["WEB102"]'),
(2, 'DS101', 'Python for Data Science', 'Python programming for data analysis', NULL, 50, 3, 18000.00, '["Laptop", "Python", "Jupyter"]', '[]'),
(2, 'DS102', 'Data Analysis with Pandas', 'Data manipulation and analysis using Pandas', NULL, 40, 3, 15000.00, '["Laptop", "Python", "Anaconda"]', '["DS101"]'),
(3, 'ELEC101', 'Basic Electrical Theory', 'Fundamentals of electrical systems and safety', NULL, 30, 2, 12000.00, '["Multimeter", "Safety Equipment"]', '[]'),
(3, 'ELEC102', 'Residential Wiring', 'Installation and maintenance of residential electrical systems', NULL, 60, 4, 20000.00, '["Tools", "Wire", "Safety Equipment"]', '["ELEC101"]');

-- Insert sample modules for courses
INSERT INTO public.course_modules (course_id, title, description, order_index, content, duration_hours) VALUES
(1, 'Introduction to HTML', 'Basic HTML structure and elements', 1, '{"type": "video", "url": "/materials/html-intro.mp4"}', 4),
(1, 'CSS Styling', 'Cascading Style Sheets fundamentals', 2, '{"type": "interactive", "url": "/materials/css-basics.html"}', 6),
(1, 'Responsive Design', 'Creating mobile-friendly websites', 3, '{"type": "project", "url": "/materials/responsive-project.html"}', 8),
(2, 'JavaScript Basics', 'Variables, functions, and control structures', 1, '{"type": "video", "url": "/materials/js-basics.mp4"}', 6),
(2, 'DOM Manipulation', 'Interacting with the Document Object Model', 2, '{"type": "interactive", "url": "/materials/dom-exercises.html"}', 8),
(2, 'Event Handling', 'Working with user interactions', 3, '{"type": "project", "url": "/materials/event-project.html"}', 10);

-- ===========================================
-- RLS POLICIES FOR TRADES AND COURSES
-- ===========================================

-- Enable RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Trades: Public can view active trades
CREATE POLICY "Public can view active trades" ON public.trades
    FOR SELECT USING (is_active = true);

-- Trades: Staff and instructors can view all trades
CREATE POLICY "Staff can view all trades" ON public.trades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'instructor', 'admin')
        )
    );

-- Trades: Staff can manage trades
CREATE POLICY "Staff can manage trades" ON public.trades
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Courses: Public can view active courses
CREATE POLICY "Public can view active courses" ON public.courses
    FOR SELECT USING (is_active = true);

-- Courses: Staff and instructors can manage courses
CREATE POLICY "Staff can manage courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Enrollments: Students can view their own enrollments
CREATE POLICY "Students can view own enrollments" ON public.enrollments
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM public.students WHERE user_id = auth.uid()
        )
    );

-- Enrollments: Staff can view all enrollments
CREATE POLICY "Staff can view all enrollments" ON public.enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Course Enrollments: Students can view their own
CREATE POLICY "Students can view own course enrollments" ON public.course_enrollments
    FOR SELECT USING (
        enrollment_id IN (
            SELECT e.id FROM public.enrollments e
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );

-- Student Progress: Students can view/update their own progress
CREATE POLICY "Students can manage own progress" ON public.student_progress
    FOR ALL USING (
        course_enrollment_id IN (
            SELECT ce.id FROM public.course_enrollments ce
            JOIN public.enrollments e ON ce.enrollment_id = e.id
            JOIN public.students s ON e.student_id = s.id
            WHERE s.user_id = auth.uid()
        )
    );