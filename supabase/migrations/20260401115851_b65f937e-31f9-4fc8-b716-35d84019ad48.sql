
-- Fix: set search_path on update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix: tighten business_views insert - require valid business reference
DROP POLICY "Anyone can insert business views" ON public.business_views;
CREATE POLICY "Anyone can insert business views" ON public.business_views FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND status = 'active')
);

-- Fix: tighten rfqs SELECT to also allow public viewing of open rfqs (not just authenticated)
-- The "Authenticated can view rfqs" USING (true) is intentional for logged-in users viewing all RFQs
-- But let's scope it down
DROP POLICY "Authenticated can view rfqs" ON public.rfqs;
CREATE POLICY "Users can view own or open rfqs" ON public.rfqs FOR SELECT TO authenticated USING (user_id = auth.uid() OR status = 'open');

DROP POLICY "Authenticated can view quotes" ON public.quotes;
CREATE POLICY "Users can view relevant quotes" ON public.quotes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.rfqs WHERE id = rfq_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.businesses WHERE id = business_id AND owner_id = auth.uid())
);
