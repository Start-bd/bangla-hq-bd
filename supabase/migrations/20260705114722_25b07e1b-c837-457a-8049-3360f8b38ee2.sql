
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;

CREATE POLICY "Users can update own reviews" ON public.reviews
FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (
  user_id = auth.uid()
  AND NOT EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = reviews.business_id AND owner_id = auth.uid()
  )
);

CREATE OR REPLACE FUNCTION public.prevent_review_business_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.business_id IS DISTINCT FROM OLD.business_id THEN
    RAISE EXCEPTION 'Cannot change business_id on a review';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prevent_review_business_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS reviews_lock_business_id ON public.reviews;
CREATE TRIGGER reviews_lock_business_id
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.prevent_review_business_change();
