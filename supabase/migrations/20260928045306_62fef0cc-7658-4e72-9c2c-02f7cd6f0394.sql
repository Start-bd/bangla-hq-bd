CREATE OR REPLACE FUNCTION public.guard_business_privileged_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;
  NEW.is_verified := false;
  NEW.is_featured := false;
  NEW.featured_until := NULL;
  NEW.plan := 'free';
  NEW.plan_expires_at := NULL;
  NEW.rating_avg := 0;
  NEW.rating_count := 0;
  NEW.view_count := 0;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_guard_business_privileged_insert
BEFORE INSERT ON public.businesses
FOR EACH ROW EXECUTE FUNCTION public.guard_business_privileged_insert();