
-- 1. Trigger to prevent business owners from updating privileged columns
CREATE OR REPLACE FUNCTION public.guard_business_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  IF NEW.is_verified   IS DISTINCT FROM OLD.is_verified
  OR NEW.plan          IS DISTINCT FROM OLD.plan
  OR NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at
  OR NEW.is_featured   IS DISTINCT FROM OLD.is_featured
  OR NEW.featured_until IS DISTINCT FROM OLD.featured_until
  OR NEW.rating_avg    IS DISTINCT FROM OLD.rating_avg
  OR NEW.rating_count  IS DISTINCT FROM OLD.rating_count
  OR NEW.status        IS DISTINCT FROM OLD.status
  OR NEW.is_claimed    IS DISTINCT FROM OLD.is_claimed
  OR NEW.view_count    IS DISTINCT FROM OLD.view_count
  OR NEW.owner_id      IS DISTINCT FROM OLD.owner_id THEN
    RAISE EXCEPTION 'Cannot modify privileged business columns';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_business_privileged ON public.businesses;
CREATE TRIGGER trg_guard_business_privileged
BEFORE UPDATE ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.guard_business_privileged_columns();

-- 2. Slug format CHECK
ALTER TABLE public.businesses
  ADD CONSTRAINT businesses_slug_format
  CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$');

-- 3. URL scheme CHECKs
ALTER TABLE public.businesses
  ADD CONSTRAINT businesses_website_url_scheme
  CHECK (website_url = '' OR website_url IS NULL OR website_url ~* '^https?://'),
  ADD CONSTRAINT businesses_facebook_url_scheme
  CHECK (facebook_url = '' OR facebook_url IS NULL OR facebook_url ~* '^https?://'),
  ADD CONSTRAINT businesses_logo_url_scheme
  CHECK (logo_url = '' OR logo_url IS NULL OR logo_url ~* '^https?://'),
  ADD CONSTRAINT businesses_cover_url_scheme
  CHECK (cover_url = '' OR cover_url IS NULL OR cover_url ~* '^https?://');

-- 4. Reviews: unique per (business, user) + block self-reviews
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_unique_per_user_business UNIQUE (business_id, user_id);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
CREATE POLICY "Authenticated users can create reviews"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = reviews.business_id AND owner_id = auth.uid()
  )
);

-- 5. Lock down SECURITY DEFINER functions not meant for direct API calls
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_business_privileged_columns() FROM PUBLIC, anon, authenticated;
