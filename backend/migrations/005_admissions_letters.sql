-- Admissions System and Letter Generation
-- This migration sets up the admissions process and automated letter generation

-- ===========================================
-- ADMISSIONS APPLICATION SYSTEM
-- ===========================================

-- Admissions applications table
CREATE TABLE public.admissions_applications (
    id SERIAL PRIMARY KEY,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    address JSONB,
    education_background JSONB DEFAULT '{}',
    trade_interest TEXT NOT NULL,
    previous_experience TEXT,
    motivation_statement TEXT,
    special_needs TEXT,
    emergency_contact JSONB,
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'under_review', 'approved', 'rejected', 'waitlisted')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id),
    decision_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admission letters table
CREATE TABLE public.admission_letters (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES public.admissions_applications(id),
    student_id INTEGER REFERENCES public.students(id),
    letter_type TEXT NOT NULL CHECK (letter_type IN ('acceptance', 'rejection', 'waitlist', 'conditional_acceptance')),
    letter_content TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    sent_by UUID REFERENCES public.profiles(id),
    delivery_method TEXT DEFAULT 'email' CHECK (delivery_method IN ('email', 'physical', 'both')),
    tracking_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- ADMISSIONS APPLICATION FUNCTIONS
-- ===========================================

-- Function to submit admissions application
CREATE OR REPLACE FUNCTION submit_admissions_application(
    p_applicant_name TEXT,
    p_applicant_email TEXT,
    p_phone TEXT,
    p_date_of_birth DATE,
    p_address JSONB,
    p_education_background JSONB,
    p_trade_interest TEXT,
    p_previous_experience TEXT,
    p_motivation_statement TEXT,
    p_special_needs TEXT,
    p_emergency_contact JSONB
)
RETURNS INTEGER AS $$
DECLARE
    application_id INTEGER;
BEGIN
    -- Validate trade exists
    IF NOT EXISTS (SELECT 1 FROM trades WHERE code = p_trade_interest AND is_active = true) THEN
        RAISE EXCEPTION 'Invalid trade code: %', p_trade_interest;
    END IF;

    -- Create application
    INSERT INTO public.admissions_applications (
        applicant_name,
        applicant_email,
        phone,
        date_of_birth,
        address,
        education_background,
        trade_interest,
        previous_experience,
        motivation_statement,
        special_needs,
        emergency_contact
    ) VALUES (
        p_applicant_name,
        p_applicant_email,
        p_phone,
        p_date_of_birth,
        p_address,
        p_education_background,
        p_trade_interest,
        p_previous_experience,
        p_motivation_statement,
        p_special_needs,
        p_emergency_contact
    ) RETURNING id INTO application_id;

    -- Log the application
    INSERT INTO public.activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        auth.uid(),
        'submit_admissions_application',
        'admissions_application',
        application_id::TEXT,
        jsonb_build_object(
            'applicant_email', p_applicant_email,
            'trade_interest', p_trade_interest
        )
    );

    RETURN application_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to review admissions application
