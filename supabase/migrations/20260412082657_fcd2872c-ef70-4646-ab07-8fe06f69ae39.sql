-- Vehicle Inspections
CREATE TABLE IF NOT EXISTS public.vehicle_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.drivers(id),
  dispatch_id UUID REFERENCES public.dispatches(id),
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('pre_trip', 'post_trip')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'passed', 'attention_needed', 'failed')),
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  inspector_id UUID,
  inspector_notes TEXT,
  blocked_dispatch BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add missing columns to vehicle_inspections if it already existed with different schema
DO $$ BEGIN
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS vehicle_id UUID;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS driver_id UUID;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS dispatch_id UUID;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS inspection_type TEXT;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS overall_score INTEGER;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS inspector_id UUID;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS inspector_notes TEXT;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS blocked_dispatch BOOLEAN DEFAULT false;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
  ALTER TABLE public.vehicle_inspections ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Inspection checklist items
CREATE TABLE IF NOT EXISTS public.vehicle_inspection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES public.vehicle_inspections(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  item_name TEXT NOT NULL,
  condition TEXT NOT NULL DEFAULT 'not_checked' CHECK (condition IN ('not_checked', 'good', 'fair', 'poor', 'critical')),
  is_safety_critical BOOLEAN DEFAULT false,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI maintenance predictions
CREATE TABLE IF NOT EXISTS public.maintenance_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  component TEXT NOT NULL,
  failure_probability INTEGER NOT NULL CHECK (failure_probability >= 0 AND failure_probability <= 100),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),
  predicted_failure_date DATE,
  urgency TEXT NOT NULL DEFAULT 'low' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  risk_factors JSONB DEFAULT '[]',
  recommended_action TEXT,
  auto_blocked BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE;
ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100);
ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS predicted_failure_date DATE;
ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS risk_factors JSONB DEFAULT '[]';
ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS auto_blocked BOOLEAN DEFAULT false;
ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE public.maintenance_predictions ADD COLUMN IF NOT EXISTS resolved_by UUID;

-- Dispatch safety gate decisions
CREATE TABLE IF NOT EXISTS public.dispatch_safety_gates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  dispatch_id UUID REFERENCES public.dispatches(id),
  gate_type TEXT NOT NULL CHECK (gate_type IN ('pre_dispatch', 'post_trip_closure')),
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'conditional', 'blocked')),
  reason TEXT,
  inspection_id UUID REFERENCES public.vehicle_inspections(id),
  prediction_ids UUID[] DEFAULT '{}',
  decided_by TEXT DEFAULT 'system',
  override_by UUID,
  override_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.dispatch_safety_gates ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE;
ALTER TABLE public.dispatch_safety_gates ADD COLUMN IF NOT EXISTS inspection_id UUID REFERENCES public.vehicle_inspections(id);
ALTER TABLE public.dispatch_safety_gates ADD COLUMN IF NOT EXISTS prediction_ids UUID[] DEFAULT '{}';
ALTER TABLE public.dispatch_safety_gates ADD COLUMN IF NOT EXISTS decided_by TEXT DEFAULT 'system';
ALTER TABLE public.dispatch_safety_gates ADD COLUMN IF NOT EXISTS override_by UUID;
ALTER TABLE public.dispatch_safety_gates ADD COLUMN IF NOT EXISTS override_reason TEXT;

-- Indexes (IF NOT EXISTS prevents duplicate errors)
CREATE INDEX IF NOT EXISTS idx_vi_vehicle ON public.vehicle_inspections(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vi_type_status ON public.vehicle_inspections(inspection_type, status);
CREATE INDEX IF NOT EXISTS idx_vi_dispatch ON public.vehicle_inspections(dispatch_id);
CREATE INDEX IF NOT EXISTS idx_vii_inspection ON public.vehicle_inspection_items(inspection_id);
CREATE INDEX IF NOT EXISTS idx_mp_vehicle ON public.maintenance_predictions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_mp_urgency ON public.maintenance_predictions(urgency) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_dsg_vehicle ON public.dispatch_safety_gates(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_dsg_dispatch ON public.dispatch_safety_gates(dispatch_id);

-- RLS
ALTER TABLE public.vehicle_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispatch_safety_gates ENABLE ROW LEVEL SECURITY;

-- Policies - vehicle_inspections
DROP POLICY IF EXISTS "Leadership can view inspections" ON public.vehicle_inspections;
CREATE POLICY "Leadership can view inspections" ON public.vehicle_inspections
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'org_admin') OR public.has_role(auth.uid(), 'ops_manager') OR public.has_role(auth.uid(), 'finance_manager'));

DROP POLICY IF EXISTS "Ops can create inspections" ON public.vehicle_inspections;
CREATE POLICY "Ops can create inspections" ON public.vehicle_inspections
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

DROP POLICY IF EXISTS "Ops can update inspections" ON public.vehicle_inspections;
CREATE POLICY "Ops can update inspections" ON public.vehicle_inspections
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

-- Policies - inspection items
DROP POLICY IF EXISTS "Leadership can view inspection items" ON public.vehicle_inspection_items;
CREATE POLICY "Leadership can view inspection items" ON public.vehicle_inspection_items
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.vehicle_inspections vi WHERE vi.id = inspection_id AND (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'org_admin') OR public.has_role(auth.uid(), 'ops_manager') OR public.has_role(auth.uid(), 'finance_manager'))));

DROP POLICY IF EXISTS "Ops can manage inspection items" ON public.vehicle_inspection_items;
CREATE POLICY "Ops can manage inspection items" ON public.vehicle_inspection_items
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

DROP POLICY IF EXISTS "Ops can update inspection items" ON public.vehicle_inspection_items;
CREATE POLICY "Ops can update inspection items" ON public.vehicle_inspection_items
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

-- Policies - maintenance predictions
DROP POLICY IF EXISTS "Leadership can view predictions" ON public.maintenance_predictions;
CREATE POLICY "Leadership can view predictions" ON public.maintenance_predictions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'org_admin') OR public.has_role(auth.uid(), 'ops_manager') OR public.has_role(auth.uid(), 'finance_manager'));

DROP POLICY IF EXISTS "System can create predictions" ON public.maintenance_predictions;
CREATE POLICY "System can create predictions" ON public.maintenance_predictions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

DROP POLICY IF EXISTS "Ops can update predictions" ON public.maintenance_predictions;
CREATE POLICY "Ops can update predictions" ON public.maintenance_predictions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

-- Policies - dispatch safety gates
DROP POLICY IF EXISTS "Leadership can view safety gates" ON public.dispatch_safety_gates;
CREATE POLICY "Leadership can view safety gates" ON public.dispatch_safety_gates
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'org_admin') OR public.has_role(auth.uid(), 'ops_manager') OR public.has_role(auth.uid(), 'finance_manager'));

DROP POLICY IF EXISTS "System can create safety gates" ON public.dispatch_safety_gates;
CREATE POLICY "System can create safety gates" ON public.dispatch_safety_gates
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'ops_manager'));

-- Triggers
DROP TRIGGER IF EXISTS update_vehicle_inspections_updated_at ON public.vehicle_inspections;
CREATE TRIGGER update_vehicle_inspections_updated_at BEFORE UPDATE ON public.vehicle_inspections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_maintenance_predictions_updated_at ON public.maintenance_predictions;
CREATE TRIGGER update_maintenance_predictions_updated_at BEFORE UPDATE ON public.maintenance_predictions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
