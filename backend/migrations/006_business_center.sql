-- Business Center schema and security for Brainstorm Academy
-- This migration creates tables, triggers, and RLS policies for the business center.

-- ===========================================
-- BUSINESS CENTER TABLES
-- ===========================================

CREATE TABLE public.business_center_branches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    address text,
    phone text,
    email text,
    manager_id integer REFERENCES public.staff_profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.business_center_services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id uuid NOT NULL REFERENCES public.business_center_branches(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL DEFAULT 0.00,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.business_center_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id uuid NOT NULL REFERENCES public.business_center_branches(id) ON DELETE CASCADE,
    service_id uuid REFERENCES public.business_center_services(id) ON DELETE SET NULL,
    student_id integer REFERENCES public.students(id) ON DELETE SET NULL,
    customer_name text,
    payment_method text NOT NULL DEFAULT 'cash',
    amount numeric(10,2) NOT NULL DEFAULT 0.00,
    transaction_date date NOT NULL DEFAULT CURRENT_DATE,
    status text NOT NULL DEFAULT 'completed',
    notes text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.business_center_inventory_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id uuid NOT NULL REFERENCES public.business_center_branches(id) ON DELETE CASCADE,
    item_name text NOT NULL,
    sku text,
    description text,
    quantity integer NOT NULL DEFAULT 0,
    reorder_level integer NOT NULL DEFAULT 0,
    unit_cost numeric(10,2) NOT NULL DEFAULT 0.00,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    last_adjusted_at timestamp with time zone
);

CREATE TABLE public.business_center_inventory_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id uuid NOT NULL REFERENCES public.business_center_inventory_items(id) ON DELETE CASCADE,
    branch_id uuid NOT NULL REFERENCES public.business_center_branches(id) ON DELETE CASCADE,
    transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'adjustment', 'transfer')),
    quantity integer NOT NULL,
    unit_cost numeric(10,2) NOT NULL DEFAULT 0.00,
    total_cost numeric(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    notes text,
    performed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.business_center_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id uuid NOT NULL REFERENCES public.business_center_branches(id) ON DELETE CASCADE,
    category text NOT NULL,
    amount numeric(12,2) NOT NULL DEFAULT 0.00,
    description text,
    expense_date date NOT NULL DEFAULT CURRENT_DATE,
    receipt_url text,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.business_center_daily_summaries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id uuid NOT NULL REFERENCES public.business_center_branches(id) ON DELETE CASCADE,
    summary_date date NOT NULL,
    total_revenue numeric(12,2) NOT NULL DEFAULT 0.00,
    total_expenses numeric(12,2) NOT NULL DEFAULT 0.00,
    total_transactions integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (branch_id, summary_date)
);

-- ===========================================
-- BUSINESS CENTER TRIGGERS
-- ===========================================

CREATE OR REPLACE FUNCTION public.business_center_adjust_inventory_on_insert()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.business_center_inventory_items
    SET quantity = quantity + NEW.quantity,
        last_adjusted_at = now(),
        updated_at = now()
    WHERE id = NEW.inventory_item_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER business_center_inventory_transaction_insert
AFTER INSERT ON public.business_center_inventory_transactions
FOR EACH ROW EXECUTE FUNCTION public.business_center_adjust_inventory_on_insert();

CREATE OR REPLACE FUNCTION public.business_center_adjust_inventory_on_delete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.business_center_inventory_items
    SET quantity = quantity - OLD.quantity,
        last_adjusted_at = now(),
        updated_at = now()
    WHERE id = OLD.inventory_item_id;
    RETURN OLD;
END;
$$;

CREATE TRIGGER business_center_inventory_transaction_delete
AFTER DELETE ON public.business_center_inventory_transactions
FOR EACH ROW EXECUTE FUNCTION public.business_center_adjust_inventory_on_delete();

CREATE OR REPLACE FUNCTION public.business_center_inventory_transaction_update()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
    quantity_delta integer;
BEGIN
    quantity_delta := NEW.quantity - OLD.quantity;
    UPDATE public.business_center_inventory_items
    SET quantity = quantity + quantity_delta,
        last_adjusted_at = now(),
        updated_at = now()
    WHERE id = NEW.inventory_item_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER business_center_inventory_transaction_update
AFTER UPDATE ON public.business_center_inventory_transactions
FOR EACH ROW EXECUTE FUNCTION public.business_center_inventory_transaction_update();

-- ===========================================
-- BUSINESS CENTER RLS ENABLEMENT
-- ===========================================

ALTER TABLE public.business_center_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_center_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_center_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_center_inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_center_inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_center_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_center_daily_summaries ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- BUSINESS CENTER RLS POLICIES
-- ===========================================

-- Branches
CREATE POLICY "Authenticated can view branches" ON public.business_center_branches
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage branches" ON public.business_center_branches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Services
CREATE POLICY "Authenticated can view services" ON public.business_center_services
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage services" ON public.business_center_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Transactions
CREATE POLICY "Authenticated can view transactions" ON public.business_center_transactions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage transactions" ON public.business_center_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Inventory items
CREATE POLICY "Authenticated can view inventory items" ON public.business_center_inventory_items
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage inventory items" ON public.business_center_inventory_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Inventory transactions
CREATE POLICY "Authenticated can view inventory transactions" ON public.business_center_inventory_transactions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage inventory transactions" ON public.business_center_inventory_transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Expenses
CREATE POLICY "Authenticated can view expenses" ON public.business_center_expenses
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage expenses" ON public.business_center_expenses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );

-- Daily summaries
CREATE POLICY "Authenticated can view daily summaries" ON public.business_center_daily_summaries
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can manage daily summaries" ON public.business_center_daily_summaries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin')
        )
    );