CREATE OR REPLACE FUNCTION review_admissions_application(
    p_application_id INTEGER,
    p_status TEXT,
    p_decision_notes TEXT,
    p_reviewed_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    old_status TEXT;
BEGIN
    -- Get current status
    SELECT application_status INTO old_status
    FROM public.admissions_applications
    WHERE id = p_application_id;

    -- Update application
    UPDATE public.admissions_applications SET
        application_status = p_status,
        reviewed_at = NOW(),
        reviewed_by = p_reviewed_by,
        decision_notes = p_decision_notes,
        updated_at = NOW()
    WHERE id = p_application_id;

    -- Log the review
    INSERT INTO public.activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        p_reviewed_by,
        'review_admissions_application',
        'admissions_application',
        p_application_id::TEXT,
        jsonb_build_object(
            'old_status', old_status,
            'new_status', p_status,
            'decision_notes', p_decision_notes
        )
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- ADMISSION LETTER GENERATION
-- ===========================================

-- Function to generate admission letter
CREATE OR REPLACE FUNCTION generate_admission_letter(
    p_application_id INTEGER,
    p_letter_type TEXT,
    p_generated_by UUID
)
RETURNS INTEGER AS $$
DECLARE
    letter_id INTEGER;
    letter_content TEXT;
    applicant_data RECORD;
BEGIN
    -- Get application data
    SELECT * INTO applicant_data
    FROM public.admissions_applications
    WHERE id = p_application_id;

    IF applicant_data IS NULL THEN
        RAISE EXCEPTION 'Application not found';
    END IF;

    -- Generate letter content based on type
    letter_content := generate_letter_content(applicant_data, p_letter_type);

    -- Create letter record
    INSERT INTO public.admission_letters (
        application_id,
        letter_type,
        letter_content,
        sent_by
    ) VALUES (
        p_application_id,
        p_letter_type,
        letter_content,
        p_generated_by
    ) RETURNING id INTO letter_id;

    -- Log the generation
    INSERT INTO public.activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details
    ) VALUES (
        p_generated_by,
        'generate_admission_letter',
        'admission_letter',
        letter_id::TEXT,
        jsonb_build_object(
            'application_id', p_application_id,
            'letter_type', p_letter_type
        )
    );

    RETURN letter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate letter content
CREATE OR REPLACE FUNCTION generate_letter_content(
    p_application RECORD,
    p_letter_type TEXT
)
RETURNS TEXT AS $$
DECLARE
    letter_content TEXT;
    trade_info RECORD;
BEGIN
    -- Get trade information
    SELECT name, duration_months, tuition_fee INTO trade_info
    FROM trades WHERE code = p_application.trade_interest;

    -- Generate letter based on type
    CASE p_letter_type
        WHEN 'acceptance' THEN
            letter_content := format_admission_acceptance_letter(p_application, trade_info);
        WHEN 'rejection' THEN
            letter_content := format_admission_rejection_letter(p_application);
        WHEN 'waitlist' THEN
            letter_content := format_admission_waitlist_letter(p_application, trade_info);
        WHEN 'conditional_acceptance' THEN
            letter_content := format_conditional_acceptance_letter(p_application, trade_info);
        ELSE
            RAISE EXCEPTION 'Invalid letter type: %', p_letter_type;
    END CASE;

    RETURN letter_content;
END;
$$ LANGUAGE plpgsql;

-- Function to format acceptance letter
CREATE OR REPLACE FUNCTION format_admission_acceptance_letter(
    p_application RECORD,
    p_trade_info RECORD
)
RETURNS TEXT AS $$
DECLARE
    letter TEXT;
BEGIN
    letter := format(
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">' ||
        '<div style="text-align: center; margin-bottom: 30px;">' ||
        '<img src="/assets/logo.png" alt="Brainstorm Skills Logo" style="max-width: 150px; height: auto;">' ||
        '<h1 style="color: #00856f; margin: 20px 0;">Brainstorm Skills Technical Institute</h1>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p style="font-size: 14px; color: #666;">%s</p>' ||
        '<p style="font-size: 14px; color: #666;">Date: %s</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>Dear %s,</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h2 style="color: #00856f;">Congratulations! Admission Accepted</h2>' ||
        '<p>We are pleased to inform you that your application for admission to Brainstorm Skills Technical Institute has been accepted. You have been admitted to the <strong>%s</strong> program.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h3 style="color: #00856f;">Program Details:</h3>' ||
        '<ul>' ||
        '<li><strong>Program:</strong> %s</li>' ||
        '<li><strong>Duration:</strong> %s months</li>' ||
        '<li><strong>Tuition Fee:</strong> KES %s</li>' ||
        '</ul>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h3 style="color: #00856f;">Next Steps:</h3>' ||
        '<ol>' ||
        '<li>Complete your registration within 14 days of receiving this letter</li>' ||
        '<li>Submit required documents (ID, certificates, medical report)</li>' ||
        '<li>Pay the initial deposit of KES 10,000</li>' ||
        '<li>Attend the orientation session on [Date to be announced]</li>' ||
        '</ol>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>For any questions or concerns, please contact our admissions office at admissions@brainstormskills.com or call +254 XXX XXX XXX.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>We look forward to welcoming you to Brainstorm Skills Technical Institute and supporting your journey towards a successful career in technology.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p>Best regards,</p>' ||
        '<p><strong>Dr. Sarah Johnson</strong><br>' ||
        'Director of Admissions<br>' ||
        'Brainstorm Skills Technical Institute</p>' ||
        '</div>' ||

        '<div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666;">' ||
        '<p>This is an official admission letter from Brainstorm Skills Technical Institute. Please keep this letter for your records.</p>' ||
        '</div>' ||
        '</div>',
        'Brainstorm Skills Technical Institute, Nairobi, Kenya',
        TO_CHAR(CURRENT_DATE, 'Month DD, YYYY'),
        p_application.applicant_name,
        p_trade_info.name,
        p_trade_info.name,
        p_trade_info.duration_months,
        TO_CHAR(p_trade_info.tuition_fee, 'FM999,999,999')
    );

    RETURN letter;
