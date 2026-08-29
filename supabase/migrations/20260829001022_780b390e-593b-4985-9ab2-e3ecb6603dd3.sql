DROP POLICY IF EXISTS "Anyone can view startups" ON public.startups;

CREATE POLICY "Public can view startups of active businesses"
ON public.startups
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = startups.business_id
      AND (
        b.status = 'active'::business_status
        OR b.owner_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);