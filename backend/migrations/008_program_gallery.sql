-- Program Gallery and Recent Programs
-- This migration sets up the program gallery table for managing recent/featured programs

CREATE TABLE IF NOT EXISTS public.program_gallery (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on display_order for efficient sorting
CREATE INDEX IF NOT EXISTS idx_program_gallery_display_order 
    ON public.program_gallery(display_order ASC) 
    WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.program_gallery ENABLE ROW LEVEL SECURITY;

-- Public read policy (everyone can view active programs)
DROP POLICY IF EXISTS "Allow public read access to program gallery" ON public.program_gallery;
CREATE POLICY "Allow public read access to program gallery"
    ON public.program_gallery
    FOR SELECT
    USING (is_active = true);

-- Admin-only insert/update/delete
DROP POLICY IF EXISTS "Allow admins to manage program gallery" ON public.program_gallery;
CREATE POLICY "Allow admins to manage program gallery"
    ON public.program_gallery
    FOR ALL
    USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.role IN ('admin', 'super_admin')
        )
    );

-- Insert sample data
INSERT INTO public.program_gallery (title, category, image_url, description, display_order) VALUES
    ('Woodwork & Craftsmanship', 'Creative Trade', '/images/gallery/painting-1.jpg', 'Master the art of fine woodworking and furniture design', 1),
    ('Digital Media Production', 'Creative Tech', '/images/gallery/hospitality-1.jpg', 'Professional video, audio, and multimedia production skills', 2),
    ('Hospitality & Event Styling', 'Service Skills', '/images/gallery/hospitality-4.jpg', 'Learn event management and hospitality service excellence', 3),
    ('Electrical & Solar Installation', 'Energy Trade', '/images/gallery/painting-5.jpg', 'Practical electrical installation and renewable energy systems', 4),
    ('Fashion Design Labs', 'Creative Enterprise', '/images/gallery/painting-3.jpg', 'Modern fashion design, tailoring, and entrepreneurship', 5),
    ('ICT & Network Cabling', 'Digital Skills', '/images/gallery/hospitality-6.jpg', 'Networking infrastructure and IT systems fundamentals', 6)
ON CONFLICT DO NOTHING;