END;
$$ LANGUAGE plpgsql;

-- Function to format rejection letter
CREATE OR REPLACE FUNCTION format_admission_rejection_letter(p_application RECORD)
RETURNS TEXT AS $$
DECLARE
    letter TEXT;
BEGIN
    letter := format(
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">' ||
        '<div style="text-align: center; margin-bottom: 30px;">' ||
        '<img src="/assets/logo.png" alt="Brainstorm Skills Logo" style="max-width: 150px; height: auto;">' ||
        '<h1 style="color: #00856f; margin: 20px 0;">Brainstorm Skills Technical Institute</h1>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p style="font-size: 14px; color: #666;">%s</p>' ||
        '<p style="font-size: 14px; color: #666;">Date: %s</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>Dear %s,</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>Thank you for your interest in Brainstorm Skills Technical Institute and for submitting your application for admission.</p>' ||
        '<p>After careful review of your application, we regret to inform you that we are unable to offer you admission to our programs at this time.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>We received a large number of qualified applications this year, and admission decisions were very competitive. While we cannot offer you admission for the current intake, we encourage you to consider reapplying for future intakes.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>For any questions or to discuss your application further, please contact our admissions office at admissions@brainstormskills.com or call +254 XXX XXX XXX.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p>Thank you again for your interest in Brainstorm Skills Technical Institute. We wish you the best in your future endeavors.</p>' ||
        '<p>Best regards,</p>' ||
        '<p><strong>Dr. Sarah Johnson</strong><br>' ||
        'Director of Admissions<br>' ||
        'Brainstorm Skills Technical Institute</p>' ||
        '</div>' ||

        '<div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666;">' ||
        '<p>This is an official communication from Brainstorm Skills Technical Institute.</p>' ||
        '</div>' ||
        '</div>',
        'Brainstorm Skills Technical Institute, Nairobi, Kenya',
        TO_CHAR(CURRENT_DATE, 'Month DD, YYYY'),
        p_application.applicant_name
    );

    RETURN letter;
END;
$$ LANGUAGE plpgsql;

-- Function to format waitlist letter
CREATE OR REPLACE FUNCTION format_admission_waitlist_letter(
    p_application RECORD,
    p_trade_info RECORD
)
RETURNS TEXT AS $$
DECLARE
    letter TEXT;
