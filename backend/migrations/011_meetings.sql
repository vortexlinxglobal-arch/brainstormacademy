-- Create meetings table and security policy for Brainstorm Academy

CREATE TABLE public.meetings (
    id SERIAL PRIMARY KEY,
    topic TEXT NOT NULL,
    agenda TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    location TEXT NOT NULL,
    participants TEXT NOT NULL,
    minutes TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view meetings" ON public.meetings
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage meetings" ON public.meetings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );
