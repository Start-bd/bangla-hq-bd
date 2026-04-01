-- Remove rfqs and reviews from Realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.rfqs;
ALTER PUBLICATION supabase_realtime DROP TABLE public.reviews;

-- Add DELETE policy for startups
CREATE POLICY "Business owners can delete startups"
ON public.startups
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = startups.business_id
  AND businesses.owner_id = auth.uid()
));

-- Add UPDATE policy for quotes
CREATE POLICY "Business owners can update quotes"
ON public.quotes
FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = quotes.business_id
  AND businesses.owner_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = quotes.business_id
  AND businesses.owner_id = auth.uid()
));

-- Add DELETE policy for quotes
CREATE POLICY "Business owners can delete quotes"
ON public.quotes
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM businesses
  WHERE businesses.id = quotes.business_id
  AND businesses.owner_id = auth.uid()
));