BEGIN
    letter := format(
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">' ||
        '<div style="text-align: center; margin-bottom: 30px;">' ||
        '<img src="/assets/logo.png" alt="Brainstorm Skills Logo" style="max-width: 150px; height: auto;">' ||
        '<h1 style="color: #00856f; margin: 20px 0;">Brainstorm Skills Technical Institute</h1>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p style="font-size: 14px; color: #666;">%s</p>' ||
        '<p style="font-size: 14px; color: #666;">Date: %s</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>Dear %s,</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h2 style="color: #00856f;">Admission Waitlist Notification</h2>' ||
        '<p>Thank you for your application to Brainstorm Skills Technical Institute. We are pleased to inform you that your application for the <strong>%s</strong> program has been placed on our waitlist.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>This means that while we were unable to offer you immediate admission due to the competitive nature of our admissions process, you remain under consideration for any available spaces that may open up.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h3 style="color: #00856f;">What happens next?</h3>' ||
        '<ul>' ||
        '<li>We will contact you if a space becomes available</li>' ||
        '<li>You may be offered admission at any time before the program starts</li>' ||
        '<li>If you are offered admission, you will have 7 days to accept</li>' ||
        '</ul>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>For any questions, please contact our admissions office at admissions@brainstormskills.com or call +254 XXX XXX XXX.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p>Thank you for your interest in Brainstorm Skills Technical Institute.</p>' ||
        '<p>Best regards,</p>' ||
        '<p><strong>Dr. Sarah Johnson</strong><br>' ||
        'Director of Admissions<br>' ||
        'Brainstorm Skills Technical Institute</p>' ||
        '</div>' ||

        '<div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666;">' ||
        '<p>This is an official communication from Brainstorm Skills Technical Institute.</p>' ||
        '</div>' ||
        '</div>',
        'Brainstorm Skills Technical Institute, Nairobi, Kenya',
        TO_CHAR(CURRENT_DATE, 'Month DD, YYYY'),
        p_application.applicant_name,
        p_trade_info.name
    );

    RETURN letter;
END;
$$ LANGUAGE plpgsql;

-- Function to format conditional acceptance letter
CREATE OR REPLACE FUNCTION format_conditional_acceptance_letter(
    p_application RECORD,
    p_trade_info RECORD
)
RETURNS TEXT AS $$
DECLARE
    letter TEXT;
BEGIN
    letter := format(
        '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">' ||
        '<div style="text-align: center; margin-bottom: 30px;">' ||
        '<img src="/assets/logo.png" alt="Brainstorm Skills Logo" style="max-width: 150px; height: auto;">' ||
        '<h1 style="color: #00856f; margin: 20px 0;">Brainstorm Skills Technical Institute</h1>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p style="font-size: 14px; color: #666;">%s</p>' ||
        '<p style="font-size: 14px; color: #666;">Date: %s</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>Dear %s,</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h2 style="color: #00856f;">Conditional Admission Offer</h2>' ||
        '<p>We are pleased to offer you conditional admission to Brainstorm Skills Technical Institute for the <strong>%s</strong> program.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<h3 style="color: #00856f;">Conditions for Admission:</h3>' ||
        '<ul>' ||
        '<li>Submit all required documents within 14 days</li>' ||
        '<li>Complete the entrance assessment with a minimum score of 60%%</li>' ||
        '<li>Pay the admission deposit of KES 5,000</li>' ||
        '<li>Attend the mandatory pre-admission interview</li>' ||
        '</ul>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>Once all conditions are met, your conditional admission will be converted to full admission status.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 20px;">' ||
        '<p>For any questions, please contact our admissions office at admissions@brainstormskills.com or call +254 XXX XXX XXX.</p>' ||
        '</div>' ||

        '<div style="margin-bottom: 30px;">' ||
        '<p>We look forward to welcoming you to our institution.</p>' ||
        '<p>Best regards,</p>' ||
        '<p><strong>Dr. Sarah Johnson</strong><br>' ||
        'Director of Admissions<br>' ||
        'Brainstorm Skills Technical Institute</p>' ||
        '</div>' ||

        '<div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #666;">' ||
        '<p>This is an official conditional admission offer from Brainstorm Skills Technical Institute.</p>' ||
        '</div>' ||
        '</div>',
        'Brainstorm Skills Technical Institute, Nairobi, Kenya',
        TO_CHAR(CURRENT_DATE, 'Month DD, YYYY'),
        p_application.applicant_name,
        p_trade_info.name
    );

    RETURN letter;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- ADMISSIONS DASHBOARD FUNCTIONS
-- ===========================================

-- Function to get admissions statistics
CREATE OR REPLACE FUNCTION get_admissions_stats(p_date_from DATE DEFAULT NULL, p_date_to DATE DEFAULT NULL)
RETURNS TABLE (
    total_applications INTEGER,
    pending_review INTEGER,
    approved INTEGER,
    rejected INTEGER,
    waitlisted INTEGER,
    conversion_rate DECIMAL(5,2)
) AS $$
DECLARE
    date_filter TEXT := '';
