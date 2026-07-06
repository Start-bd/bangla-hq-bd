
-- 1) Restrict SELECT on business_views to owners/admins
DROP POLICY IF EXISTS "Anyone can view business views" ON public.business_views;
DROP POLICY IF EXISTS "Public can select business views" ON public.business_views;
DROP POLICY IF EXISTS "Public read business_views" ON public.business_views;

CREATE POLICY "Owners and admins can view business_views"
ON public.business_views
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_views.business_id
      AND b.owner_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- 2) Trigger-level defense: block review updates when the reviewer owns the business
CREATE OR REPLACE FUNCTION public.prevent_self_review_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = NEW.business_id
      AND b.owner_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Business owners cannot update reviews on their own business';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prevent_self_review_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS prevent_self_review_update_trg ON public.reviews;
CREATE TRIGGER prevent_self_review_update_trg
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.prevent_self_review_update();