BEGIN
    IF p_date_from IS NOT NULL AND p_date_to IS NOT NULL THEN
        date_filter := format(' AND submitted_at BETWEEN %L AND %L', p_date_from, p_date_to);
    END IF;

    RETURN QUERY EXECUTE format(
        'SELECT
            COUNT(*) as total_applications,
            COUNT(CASE WHEN application_status = ''pending'' THEN 1 END) as pending_review,
            COUNT(CASE WHEN application_status = ''approved'' THEN 1 END) as approved,
            COUNT(CASE WHEN application_status = ''rejected'' THEN 1 END) as rejected,
            COUNT(CASE WHEN application_status = ''waitlisted'' THEN 1 END) as waitlisted,
            ROUND(
                (COUNT(CASE WHEN application_status = ''approved'' THEN 1 END)::DECIMAL /
                 NULLIF(COUNT(CASE WHEN application_status IN (''approved'', ''rejected'') THEN 1 END), 0)) * 100,
                2
            ) as conversion_rate
        FROM public.admissions_applications
        WHERE 1=1 %s',
        date_filter
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get applications by trade
CREATE OR REPLACE FUNCTION get_applications_by_trade()
RETURNS TABLE (
    trade_code TEXT,
    trade_name TEXT,
    total_applications INTEGER,
    approved INTEGER,
    rejected INTEGER,
    pending INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.code as trade_code,
        t.name as trade_name,
        COUNT(aa.id) as total_applications,
        COUNT(CASE WHEN aa.application_status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN aa.application_status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN aa.application_status = 'pending' THEN 1 END) as pending
    FROM public.trades t
    LEFT JOIN public.admissions_applications aa ON t.code = aa.trade_interest
    WHERE t.is_active = true
    GROUP BY t.code, t.name
    ORDER BY total_applications DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- ADMISSIONS WORKFLOW AUTOMATION
-- ===========================================

-- Function to process bulk admissions decisions
CREATE OR REPLACE FUNCTION process_bulk_admissions(
    p_application_ids INTEGER[],
    p_decision TEXT,
    p_decision_notes TEXT,
    p_processed_by UUID
)
RETURNS INTEGER AS $$
DECLARE
    processed_count INTEGER := 0;
    app_id INTEGER;
BEGIN
    FOREACH app_id IN ARRAY p_application_ids LOOP
        -- Process each application
        PERFORM review_admissions_application(app_id, p_decision, p_decision_notes, p_processed_by);

        -- Generate letter for approved/rejected applications
        IF p_decision IN ('approved', 'rejected', 'waitlisted') THEN
            PERFORM generate_admission_letter(app_id, p_decision, p_processed_by);
        END IF;

        processed_count := processed_count + 1;
    END LOOP;

    RETURN processed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- RLS POLICIES FOR ADMISSIONS
-- ===========================================

-- Enable RLS
ALTER TABLE public.admissions_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_letters ENABLE ROW LEVEL SECURITY;

-- Admissions applications: Public can create applications
CREATE POLICY "Public can create admissions applications" ON public.admissions_applications
    FOR INSERT WITH CHECK (true);

-- Admissions applications: Applicants can view their own applications
CREATE POLICY "Applicants can view own applications" ON public.admissions_applications
    FOR SELECT USING (applicant_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Admissions applications: Staff can view all applications
CREATE POLICY "Staff can view all admissions applications" ON public.admissions_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Admissions applications: Staff can update applications
CREATE POLICY "Staff can update admissions applications" ON public.admissions_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Admission letters: Staff can view all letters
CREATE POLICY "Staff can view all admission letters" ON public.admission_letters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Admission letters: Staff can create letters
CREATE POLICY "Staff can create admission letters" ON public.admission_letters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Admission letters: Staff can update letters
CREATE POLICY "Staff can update admission letters" ON public.admission_letters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );